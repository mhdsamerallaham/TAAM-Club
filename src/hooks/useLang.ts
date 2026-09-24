import { create } from 'zustand';
import i18n from '@/i18n';
import type { Language } from '@/types';

interface LangStore {
  lang: Language;
  setLang: (lang: Language) => void;
}

export const useLangStore = create<LangStore>((set) => ({
  lang: 'tr',
  setLang: (lang) => {
    i18n.changeLanguage(lang);
    set({ lang });
    document.documentElement.lang = lang;
  },
}));
