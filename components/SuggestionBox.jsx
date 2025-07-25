import React, { useState } from "react";

const categories = [
  { value: "bug", label: "Signaler un bug" },
  { value: "feature", label: "Demander une fonctionnalité" },
  { value: "improvement", label: "Proposer une amélioration" },
  { value: "other", label: "Autre" },
];

export default function SuggestionBox() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(categories[0].value);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/suggestion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, message }),
    });
    setLoading(false);
    setSent(true);
    setMessage("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        className="w-12 h-12 rounded-full bg-blue-500 shadow-lg flex items-center justify-center text-white text-2xl font-bold hover:bg-blue-600 transition focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-label="Ouvrir la boîte à suggestions"
        style={{ boxShadow: "0 2px 16px 0 #3b82f6aa" }}
      >
        💡
      </button>
      {open && (
        <div className="absolute bottom-16 right-0 w-80 max-w-xs bg-[#181f3a] border border-blue-400 rounded-xl shadow-2xl p-5 animate-fade-in text-white">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-blue-400 text-lg">Suggestion</span>
            <button className="text-gray-400 hover:text-blue-400 text-xl font-bold" onClick={() => setOpen(false)} aria-label="Fermer">×</button>
          </div>
          {!sent ? (
            <form onSubmit={handleSubmit}>
              <label className="block text-sm mb-1 text-gray-300">Catégorie</label>
              <select
                className="w-full mb-3 p-2 rounded bg-[#232346] text-gray-200 border border-blue-500 focus:outline-none"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <label className="block text-sm mb-1 text-gray-300">Votre suggestion</label>
              <textarea
                className="w-full p-2 rounded bg-[#232346] text-gray-200 border border-blue-500 focus:outline-none mb-3"
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Exprimez-vous librement..."
                required
              />
              <button
                type="submit"
                className="w-full py-2 rounded bg-blue-500 text-white font-bold neon-glow shadow-blue-glow hover:bg-blue-600 transition mt-2"
                disabled={loading || !message.trim()}
              >
                {loading ? "Envoi..." : "Envoyer"}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <span className="text-3xl block mb-2">🙏</span>
              <span className="font-bold text-blue-400">Merci pour votre suggestion !</span>
              <div className="text-gray-300 mt-2 text-sm">Nous lisons chaque retour avec attention.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
