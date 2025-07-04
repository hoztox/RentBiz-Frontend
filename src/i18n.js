// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files (create these later)
import enTranslation from './locales/en/translation.json';
import arTranslation from './locales/ar/translation.json';
// Add more languages as needed

i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Bind i18next to React
  .init({
    resources: {
      en: { translation: enTranslation },
      ar: { translation: arTranslation },
      // Add more languages here, e.g., 'fr': { translation: frTranslation }
    },
    fallbackLng: 'en', // Default language if translation is missing
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'], // Check localStorage, then browser language
      caches: ['localStorage'], // Persist language choice
    },
  });

export default i18n;