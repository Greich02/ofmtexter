// Route API Next.js (App Router) pour générer du texte avec un prompt enrichi et humanisé

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
  const { exchanges, tone, objectif, count, instructions } = body;
  let results = [];

  const history = exchanges.map((ex, i) => `Fan: ${ex.fan}\nModèle: ${ex.model}`).join("\n");

  const prompt = `
Tu es une modèle OnlyFans. Ta mission est de répondre à ton abonné dans le contexte d'une conversation, à la première personne, sans aucune explication, sans introduction, sans reformulation de la consigne. Ta réponse doit être directement copiable/collable comme message du modèle.

Génère ${count} variantes dans un style naturel, varié, parfois cru, avec une vraie voix humaine.

Tu es jeune, sexy, expressive, confiante, parfois taquine, parfois cash. Parle comme une fille sur WhatsApp, pas comme une IA. Utilise des soupirs, des bruits, des fautes naturelles, des expressions spontanées (hmm, rawr, tu vois ?). Tu peux glisser des emojis (max 2-3, jamais en spam).

Varie la construction des phrases, la longueur, le style. Ne fais JAMAIS deux phrases identiques. Parfois douce, parfois dominante, parfois timide.

Objectif : ${objectif}
Ton à adopter : ${tone}
${instructions && instructions.trim() ? `Information importante à prendre en compte : ${instructions.trim()}` : ""}

Voici l'historique :\n${history}

IMPORTANT : Donne uniquement les réponses, sans aucun raisonnement, sans structure de code ou balises. Chaque réponse doit commencer et finir par un dièse (#), sur une seule ligne.
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
        {
          role: "system",
          content: "Tu es une modèle OnlyFans qui génère des répliques naturelles, variées, parfois crues, toujours humaines. Pas de filtre IA, tu dois paraître 100% réelle."
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
      temperature: 1.1
    })
  });

  const data = await grokRes.json();
  const messageObj = data.choices?.[0]?.message;

  let text = messageObj?.content || "";
  if (!text && messageObj?.reasoning_content) {
    text = messageObj.reasoning_content;
  }

  console.log("Prompt: ", prompt);
  console.log("Réponse: ", text)

  // Supprimer les caractères invisibles type variation selectors

  let variants = text.match(/#([^#\n]+)#/g);
  if (!variants || variants.length === 0) {
    variants = text.split(/\n|\r/).filter(l => l.trim().length > 0);
  }

results = variants.map((v, i) => {
  // Supprime uniquement les # de début et fin, sans toucher au texte à l'intérieur
  const match = v.match(/#(.*?)#/);
  const clean = match ? match[1].trim() : v.trim();
  return { variant: i + 1, text: clean };
});


  if (results.length === 0 && text) {
    results = [{ variant: 1, text }];
  }

let tokensUsed = 0;
if (data.usage) {
  tokensUsed = data.usage.total_tokens || 0;
}
const creditsToDeduct = Math.ceil(tokensUsed / 100);

// Même si pas assez de crédits, on déduit jusqu'à 0
dbUser.credits = Math.max(0, dbUser.credits - creditsToDeduct);

try {
  await dbUser.save();
} catch (err) {
  return NextResponse.json({ error: "Erreur lors de la sauvegarde de l'utilisateur", details: err.message }, { status: 500 });
}

return NextResponse.json({ results, creditsLeft: dbUser.credits });

}
