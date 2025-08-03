import React from "react";

const features = [
  {
    icon: "💬",
    title: "Réponses IA sur-mesure",
    desc: "Générez des messages ultra-naturels adaptés à chaque abonné et contexte de conversation."
  },
  {
    icon: "📜",
    title: "Conversations suivies intelligentes",
    desc: "Faites évoluer vos dialogues étape par étape grâce à des scripts dynamiques conçus pour convertir et engager."
  },
  {
    icon: "🖼️",
    title: "Scripts médias en un clic",
    desc: "Créez des scénarios personnalisés pour vos contenus photo, vidéo ou audio – étape par étape."
  },
  {
    icon: "👥",
    title: "Pilotage de votre équipe",
    desc: "Invitez vos chatteurs, assignez des rôles et suivez leurs performances en toute simplicité."
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
