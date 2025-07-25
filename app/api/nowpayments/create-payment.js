import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { amount, currency, userId, planName, annual } = req.body;
  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  const callbackUrl = process.env.NOWPAYMENTS_CALLBACK_URL;
  try {
    const invoiceRes = await axios.post(
      "https://api.nowpayments.io/v1/invoice",
      {
        price_amount: amount,
        price_currency: currency,
        order_id: `${userId}-${planName}-${annual ? 'annual' : 'monthly'}-${Date.now()}`,
        callback_url: callbackUrl,
        success_url: process.env.NOWPAYMENTS_SUCCESS_URL || "https://onlyprompt.com/dashboard",
        cancel_url: process.env.NOWPAYMENTS_CANCEL_URL || "https://onlyprompt.com/dashboard/buycredits",
        title: `Abonnement ${planName} (${annual ? 'Annuel' : 'Mensuel'})`,
      },
      { headers: { "x-api-key": apiKey } }
    );
    res.json({ payUrl: invoiceRes.data.invoice_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
