import fr from "../locales/fr";
import en from "../locales/en";

const translations = { fr, en };

export function t(key, lang = "en") {
  return translations[lang][key] || key;
}
