'use client'
import React, { useEffect, useState } from "react";

function emptyPlan() {
  return {
    name: "",
    price: 0,
    priceYear: 0,
    credits: 0,
    features: [],
    highlight: false,
    access: { team: false, mediaScript: false, proScript: false },
  };
}

export default function PlansAdminPage() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(emptyPlan());
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch plans
  useEffect(() => {
    fetch("/api/admin/plans")
      .then(res => res.json())
      .then(data => setPlans(data));
  }, [loading]);

  // Handle form change
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("access.")) {
      setForm(f => ({ ...f, access: { ...f.access, [name.split(".")[1]]: checked } }));
    } else if (name === "features") {
      setForm(f => ({ ...f, features: value.split("\n") }));
    } else if (type === "checkbox") {
      setForm(f => ({ ...f, [name]: checked }));
    } else if (["price", "priceYear", "credits"].includes(name)) {
      setForm(f => ({ ...f, [name]: Number(value) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  // Submit form
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/admin/plans?id=${editingId}` : "/api/admin/plans";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(emptyPlan());
    setEditingId(null);
    setLoading(false);
  }

  // Edit
  function handleEdit(plan) {
    setForm({ ...plan, features: plan.features.join("\n") });
    setEditingId(plan._id);
  }

  // Delete
  async function handleDelete(id) {
    setLoading(true);
    await fetch(`/api/admin/plans?id=${id}`, { method: "DELETE" });
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-2 md:px-0 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800 text-center tracking-tight">Gestion des plans</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-8 rounded-2xl mb-10 flex flex-col gap-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex flex-col">
            <label htmlFor="plan-name" className="text-xs text-gray-600 mb-1">Nom du plan</label>
            <input id="plan-name" name="name" value={form.name} onChange={handleChange} placeholder="Nom" className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-100" required />
          </div>
          <div className="w-32 flex flex-col">
            <label htmlFor="plan-price" className="text-xs text-gray-600 mb-1">Prix mensuel (€)</label>
            <input id="plan-price" name="price" type="number" value={form.price} onChange={handleChange} placeholder="Prix mensuel" className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-100" required />
          </div>
          <div className="w-32 flex flex-col">
            <label htmlFor="plan-priceYear" className="text-xs text-gray-600 mb-1">Prix annuel (€)</label>
            <input id="plan-priceYear" name="priceYear" type="number" value={form.priceYear} onChange={handleChange} placeholder="Prix annuel" className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-100" required />
          </div>
          <div className="w-32 flex flex-col">
            <label htmlFor="plan-credits" className="text-xs text-gray-600 mb-1">Crédits/mois</label>
            <input id="plan-credits" name="credits" type="number" value={form.credits} onChange={handleChange} placeholder="Crédits/mois" className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-100" required />
          </div>
        </div>
        <textarea name="features" value={form.features} onChange={handleChange} placeholder="Fonctionnalités (une par ligne)" className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-gray-100 h-28" />
        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2 text-gray-700"><input type="checkbox" name="highlight" checked={form.highlight} onChange={handleChange} /> Highlight</label>
          <label className="flex items-center gap-2 text-gray-700"><input type="checkbox" name="access.team" checked={form.access.team} onChange={handleChange} /> Team</label>
          <label className="flex items-center gap-2 text-gray-700"><input type="checkbox" name="access.mediaScript" checked={form.access.mediaScript} onChange={handleChange} /> MediaScript</label>
          <label className="flex items-center gap-2 text-gray-700"><input type="checkbox" name="access.proScript" checked={form.access.proScript} onChange={handleChange} /> ProScript</label>
        </div>
        <div className="flex gap-4 items-center">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow transition">
            {editingId ? "Modifier" : "Créer"} le plan
          </button>
          {editingId && <button type="button" className="text-sm text-gray-500 underline" onClick={() => { setForm(emptyPlan()); setEditingId(null); }}>Annuler la modification</button>}
        </div>
      </form>
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Plans existants</h2>
      <div className="space-y-4">
        {plans.map(plan => (
          <div key={plan._id} className="bg-white border border-gray-200 shadow p-5 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-2 hover:shadow-lg transition">
            <div>
              <div className="font-bold text-blue-600 text-lg">{plan.name}</div>
              <div className="text-sm text-gray-700">{plan.credits} crédits/mois | {plan.price}€/mois | {plan.priceYear}€/an</div>
              <div className="text-xs text-gray-500 mt-1">{Array.isArray(plan.features) ? plan.features.join(", ") : plan.features}</div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-semibold shadow transition" onClick={() => handleEdit(plan)}>Modifier</button>
              <button className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold shadow transition" onClick={() => handleDelete(plan._id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
