import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Plan from "@/models/Plan";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { payment_status, order_id, price_amount } = req.body;
  // order_id format: userId-planName-annual|monthly-timestamp
  const [userId, planName, period] = order_id.split("-");
  await dbConnect();

  if (payment_status === "confirmed" || payment_status === "finished") {
    // Paiement réussi : attribuer le plan et les crédits
    const plan = await Plan.findOne({ name: planName });
    if (!plan) return res.status(404).end();
    await User.findByIdAndUpdate(userId, {
      plan: plan._id,
      credits: plan.credits,
      creditsRenewalDate: new Date(),
      $push: {
        planHistory: {
          plan: plan._id,
          startDate: new Date(),
          endDate: null
        }
      }
    });
    // Tu peux aussi envoyer un email de confirmation ici
    return res.status(200).json({ success: true });
  }

  if (payment_status === "failed" || payment_status === "expired" || payment_status === "cancelled") {
    // Paiement échoué : log ou notification
    // Optionnel : notifier l'utilisateur ou enregistrer l'échec
    return res.status(200).json({ failed: true });
  }

  // Autres statuts : ignore ou log
  return res.status(200).end();
}
