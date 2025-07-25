"use client";
import React from "react";
import { useSession, signOut, SessionProvider } from "next-auth/react";

const Topbar = ({ credits = 0, showDashboardButton }) => {
  return (
    <SessionProvider>
      <TopbarContent credits={credits} showDashboardButton={showDashboardButton} />
    </SessionProvider>
  );
};

function TopbarContent({ credits = 0, showDashboardButton }) {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <header className="fixed top-0 left-0 right-0 w-full h-16 bg-[#181828] flex items-center justify-between px-8 z-40 shadow-lg">
      <a href="/">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 font-extrabold text-2xl neon-glow">OnlyPrompt</span>
        </div>
      </a>
      <div className="flex items-center gap-6">
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
              <span className="text-blue-400 font-bold">{user.email}</span>
            </div>
          ) : (
            <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#232346] text-gray-200 font-semibold hover:text-blue-400 transition">
              <span>👤</span>
              <span>{user?.email || "Manager"}</span>
            </button>
          )}
        </div>
        <a href="/dashboard/buycredits" className="px-3 py-1 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition text-sm">+ Ajouter des crédits</a>
        <button onClick={() => signOut({ callbackUrl: "/login" })} className="px-3 py-1 rounded bg-[#232346] text-gray-200 font-bold hover:text-red-400 transition text-sm">🚪 Se déconnecter</button>
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
    </header>
  );
}

export default Topbar;
