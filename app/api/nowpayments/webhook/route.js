import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Plan from "@/models/Plan";

export async function POST(req) {
  const body = await req.json();
  const { payment_status, order_id, price_amount } = body;
  // order_id format: userId-planName-annual|monthly-timestamp
  const [userId, planName, period] = order_id.split("-");
  await dbConnect();

  if (payment_status === "confirmed" || payment_status === "finished") {
    // Paiement réussi : attribuer le plan et les crédits
    console.log("planName reçu:", planName);
    const allPlans = await Plan.find({});
    console.log("Plans existants:", allPlans.map(p => p.name));
    const plan = await Plan.findOne({ name: planName });
    if (!plan) return new Response(null, { status: 406});
    // Calcul de la date d'expiration
    const now = new Date();
    let endDate;
    if (period === "annual") {
      endDate = new Date(now);
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + 1);
    }
    // Met à jour le plan et supprime l'ancien
    await User.findByIdAndUpdate(userId, {
      plan: plan._id,
      credits: plan.credits,
      creditsRenewalDate: now,
      planHistory: [{
        plan: plan._id,
        startDate: now,
        endDate: endDate
      }]
    });
    // Tu peux aussi envoyer un email de confirmation ici
    return Response.json({ success: true });
  }

  if (["failed", "expired", "cancelled"].includes(payment_status)) {
    // Paiement échoué : log ou notification
    return Response.json({ failed: true });
  }

  // Autres statuts : ignore ou log
  return new Response(null, { status: 200 });
}
