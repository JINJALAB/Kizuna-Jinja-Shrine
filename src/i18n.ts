import i18n from "i18next";
import commonEN from "locales/en/common.json";
import commonJP from "locales/jp/common.json";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    common: commonEN,
  },
  jp: {
    common: commonJP,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    ns: ["common"],
    defaultNS: "common",
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
