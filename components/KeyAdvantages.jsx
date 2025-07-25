import React from "react";
import KeyAdvantageCard from "./KeyAdvantageCard";

export default function KeyAdvantages() {
  return (
    <section className="py-16 bg-black flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <KeyAdvantageCard
          icon={<span role="img" aria-label="Gain de temps">🔥</span>}
          title="Gain de temps pour vos équipes"
          description="Automatisez les tâches répétitives et concentrez-vous sur l’essentiel."
        />
        <KeyAdvantageCard
          icon={<span role="img" aria-label="Optimisation">📈</span>}
          title="Optimisation des revenus"
          description="Scripts testés pour maximiser vos conversions et revenus."
        />
        <KeyAdvantageCard
          icon={<span role="img" aria-label="IA">🤖</span>}
          title="IA entraînée pour OnlyFans"
          description="Des messages personnalisés adaptés à votre audience OFM."
        />
      </div>
    </section>
  );
}
