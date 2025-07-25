import React, { useState } from "react";
import objectiveInstructions from "../lib/objectiveInstructions";
import toneInstructions from "../lib/toneInstructions";


export default function ScriptGenerator() {
  // Champ nom/pseudo
  const [pseudo, setPseudo] = useState("");
  // Aide contextuelle pour chaque section
  // L'aide s'affiche au hover, donc pas besoin d'état React
  const helpTexts = {
    main: `Génère étape par étape un script de conversation entre un modèle et un abonné. Choisis l'objectif, le nombre d'étapes, puis démarre la conversation. Tu peux ajouter des instructions pour influencer le style ou le contenu des réponses.`,
  };
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
        body: JSON.stringify({ objectif, historique: histLimited, tone, pseudo, instructions: fullInstructions })
      });
      const data = await res.json();
      const reply = data.reponse || "";
      setHistorique([...hist.slice(0, -1), { ...hist[hist.length - 1], modele: reply }]);
      setCopiableMsg(reply);
    } catch (err) {
      setHistorique([...hist.slice(0, -1), { ...hist[hist.length - 1], modele: "Erreur lors de la génération." }]);
      setCopiableMsg("Erreur lors de la génération.");
    }
    setIsLoading(false);
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
    <div className="bg-[#181828] rounded-2xl p-8 shadow-lg max-w-4xl mx-auto mb-8">
      <div className="relative flex items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex-1">Génération de Scripts</h2>
        <div className="ml-auto relative group select-none" style={{marginLeft: 'auto'}}>
      {/* Champ pseudo et bouton nouveau chat sous le titre */}
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-blue-400 bg-[#181f3a] text-blue-300 text-xs font-bold cursor-help transition-all duration-150 shadow-none group-hover:bg-blue-500 group-hover:text-white"
            tabIndex={0}
            aria-label="Aide Génération de Scripts"
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
          <button className="absolute top-4 right-4 px-3 py-1 rounded bg-pink-500 text-white font-bold shadow-pink-glow hover:bg-pink-600 transition" onClick={handleClear} title="Réinitialiser la conversation">🧹 Clear</button>
          <label className="block text-gray-300 mb-2">Objectif du script</label>
          <select className="w-full p-3 rounded bg-[#181828] text-gray-200 mb-4" value={objectif} onChange={e => setObjectif(e.target.value)}>
            {objectifs.map(o => <option key={o}>{o}</option>)}
          </select>
          <label className="block text-gray-300 mb-2">Ton</label>
          <select className="w-full p-3 rounded bg-[#181828] text-gray-200 mb-4" value={tone} onChange={e => setTone(e.target.value)}>
            {tones.map(t => <option key={t}>{t}</option>)}
          </select>
          {/* Champ instructions déplacé ici, juste au-dessus du bouton Envoyer */}
          {!historique.length && (
            <>
              <label className="block text-gray-300 mt-4 mb-2">Contexte initial : dernier message du fan</label>
              <textarea className="w-full p-3 rounded bg-[#181820] text-gray-300 mb-4 border border-[#232346] focus:border-blue-500 transition" rows={2} value={initialFanMsg} onChange={e => setInitialFanMsg(e.target.value)} placeholder="Entrez le contexte ou le dernier message du fan ici..." />
              <button className="w-full px-4 py-2 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition mt-4" onClick={async () => {
                if (initialFanMsg) {
                  const hist = [{ modele: "", abonne: initialFanMsg }];
                  setHistorique(hist);
                  setInitialFanMsg("");
                  await generateAndAddModelReply(hist);
                  setCurrentStep(2);
                }
              }} disabled={isLoading || !initialFanMsg}>
                {isLoading ? "Génération..." : "Démarrer la conversation"}
              </button>
            </>
          )}
        </div>
          {historique.length > 0 && historique[historique.length - 1]?.modele && (
            <div className="mb-8">
              <label className="block text-gray-300 mb-2">Réponse de l'abonné</label>
              <textarea className="w-full p-3 rounded bg-[#232346] text-gray-200 mb-4" rows={2} value={abonneMsg} onChange={e => setAbonneMsg(e.target.value)} placeholder="Entrez la réponse de l'abonné ici..." />
              <button
                className="self-start mb-2 px-3 py-1 rounded bg-pink-500 text-white font-bold neon-glow shadow-pink-glow hover:bg-pink-600 transition text-sm"
                onClick={() => setShowInstructions(v => !v)}
                type="button"
                style={{marginBottom: showInstructions ? 0 : 16}}
              >
                {showInstructions ? "Masquer les instructions" : "Instructions supplémentaires +"}
              </button>
              {showInstructions && (
                <div className="mb-2">
                  <label className="block text-gray-300 mb-2">Instructions supplémentaires</label>
                  <textarea
                    className="w-full p-3 rounded bg-[#232346] text-gray-200"
                    rows={2}
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    placeholder="Ex: Le message doit contenir un emoji, rester mystérieux, etc."
                  />
                </div>
              )}
              <div className="w-full flex items-center">
                <button
                  className={`w-full px-4 py-2 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition${!abonneMsg ? ' opacity-60 cursor-not-allowed' : ''}`}
                  onClick={handleNextStep}
                  disabled={!abonneMsg}
                  style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center w-full">
                      <span>Génération</span>
                      <span className="ml-2 text-blue-200 animate-pulse text-xl" aria-label="Génération en cours">…</span>
                    </span>
                  ) : 'Envoyer'}
                </button>
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
                title="Copier le message"
              >{copiedIdx === 'main' ? "copié" : "copier"}</button>
            </div>
          )}
          {historique.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-pink-400 mb-6 neon-glow">Dialogue</h3>
              <div className="flex flex-col gap-2">
                {historique.map((h, i) => (
                  <React.Fragment key={i}>
                    {h.abonne && (
                      <div className="flex items-start gap-2">
                        <div className="bg-[#232346] rounded-xl px-4 py-2 text-gray-300 max-w-[80%] shadow-blue-glow border-l-4 border-pink-400">
                          <span className="font-bold text-pink-400 mr-2">Abonné :</span>{h.abonne}
                        </div>
                      </div>
                    )}
                    {h.modele && h.modele.trim() !== '' && (
                      <div className="flex items-start gap-2 justify-end">
                        <div className="bg-[#181828] rounded-xl px-4 py-2 text-blue-200 max-w-[80%] shadow-blue-glow border-r-4 border-blue-400 ml-auto flex items-center">
                          <span className="font-bold text-blue-400 mr-2 text-nowrap ">Modèle :</span>{h.modele}
                          <button
                            className={`ml-2 px-2 py-1 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition text-xs`}
                            onClick={() => {
                              navigator.clipboard.writeText(h.modele);
                              setCopiedIdx(i);
                              setTimeout(() => setCopiedIdx(null), 1200);
                            }}
                            title="Copier le message"
                          >{copiedIdx === i ? "copié" : "copier"}</button>
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
