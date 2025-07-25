// Utilitaire pour générer du texte via OpenAI ou Grok
export async function generateTextWithProvider({ exchanges, tone, objectif, count }) {
  // En dev, utilise OpenAI
  // En prod, utilise Grok
  // Ici, on choisit le provider selon NODE_ENV
  const provider = process.env.NODE_ENV === "production" ? "grok" : "openai";
  // Ajout du champ instructions dans le body
  const res = await fetch("/api/generate-text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ exchanges, tone, objectif, count, provider, instructions: arguments[0].instructions })
  });
  if (!res.ok) throw new Error("Erreur lors de la génération");
  return await res.json();
}
