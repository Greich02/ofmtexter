// Route API Next.js pour générer chaque étape d'un script conversationnel OF
import { NextResponse } from "next/server";

export async function POST(req) {
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

  let dernierFan = "";
  if (historique && historique.length > 0) {
    dernierFan = historique[historique.length - 1]?.abonne || "";
  }

  const personas = [
    "jeune, joueuse, expressive, adore provoquer subtilement",
    "douce mais perverse, un peu timide au début",
    "sûre d'elle, directe, adore dominer en douceur",
    "taquine, adore les jeux de rôle et tester les limites",
    "naturelle, parle comme une copine un peu chaude sur Insta"
  ];
  const persona = personas[Math.floor(Math.random() * personas.length)];

  const prompt = `
Tu es une modèle OnlyFans. Tu discutes avec tes abonnés en messages privés. Ta mission est de répondre à ton fan comme dans une vraie conversation sur WhatsApp ou Instagram.

Tu parles à la première personne. Pas d'explication, pas de consigne visible. Tu écris un message naturel, vivant, varié. Ta réponse doit être directement copiable/collable comme si tu l'avais écrite spontanément.

Tu dois éviter toute forme de répétition excessive.
Tu peux mettre des emojis mais varie les d'un message à un autre en fonction du ccontexte et pas plus de trois à la suite. Evite aussi les tirets(-) en milieu de phrase. 
Prends en compte l'historique des messages afin d'être concise, naturelle, évite de tourner en boucle ou de répéter les mêmes expressions en début de phrase (oh, mmm, etc). Chaque message doit sembler spontané et différent du précédent.



Ta personnalité pour ce message : ${persona}

Objectif du script : ${objectif}
${tone ? `Ton à adopter : ${tone}` : ""}
${pseudo ? `Nom ou pseudo du modèle : ${pseudo}` : ""}
${typeof totalEtapes !== 'undefined' ? `Nombre d'étapes : ${totalEtapes}` : ""}
Voici l'historique de la conversation (JSON) :
${JSON.stringify(historique, null, 2)}
Dernier message du fan : ${dernierFan}
${instructions && instructions.trim() ? `\nInformation importante : ${instructions.trim()}` : ""}

Réponds UNIQUEMENT avec le message du modèle${typeof etape !== 'undefined' ? ` pour l'étape ${etape}` : ""}, sans introduction ni réflexion.
`;

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
        {
          role: "system",
          content: "Tu es une modèle OnlyFans qui génère des répliques naturelles, variées, parfois crues, toujours humaines. Pas de filtre IA, tu dois paraître 100% réelle."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 1.0,
      //top_p: 0.9,
      //frequency_penalty: 0.5,
      //presence_penalty: 0.8
    })
  });

  const data = await grokRes.json();
  const messageObj = data.choices?.[0]?.message;
  console.log("[GROK API] messageObj:", messageObj);
  let text = messageObj?.content || "";
  if (!text && messageObj?.reasoning_content) {
    text = messageObj.reasoning_content;
  }

  let tokensUsed = 0;
  if (data.usage) {
    tokensUsed = data.usage.total_tokens || 0;
  }
  
  const creditsToDeduct = Math.ceil(tokensUsed / 100);

// Même si le solde est insuffisant, on déduit jusqu’à 0
dbUser.credits = Math.max(0, dbUser.credits - creditsToDeduct);

try {
  await dbUser.save();
} catch (err) {
  return NextResponse.json({ error: "Erreur lors de la sauvegarde de l'utilisateur", details: err.message }, { status: 500 });
}

const reponse = text.split('\n').find(l => l.trim().length > 0) || text;

return NextResponse.json({ reponse, creditsLeft: dbUser.credits });
}