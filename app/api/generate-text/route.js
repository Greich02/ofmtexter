// Route API Next.js (App Router) pour générer du texte

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
  console.log("[GROK API][User trouvé]", dbUser);
  if (!dbUser) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 403 });
  }
  const body = await req.json();
  // DEBUG : log du body reçu
  console.log("[GROK API][Body reçu]", body);
  const { exchanges, tone, objectif, count, provider, instructions } = body;
  let results = [];
  // Construction du prompt pour Grok
  const history = exchanges.map((ex, i) => `Fan: ${ex.fan}\nModèle: ${ex.model}`).join("\n");
  const prompt = `Voici l'historique des échanges entre un fan et un modèle OnlyFans :\n${history}\n\nGénère ${count} réponses du modèle dans le ton '${tone}' et pour l'objectif '${objectif}'.${instructions && instructions.trim() ? `\nInformation importante à prendre en compte : ${instructions.trim()}` : ""}\n\nIMPORTANT : Ne donne aucune explication, aucun raisonnement, aucune analyse, aucune consigne. Ne mets rien dans le raisonnement. Quoi qu'il arrive donne uniquement les réponses, chacune sur une seule ligne, commence et termine par #, sans texte supplémentaire. Réponds uniquement par les variantes, rien d'autre. Et aussi, adapte toi à la langue des messages entrés.`;

  // DEBUG : log du prompt complet envoyé à l'API
  //console.log("[GROK API][Prompt envoyé]", prompt);
  // Appel Grok AI
  const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.XAI_API_KEY}`
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
  //console.log("Message complet Grok:", messageObj);
  // Log du nombre de tokens utilisés
  let tokensUsed = 0;
  if (data.usage) {
    tokensUsed = data.usage.total_tokens || 0;
    console.log("Tokens utilisés:", tokensUsed, "(prompt:", data.usage.prompt_tokens, ", completion:", data.usage.completion_tokens, ")");
  }
  // Déduction des crédits (1 crédit = 100 tokens, arrondi supérieur)
  const creditsToDeduct = Math.ceil(tokensUsed / 100);
  if (dbUser.credits < creditsToDeduct) {
    console.log("[GROK API][Erreur] Crédits insuffisants", dbUser.credits, "<", creditsToDeduct);
    return NextResponse.json({ error: "Crédits insuffisants" }, { status: 402 });
  }
  dbUser.credits -= creditsToDeduct;
  console.log("[GROK API][Crédits après déduction]", dbUser.credits);
  // Vérification des champs critiques avant sauvegarde
  if (!dbUser.googleId) {
    console.error("[GROK API][Erreur] googleId manquant sur l'utilisateur:", dbUser);
    return NextResponse.json({ error: "Impossible de sauvegarder l'utilisateur: googleId manquant", user: dbUser }, { status: 500 });
  }
  try {
    await dbUser.save();
  } catch (err) {
    console.error("[GROK API][Erreur save user]", err, dbUser);
    return NextResponse.json({ error: "Erreur lors de la sauvegarde de l'utilisateur", details: err.message, user: dbUser }, { status: 500 });
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
  return NextResponse.json({ results, creditsLeft: dbUser.credits });
}
