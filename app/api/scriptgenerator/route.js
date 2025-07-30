// Cette route est dépréciée pour le script libre. Utilisez app/api/scriptstep/route.js pour la génération étape par étape.
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const dbUser = await User.findOne({ email: session.user.email });
  if (!dbUser) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 403 });
  }
  const body = await req.json();
  const { desc, result, steps } = body;
  // Prompt direct pour Grok
  const prompt = `Génère un script en ${steps} étapes pour : ${desc}. Le résultat attendu est : ${result}. IMPORTANT : Donne uniquement les étapes du script, sans explication, raisonnement ou analyse. Chaque étape doit être une réplique directe dans une conversation entre une modèle OnlyFans et un abonné, comme un vrai dialogue. Chaque étape doit commencer par 'Étape X:' suivi de la réplique du modèle, puis un tiret et la réplique de l'abonné. Réponds uniquement par les étapes, rien d'autre.\n\nExemple :\nÉtape 1: Modèle - Salut toi, tu veux discuter ? - Abonné : Oui, j'adore parler avec toi !\nÉtape 2: Modèle - Tu veux voir mes nouvelles photos ? - Abonné : Bien sûr, montre-moi !\nÉtape 3: Modèle - Tu veux qu'on se retrouve en privé ? - Abonné : Avec plaisir !\nMaintenant, génère le script demandé :`;

  const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.XAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "grok-3-mini",
      messages: [
        { role: "system", content: "Tu es une modèle OnlyFans qui discute avec ses abonnés et génère des dialogues naturels et directs, sans formulation ni explication." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7
    })
  });
  const data = await grokRes.json();
  const messageObj = data.choices?.[0]?.message;
  // Log du nombre de tokens utilisés
  let tokensUsed = 0;
  if (data.usage) {
    tokensUsed = data.usage.total_tokens || 0;
    console.log("Tokens utilisés:", tokensUsed, "(prompt:", data.usage?.prompt_tokens, ", completion:", data.usage?.completion_tokens, ")");
  }
  // Déduction des crédits (1 crédit = 100 tokens, arrondi supérieur)
  const creditsToDeduct = Math.ceil(tokensUsed / 100);
  if (dbUser.credits < creditsToDeduct) {
    return NextResponse.json({ error: "Crédits insuffisants" }, { status: 402 });
  }
  dbUser.credits -= creditsToDeduct;
  await dbUser.save();
  let text = messageObj?.content || "";
  if (!text && messageObj?.reasoning_content) {
    text = messageObj.reasoning_content;
  }
  // Parsing : chaque étape sur une ligne, format 'Étape X: titre - contenu'
  let lines = text.split(/\n|\r/).filter(l => l.trim().length > 0 && l.includes('Étape'));
  const generated = lines.map((l, i) => {
    // Sépare titre et contenu
    const [titlePart, ...contentParts] = l.split('-');
    return {
      title: titlePart ? titlePart.trim() : `Étape ${i + 1}`,
      content: contentParts.join('-').trim()
    };
  });
  return NextResponse.json({ generated, creditsLeft: dbUser.credits });
}
