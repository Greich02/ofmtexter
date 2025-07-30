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
    const prompt = `Tu es une modèle OnlyFans. Génère UNIQUEMENT le message à envoyer pour l'étape suivante, à la première personne, sans explication ni préambule.\n\n${stepInstruction}\n\nNom de l'étape : ${step.name}\nType d'étape : ${step.type}\nDescription : ${step.desc}\n\nLe message doit être naturel, direct, et prêt à être copié/collé.`;

    const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-3-mini",
        messages: [
          { role: "system", content: "Tu es une modèle OnlyFans qui génère des messages médias naturels et directs." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7
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
