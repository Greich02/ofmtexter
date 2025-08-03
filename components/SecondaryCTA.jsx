import React from "react";

export default function SecondaryCTA() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-950 via-black to-gray-900 flex flex-col items-center">
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
        Rejoignez des centaines de managers et chatteurs qui boostent leur conversion avec l’IA.
      </h3>
      <button className="px-8 py-4 rounded-lg bg-blue-500 text-white font-bold shadow-blue-glow neon-glow hover:bg-blue-600 transition text-lg">
        Créer mon compte maintenant
      </button>
      <style jsx>{`
        .neon-glow {
          text-shadow: 0 0 8px #3b82f6, 0 0 16px #3b82f6;
        }
        .shadow-blue-glow {
          box-shadow: 0 0 16px #3b82f6, 0 0 32px #3b82f6;
        }
      `}</style>
    </section>
  );
}
