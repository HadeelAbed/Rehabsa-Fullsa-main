import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import arTranslation from './locales/ar.json';
import enTranslation from './locales/en.json';

const resources = {
  ar: { translation: arTranslation },
  en: { translation: enTranslation }
};

const savedLang = localStorage.getItem('i18nextLng');
const initialLang = savedLang === 'ar' ? 'ar' : 'en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: 'en',
    load: 'languageOnly',
    debug: false,
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

const originalChangeLanguage = i18n.changeLanguage.bind(i18n);
i18n.changeLanguage = (lng: string, ...args: any[]) => {
  localStorage.setItem('i18nextLng', lng);
  return originalChangeLanguage(lng, ...args);
};

export default i18n;
