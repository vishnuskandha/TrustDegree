import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation resources
import enCommon from "./locales/en/common.json";
import enPages from "./locales/en/pages.json";
import enErrors from "./locales/en/errors.json";
import enWeb3 from "./locales/en/web3.json";
import taCommon from "./locales/ta/common.json";
import taPages from "./locales/ta/pages.json";
import taErrors from "./locales/ta/errors.json";
import taWeb3 from "./locales/ta/web3.json";

i18n
  .use(initReactI18next)
  .init({
    ns: ["common", "pages", "errors", "web3"],
    defaultNS: "pages",
    fallbackNS: ["common", "errors"],
    resources: {
      en: {
        common: enCommon,
        pages: enPages,
        errors: enErrors,
        web3: enWeb3,
      },
      ta: {
        common: taCommon,
        pages: taPages,
        errors: taErrors,
        web3: taWeb3,
      },
    },
    lng: localStorage.getItem("language") || "en",
    fallbackLng: "en",
    returnNull: false,
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

const syncDocumentLanguage = (language: string) => {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.lang = language.split("-")[0] || "en";
};

syncDocumentLanguage(i18n.language);
i18n.on("languageChanged", syncDocumentLanguage);

export default i18n;
