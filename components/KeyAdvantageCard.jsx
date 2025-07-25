import React from "react";

export default function KeyAdvantageCard({ icon, title, description }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 flex flex-col items-center text-center transition-shadow duration-300 hover:shadow-blue-glow cursor-pointer group">
      <div className="text-4xl mb-4 group-hover:text-blue-400">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
      <style jsx>{`
        .hover\:shadow-blue-glow:hover {
          box-shadow: 0 0 24px #3b82f6, 0 0 48px #3b82f6;
        }
      `}</style>
    </div>
  );
}
