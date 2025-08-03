// API route pour générer chaque étape d'un script média avec xAI (Grok)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/route";
import stepInstructions from "../../../lib/stepInstructions";

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
  const { scriptName, steps } = body; // steps: [{name, type, desc}]
  const results = [];
  let totalTokensUsed = 0;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    // Ajoute l'instruction contextuelle selon le type d'étape
    const stepInstruction = stepInstructions[step.type] || "";
    const prompt = `
        Tu es une modèle OnlyFans. Ta mission est de répondre à ton abonné à la première personne, sans explication, sans introduction, sans reformulation. Tu génères des messages sensuels, humains, naturels, directs et réalistes, comme si tu discutais par DM sur Instagram.

        Exemple :
        Fan : Tu fais quoi ?
        Modèle : Je suis sous la douche, toute nue... tu veux une photo ? 😏

        Varie la **construction, le ton, le rythme et l’intensité**. Tu peux faire des phrases courtes ou longues, des soupirs, des fautes naturelles, des sons ("hmm", "haa", "rawr", etc.), et quelques émojis (max 2-3 à la suite). Pas plus d’une virgule par message.

        Tu es une fille jeune, chaude, joueuse, confiante, qui n’a pas peur d’être directe ou crue quand il le faut. Ton message doit paraître **100% humain** et pouvoir être **copié/collé directement** à un abonné.

        ${stepInstruction ? `Contexte de l'étape : ${stepInstruction}` : ""}
        Nom de l'étape : ${step.name}
        Type d'étape : ${step.type}
        Description personnalisée de l'étape : ${step.desc}

        Génère UNIQUEMENT le message du modèle à cette étape, sans préambule, sans contexte inutile. Commence directement comme si tu lui écrivais.
        `;


    const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-3-mini",
        messages: [
          { role: "system", content: "Tu es une modèle OnlyFans sexy, humaine, directe, qui écrit à ses abonnés comme en DM. Pas de réponse IA, uniquement du naturel." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1000,
        temperature: 1.0
      })
    });
    const data = await grokRes.json();
    let tokensUsed = 0;
    console.log(`[GROK API][MediaScript] step:`, step.name, "API raw response:", data);
    if (data.usage) {
      tokensUsed = data.usage.total_tokens || 0;
      totalTokensUsed += tokensUsed;
      console.log(`[GROK API][MediaScript] step: ${step.name}, tokens utilisés:`, tokensUsed);
    }
    const messageObj = data.choices?.[0]?.message;
    console.log(`[GROK API][MediaScript] step:`, step.name, "messageObj:", messageObj);
    let text = messageObj?.content || "";
    if (!text && messageObj?.reasoning_content) {
      text = messageObj.reasoning_content;
    }
    // Nettoyage : retire tout sauf la réplique du modèle
    const reponse = text.split('\n').find(l => l.trim().length > 0) || text;
    console.log(`[GROK API][MediaScript] step:`, step.name, "final reponse:", reponse);
    results.push({ stepName: step.name, content: reponse });
  }
  // Déduction des crédits (1 crédit = 100 tokens, arrondi supérieur)
  const creditsToDeduct = Math.ceil(totalTokensUsed / 100);
  if (dbUser.credits < creditsToDeduct) {
    return NextResponse.json({ error: "Crédits insuffisants" }, { status: 402 });
  }
  dbUser.credits -= creditsToDeduct;
  await dbUser.save();
  return NextResponse.json({ results, creditsLeft: dbUser.credits });
}
