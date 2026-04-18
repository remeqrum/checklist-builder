import { create } from 'zustand';
import type { Locale } from './translations';

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const getSavedLocale = (): Locale => {
  try {
    const saved = localStorage.getItem('tcb-locale');
    if (saved === 'en' || saved === 'ru' || saved === 'sk') return saved;
  } catch {}

  // Auto-detect from browser language
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('ru')) return 'ru';
  if (lang.startsWith('sk') || lang.startsWith('cs')) return 'sk';
  return 'en';
};

export const useI18n = create<I18nState>((set) => ({
  locale: getSavedLocale(),
  setLocale: (locale) => {
    localStorage.setItem('tcb-locale', locale);
    set({ locale });
  },
}));
