'use client';
import React, { useState } from "react";
// Interface complète d'envoi/programme de messages Telegram pour l'admin

export default function SendMessagesAdmin() {
  const [mode, setMode] = useState("manual"); // "manual" ou "scheduled"
  const [message, setMessage] = useState("");
  const [groups, setGroups] = useState([""]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGroupChange = (idx, value) => {
    setGroups(groups.map((g, i) => (i === idx ? value : g)));
  };
  const addGroup = () => setGroups([...groups, ""]);
  const removeGroup = (idx) => setGroups(groups.filter((_, i) => i !== idx));

  const handleSend = async () => {
    setLoading(true);
    setResult(null);
    // Appel API à implémenter côté backend
    const res = await fetch("/api/admin/sendmessages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode,
        message,
        groups: groups.filter(Boolean),
        scheduleDate: mode === "scheduled" ? scheduleDate : null,
      }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
    setHistory([{ date: new Date().toLocaleString(), ...data }, ...history]);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-[#181828] rounded-2xl shadow-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-white">Envoi de messages Telegram (Admin)</h1>
      <div className="mb-4 flex gap-4">
        <label className="flex items-center gap-2 text-white">
          <input type="radio" checked={mode === "manual"} onChange={() => setMode("manual")}/>
          Envoi manuel
        </label>
        <label className="flex items-center gap-2 text-white">
          <input type="radio" checked={mode === "scheduled"} onChange={() => setMode("scheduled")}/>
          Programmation
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Contenu du message</label>
        <textarea
          className="w-full p-3 rounded bg-[#232346] text-gray-200"
          rows={4}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Votre message à envoyer..."
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Groupes Telegram cibles</label>
        {groups.map((g, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              className="flex-1 p-2 rounded bg-[#232346] text-gray-200"
              value={g}
              onChange={e => handleGroupChange(idx, e.target.value)}
              placeholder="Lien ou @groupe Telegram"
            />
            {groups.length > 1 && (
              <button className="text-red-400 font-bold" onClick={() => removeGroup(idx)} type="button">✕</button>
            )}
          </div>
        ))}
        <button className="text-blue-400 font-bold mt-2" onClick={addGroup} type="button">+ Ajouter un groupe</button>
      </div>
      {mode === "scheduled" && (
        <div className="mb-4">
          <label className="block text-white mb-2">Date et heure d'envoi</label>
          <input
            type="datetime-local"
            className="p-2 rounded bg-[#232346] text-gray-200"
            value={scheduleDate}
            onChange={e => setScheduleDate(e.target.value)}
          />
        </div>
      )}
      <button
        className="w-full py-3 rounded bg-blue-500 text-white font-bold mt-4 hover:bg-blue-600 transition"
        onClick={handleSend}
        disabled={loading || !message || groups.filter(Boolean).length === 0 || (mode === "scheduled" && !scheduleDate)}
      >
        {loading ? "Envoi..." : mode === "manual" ? "Envoyer maintenant" : "Programmer l'envoi"}
      </button>
      {result && (
        <div className={`mt-4 p-3 rounded ${result.success ? 'bg-green-700 text-white' : 'bg-red-700 text-white'}`}>
          {result.message || (result.success ? "Message envoyé/programmé avec succès." : "Erreur lors de l'envoi.")}
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-2">Historique des envois</h2>
        <ul className="space-y-2">
          {history.map((h, i) => (
            <li key={i} className="bg-[#232346] rounded p-3 text-gray-200">
              <div><b>Date:</b> {h.date}</div>
              <div><b>Message:</b> {h.sentMessage || message}</div>
              <div><b>Groupes:</b> {(h.groups || groups).join(", ")}</div>
              <div><b>Statut:</b> {h.success ? "✅ Succès" : "❌ Échec"}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
