import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { t } from "../lib/i18n";

function AIDashboardAnimation() {
  const { language } = useLanguage();
  const prompt = t("hero_prompt", language);
  const answers = [
    t("hero_answer1", language),
    t("hero_answer2", language),
    t("hero_answer3", language),
    t("hero_answer4", language),
  ];
  const [current, setCurrent] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState("typing");

  useEffect(() => {
    let timeout;
    if (phase === "typing") {
      if (displayed.length < answers[current].length) {
        timeout = setTimeout(() => {
          setDisplayed(answers[current].slice(0, displayed.length + 1));
        }, 35 + Math.random() * 40);
      } else {
        timeout = setTimeout(() => setPhase("waiting"), 1200);
      }
    } else if (phase === "waiting") {
      timeout = setTimeout(() => {
        setDisplayed("");
        setCurrent((c) => (c + 1) % answers.length);
        setPhase("typing");
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [displayed, phase, current, answers]);

  return (
    <div className="bg-gradient-to-tr from-blue-900 via-blue-400 to-blue-900 rounded-2xl p-0 shadow-2xl w-full max-w-[370px] md:w-[420px] h-[200px] md:h-[220px] flex flex-col justify-start items-center relative border-2 border-blue-400" id="/home" >
      <div className="w-full flex items-center justify-between px-4 py-2 bg-[#101a2b] rounded-t-2xl border-b border-blue-800">
        <span className="text-xs text-blue-300 font-mono">OfmPilot.com</span>
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
          <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>
          <span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
        </div>
      </div>
      <div className="flex-1 w-full px-4 md:px-6 py-3 md:py-4 flex flex-col justify-center">
        <div className="text-xs text-blue-200 font-mono mb-2">{t("hero_prompt_label", language)}</div>
        <div className="bg-[#181f3a] rounded-lg px-3 py-2 text-blue-100 font-mono text-xs md:text-sm shadow-blue-glow border border-blue-500 mb-4 animate-fade-in">
          {prompt}
        </div>
        <div className="text-xs text-blue-200 font-mono mb-2">{t("hero_answer_label", language)}</div>
        <div className="bg-[#232346] rounded-lg px-3 py-2 text-blue-100 font-mono text-sm md:text-base shadow-blue-glow border border-blue-500 min-h-[32px] animate-fade-in">
          <span className="ai-cursor">{displayed}<span className="animate-blink">|</span></span>
        </div>
      </div>
      <style jsx>{`
        .ai-cursor .animate-blink {
          animation: blink 1s steps(2, start) infinite;
        }
        @keyframes blink {
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function HeroSection() {
  const { data: session } = useSession();
  const { language } = useLanguage();
  return (
    <section className="pt-16 pb-20 px-4 md:px-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 bg-gradient-to-b from-black via-gray-900 to-gray-950">
      <div className="max-w-xl text-center lg:text-left">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 flex flex-col">
          <span>{t("hero_title1", language)}</span>
          <span className="text-blue-400 neon-glow mt-3 md:mt-5">{t("hero_title2", language)}</span>
        </h1>
        <p className="text-base md:text-lg text-gray-300 mb-8">
          {t("hero_desc", language)}
        </p>
        {!session?.user && (
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <a href="/signup" className="px-6 py-3 rounded-lg bg-blue-500 text-white font-bold shadow-blue-glow neon-glow hover:bg-blue-600 transition text-center">{t("hero_signup_btn", language)}</a>
            <a href="/login" className="px-6 py-3 rounded-lg bg-white text-blue-500 font-bold border border-blue-400 hover:bg-blue-50 transition text-center">{t("hero_login_btn", language)}</a>
          </div>
        )}
      </div>
      <div className="w-full lg:w-1/2 flex justify-center">
        <AIDashboardAnimation />
      </div>
    </section>
  );
}
