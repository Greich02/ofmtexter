'use client'
import React, { useState } from "react";
import useUserSession from "./useUserSession";
import { useLanguage } from "../contexts/LanguageContext";
import { t } from "../lib/i18n";
// Placeholders dynamiques pour chaque type d'étape
const stepDescriptionPlaceholders = {
  "Chauffe": "Ex: Décris une scène ou une ambiance excitante liée au média à venir (ex : 'je suis nue sous la douche, j’ai pensé à toi…'), ou à la précédente phrase de sexualisation. Donne des détails sensoriels pour nourrir l’imaginaire.",
  "Média": "Ex: Voici ce que contient le média : la modèle est nue sur le lit, ne porte qu'une culotte mais se cache les seins avec une main. Décris le média pour donner envie et précise que tout ça est nouveau pour elle.",
  "Post-média": "Ex: Décris comment la modèle se sent après l’envoi du média (ex : 'elle est toute excitée à l’idée qu’il l’ait vue nue, veut savoir ce qu’il en a pensé').",
  "Sexualisation post-media": "Ex: Donne à l'abonné une idée de ce qui pourrait se passer ensuite dans ce scénario pour relancer l’excitation (ex : 'elle lui chuchote ce qu’elle aimerait lui faire s’il était là maintenant').",
  "Fidélisation post script": "Ex: Exprime comme la modèle a apprécié ce moment et aimerais remettre ça plus souvent avec lui."
};

const stepTypes = [
  "Chauffe",
  "Média",
  "Post-média",
  "Sexualisation post-media",
  "Fidélisation post script"
];

export default function MediaScriptGenerator({ setCreditsLeft }) {
  const { language } = useLanguage();

  const { user, loading } = useUserSession();
  const hasMediaScript = user?.planAccess?.mediaScript;
  const credits = typeof user?.credits === "number" ? user.credits : null;
  const canGenerate = hasMediaScript && credits > 0;
  const [creditsLeftState, setCreditsLeftState] = useState(credits);
  React.useEffect(() => {
    if (typeof creditsLeftState === "number" && setCreditsLeft) {
      setCreditsLeft(creditsLeftState);
    }
  }, [creditsLeftState, setCreditsLeft]);
  const helpTexts = {
    main: t("mediascriptgen_help_main", language)
  };
  const [scriptName, setScriptName] = useState("");
  const [steps, setSteps] = useState([
    { name: "", type: t("mediascriptgen_step_type_chauffe", language), desc: "" }
  ]);
  const [generated, setGenerated] = useState([]);
  const handleStepChange = (idx, field, value) => {
    const updated = steps.map((step, i) =>
      i === idx ? { ...step, [field]: value } : step
    );
    setSteps(updated);
  };

  const addStep = () => {
    setSteps([...steps, { name: "", type: t("mediascriptgen_step_type_chauffe", language), desc: "" }]);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(null);
  const [copiableMsg, setCopiableMsg] = useState("");

  const generateScript = async () => {
    setIsLoading(true);
    setGenerated([]);
    setCurrentStepIdx(null);
    setCopiableMsg("");
    try {
      const res = await fetch("/api/mediascript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scriptName, steps })
      });
      const data = await res.json();
      setGenerated(data.results || []);

      if (data.results && data.results.length > 0) {
        setCurrentStepIdx(0);
        setCopiableMsg(data.results[0].content);
      }
      if (typeof data.creditsLeft === "number") setCreditsLeftState(data.creditsLeft);
  // Synchronise creditsLeftState avec Topbar à chaque changement
  React.useEffect(() => {
    if (typeof creditsLeftState === "number" && setCreditsLeft) {
      setCreditsLeft(creditsLeftState);
    }
  }, [creditsLeftState, setCreditsLeft]);
    } catch (err) {
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-[#181828] rounded-2xl p-8 shadow-lg max-w-3xl mx-auto mb-8 mt-8">
      <div className="relative flex items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex-1">{t("mediascriptgen_title", language)}</h2>
        <div className="ml-auto relative group select-none" style={{marginLeft: 'auto'}}>
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-blue-400 bg-[#181f3a] text-blue-300 text-xs font-bold cursor-help transition-all duration-150 shadow-none group-hover:bg-blue-500 group-hover:text-white"
            tabIndex={0}
            aria-label={t("mediascriptgen_help_aria", language)}
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
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">{t("mediascriptgen_script_name_label", language) || "Nom du script"}</label>
        <input className="w-full p-3 rounded bg-[#232346] text-gray-200 mb-4" value={scriptName} onChange={e => setScriptName(e.target.value)} placeholder={t("mediascriptgen_script_name_placeholder", language) || "Ex: Séquence photo premium"} />
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-4">{t("mediascriptgen_steps_title", language) || "Étapes du script"}</h3>
        {steps.map((step, idx) => (
          <div key={idx} className="bg-[#232346] rounded-lg p-4 mb-4 flex flex-col gap-2">
            <label className="text-gray-300">{t("mediascriptgen_step_name_label", language) || "Nom de l’étape"}</label>
            <input className="p-2 rounded bg-[#181828] text-gray-200" value={step.name} onChange={e => handleStepChange(idx, "name", e.target.value)} placeholder={t("mediascriptgen_step_name_placeholder", language) || "Nom de l’étape..."} />
            <label className="text-gray-300">{t("mediascriptgen_media_type_label", language)}</label>
            <select className="p-2 rounded bg-[#181828] text-gray-200" value={step.type} onChange={e => handleStepChange(idx, "type", e.target.value)}>
              {stepTypes.map((type, i) => <option key={type + '-' + i}>{t(`mediascriptgen_step_type_${type.toLowerCase().replace(/\s+/g, '_')}`, language) || type}</option>)}
            </select>
            <label className="text-gray-300">{t("mediascriptgen_step_desc_label", language) || "Description"}</label>
            <textarea
              className="p-2 rounded bg-[#181828] text-gray-200"
              value={step.desc}
              onChange={e => handleStepChange(idx, "desc", e.target.value)}
              placeholder={t(`mediascriptgen_step_desc_placeholder_${step.type.toLowerCase().replace(/\s+/g, '_')}`, language) || "Décrivez ce que vous souhaitez obtenir..."}
            />
          </div>
        ))}
        <button className="px-4 py-2 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition" onClick={addStep}>{t("mediascriptgen_add_step_btn", language)}</button>
      </div>
      {(!canGenerate || creditsLeftState === 0) ? (
        <button className="w-full px-4 py-2 rounded bg-yellow-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-yellow-600 transition" onClick={() => window.location.href = "/pricing"} disabled={isLoading || loading}>
                    {creditsLeftState === 0 ? t("mediascriptgen_no_credits_btn", language) : t("mediascriptgen_upgrade_btn", language)}
        </button>
      ) : (
        <button className="w-full px-4 py-2 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition mb-6" onClick={generateScript} disabled={isLoading || !canGenerate}>{t("mediascriptgen_generate_btn", language)}</button>
      )}

      {isLoading && (
        <div className="mb-6 text-blue-400 font-bold animate-pulse">{t("mediascriptgen_loading_btn", language)}</div>
      )}
      {(generated.length > 0 || currentStepIdx !== null) && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-white mb-4">{t("mediascriptgen_results_title", language)} : <span className="text-blue-400">{generated[currentStepIdx].stepName}</span></h3>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 bg-[#232346] rounded-lg px-4 py-3 text-blue-200 font-mono shadow-blue-glow border border-blue-500 select-all overflow-x-auto">
              {generated[currentStepIdx].content}
            </div>
            <button
              className="ml-2 px-3 py-2 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition"
              onClick={() => {navigator.clipboard.writeText(generated[currentStepIdx].content)}}
              title={t("mediascriptgen_copy_btn", language)}
            >{t("mediascriptgen_copy_btn", language)}</button>
          </div>
          <div className="flex gap-2">
            {generated.map((step, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded font-bold text-xs transition ${i === currentStepIdx ? "bg-blue-500 text-white neon-glow" : "bg-[#232346] text-blue-400 hover:bg-blue-500 hover:text-white"}`}
                onClick={() => { setCurrentStepIdx(i); setCopiableMsg(step.content); }}
              >{step.stepName || t("mediascriptgen_variant_label", language).replace("{variant}", (i + 1).toString())}</button>
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
