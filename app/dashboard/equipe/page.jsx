import DashboardLayout from "@/components/DashboardLayout";
import React from "react";
 

export default function TeamPage() {
  return (
    <DashboardLayout>
        <div className="relative min-h-[60vh] flex flex-col items-center justify-center">
      {/* Contenu de gestion d'équipe (placeholder) */}
      <div className="w-full max-w-2xl mx-auto p-8 rounded-xl bg-[#181828] shadow-lg blur-sm opacity-60 pointer-events-none select-none">
        <h2 className="text-2xl font-bold text-white mb-4">Gestion de l'équipe</h2>
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Ajouter un membre</label>
          <div className="flex gap-2">
            <input type="email" className="flex-1 p-2 rounded bg-[#232346] text-gray-200" placeholder="Email du membre" disabled />
            <button className="px-4 py-2 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow" disabled>Ajouter</button>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-bold text-blue-400 mb-2">Membres de l'équipe</h3>
          <ul className="space-y-2">
            <li className="flex justify-between items-center bg-[#232346] rounded px-4 py-2 text-gray-200">
              <span>john.doe@email.com</span>
              <span className="text-xs text-gray-400">Crédits utilisés : 42</span>
              <button className="ml-2 px-2 py-1 rounded bg-red-500 text-white font-bold text-xs" disabled>Retirer</button>
            </li>
            <li className="flex justify-between items-center bg-[#232346] rounded px-4 py-2 text-gray-200">
              <span>jane.smith@email.com</span>
              <span className="text-xs text-gray-400">Crédits utilisés : 17</span>
              <button className="ml-2 px-2 py-1 rounded bg-red-500 text-white font-bold text-xs" disabled>Retirer</button>
            </li>
          </ul>
        </div>
      </div>
      {/* Overlay Coming Soon */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-10 flex flex-col items-center">
          <span className="text-5xl mb-4">🔒</span>
          <span className="text-3xl font-bold text-white mb-2">Coming soon</span>
          <span className="text-gray-300">La gestion d'équipe arrive bientôt !</span>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}
