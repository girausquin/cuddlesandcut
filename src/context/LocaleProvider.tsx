'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/i18n/config';
import { MESSAGES } from '@/i18n';

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const LocaleCtx = createContext<Ctx | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // 🔹 Cargar preferencia guardada del usuario
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('locale') as Locale | null;
    if (saved && LOCALES.includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  // 🔹 Actualizar idioma y guardar preferencia
  const setLocale = (next: Locale) => {
    setLocaleState(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', next);
    }
  };

  // 🔹 Cargar mensajes según idioma actual
  const dict = useMemo(() => MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE], [locale]);

  // 🔹 Función traductora segura con fallback
  const t = useMemo(() => {
    return (key: string) => dict[key] ?? key;
  }, [dict]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return <LocaleCtx.Provider value={value}>{children}</LocaleCtx.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleCtx);
  if (!ctx) throw new Error('❌ useLocale must be used within LocaleProvider');
  return ctx;
}
