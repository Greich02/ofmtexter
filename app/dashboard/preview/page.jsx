'use client'
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";
import Topbar from "../../../components/Topbar.jsx";
import Footer from "../../../components/Footer.jsx";
import Navbar from "../../../components/Navbar.jsx";
import { useSession, SessionProvider } from "next-auth/react";

// Les plans sont récupérés dynamiquement

function BuyCreditsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [annual, setAnnual] = useState(false);
  const [payment, setPayment] = useState("paypal");
  const [plans, setPlans] = useState([]);
  const [plan, setPlan] = useState(null);
  const { data: session } = useSession();

  // Récupère les plans depuis l'API
  useEffect(() => {
    fetch("/api/plans")
      .then(res => res.json())
      .then(data => setPlans(data.plans || []));
  }, []);

  // Met à jour le plan selon le choix Pricing (query param ou localStorage)
  useEffect(() => {
    const planName = searchParams.get("plan") || window.localStorage.getItem("selectedPlan");
    if (plans.length) {
      if (planName) {
        const found = plans.find(p => p.name === planName);
        setPlan(found || plans[0]);
      } else {
        setPlan(plans[0]);
      }
    }
  }, [searchParams, plans]);

  // Calcul du prix
  const basePrice = plan ? (annual ? plan.priceYear / 12 : plan.price) : 0;
  const fee = payment === "paypal" ? 0.02 : 0.01;
  const finalPrice = (basePrice * (1 + fee)).toFixed(2);

  // Tracking event (exemple Google Analytics)
  useEffect(() => {
    if (plan && typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "view_buycredits_preview", {
        plan: plan.name,
        annual,
        payment,
        price: finalPrice
      });
    }
  }, [plan, annual, payment, finalPrice]);

  return (
    <main className="min-h-screen w-full flex flex-col ">
      {session?.user ? (
        <Topbar showDashboardButton={true} />
      ) : <Navbar />}
      <section className="flex-1 flex flex-col md:flex-row items-stretch justify-center w-full mt-7 ">
        <div className="flex-1 flex items-center justify-center px-4 py-12 bg-[#181828]">
          <div className="w-full max-w-xl bg-[#232346] rounded-3xl shadow-2xl p-10 flex flex-col gap-8 border border-blue-500/30">
            {!plan ? (
              <div className="text-center text-white py-12">Chargement du plan...</div>
            ) : (
              <React.Fragment>
                <h1 className="text-3xl font-extrabold text-blue-400 mb-2 text-left">Aperçu du plan</h1>
                <div className="mb-4">
                  <span className="text-blue-400 font-bold text-xl">{plan.name}</span>
                  <span className="ml-2 text-gray-400">{annual ? "(Annuel)" : "(Mensuel)"}</span>
                </div>
                <ul className="mb-6 text-gray-300 text-base space-y-2">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-blue-400">•</span> {f}
                    </li>
                  ))}
                </ul>
                <div className="mb-4">
                  <span className="text-blue-400 font-bold">{plan.credits} crédits/mois</span>
                </div>
                <div className="flex gap-4 mb-6">
                  <button
                    className={`px-4 py-2 rounded-lg font-bold text-center transition ${annual ? 'bg-blue-500 text-white' : 'bg-[#232346] text-blue-400'}`}
                    onClick={() => setAnnual(true)}
                  >Annuel (-20%)</button>
                  <button
                    className={`px-4 py-2 rounded-lg font-bold text-center transition ${!annual ? 'bg-blue-500 text-white' : 'bg-[#232346] text-blue-400'}`}
                    onClick={() => setAnnual(false)}
                  >Mensuel</button>
                </div>
                <div className="flex gap-4 mb-6">
                  <button
                    className={`px-4 py-2 rounded-lg font-bold text-center transition ${payment === 'crypto' ? 'bg-blue-500 text-white' : 'bg-[#232346] text-blue-400'}`}
                    onClick={() => setPayment('crypto')}
                  >Crypto</button>
                  <button
                    className={`px-4 py-2 rounded-lg font-bold text-center transition ${payment === 'paypal' ? 'bg-blue-500 text-white' : 'bg-[#232346] text-blue-400'}`}
                    onClick={() => setPayment('paypal')} disabled
                  >Paypal <span className="text-sm text-amber-300 italic" >(Indisponible) </span> </button>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
        {/* Récapitulatif et paiement en bas */}
        <div className="w-full md:w-[420px] bg-[#181828] border-l border-blue-500/20 flex flex-col justify-between p-10 mt-10">
          {!plan ? null : (
            <React.Fragment>
              <div className="mb">
                <h2 className="text-xl font-bold text-blue-400 mb-4">Récapitulatif</h2>
                <div className="flex flex-col gap-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Plan</span>
                    <span className="font-bold text-blue-400">{plan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Crédits/mois</span>
                    <span className="font-bold text-blue-400">{plan.credits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Durée</span>
                    <span className="font-bold text-blue-400">{annual ? "12 mois" : "1 mois"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Moyen de paiement</span>
                    <span className="font-bold text-blue-400">{payment === "paypal" ? "Paypal" : "Crypto"}</span>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex justify-between text-lg font-bold text-white ">
                    <span>Sous-total</span>
                    <span>
                      {annual
                        ? `${(plan.priceYear / 12).toFixed(2)} € x 12 = ${plan.priceYear.toFixed(2)} €`
                        : `${plan.price.toFixed(2)} €`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base text-white ">
                    <span>Frais ({payment === "paypal" ? "2% Paypal" : "1% Crypto"})</span>
                    <span>
                      {annual
                        ? `${((plan.priceYear * (payment === "paypal" ? 0.02 : 0.01))).toFixed(2)} €`
                        : `${((plan.price * (payment === "paypal" ? 0.02 : 0.01))).toFixed(2)} €`}
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-extrabold text-blue-400">
                    <span>Total TTC</span>
                    <span>
                      {annual
                        ? `${(plan.priceYear * (1 + (payment === "paypal" ? 0.02 : 0.01))).toFixed(2)} €`
                        : `${(plan.price * (1 + (payment === "paypal" ? 0.02 : 0.01))).toFixed(2)} €`}
                    </span>
                  </div>
                </div>
                <button
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-400 text-white font-extrabold neon-glow shadow-blue-glow text-lg hover:scale-105 transition mb-4"
                  onClick={async () => {
                    // Intégration NowPayments
                    const res = await fetch("/api/nowpayments/create-payment", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        amount: annual
                          ? (plan.priceYear * (1 + (payment === "paypal" ? 0.02 : 0.01))).toFixed(2)
                          : (plan.price * (1 + (payment === "paypal" ? 0.02 : 0.01))).toFixed(2),
                        currency: "EUR",
                        userId: "USER_ID_PLACEHOLDER", // à remplacer par l'id utilisateur réel
                        planName: plan.name,
                        annual,
                      }),
                    });
                    const data = await res.json();
                    if (data.payUrl) {
                      window.open(data.payUrl, "_blank");
                    } else {
                      alert("Erreur lors de la création du paiement");
                    }
                  }}
                >Procéder au paiement</button>
                <button
                  className="w-full px-6 py-3 rounded-xl bg-[#232346] text-blue-400 font-bold hover:bg-blue-500 hover:text-white"
                  onClick={() => router.push('/pricing')}
                >Revenir aux tarifs</button>
              </div>
            </React.Fragment>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default function BuyCreditsPage() {
  return (
    <SessionProvider>
      <Suspense fallback={<div className="text-center text-white py-12">Chargement...</div>}>
        <BuyCreditsPageContent />
      </Suspense>
    </SessionProvider>
  );
}
