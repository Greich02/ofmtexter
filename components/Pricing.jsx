// c:\Users\Utilisateur\Desktop\ofmtexter\components\Pricing.jsx
import React, { useState } from "react";

const plans = [
  {
    name: "Gratuit",
    price: 0,
    priceYear: 0,
    credits: 100,
    features: ["~10 générations", "Pas d'accès équipe", "Pas de script Médias"],
    highlight: false,
  },
  {
    name: "Solo",
    price: 5,
    priceYear: 48,
    credits: 5000,
    features: ["~500 générations", "Usage individuel", "Pas de script"],
    highlight: false,
  },
  {
    name: "Pro",
    price: 10,
    priceYear: 96,
    credits: 12000,
    features: ["~1200 générations", "Accès génération de scripts", "Usage individuel"],
    highlight: true,
  },
  {
    name: "Agence",
    price: 25,
    priceYear: 240,
    credits: 35000,
    features: ["~3500 générations", "Accès équipe (5 membres inclus)", "Scripts illimités"],
    highlight: false,
  }
];

const allFeatures = [
  "Générations incluses/mois",
  "Accès équipe",
  "Génération Pro",
  "Scripts médias",
  //"Usage individuel",
];

const planFeatures = {
  "Gratuit": ["~10", "Non", "Non", "Non", "Non"],
  "Solo": ["~500", "Non", "Non", "Non", "Oui"],
  "Pro": ["~1200", "Non", "Oui", "Non", "Oui"],
  "Agence": ["~3500", "Oui", "Oui", "Oui", "Oui"],
};

export default function Pricing({ isLoggedIn }) {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="w-full py-12 px-2 md:px-8 bg-gradient-to-br from-[#181828] via-[#232346] to-[#181828]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-blue-400 mb-4">Tarifs</h2>
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-l-lg font-bold text-sm transition ${annual ? 'bg-blue-500 text-white' : 'bg-[#232346] text-blue-400'}`}
            onClick={() => setAnnual(true)}
          >Annuel (-20%)</button>
          <button
            className={`px-4 py-2 rounded-r-lg font-bold text-sm transition ${!annual ? 'bg-blue-500 text-white' : 'bg-[#232346] text-blue-400'}`}
            onClick={() => setAnnual(false)}
          >Mensuel</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-2xl shadow-lg p-6 bg-[#181828] border-2 ${plan.highlight ? 'border-blue-500 scale-105 z-10' : 'border-[#232346]'} transition-all duration-200 relative`}
            >
              {plan.highlight && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white font-bold px-4 py-1 rounded-full shadow-blue-glow text-xs">Le plus populaire</span>
              )}
              <h3 className="text-xl md:text-2xl font-bold text-blue-400 mb-2 text-center">{plan.name}</h3>
              <div className="text-center mb-2">
                <span className="text-3xl md:text-4xl font-extrabold text-white">{annual ? `$${plan.priceYear/12 }` : `$${plan.price}`}</span>
                <span className="text-blue-400 font-bold ml-2">/mois</span>
                {annual && plan.price > 0 && (
                  <span className="block text-xs text-blue-300 mt-1">{`Soit ${plan.priceYear}$ → -20%`}</span>
                )}
              </div>
              <div className="mb-4 text-center">
                <span className="text-blue-400 font-bold">{plan.credits} crédits/mois</span>
              </div>
              <ul className="mb-6 text-gray-300 text-sm space-y-2">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-blue-400">•</span> {f}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full px-4 py-2 rounded-lg font-bold text-center transition ${plan.highlight ? 'bg-blue-500 text-white neon-glow shadow-blue-glow hover:bg-blue-600' : 'bg-[#232346] text-blue-400 hover:bg-blue-500 hover:text-white'}`}
                onClick={() => {
                  if (plan.name === 'Gratuit') {
                    window.location.href = isLoggedIn ? '/dashboard' : '/signup';
                  } else {
                    if (!isLoggedIn) {
                      // Store selected plan in localStorage for use after signup
                      window.localStorage.setItem('selectedPlan', plan.name);
                      window.location.href = '/signup';
                    } else {
                      window.location.href = '/dashboard/buycredits';
                    }
                  }
                }}
              >Choisir</button>
            </div>
          ))}
        </div>
        <div className="mt-12 overflow-x-auto">
          <table className="w-full text-sm md:text-base text-left border-collapse">
            <thead>
              <tr className="bg-[#232346] text-blue-400">
                <th className="p-3 font-bold">Plan</th>
                {allFeatures.map(f => (
                  <th key={f} className="p-3 font-bold">{f}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plans.map(plan => (
                <tr key={plan.name} className="border-b border-[#232346]">
                  <td className="p-3 font-bold text-blue-400">{plan.name}</td>
                  {planFeatures[plan.name].map((f, i) => (
                    <td key={i} className="p-3 text-gray-200">{f}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-center text-gray-400 text-xs md:text-sm">
          <p>Les crédits sont renouvelés chaque mois. Les prix affichés sont hors taxes. Pour toute question, contactez-nous.</p>
        </div>
      </div>
    </section>
  );
}
