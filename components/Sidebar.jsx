import React from "react";
import { useRouter, usePathname } from "next/navigation";

const menu = [
  { icon: "🧠", label: "Formuler des Textes", slug: "dashboard/textgenerator" },
  { icon: "📜", label: "Génrérer des scripts ciblés", slug: "dashboard/scriptgenerator" },
  { icon: "🎬", label: "Script pour médias", slug: "dashboard/mediascriptgenerator" },
  { icon: "👥", label: "Gérer mon équipe", slug: "dashboard/equipe" },

];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-[#0d0d0d] flex flex-col justify-between mt-20 px-4 shadow-lg z-30">
      <nav className="flex-1">
        <ul className="space-y-2">
          {menu.map((item) => {
            const isSelected = pathname === `/${item.slug}`;
            return (
              <li key={item.label}>
                <button
                  className={`w-full flex items-center text-center gap-3 px-4 py-3 rounded-lg text-lg font-semibold transition shadow-sm
                    ${isSelected ? "bg-blue-900 text-blue-400 shadow-blue-glow" : "text-gray-300 hover:text-blue-400 hover:bg-[#181828]"}`}
                  onClick={() => router.push(`/${item.slug}`)}
                >
                  <span className="text-2xl">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="flex flex-col items-center gap-4 mt-8">
        <span className="text-blue-400 font-extrabold text-xl neon-glow">OnlyPrompt</span>
        <div className="bg-[#181828] rounded-lg px-3 py-2 text-xs text-gray-300 flex flex-col items-center w-full">
          <span>Plan Premium</span>
          <span className="font-bold text-blue-400">125 crédits restants</span>
          <button className="mt-2 px-3 py-1 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition text-xs">+ Ajouter des crédits</button>
        </div>
      </div>
      {/*
       <style jsx>{`
        .neon-glow {
          text-shadow: 0 0 4px #3b82f6, 0 0 8px #3b82f6;
        }
        .shadow-blue-glow {
          box-shadow: 0 0 8px #3b82f6, 0 0 16px #3b82f6;
        }
      `}</style>
       */}
    </aside>
  );
}
