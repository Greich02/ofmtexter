import React from "react";
import { useLanguage } from "../contexts/LanguageContext.jsx";

export default function LanguageDropdown() {
  const { language, switchLanguage } = useLanguage();

  return (
    <div className="relative inline-block text-left">
      <select
        value={language}
        onChange={e => switchLanguage(e.target.value)}
        className="bg-[#232346] text-blue-400 font-bold px-3 py-2 rounded-lg border border-blue-400 focus:outline-none"
        aria-label="Choisir la langue"
      >
        <option value="fr">Français</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
