import React, { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { t } from "../lib/i18n";

const allFeatures = [
  "Générations incluses/mois",
  "Génération de réponses rapides",
  "Conversations suivies",
  "Scripts médias",
  "Gestion d'équipe",
];

const planFeatures = {
  "Gratuit": ["~50", "Oui", "Oui", "Oui", "Non"],
  "Solo": ["~500", "Oui", "Oui", "Non", "Non"],
  "Pro": ["~1200", "Oui", "Oui", "Oui", "Non"],
  "Agence": ["~3500", "Oui", "Oui", "Oui", "Oui"],
};

export default function Pricing({ isLoggedIn }) {
  const [annual, setAnnual] = useState(true);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 loader
  const { language } = useLanguage();

  useEffect(() => {
    fetch("/api/plans")
      .then(res => res.json())
      .then(data => {
        setPlans(data.plans || []);
        setLoading(false); // 👈 désactive le loader
      });
  }, []);

  return (
    <section id="pricing" className="w-full py-12 px-2 md:px-8 bg-gradient-to-br from-[#181828] via-[#232346] to-[#181828]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-blue-400 mb-4">{t("pricing_title", language)}</h2>

        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-l-lg font-bold text-sm transition ${annual ? 'bg-blue-500 text-white' : 'bg-[#232346] text-blue-400'}`}
            onClick={() => setAnnual(true)}
          >{t("pricing_annual_btn", language)}</button>
          <button
            className={`px-4 py-2 rounded-r-lg font-bold text-sm transition ${!annual ? 'bg-blue-500 text-white' : 'bg-[#232346] text-blue-400'}`}
            onClick={() => setAnnual(false)}
          >{t("pricing_monthly_btn", language)}</button>
        </div>

        {/* === Loader === */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-2 ">
              {plans.map(plan => (
                <div
                  key={plan.name}
                  className={`flex flex-col rounded-2xl shadow-lg p-6 bg-[#181828] border-2 ${plan.highlight ? 'border-blue-500 scale-105 z-10' : 'border-[#232346]'} transition-all duration-200 relative`}
                >
                  {plan.highlight && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white font-bold px-4 py-1 rounded-full shadow-blue-glow text-xs">{t("pricing_popular", language)}</span>
                  )}
                  <h3 className="text-xl md:text-2xl font-bold text-blue-400 mb-2 text-center">{plan.name}</h3>
                  <div className="text-center mb-2">
                    <span className="text-3xl md:text-4xl font-extrabold text-white">
                      {annual ? `$${plan.priceYear / 12}` : `$${plan.price}`}
                    </span>
                    <span className="text-blue-400 font-bold ml-2">{t("pricing_per_month", language)}</span>
                    {annual && plan.price > 0 && (
                      <span className="block text-xs text-blue-300 mt-1">{t("pricing_annual_note", language, { price: plan.priceYear })}</span>
                    )}
                  </div>
                  <div className="mb-4 text-center">
                    <span className="text-blue-400 font-bold">{plan.credits} {t("pricing_credits_per_month", language)}</span>
                  </div>
                  <ul className="mb-6 text-gray-300 text-sm space-y-2">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2">
                        <span className="text-blue-400">•</span> {t(f, language)}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full px-4 py-2 rounded-lg font-bold text-center transition ${plan.highlight ? 'bg-blue-500 text-white neon-glow shadow-blue-glow hover:bg-blue-600' : 'bg-[#232346] text-blue-400 hover:bg-blue-500 hover:text-white'}`}
                    onClick={() => {
                      if (plan.name === t("pricing_free_plan", language)) {
                        window.location.href = isLoggedIn ? '/dashboard' : '/signup';
                      } else {
                        if (!isLoggedIn) {
                          window.localStorage.setItem('selectedPlan', plan.name);
                          window.location.href = '/signup';
                        } else {
                          window.location.href = '/dashboard/preview';
                        }
                      }
                    }}
                  >{t("pricing_choose_btn", language)}</button>
                </div>
              ))}
            </div>

            <div className="mt-12 overflow-x-auto">
              <table className="w-full text-sm md:text-base text-left border-collapse">
                <thead>
                  <tr className="bg-[#232346] text-blue-400">
                    <th className="p-3 font-bold">{t("pricing_table_plan", language)}</th>
                    {allFeatures.map(f => (
                      <th key={f} className="p-3 font-bold">{t(f, language)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {plans.map(plan => (
                    <tr key={plan.name} className="border-b border-[#232346]">
                      <td className="p-3 font-bold text-blue-400">{plan.name}</td>
                      {planFeatures[plan.name].map((f, i) => (
                        <td key={i} className="p-3 text-gray-200">{t(f, language)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="mt-8 text-center text-gray-400 text-xs md:text-sm">
          <p>{t("pricing_footer_note", language)}</p>
        </div>
      </div>
    </section>
  );
}
