import React from "react";
import KeyAdvantageCard from "./KeyAdvantageCard";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { t } from "../lib/i18n";

export default function KeyAdvantages() {
  const { language } = useLanguage();
  return (
    <section className="py-16 bg-black flex flex-col items-center" >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <KeyAdvantageCard
          icon={<span role="img" aria-label="Gain de temps">🔥</span>}
          title={t("keyadv_time_title", language)}
          description={t("keyadv_time_desc", language)}
        />
        <KeyAdvantageCard
          icon={<span role="img" aria-label="Optimisation">📈</span>}
          title={t("keyadv_revenue_title", language)}
          description={t("keyadv_revenue_desc", language)}
        />
        <KeyAdvantageCard
          icon={<span role="img" aria-label="IA">🤖</span>}
          title={t("keyadv_ai_title", language)}
          description={t("keyadv_ai_desc", language)}
        />
      </div>
    </section>
  );
}
