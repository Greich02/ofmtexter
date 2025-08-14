import React, { useState } from "react";
import objectiveInstructions from "../lib/objectiveInstructions";
import toneInstructions from "../lib/toneInstructions";
import useUserSession from "./useUserSession";
import { useLanguage } from "../contexts/LanguageContext";
import { t } from "../lib/i18n";


export default function ScriptGenerator({ setCreditsLeft }) {
  const { user, loading } = useUserSession();
  const { language } = useLanguage();
  const hasProScript = user?.planAccess?.proScript;
  const credits = typeof user?.credits === "number" ? user.credits : 0;
  const [creditsLeftState, setCreditsLeftState] = useState(credits);
  const [conversationEnCours, setConversationEnCours] = useState(false);

  // Synchronise creditsLeftState avec user.credits à chaque changement de session
  React.useEffect(() => {
    setCreditsLeftState(credits);
  }, [credits]);
  // Synchronise creditsLeftState avec Topbar à chaque changement
  React.useEffect(() => {
    if (typeof creditsLeftState === "number" && setCreditsLeft) {
      setCreditsLeft(creditsLeftState);
    }
  }, [creditsLeftState, setCreditsLeft]);
  const canGenerate = hasProScript && creditsLeftState > 0;
  // Log pour debug accès et droits
  //console.log("[ScriptGenerator] hasProScript:", hasProScript, "creditsLeft:", creditsLeftState, "canGenerate:", canGenerate, "user:", user, "credits: ", credits);

  // Champ nom/pseudo
  const [pseudo, setPseudo] = useState("");
  // Aide contextuelle pour chaque section
  // L'aide s'affiche au hover, donc pas besoin d'état React
  const helpTexts = {
    main: t("scriptgen_help_main", language)
  };
  const objectifs = [
    t("objective_sexualization", language),
    t("objective_engagement", language),
    t("objective_kyc", language),
    t("objective_media_sale", language),
    t("objective_tips_request", language),
    t("objective_upsell", language),
    t("objective_reactivation", language),
    t("objective_thanks", language),
    t("objective_justification", language),
    t("objective_negotiation", language),
    t("objective_teasing", language),
    t("objective_conversion", language)
  ];
  const tones = [
    t("tone_neutral", language),
    t("tone_sexual", language),
    t("tone_flirty", language),
    t("tone_tender", language),
    t("tone_teasing", language),
    t("tone_dominant", language),
    t("tone_whiny", language),
    t("tone_funny", language),
    t("tone_crazy", language),
    t("tone_romantic", language)
  ];
  const [tone, setTone] = useState(tones[0]);
  const [objectif, setObjectif] = useState(objectifs[0]);
  // const [steps, setSteps] = useState(3); // supprimé
  const [currentStep, setCurrentStep] = useState(1);
  const [historique, setHistorique] = useState([]); // [{modele:..., abonne:...}]
  const [modeleMsg, setModeleMsg] = useState("");
  const [abonneMsg, setAbonneMsg] = useState("");
  const [initialFanMsg, setInitialFanMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Bouton clear pour réinitialiser tout le workflow
  const handleClear = () => {
    setCurrentStep(1);
    setHistorique([]);
    setModeleMsg("");
    setAbonneMsg("");
    setInitialFanMsg("");
    setInstructions("");
    setShowInstructions(false);
    setIsLoading(false);
    setCopiedIdx(null);
  };

  // Champ copiable pour le dernier message généré
  const [copiableMsg, setCopiableMsg] = useState("");
  // Instructions supplémentaires
  const [showInstructions, setShowInstructions] = useState(false);
  const [instructions, setInstructions] = useState("");
  // Feedback copier/copié
  const [copiedIdx, setCopiedIdx] = useState(null);

  // Génère le message du modèle pour l'étape courante et ajoute à l'historique
  const generateAndAddModelReply = async (hist) => {
    setIsLoading(true);
    // Ajoute l'instruction contextuelle selon l'objectif et le ton
    const contextualObjective = objectiveInstructions[objectif] || "";
    const contextualTone = toneInstructions[tone] || "";
    // Combine instructions personnalisées, objectif et ton
    const fullInstructions = [contextualObjective, contextualTone, instructions].filter(Boolean).join("\n");
    // Ne garde que les 10 derniers messages échangés (fan et modèle)
    const histLimited = hist.slice(-10);
    try {
      const res = await fetch("/api/scriptstep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ objectif, historique: histLimited, tone, pseudo, instructions: fullInstructions, language })
      });
      const data = await res.json();
      const reply = data.reponse || "";
      setHistorique([...hist.slice(0, -1), { ...hist[hist.length - 1], modele: reply }]);
      setCopiableMsg(reply);
      // Met à jour les crédits restants si présents dans la réponse
      if (typeof data.creditsLeft === "number") {
        setCreditsLeft(data.creditsLeft);
      }
    } catch (err) {
      setHistorique([...hist.slice(0, -1), { ...hist[hist.length - 1], modele: "Erreur lors de la génération." }]);
      setCopiableMsg("Erreur lors de la génération.");
    }
    setIsLoading(false);
    setInstructions(""); // Reset après envoi
  };

  // Ajoute la réponse abonné, génère la réponse modèle et met à jour l'historique
  const handleNextStep = async () => {
    const newHist = [...historique, { modele: "", abonne: abonneMsg }];
    setAbonneMsg("");
    setHistorique(newHist);
    await generateAndAddModelReply(newHist);
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="bg-[#181828] rounded-2xl p-8 shadow-lg max-w-3xl mx-auto mb-8 mt-8">
      <div className="relative flex items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex-1">{t("scriptgen_title", language)}</h2>
        <div className="ml-auto relative group select-none" style={{marginLeft: 'auto'}}>
      {/* Champ pseudo et bouton nouveau chat sous le titre */}
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-blue-400 bg-[#181f3a] text-blue-300 text-xs font-bold cursor-help transition-all duration-150 shadow-none group-hover:bg-blue-500 group-hover:text-white"
            tabIndex={0}
            aria-label={t("scriptgen_help_aria", language)}
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
      <div className="mb-6" />
      {/* Mode "libre" uniquement */}
      <>
          <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          className="p-2 rounded bg-[#232346] text-gray-200 border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Nom ou Pseudo..."
          value={pseudo}
          onChange={e => setPseudo(e.target.value)}
          style={{ minWidth: 160 }}
        />
        <button
          className="px-3 py-2 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition"
          onClick={() => window.open(window.location.href, '_blank')}
          title="Nouveau chat (nouvel onglet)"
        >Nouveau chat</button>
      </div>
        <div className="bg-[#232346] rounded-b-lg p-6 mb-6 relative">
          <button className="absolute top-4 right-4 px-3 py-1 rounded bg-pink-500 text-white font-bold shadow-pink-glow hover:bg-pink-600 transition" onClick={handleClear} title={t("scriptgen_clear_btn", language)}>🧹 {t("scriptgen_clear_btn", language)}</button>
          <label className="block text-gray-300 mb-2">{t("scriptgen_objective_label", language)}</label>
          <select className="w-full p-3 rounded bg-[#181828] text-gray-200 mb-4" value={objectif} onChange={e => setObjectif(e.target.value)}>
            {objectifs.map(o => <option key={o}>{o}</option>)}
          </select>
          <label className="block text-gray-300 mb-2">{t("scriptgen_tone_label", language)}</label>
          <select className="w-full p-3 rounded bg-[#181828] text-gray-200 mb-4" value={tone} onChange={e => setTone(e.target.value)}>
            {tones.map(t => <option key={t}>{t}</option>)}
          </select>
          {/* Champ instructions déplacé ici, juste au-dessus du bouton Envoyer */}
          {currentStep === 1 && (
            <>
              <label className="block text-gray-300 mt-4 mb-2">{t("scriptgen_step_label", language).replace("{step}", "1")}</label>
              <textarea className="w-full p-3 rounded bg-[#181820] text-gray-300 mb-4 border border-[#232346] focus:border-blue-500 transition" rows={2} value={initialFanMsg} onChange={e => setInitialFanMsg(e.target.value)} placeholder={t("scriptgen_step_placeholder", language)} />
          <button
                className="self-start mb-2 px-3 py-1 rounded bg-pink-500 text-white font-bold neon-glow shadow-pink-glow hover:bg-pink-600 transition text-sm"
                onClick={() => setShowInstructions(v => !v)}
                type="button"
                style={{marginBottom: showInstructions ? 0 : 16}}
              >
                {showInstructions ? t("scriptgen_hide_instructions_btn", language) : t("scriptgen_add_instructions_btn", language)}
              </button>
              {showInstructions && (
                <div className="mb-2">
                  <label className="block text-gray-300 mb-2">{t("scriptgen_instructions_label", language)}</label>
                  <textarea
                    className="w-full p-3 rounded bg-[#232346] text-gray-200 italic border-slate-100 border-2 "
                    rows={2}
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    placeholder={t("scriptgen_instructions_placeholder", language)}
                  />
                </div>
              )}
             
              <button className="w-full px-4 py-2 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition mt-4" onClick={async () => {
                if (initialFanMsg) {
                  const hist = [{ modele: "", abonne: initialFanMsg }];
                  setHistorique(hist);
                  setInitialFanMsg("");
                  // Génère et facture le premier message
                  await generateAndAddModelReply(hist);
                  // Déduire les crédits après génération
                  setCurrentStep(2);
                  setConversationEnCours(true);
                }
              }} disabled={isLoading || !initialFanMsg || !canGenerate }>
                {isLoading ? t("scriptgen_loading_btn", language) : t("scriptgen_generate_btn", language)}
              </button>
            </>
          )}
        </div>
          {conversationEnCours && (
            <div className="mb-8">
              <label className="block text-gray-300 mb-2">{t("scriptgen_step_label", language).replace("{step}", currentStep.toString())}</label>
              <textarea className="w-full p-3 rounded bg-[#232346] text-gray-200 mb-4" rows={2} value={abonneMsg} onChange={e => setAbonneMsg(e.target.value)} placeholder={t("scriptgen_step_placeholder", language)} />
              <button
                className="self-start mb-2 px-3 py-1 rounded bg-pink-500 text-white font-bold neon-glow shadow-pink-glow hover:bg-pink-600 transition text-sm"
                onClick={() => setShowInstructions(v => !v)}
                type="button"
                style={{marginBottom: showInstructions ? 0 : 16}}
              >
                {showInstructions ? t("scriptgen_hide_instructions_btn", language) : t("scriptgen_add_instructions_btn", language)}
              </button>
              {showInstructions && (
                <div className="mb-2">
                  <label className="block text-gray-300 mb-2">{t("scriptgen_instructions_label", language)}</label>
                  <textarea
                    className="w-full p-3 rounded bg-[#232346] text-gray-200"
                    rows={2}
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    placeholder={t("scriptgen_instructions_placeholder", language)}
                  />
                </div>
              )}
              <div className="w-full flex items-center">
                {(!canGenerate || creditsLeftState <= 0) ? (
                  <button className="w-full px-4 py-2 rounded bg-yellow-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-yellow-600 transition" onClick={() => window.location.href = "/pricing"} disabled={isLoading || loading}>
                    {creditsLeftState === 0 ? t("scriptgen_no_credits_btn", language) : t("scriptgen_upgrade_btn", language)}
                  </button>
                ) : (
                  <button
                    className={`w-full px-4 py-2 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition${!abonneMsg ? ' opacity-60 cursor-not-allowed' : ''}`}
                    onClick={handleNextStep}
                    disabled={isLoading || !abonneMsg || !canGenerate}
                    style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center w-full">
                        <span>{t("scriptgen_loading_btn", language)}</span>
                        <span className="ml-2 text-blue-200 animate-pulse text-xl" aria-label={t("scriptgen_loading_btn", language)}>…</span>
                      </span>
                    ) : t("scriptgen_generate_btn", language)}
                  </button>
                )}
                {typeof creditsLeft === "number" && (
                  <span className="ml-4 text-blue-300 font-bold">{t("credits", language)} : {creditsLeftState}</span>
                )}
              </div>
            </div>
          )}
          {copiableMsg && copiableMsg.trim() !== '' && (
            <div className="mb-6 flex items-center gap-2">
              <div className="flex-1 bg-[#232346] rounded-lg px-4 py-3 text-blue-200 font-mono shadow-blue-glow border border-blue-500 select-all overflow-x-auto">
                {copiableMsg}
              </div>
              <button
                className={`ml-2 px-3 py-2 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition`}
                onClick={() => {
                  navigator.clipboard.writeText(copiableMsg);
                  setCopiedIdx('main');
                  setTimeout(() => setCopiedIdx(null), 1200);
                }}
                title={t("scriptgen_copy_btn", language)}
              >{copiedIdx === 'main' ? t("scriptgen_copied_btn", language) : t("scriptgen_copy_btn", language)}</button>
            </div>
          )}
          {historique.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-pink-400 mb-6 neon-glow">{t("scriptgen_results_title", language)}</h3>
              <div className="flex flex-col gap-2">
                {historique.map((h, i) => (
                  <React.Fragment key={i}>
                    {h.abonne && (
                      <div className="flex items-start gap-2">
                        <div className="bg-[#232346] rounded-xl px-4 py-2 text-gray-300 max-w-[80%] shadow-blue-glow border-l-4 border-pink-400">
                          <span className="font-bold text-pink-400 mr-2">{t("scriptgen_step_label", language).replace("{step}", (i+1).toString())}</span>{h.abonne}
                        </div>
                      </div>
                    )}
                    {h.modele && h.modele.trim() !== '' && (
                      <div className="flex items-start gap-2 justify-end">
                        <div className="bg-[#181828] rounded-xl px-4 py-2 text-blue-200 max-w-[80%] shadow-blue-glow border-r-4 border-blue-400 ml-auto flex items-center">
                          <span className="font-bold text-blue-400 mr-2 text-nowrap ">{t("scriptgen_variant_label", language).replace("{variant}", (i+1).toString())}</span>{h.modele}
                          <button
                            className={`ml-2 px-2 py-1 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition text-xs`}
                            onClick={() => {
                              navigator.clipboard.writeText(h.modele);
                              setCopiedIdx(i);
                              setTimeout(() => setCopiedIdx(null), 1200);
                            }}
                            title={t("scriptgen_copy_btn", language)}
                          >{copiedIdx === i ? t("scriptgen_copied_btn", language) : t("scriptgen_copy_btn", language)}</button>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </>
      {/* Le mode "media" est maintenant une section à part entière */}
      {/* Historique stylé affiché ci-dessus, section scripts enregistrés retirée */}
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
