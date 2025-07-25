// Route API Next.js (App Router) pour générer du texte
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  // DEBUG : log du body reçu
  console.log("[GROK API][Body reçu]", body);
  const { exchanges, tone, objectif, count, provider, instructions } = body;
  let results = [];
  // Construction du prompt pour Grok
  const history = exchanges.map((ex, i) => `Fan: ${ex.fan}\nModèle: ${ex.model}`).join("\n");
  const prompt = `Voici l'historique des échanges entre un fan et un modèle OnlyFans :\n${history}\n\nGénère ${count} réponses du modèle dans le ton '${tone}' et pour l'objectif '${objectif}'.${instructions && instructions.trim() ? `\nInformation importante à prendre en compte : ${instructions.trim()}` : ""}\n\nIMPORTANT : Ne donne aucune explication, aucun raisonnement, aucune analyse, aucune consigne. Ne mets rien dans le raisonnement. Quoi qu'il arrive donne uniquement les réponses, chacune sur une seule ligne, commence et termine par #, sans texte supplémentaire. Réponds uniquement par les variantes, rien d'autre. Et aussi, adapte toi à la langue des messages entrés.`;

  // DEBUG : log du prompt complet envoyé à l'API
  console.log("[GROK API][Prompt envoyé]", prompt);
  // Appel Grok AI
  const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer API_Key"
    },
    body: JSON.stringify({
      model: "grok-3-mini",
      messages: [
        { role: "system", content: "Tu es un modèle OnlyFans expert en engagement et conversion." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.8
    })
  });
  const data = await grokRes.json();
  // Log l'objet complet message dans choices pour debug
  const messageObj = data.choices?.[0]?.message;
  console.log("Message complet Grok:", messageObj);
  // Log du nombre de tokens utilisés
  if (data.usage) {
    console.log("Tokens utilisés:", data.usage.total_tokens, "(prompt:", data.usage.prompt_tokens, ", completion:", data.usage.completion_tokens, ")");
  }
  let text = messageObj?.content || "";
  // Si content est vide, fallback sur reasoning_content
  if (!text && messageObj?.reasoning_content) {
    text = messageObj.reasoning_content;
  }
  // Parsing amélioré :
  // 1. Essaye d'extraire entre #...#
  let variants = text.match(/#([^#\n]+)#/g);
  // 2. Si rien trouvé, découpe par ligne et nettoie
  if (!variants || variants.length === 0) {
    variants = text.split(/\n|\r/).filter(l => l.trim().length > 0);
  }
  results = variants.map((v, i) => {
    // Nettoie le texte : retire #, espaces, numéros éventuels
    let clean = v.replace(/#/g, "").replace(/^\d+\.\s*/, "").trim();
    return { variant: i + 1, text: clean };
  });
  // Si pas de variantes, fallback sur tout le texte
  if (results.length === 0 && text) {
    results = [{ variant: 1, text }];
  }
  return NextResponse.json({ results });
}
