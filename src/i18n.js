import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import jsonTransTableLV from "./locales/lv.json"
import jsonTransTableEN from "./locales/en.json"
import jsonTransTableRU from "./locales/ru.json"

i18next
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    // pass the i18n instance to react-i18next.
    .use(LanguageDetector)
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
      debug: true,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
      resources: {
        lv: {
          translations: jsonTransTableLV,
        },
        en: {
          translations: jsonTransTableEN,
        },
        ru: {
          translations: jsonTransTableRU,
        },
      },
      // have a common namespace used around the full app
      ns: ["translations"],
      defaultNS: "translations"
    })

export default i18next