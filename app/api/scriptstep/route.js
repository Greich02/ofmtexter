// Route API Next.js pour générer chaque étape d'un script conversationnel OF
import { NextResponse } from "next/server";

export async function POST(req) {
  // Ajout soustraction crédits utilisateur
  const { getServerSession } = require("next-auth");
  const dbConnect = require("@/lib/mongoose").default;
  const User = require("@/models/User").default;
  const { authOptions } = require("../auth/[...nextauth]/route");
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
  const { objectif, historique, etape, totalEtapes, instructions, tone, pseudo } = body;
  // Prompt dynamique pour Grok
  let dernierFan = "";
  if (historique && historique.length > 0) {
    dernierFan = historique[historique.length - 1]?.abonne || "";
  }
  const prompt = `
Tu es une modèle OnlyFans. Ta mission est de répondre à ton abonné dans le contexte d'une conversation, à la première personne, sans aucune explication, sans introduction, sans reformulation de la consigne. Ta réponse doit être directement copiable/collable comme message du modèle.

Exemple :
Fan : Salut beauté !
Modèle : Coucou toi 😘, comment tu vas ?

Fan : Je veux voir plus de photos.
Modèle : Je peux t'envoyer des photos privées, tu veux voir quoi en particulier ?

Génère chaque réponse avec un style unique. Change la construction, la longueur, le rythme et les expressions utilisées. Pas deux phrases identiques. Varie le style et le niveau d’intensité.
Tu es une modèle OnlyFans, jeune, sexy, expressive, confiante, un peu taquine, parfois crue quand il faut. Tu parles comme une vraie fille en train de discuter sur Insta ou WhatsApp, pas comme une rédactrice IA. Tes messages peuvent contenir des fautes naturelles, des expressions courtes, des soupirs ou des bruits naturels ("hmm", "rawr", "tu vois ?", etc.).
Tu peux utiliser des émojis mais pense à les varier et les adapter à ton message mais jamais plus de deux trois à la suite. Pour les ponctuations évite les exclamtions et les virgules excessives (maximum une virgule par réponse sinon aucune même si le sens de la phrase le demande)

Objectif du script : ${objectif}
${tone ? `Ton à adopter : ${tone}` : ""}
${pseudo ? `Nom ou pseudo du modèle : ${pseudo}` : ""}
${typeof totalEtapes !== 'undefined' ? `Nombre d'étapes : ${totalEtapes}` : ""}
Voici l'historique de la conversation (JSON) :
${JSON.stringify(historique, null, 2)}
Dernier message du fan : ${dernierFan}
${instructions && instructions.trim() ? `\nInformation importante à prendre en compte : ${instructions.trim()}` : ""}

Génère UNIQUEMENT la réplique du modèle${typeof etape !== 'undefined' ? ` pour l'étape ${etape}` : ""}, à la première personne, sans explication ni raisonnement, sans préambule. Réponds comme si tu étais le modèle, prêt à envoyer le message au fan.
`;
  // DEBUG : log du prompt envoyé
  console.log("[SCRIPTSTEP][Prompt envoyé]", prompt);

  const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.XAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "grok-3-mini",
      messages: [
        { role: "system", content: "Tu es une modèle OnlyFans qui discute avec ses abonnés et génère des répliques naturelles et directes, sans formulation ni explication." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7
    })
  });
  const data = await grokRes.json();
  //console.log("[GROK API] data:", data);
  const messageObj = data.choices?.[0]?.message;
  console.log("[GROK API] messageObj:", messageObj);
  let text = messageObj?.content || "";
  if (!text && messageObj?.reasoning_content) {
    text = messageObj.reasoning_content;
  }
  // Nettoyage : retire tout sauf la réplique du modèle
  // Déduction des crédits (1 crédit = 100 tokens, arrondi supérieur)
  let tokensUsed = 0;
  if (data.usage) {
    tokensUsed = data.usage.total_tokens || 0;
  }
  const creditsToDeduct = Math.ceil(tokensUsed / 100);
  if (dbUser.credits < creditsToDeduct) {
    return NextResponse.json({ error: "Crédits insuffisants" }, { status: 402 });
  }
  dbUser.credits -= creditsToDeduct;
  try {
    await dbUser.save();
  } catch (err) {
    return NextResponse.json({ error: "Erreur lors de la sauvegarde de l'utilisateur", details: err.message }, { status: 500 });
  }
  const reponse = text.split('\n').find(l => l.trim().length > 0) || text;
  return NextResponse.json({ reponse, creditsLeft: dbUser.credits });
}
