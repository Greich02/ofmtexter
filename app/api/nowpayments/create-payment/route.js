import axios from "axios";

export async function POST(req) {
  const body = await req.json();
  const { amount, currency, userId, planName, annual } = body;
  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  const callbackUrl = process.env.NOWPAYMENTS_CALLBACK_URL;
  try {
    const invoiceRes = await axios.post(
      "https://api.nowpayments.io/v1/invoice",
      {
        price_amount: amount,
        price_currency: currency,
        order_id: `${userId}-${planName}-${annual ? 'annual' : 'monthly'}-${Date.now()}`,
        order_description: `Abonnement ${planName} (${annual ? 'Annuel' : 'Mensuel'})`,
        ipn_callback_url: process.env.NOWPAYMENTS_CALLBACK_URL,
        success_url: process.env.NOWPAYMENTS_SUCCESS_URL || "https://onlyprompt.com/dashboard",
        cancel_url: process.env.NOWPAYMENTS_CANCEL_URL || "https://onlyprompt.com/dashboard/buycredits",
      },
      { headers: { "x-api-key": apiKey } }
    );
    return Response.json({ payUrl: invoiceRes.data.invoice_url });
  } catch (err) {
    console.error("NOWPAYMENTS ERROR:", err, err?.response?.data);
    return Response.json({ error: err.message, details: err?.response?.data }, { status: 500 });
  }
}
