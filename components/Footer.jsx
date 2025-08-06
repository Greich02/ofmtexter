"use client";
import React from "react";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { t } from "../lib/i18n";

export default function Footer() {
  const { language } = useLanguage();
  return (
    <footer className="bg-black py-8 md:py-10 text-gray-400 mt-16">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 px-4">
        <div className="flex flex-col gap-3 md:gap-4 text-center md:text-left">
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-2">
            <a href="#about" className="hover:text-blue-400 transition">{t("footer_about", language)}</a>
            <a href="#legal" className="hover:text-blue-400 transition">{t("footer_legal", language)}</a>
            <a href="#policy" className="hover:text-blue-400 transition">{t("footer_policy", language)}</a>
            <a href="#faq" className="hover:text-blue-400 transition">{t("footer_faq", language)}</a>
          </div>
          <div className="text-sm md:text-base">
            {t("footer_email_label", language)} <a href="mailto:support@ofmpilot.com" className="text-blue-400 hover:underline">support@ofmpilot.com</a>
          </div>
          <div className="flex justify-center md:justify-start gap-4 mt-2">
            <a href="#" className="hover:text-blue-400 transition"><span className="text-lg md:text-xl">X</span></a>
            <a href="#" className="hover:text-blue-400 transition"><span className="text-lg md:text-xl">Discord</span></a>
            <a href="#" className="hover:text-blue-400 transition"><span className="text-lg md:text-xl">Instagram</span></a>
          </div>
        </div>
        <div className="text-xs md:text-sm text-center md:text-right mt-4 md:mt-0">
          {t("footer_copyright", language)}
        </div>
      </div>
    </footer>
  );
}
