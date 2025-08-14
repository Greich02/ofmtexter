import fr from "../locales/fr";
import en from "../locales/en";

const translations = { en, fr };

export function t(key, lang = "en", params = {}) {
  let str = translations[lang][key] || key;
  Object.entries(params).forEach(([k, v]) => {
    str = str.replace(new RegExp(`{${k}}`, "g"), v);
  });
  return str;
}
