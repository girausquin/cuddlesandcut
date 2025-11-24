'use client';

import Image from 'next/image';
import { useLocale } from '@/context/LocaleProvider';

export default function LanguageFlags() {
  const { locale, setLocale } = useLocale();

  const toggleLocale = (next: 'en' | 'es') => setLocale(next);

  return (
    <div className="flex items-center gap-2 ml-1">
      <button
        onClick={() => toggleLocale('en')}
        aria-label="Switch to English"
        className={`transition rounded-full border border-transparent hover:border-black/10 p-[2px] ${
          locale === 'en' ? 'opacity-100' : 'opacity-40 hover:opacity-70'
        }`}
      >
        <Image
          src="/flags/us.png"
          alt="English"
          width={22}
          height={22}
          className="rounded-full object-cover"
        />
      </button>

      <button
        onClick={() => toggleLocale('es')}
        aria-label="Cambiar a español"
        className={`transition rounded-full border border-transparent hover:border-black/10 p-[2px] ${
          locale === 'es' ? 'opacity-100' : 'opacity-40 hover:opacity-70'
        }`}
      >
        <Image
          src="/flags/es.png"
          alt="Español"
          width={22}
          height={22}
          className="rounded-full object-cover"
        />
      </button>
    </div>
  );
}
