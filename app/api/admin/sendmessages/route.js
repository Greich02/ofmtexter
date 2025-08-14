import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { sendTelegramMessage } from "../../../../lib/telegram";

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || "ofmtexter";
const COLLECTION = "sendmessages";

async function saveToDb(doc) {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  const res = await db.collection(COLLECTION).insertOne(doc);
  await client.close();
  return res;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { mode, message, groups, scheduleDate } = body;
    if (!message || !groups || !Array.isArray(groups) || groups.length === 0) {
      return NextResponse.json({ success: false, message: "Champs requis manquants." }, { status: 400 });
    }
    // Pour la démo, on simule l'envoi immédiat ou la programmation
    let status = "pending";
    let sentMessage = null;
    let sendResults = null;
    if (mode === "manual") {
      // Envoi réel via gramjs
      sendResults = await sendTelegramMessage(groups, message);
      const allOk = sendResults.every(r => r.success);
      status = allOk ? "sent" : "partial";
      sentMessage = message;
    } else if (mode === "scheduled") {
      // TODO: Stocker pour traitement différé (cron ou worker)
      status = "scheduled";
    }
    // Historique en base
    await saveToDb({
      mode,
      message,
      groups,
      scheduleDate: scheduleDate || null,
      status,
      sendResults,
      sentAt: status === "sent" ? new Date() : null,
      createdAt: new Date(),
    });
    return NextResponse.json({
      success: status === "sent" || status === "partial",
      message: status === "sent"
        ? "Message envoyé avec succès."
        : status === "partial"
        ? "Certains messages n'ont pas pu être envoyés."
        : "Message programmé.",
      sentMessage,
      groups,
      sendResults
    });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Erreur serveur: " + e.message });
  }
}
