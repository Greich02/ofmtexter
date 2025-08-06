"use client";
import React, { useState } from "react";
import LanguageDropdown from "./LanguageDropdown.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { t } from "../lib/i18n";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-between px-4 md:px-8 py-4 shadow-lg">
      {/* Logo */}
      <a href="/" onClick={closeMenu}>
        <div className="flex items-center gap-2">
          <span className="text-blue-400 font-extrabold text-xl md:text-2xl neon-glow">OfmPilot</span>
        </div>
      </a>

      {/* Menu hamburger pour mobile */}
      <button
        onClick={toggleMenu}
        className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
        aria-label="Menu"
      >
        <span className={`block w-6 h-0.5 bg-gray-200 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-gray-200 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-gray-200 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
      </button>

      {/* Menu desktop */}
      <div className="hidden md:flex items-center gap-8">
        <ul className="flex gap-8 text-gray-200 font-medium">
          <li><a href="/" className="hover:text-blue-400 transition">{t("navbar_home", language)}</a></li>
          <li><a href="#features" className="hover:text-blue-400 transition">{t("navbar_features", language)}</a></li>
          <li><a href="/pricing" className="hover:text-blue-400 transition">{t("navbar_pricing", language)}</a></li>
        </ul>
        <LanguageDropdown />
        <div className="flex gap-4">
          <a href="/login" className="px-4 py-2 rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition text-center">{t("navbar_login", language)}</a>
          <a href="/signup" className="px-4 py-2 rounded-lg bg-blue-500 text-white font-bold shadow-blue-glow hover:bg-blue-600 transition text-center">{t("navbar_signup", language)}</a>
        </div>
      </div>

      {/* Menu mobile */}
      <div className={`md:hidden fixed top-16 left-0 w-full bg-black bg-opacity-95 backdrop-blur-md transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="flex flex-col items-center py-8 space-y-6">
          <ul className="flex flex-col items-center gap-6 text-gray-200 font-medium text-lg">
            <li><a href="/" onClick={closeMenu} className="hover:text-blue-400 transition">{t("navbar_home", language)}</a></li>
            <li><a href="#features" onClick={closeMenu} className="hover:text-blue-400 transition">{t("navbar_features", language)}</a></li>
            <li><a href="/pricing" onClick={closeMenu} className="hover:text-blue-400 transition">{t("navbar_pricing", language)}</a></li>
          </ul>
          <LanguageDropdown />
          <div className="flex flex-col gap-4 w-full max-w-xs px-4">
            <a 
              href="/login" 
              onClick={closeMenu}
              className="px-6 py-3 rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition text-center font-medium"
            >
              {t("navbar_login", language)}
            </a>
            <a 
              href="/signup" 
              onClick={closeMenu}
              className="px-6 py-3 rounded-lg bg-blue-500 text-white font-bold shadow-blue-glow hover:bg-blue-600 transition text-center"
            >
              {t("navbar_signup", language)}
            </a>
          </div>
        </div>
      </div>

      {/* Overlay pour fermer le menu */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        ></div>
      )}
    </nav>
  );
}
