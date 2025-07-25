import React, { useState } from "react";
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

export default function TextGenerator() {
  // Aide contextuelle au hover
  const helpTexts = {
    main: `Génère plusieurs variantes de réponses pour un échange entre un fan et un modèle. Remplis les messages, choisis le ton, l'objectif, le nombre de variantes, et ajoute des instructions si besoin. Clique sur "Générer les réponses" pour obtenir des suggestions IA.`,
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
    } catch (err) {
      setResults([{ variant: 1, text: "Erreur lors de la génération." }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-[#181828] rounded-2xl p-8 shadow-lg max-w-3xl mx-auto mb-8">
      <div className="relative flex items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex-1">Générateur de Textes</h2>
        <div className="ml-auto relative group select-none" style={{marginLeft: 'auto'}}>
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-blue-400 bg-[#181f3a] text-blue-300 text-xs font-bold cursor-help transition-all duration-150 shadow-none group-hover:bg-blue-500 group-hover:text-white"
            tabIndex={0}
            aria-label="Aide Générateur de Textes"
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
      <button className="mb-4 px-4 py-2 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition" onClick={addExchange}>+ Ajouter un échange</button>
      {exchanges.map((ex, idx) => (
        <div key={idx} className="mb-6">
          <label className="block text-gray-300 mb-2">Message du modèle</label>
          <textarea className="w-full p-3 rounded bg-[#232346] text-gray-200 mb-2" rows={2} value={ex.model} onChange={e => handleExchangeChange(idx, "model", e.target.value)} placeholder="Entrez la réponse du modèle ici..." />
          <label className="block text-gray-300 mb-2">Réponse du fan</label>
          <textarea className="w-full p-3 rounded bg-[#232346] text-gray-200" rows={2} value={ex.fan} onChange={e => handleExchangeChange(idx, "fan", e.target.value)} placeholder="Entrez le message du fan ici..." />
        </div>
      ))}
      <div className="flex gap-4 mb-6 items-end flex-wrap">
        <div>
          <label className="block text-gray-300 mb-2">Ton</label>
          <select className="p-2 rounded bg-[#232346] text-gray-200" value={tone} onChange={e => setTone(e.target.value)}>
            {tones.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Objectif</label>
          <select className="p-2 rounded bg-[#232346] text-gray-200" value={objectif} onChange={e => setObjectif(e.target.value)}>
            {objectifs.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="block text-gray-300 mb-2">Nombre de réponses à générer</label>
          <div className="flex items-center gap-2">
            <input type="range" min={1} max={5} value={count} onChange={e => setCount(Number(e.target.value))} className="w-32" />
            <span className="ml-2 text-blue-400 font-bold">{count}</span>
            <button
              className="ml-4 px-3 py-1 rounded bg-pink-500 text-white font-bold neon-glow shadow-pink-glow hover:bg-pink-600 transition text-sm"
              onClick={() => setShowInstructions(v => !v)}
              type="button"
            >
              {showInstructions ? "Masquer les instructions" : "Ajouter des instructions +"}
            </button>
          </div>
        </div>
      </div>
      {showInstructions && (
        <div className="mb-4">
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
      <div className="flex gap-4 mb-6">
        <button className="px-6 py-2 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition" onClick={generateResponses} disabled={isLoading}>
          {isLoading ? "Génération..." : "Générer les réponses"}
        </button>
        <button className="px-6 py-2 rounded bg-[#232346] text-gray-200 font-bold hover:text-red-400 transition" onClick={clearAll} disabled={isLoading}>Clear</button>
      </div>
      {results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-white mb-4">Résultats générés</h3>
          <div className="space-y-4">
            {results.map((r, idx) => (
              <div key={r.variant} className="bg-[#232346] rounded-lg p-4 shadow-blue-glow text-gray-200 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-400">Variante {r.variant}</span>
                  <button
                    className={`text-xs px-3 py-1 rounded font-bold transition ${copiedIdx === idx ? "bg-blue-500 text-white neon-glow" : "bg-[#181828] text-blue-400 hover:bg-blue-500 hover:text-white"}`}
                    onClick={() => {
                      navigator.clipboard.writeText(r.text);
                      setCopiedIdx(idx);
                      setTimeout(() => setCopiedIdx(null), 1200);
                    }}
                  >{copiedIdx === idx ? "copié" : "copier"}</button>
                </div>
                <div className="text-gray-200">{r.text}</div>
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
