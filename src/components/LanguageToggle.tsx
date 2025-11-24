'use client';

import { useLocale } from '@/context/LocaleProvider';

export default function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  const toggle = () => setLocale(locale === 'en' ? 'es' : 'en');

  return (
    <button
      onClick={toggle}
      className="rounded-full border px-3 py-1 text-sm hover:shadow-md transition"
      aria-label="Toggle language"
    >
      {locale === 'en' ? 'Español' : 'English'}
    </button>
  );
}
