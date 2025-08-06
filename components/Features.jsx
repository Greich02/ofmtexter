import React from "react";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { t } from "../lib/i18n";

const features = [
  {
    icon: "💬",
    title: "features_title1",
    desc: "features_desc1"
  },
  {
    icon: "�",
    title: "features_title2",
    desc: "features_desc2"
  },
  {
    icon: "🖼️",
    title: "features_title3",
    desc: "features_desc3"
  },
  {
    icon: "👥",
    title: "features_title4",
    desc: "features_desc4"
  },
];

export default function Features() {
  const { language } = useLanguage();
  return (
    <section id="features" className="py-16 bg-gradient-to-b from-gray-950 via-black to-gray-900">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-4 p-6 bg-gray-900 rounded-xl shadow hover:shadow-blue-glow transition">
            <span className="text-3xl">{f.icon}</span>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">{t(f.title, language)}</h4>
              <p className="text-gray-300">{t(f.desc, language)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
