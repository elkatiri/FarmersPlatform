import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import fr from '../i18n/fr';
import ar from '../i18n/ar';

const translations = { fr, ar };
const STORAGE_KEY = 'agrilink_lang';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'fr';
    } catch {
      return 'fr';
    }
  });

  const isRTL = lang === 'ar';

  /* Persist & update <html> attributes on every language change */
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* noop */ }
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang, isRTL]);

  const setLang = useCallback((l) => {
    if (translations[l]) setLangState(l);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === 'fr' ? 'ar' : 'fr'));
  }, []);

  /**
   * Translation helper.
   * Accepts a dot-path key: t('home.heroTitle1')
   * Falls back to key string if not found.
   */
  const t = useCallback(
    (key) => {
      const dict = translations[lang] || translations.fr;
      const parts = key.split('.');
      let val = dict;
      for (const p of parts) {
        if (val && typeof val === 'object' && p in val) {
          val = val[p];
        } else {
          return key; // fallback
        }
      }
      return val;
    },
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
