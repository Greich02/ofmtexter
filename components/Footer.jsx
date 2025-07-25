"use client";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black py-10 text-gray-400 mt-16">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 px-4">
        <div className="flex flex-col gap-2 md:gap-4">
          <div className="flex gap-4 mb-2">
            <a href="#about" className="hover:text-blue-400">À propos</a>
            <a href="#legal" className="hover:text-blue-400">Mentions légales</a>
            <a href="#policy" className="hover:text-blue-400">Politique</a>
            <a href="#faq" className="hover:text-blue-400">FAQ</a>
          </div>
          <div>Email : <a href="mailto:support@onlyprompt.ai" className="text-blue-400 hover:underline">support@onlyprompt.ai</a></div>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-blue-400"><span className="text-xl">X</span></a>
            <a href="#" className="hover:text-blue-400"><span className="text-xl">Discord</span></a>
            <a href="#" className="hover:text-blue-400"><span className="text-xl">Instagram</span></a>
          </div>
        </div>
        <div className="text-sm text-center md:text-right mt-4 md:mt-0">
          © 2025 OnlyPrompt. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
