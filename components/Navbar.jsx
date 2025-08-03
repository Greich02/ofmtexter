"use client";
import React from "react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-between px-8 py-4 shadow-lg">
      <a href="/">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 font-extrabold text-2xl neon-glow">OfmPilot</span>
        </div>
      </a>
      <ul className="flex gap-8 text-gray-200 font-medium">
        <li><a href="/" className="hover:text-blue-400 transition">Accueil</a></li>
        <li><a href="#features" className="hover:text-blue-400 transition">Fonctionnalités</a></li>
        <li><a href="/pricing" className="hover:text-blue-400 transition">Tarifs</a></li>
      </ul>
      <div className="flex gap-4">
        <a href="/login" className="px-4 py-2 rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition text-center">Connexion</a>
        <a href="/signup" className="px-4 py-2 rounded-lg bg-blue-500 text-white font-bold shadow-blue-glow hover:bg-blue-600 transition text-center">Créer un compte</a>
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
    </nav>
  );
}
