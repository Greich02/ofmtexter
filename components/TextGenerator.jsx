import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { t } from "../lib/i18n";
import useUserSession from "./useUserSession";
import { generateTextWithProvider } from "../lib/textProvider";
import objectiveInstructions from "../lib/objectiveInstructions";
import toneInstructions from "../lib/toneInstructions";

const tones = [
  "Neutre",
  "Sexuel",
  "Aguicheur",
  "Tendre",
  "Taquin",
  "Dominant",
  "Chouineur",
  "Drôle",
  "Fou",
  "Romantique",
];
const objectifs = [
  "Sexualisation",
  "Engagement",
  "KYC",
  "Vente de média",
  "Demande de tips",
  "Vente complémentaire",
  "Réactivation",
  "Remerciement",
  "Justification",
  "Négociation",
  "Teasing",
  "Conversion"
];

export default function TextGenerator({ setCreditsLeft }) {
  const { language } = useLanguage();
  const { user, loading } = useUserSession();
  const hasBasicScript = user?.planAccess?.basicScript;
  const credits = typeof user?.credits === "number" ? user.credits : null;
  const canGenerate = hasBasicScript && credits > 0;
  const [creditsLeftState, setCreditsLeftState] = useState(credits);

  // Synchronise creditsLeftState avec Topbar à chaque changement
  React.useEffect(() => {
    if (typeof creditsLeftState === "number" && setCreditsLeft) {
      setCreditsLeft(creditsLeftState);
    }
  }, [creditsLeftState, setCreditsLeft]);
  // Aide contextuelle au hover
  const helpTexts = {
        main: t("textgen_help_main", language)
  };
  const [exchanges, setExchanges] = useState([
    { fan: "", model: "" }
  ]);
  const [tone, setTone] = useState(tones[0]);
  const [objectif, setObjectif] = useState(objectifs[0]);
  const [count, setCount] = useState(3);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleExchangeChange = (idx, field, value) => {
    const updated = exchanges.map((ex, i) =>
      i === idx ? { ...ex, [field]: value } : ex
    );
    setExchanges(updated);
  };

  const addExchange = () => {
    setExchanges([{ fan: "", model: "" }, ...exchanges]);
  };

  const clearAll = () => {
    setExchanges([{ fan: "", model: "" }]);
    setResults([]);
  };

  const generateResponses = async () => {
    setIsLoading(true);
    setCopiedIdx(null);
    // Ajoute l'instruction contextuelle selon l'objectif et le ton
    const contextualObjective = objectiveInstructions[objectif] || "";
    const contextualTone = toneInstructions[tone] || "";
    // Combine instructions personnalisées, objectif et ton
    const fullInstructions = [contextualObjective, contextualTone, instructions].filter(Boolean).join("\n");
    try {
      const response = await generateTextWithProvider({ exchanges, tone, objectif, count, instructions: fullInstructions });
      setResults(response.results);
      if (typeof response.creditsLeft === "number") {
        setCreditsLeftState(response.creditsLeft);
        if (setCreditsLeft) setCreditsLeft(response.creditsLeft);
      }
    } catch (err) {
      setResults([{ variant: 1, text: "Erreur lors de la génération." }]);
    }
    setIsLoading(false);
    setInstructions(""); // Reset après envoi

  };

  return (
    <div className="bg-[#181828] rounded-2xl p-4 md:p-8 shadow-lg max-w-3xl mx-auto mb-8 mt-8">
      <div className="relative flex items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white flex-1">{t("textgen_title", language)}</h2>
        <div className="ml-auto relative group select-none" style={{marginLeft: 'auto'}}>
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-blue-400 bg-[#181f3a] text-blue-300 text-xs font-bold cursor-help transition-all duration-150 shadow-none group-hover:bg-blue-500 group-hover:text-white"
            tabIndex={0}
            aria-label={t("textgen_help_aria", language)}
          >
            ?
          </span>
          <div className="absolute right-0 mt-2 z-50 hidden group-hover:block group-focus:block animate-fade-in"
            style={{minWidth: '220px'}}>
            <div className="bg-[#1a2550] text-white text-sm rounded-lg shadow-lg p-4 border border-blue-500 max-w-xs">
              {helpTexts.main}
            </div>
          </div>
        </div>
      </div>
      <button className="mb-4 px-4 py-2 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition text-sm md:text-base" onClick={addExchange}>{t("textgen_add_exchange_btn", language)}</button>
      {exchanges.map((ex, idx) => (
        <div key={idx} className="mb-6">
          <label className="block text-gray-300 mb-2 text-sm md:text-base">{t("textgen_model_label", language)}</label>
          <textarea className="w-full p-3 rounded bg-[#232346] text-gray-200 mb-2 text-sm md:text-base" rows={2} value={ex.model} onChange={e => handleExchangeChange(idx, "model", e.target.value)} placeholder={t("textgen_model_placeholder", language)} />
          <label className="block text-gray-300 mb-2 text-sm md:text-base">{t("textgen_fan_label", language)}</label>
          <textarea className="w-full p-3 rounded bg-[#232346] text-gray-200 text-sm md:text-base" rows={2} value={ex.fan} onChange={e => handleExchangeChange(idx, "fan", e.target.value)} placeholder={t("textgen_fan_placeholder", language)} />
        </div>
      ))}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-end flex-wrap">
        <div className="w-full sm:w-auto">
          <label className="block text-gray-300 mb-2 text-sm md:text-base">{t("textgen_tone_label", language)}</label>
          <select className="w-full sm:w-auto p-2 rounded bg-[#232346] text-gray-200 text-sm md:text-base" value={tone} onChange={e => setTone(e.target.value)}>
            {tones.map(toneVal => <option key={toneVal}>{t(toneVal, language)}</option>)}
          </select>
        </div>
        <div className="w-full sm:w-auto">
          <label className="block text-gray-300 mb-2 text-sm md:text-base">{t("textgen_objective_label", language)}</label>
          <select className="w-full sm:w-auto p-2 rounded bg-[#232346] text-gray-200 text-sm md:text-base" value={objectif} onChange={e => setObjectif(e.target.value)}>
            {objectifs.map(objVal => <option key={objVal}>{t(objVal, language)}</option>)}
          </select>
        </div>
        <div className="flex flex-col w-full sm:w-auto">
          <label className="block text-gray-300 mb-2 text-sm md:text-base">{t("textgen_count_label", language)}</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input type="range" min={1} max={5} value={count} onChange={e => setCount(Number(e.target.value))} className="w-24 sm:w-32" />
              <span className="text-blue-400 font-bold text-sm md:text-base">{count}</span>
            </div>
            <button
              className="px-3 py-1 rounded bg-pink-500 text-white font-bold neon-glow shadow-pink-glow hover:bg-pink-600 transition text-xs md:text-sm"
              onClick={() => setShowInstructions(v => !v)}
              type="button"
            >
              {showInstructions ? t("textgen_hide_instructions_btn", language) : t("textgen_add_instructions_btn", language)}
            </button>
          </div>
        </div>
      </div>
      {showInstructions && (
        <div className="mb-4">
          <label className="block text-gray-300 mb-2 text-sm md:text-base">{t("textgen_instructions_label", language)}</label>
          <textarea
                className="w-full p-3 rounded bg-[#232346] text-gray-200 italic border-slate-100 border-2 text-sm md:text-base"
                 rows={2}
                 value={instructions}
                 onChange={e => setInstructions(e.target.value)}
                 placeholder={t("textgen_instructions_placeholder", language)}
               />
             </div>
      )}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {(!canGenerate || creditsLeftState === 0) ? (
          <button className="w-full px-4 py-2 rounded bg-yellow-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-yellow-600 transition text-sm md:text-base" onClick={() => window.location.href = "/pricing"} disabled={isLoading || loading}>
                    {creditsLeftState === 0 ? t("textgen_no_credits_btn", language) : t("textgen_upgrade_btn", language)}
          </button>
        ) : (
          <button className="w-full sm:w-auto px-6 py-2 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition text-sm md:text-base" onClick={generateResponses} disabled={isLoading || !canGenerate}>
            {isLoading ? t("textgen_loading_btn", language) : t("textgen_generate_btn", language)}
          </button>
        )}
        <button className="w-full sm:w-auto px-6 py-2 rounded bg-[#232346] text-gray-200 font-bold hover:text-red-400 transition text-sm md:text-base" onClick={clearAll} disabled={isLoading}>{t("textgen_clear_btn", language)}</button>
      </div>
      {results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg md:text-xl font-bold text-white mb-4">{t("textgen_results_title", language)}</h3>
          <div className="space-y-4">
            {results.map((r, idx) => (
              <div key={r.variant} className="bg-[#232346] rounded-lg p-4 shadow-blue-glow text-gray-200 flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span className="font-bold text-blue-400 text-sm md:text-base">{t("textgen_variant_label", language, { variant: r.variant })}</span>
                  <button
                    className={`text-xs px-3 py-1 rounded font-bold transition ${copiedIdx === idx ? "bg-blue-500 text-white neon-glow" : "bg-[#181828] text-blue-400 hover:bg-blue-500 hover:text-white"}`}
                    onClick={() => {
                      navigator.clipboard.writeText(r.text);
                      setCopiedIdx(idx);
                      setTimeout(() => setCopiedIdx(null), 1200);
                    }}
                  >{copiedIdx === idx ? t("textgen_copied_btn", language) : t("textgen_copy_btn", language)}</button>
                </div>
                <div className="text-gray-200 text-sm md:text-base">{r.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}
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
    </div>
  );
}
