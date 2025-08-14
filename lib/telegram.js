// lib/telegram.js
// Utilitaire d'envoi de messages Telegram via gramjs
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import input from "input"; // pour la connexion initiale (à remplacer par config/env)

// Ces valeurs doivent être stockées dans des variables d'environnement sécurisées !
const apiId = parseInt(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;
const stringSession = new StringSession(process.env.TELEGRAM_SESSION || "");

let client = null;

export async function getTelegramClient() {
  if (client) return client;
  client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 });
  if (!client.connected) {
    await client.start({
      phoneNumber: async () => process.env.TELEGRAM_PHONE || await input.text("Numéro de téléphone Telegram :"),
      password: async () => process.env.TELEGRAM_PASSWORD || await input.text("Mot de passe 2FA :"),
      phoneCode: async () => await input.text("Code reçu :"),
      onError: (err) => console.log(err),
    });
    // Sauvegarder la session stringSession.stringify() dans un .env sécurisé !
  }
  return client;
}

export async function sendTelegramMessage(groups, message) {
  const client = await getTelegramClient();
  let results = [];
  for (const group of groups) {
    try {
      // GramJS accepte @username, t.me lien ou id numérique
      await client.sendMessage(group, { message });
      results.push({ group, success: true });
    } catch (e) {
      results.push({ group, success: false, error: e.message });
    }
  }
  return results;
}
