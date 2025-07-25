// API route pour générer chaque étape d'un script média avec xAI (Grok)
import { NextResponse } from "next/server";
import stepInstructions from "../../../lib/stepInstructions";

export async function POST(req) {
  const body = await req.json();
  const { scriptName, steps } = body; // steps: [{name, type, desc}]
  const results = [];

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
    console.log(`[GROK API][MediaScript] step: ${step.name}, data:`, data);
    const messageObj = data.choices?.[0]?.message;
    let text = messageObj?.content || "";
    if (!text && messageObj?.reasoning_content) {
      text = messageObj.reasoning_content;
    }
    // Nettoyage : retire tout sauf la réplique du modèle
    const reponse = text.split('\n').find(l => l.trim().length > 0) || text;
    results.push({ stepName: step.name, content: reponse });
  }

  return NextResponse.json({ results });
}
