'use client'
import React, { useState } from "react";
import Topbar from "../../components/Topbar.jsx";
import Footer from "../../components/Footer.jsx";

const questions = [
  {
    question: "Quel est votre profil ?",
    options: [
      { value: "chatteur", label: "Chatteur" },
      { value: "agence", label: "Agence" },
      { value: "manager", label: "Manager" },
      { value: "autre", label: "Autre" },
    ],
  },
  {
    question: "Quel est votre principal objectif sur OnlyPrompt ?",
    options: [
      { value: "gagner_temps", label: "Gagner du temps" },
      { value: "automatiser", label: "Automatiser mes tâches" },
      { value: "créer_contenu", label: "Créer du contenu" },
      { value: "autre", label: "Autre" },
    ],
  },
  {
    question: "Quel canal utilisez-vous le plus pour vos activités ?",
    options: [
      { value: "whatsapp", label: "WhatsApp" },
      { value: "telegram", label: "Telegram" },
      { value: "facebook", label: "Facebook" },
      { value: "autre", label: "Autre" },
    ],
  },
  {
    question: "À quelle fréquence prévoyez-vous d'utiliser OnlyPrompt ?",
    options: [
      { value: "quotidien", label: "Quotidiennement" },
      { value: "hebdo", label: "Hebdomadaire" },
      { value: "occasionnel", label: "Occasionnellement" },
      { value: "autre", label: "Autre" },
    ],
  },
];

export default function page() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleSelect = (value) => {
    setAnswers({ ...answers, [step]: value });
    setTimeout(() => {
      if (step < questions.length - 1) {
        setStep(step + 1);
      }
    }, 350);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const isLastStep = step === questions.length - 1;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#181828] via-[#232346] to-[#0f172a] flex flex-col w-full">
      <Topbar />
      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="bg-[#232346] rounded-3xl shadow-2xl p-10 w-full max-w-md mx-auto flex flex-col items-center gap-8 border border-blue-500/30 animate-fade-in">
          <h2 className="text-2xl font-extrabold text-blue-400 neon-glow mb-4 text-center">Bienvenue sur OnlyPrompt !</h2>
          <div className="w-full flex flex-col items-center gap-6">
            <div className="w-full text-center">
              <span className="text-lg text-gray-200 font-semibold mb-2 block">{questions[step].question}</span>
              <div className="flex flex-wrap gap-4 justify-center mt-4">
                {questions[step].options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`px-6 py-3 rounded-xl font-bold border-2 transition neon-glow shadow-blue-glow text-base ${answers[step] === opt.value ? 'bg-blue-500 text-white border-blue-400' : 'bg-[#181828] text-blue-400 border-blue-500 hover:bg-blue-600'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between w-full mt-6">
              <button onClick={handleBack} disabled={step === 0} className="px-4 py-2 rounded-lg bg-[#181828] text-blue-400 border border-blue-500 font-bold hover:bg-blue-600 transition disabled:opacity-40">Retour</button>
              <span className="text-gray-400 text-sm">{step + 1} / {questions.length}</span>
            </div>
            {isLastStep && (
              <button className="w-full mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-400 text-white font-extrabold neon-glow shadow-blue-glow text-lg hover:scale-105 transition">Valider mes réponses</button>
            )}
          </div>
        </div>
      </div>
      <Footer />
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
    </main>
  );
}
