import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LANGUAGES, translations } from './translations';

const I18nContext = createContext(null);
const STORAGE_KEY = 'troca.lang';

function detectInitialLang() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && translations[saved]) return saved;
  const browser = (navigator.language || 'pt').slice(0, 2);
  return translations[browser] ? browser : 'pt';
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(detectInitialLang);
  const meta = LANGUAGES.find(l => l.code === lang) ?? LANGUAGES[0];

  // Atualiza <html lang/dir> para leitores de tela e para o layout RTL (árabe)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = meta.code;
    document.documentElement.dir = meta.dir;
  }, [lang, meta]);

  const t = useCallback((key, vars) => {
    let text = translations[lang]?.[key] ?? translations.pt[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) text = text.replaceAll(`{${k}}`, v);
    }
    return text;
  }, [lang]);

  // Nome da moeda no idioma atual (Intl), com o nome da API como reserva
  const currencyName = useCallback((code, fallback) => {
    try {
      return new Intl.DisplayNames([meta.locale], { type: 'currency' }).of(code) ?? fallback ?? code;
    } catch {
      return fallback ?? code;
    }
  }, [meta.locale]);

  const value = useMemo(
    () => ({ lang, setLang, t, locale: meta.locale, dir: meta.dir, currencyName }),
    [lang, t, meta, currencyName]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n deve ser usado dentro de <I18nProvider>');
  return ctx;
}
