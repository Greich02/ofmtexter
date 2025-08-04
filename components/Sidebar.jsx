import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const menu = [
  { icon: "🧠", label: "Générer des réponses rapides", slug: "dashboard/textgenerator" },
  { icon: "📜", label: "Conversations suivies (Pro) ", slug: "dashboard/scriptgenerator" },
  { icon: "🎬", label: "Scripts pour contenus médias", slug: "dashboard/mediascriptgenerator" },
  { icon: "👥", label: "Gérer mon équipe", slug: "dashboard/equipe" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMenuClick = (slug) => {
    router.push(`/${slug}`);
    closeMobileMenu();
  };

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className="hidden md:block fixed top-0 left-0 h-full w-64 bg-[#0d0d0d] flex flex-col justify-between mt-20 px-4 shadow-lg z-30">
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
          <span className="text-blue-400 font-extrabold text-xl neon-glow">OfmPilot</span>
          <div className="bg-[#181828] rounded-lg px-3 py-2 text-xs text-gray-300 flex flex-col items-center w-full">
            <span>Plan Premium</span>
            <span className="font-bold text-blue-400">125 crédits restants</span>
            <button className="mt-2 px-3 py-1 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition text-xs">+ Ajouter des crédits</button>
          </div>
        </div>
      </aside>

      {/* Bouton hamburger mobile */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-20 left-4 z-50 flex flex-col justify-center items-center w-10 h-10 bg-[#0d0d0d] rounded-lg shadow-lg"
        aria-label="Menu"
      >
        <span className={`block w-5 h-0.5 bg-gray-200 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
        <span className={`block w-5 h-0.5 bg-gray-200 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-5 h-0.5 bg-gray-200 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
      </button>

      {/* Menu mobile */}
      <div className={`md:hidden fixed top-20 left-0 w-64 h-full bg-[#0d0d0d] flex flex-col justify-between px-4 shadow-lg z-40 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="flex-1 pt-4">
          <ul className="space-y-2">
            {menu.map((item) => {
              const isSelected = pathname === `/${item.slug}`;
              return (
                <li key={item.label}>
                  <button
                    className={`w-full flex items-center text-center gap-3 px-4 py-3 rounded-lg text-lg font-semibold transition shadow-sm
                      ${isSelected ? "bg-blue-900 text-blue-400 shadow-blue-glow" : "text-gray-300 hover:text-blue-400 hover:bg-[#181828]"}`}
                    onClick={() => handleMenuClick(item.slug)}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex flex-col items-center gap-4 mt-8 pb-4">
          <span className="text-blue-400 font-extrabold text-xl neon-glow">OfmPilot</span>
          <div className="bg-[#181828] rounded-lg px-3 py-2 text-xs text-gray-300 flex flex-col items-center w-full">
            <span>Plan Premium</span>
            <span className="font-bold text-blue-400">125 crédits restants</span>
            <button className="mt-2 px-3 py-1 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition text-xs">+ Ajouter des crédits</button>
          </div>
        </div>
      </div>

      {/* Overlay pour fermer le menu mobile */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeMobileMenu}
        ></div>
      )}
    </>
  );
}
