"use client";
import React, { useState } from "react";
import { useSession, signOut, SessionProvider } from "next-auth/react";

const Topbar = ({ showDashboardButton, creditsLeft }) => {
  return (
    <SessionProvider>
      <TopbarContent showDashboardButton={showDashboardButton} creditsLeft={creditsLeft} />
    </SessionProvider>
  );
};

function TopbarContent({ showDashboardButton, creditsLeft }) {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = session?.user;
  
  // Si creditsLeft est passé en prop, on l'affiche, sinon on prend la valeur session
  const credits = typeof creditsLeft === "number" ? creditsLeft : (typeof user?.credits === "number" ? user.credits : 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full h-16 bg-[#181828] flex items-center justify-between px-4 md:px-8 z-40 shadow-lg">
      {/* Logo */}
      <a href="/" onClick={closeMenu}>
        <div className="flex items-center gap-2">
          <span className="text-blue-400 font-extrabold text-xl md:text-2xl neon-glow">OfmPilot</span>
        </div>
      </a>

      {/* Menu hamburger pour mobile */}
      {/* Menu hamburger pour mobile */}
      <button
        onClick={toggleMenu}
        className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1 z-[100] relative"
        aria-label="Menu"
      >
        <span
          className={`block w-6 h-0.5 transition-all duration-300 ${
            isMenuOpen
              ? 'rotate-45 translate-y-1.5 bg-white'
              : 'bg-gray-200'
          }`}
        ></span>
        <span
          className={`block w-6 h-0.5 transition-all duration-300 ${
            isMenuOpen
              ? 'opacity-0'
              : 'bg-gray-200'
          }`}
        ></span>
        <span
          className={`block w-6 h-0.5 transition-all duration-300 ${
            isMenuOpen
              ? '-rotate-45 -translate-y-1.5 bg-white'
              : 'bg-gray-200'
          }`}
        ></span>
      </button>


      {/* Menu desktop */}
      <div className="hidden md:flex items-center gap-6">
        {typeof showDashboardButton !== 'undefined' && showDashboardButton && (
          <a href="/dashboard" className="px-3 py-1 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition text-sm">Dashboard</a>
        )}
        <div className="flex items-center gap-2 bg-[#232346] px-3 py-1 rounded-lg text-blue-400 font-bold shadow-blue-glow">
          <span>🔢</span>
          <span>{credits} crédits</span>
        </div>
        <div className="relative group">
          {user?.avatar ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#232346] text-gray-200 font-semibold">
              <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-blue-400" />
              <span className="text-blue-400 font-bold hidden lg:block">{user?.email}</span>
            </div>
          ) : (
            <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#232346] text-gray-200 font-semibold hover:text-blue-400 transition">
              <span>👤</span>
              <span className="hidden lg:block">{user?.email}</span>
            </button>
          )}
        </div>
        <a href="/pricing" className="px-3 py-1 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition text-sm">Mettre à niveau</a>
        <button onClick={() => signOut({ callbackUrl: "/login" })} className="px-3 py-1 rounded bg-[#232346] text-gray-200 font-bold hover:text-red-400 transition text-sm">🚪 Se déconnecter</button>
      </div>

{/* Menu mobile + overlay */}  
{isMenuOpen && (
  <div className="md:hidden fixed inset-0 z-50">
    {/* Overlay semi-transparent pour fermer le menu */}
    <div
      className="absolute inset-0 bg-black bg-opacity-50"
      onClick={closeMenu}
    ></div>

    {/* Menu mobile au-dessus du fond */}
    <div className="absolute top-16 left-0 w-full bg-[#181828] bg-opacity-95 backdrop-blur-md transition-all duration-300 ease-in-out">
      <div className="flex flex-col py-6 space-y-4">
        {/* Crédits */}
        <div className="flex items-center justify-center gap-2 bg-[#232346] px-4 py-3 rounded-lg text-blue-400 font-bold shadow-blue-glow mx-4">
          <span>🔢</span>
          <span>{credits} crédits</span>
        </div>

        {/* Dashboard button */}
        {typeof showDashboardButton !== 'undefined' && showDashboardButton && (
          <a 
            href="/dashboard" 
            onClick={closeMenu}
            className="mx-4 px-4 py-3 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition text-center"
          >
            Dashboard
          </a>
        )}

        {/* User info */}
        <div className="mx-4 px-4 py-3 rounded-lg bg-[#232346] text-gray-200 font-semibold">
          {user?.avatar ? (
            <div className="flex items-center gap-3">
              <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-blue-400" />
              <span className="text-blue-400 font-bold">{user?.email}</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span>👤</span>
              <span className="text-blue-400 font-bold">{user?.email}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 mx-4">
          <a 
            href="/pricing" 
            onClick={closeMenu}
            className="px-4 py-3 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition text-center"
          >
            Mettre à niveau
          </a>
          <button 
            onClick={() => {
              closeMenu();
              signOut({ callbackUrl: "/login" });
            }} 
            className="px-4 py-3 rounded bg-[#232346] text-gray-200 font-bold hover:text-red-400 transition text-center"
          >
            🚪 Se déconnecter
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </header>
  );
}

export default Topbar;
