import React from "react";

const testimonials = [
  {
    name: "Sophie M.",
    role: "Manager d’agence OFM",
    text: "OnlyPrompt a transformé notre façon de gérer les messages. L’IA est bluffante et les résultats sont là !",
    score: 4.9
  },
  {
    name: "Julien T.",
    role: "Chateur principal",
    text: "Gain de temps énorme et scripts ultra efficaces. Je recommande à toutes les agences !",
    score: 5.0
  },
  {
    name: "Agence Nova",
    role: "Partenaire",
    text: "L’intégration est simple et le support réactif. Nos managers sont ravis.",
    score: 4.8
  }
];

export default function SocialProof() {
  return (
    <section className="py-16 bg-black flex flex-col items-center">
      <h3 className="text-2xl font-bold text-white mb-8">Ce que disent nos utilisateurs</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-gray-900 rounded-xl p-6 shadow hover:shadow-blue-glow transition flex flex-col items-center text-center">
            <span className="text-yellow-400 text-3xl mb-2">★ {t.score}/5</span>
            <p className="text-gray-200 mb-4">“{t.text}”</p>
            <span className="text-blue-400 font-bold">{t.name}</span>
            <span className="text-gray-400 text-sm">{t.role}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 text-gray-300">Score moyen : <span className="text-blue-400 font-bold">4.9/5</span> sur 200+ utilisateurs</div>
    </section>
  );
}
