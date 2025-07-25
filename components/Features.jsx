import React from "react";

const features = [
  {
    icon: "💬",
    title: "Générateur de messages intelligents",
    desc: "Créez des messages adaptés à chaque profil et situation."
  },
  {
    icon: "🖼️",
    title: "Scripts média étape par étape",
    desc: "Automatisez la création et l’envoi de médias selon vos besoins."
  },
  {
    icon: "👥",
    title: "Gestion d’équipe intégrée",
    desc: "Ajoutez, gérez et attribuez des rôles à vos collaborateurs."
  },
  {
    icon: "🎯",
    title: "Ciblage par rôle",
    desc: "Manager, chateur, agence : chaque rôle a ses outils dédiés."
  },

];

export default function Features() {
  return (
    <section id="features" className="py-16 bg-gradient-to-b from-gray-950 via-black to-gray-900">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-4 p-6 bg-gray-900 rounded-xl shadow hover:shadow-blue-glow transition">
            <span className="text-3xl">{f.icon}</span>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">{f.title}</h4>
              <p className="text-gray-300">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
