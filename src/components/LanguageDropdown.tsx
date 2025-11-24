// src/components/LanguageDropdown.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Globe } from "lucide-react";
import { locales } from "@/i18n";

function buildPathWithLocale(currentPath: string, nextLocale: string) {
  const withoutLocale = currentPath.replace(/^\/(en|es)(?=\/|$)/, "");
  return `/${nextLocale}${withoutLocale || ""}`;
}

export default function LanguageDropdown() {
  const t = useTranslations("navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  const currentUrl = useMemo(() => {
    const qs = searchParams?.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }, [pathname, searchParams]);

  const changeLocale = (nextLocale: string) => {
    const nextPath = buildPathWithLocale(currentUrl, nextLocale);
    router.push(nextPath);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 text-sm hover:opacity-80"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language")}
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{t("language")}</span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-36 rounded-xl border bg-white shadow-lg p-1 text-sm z-50"
        >
          <button
            role="option"
            aria-selected={locale === "en"}
            onClick={() => changeLocale("en")}
            className="w-full text-left rounded-lg px-3 py-2 hover:bg-gray-100"
          >
            🇺🇸 {t("english")}
          </button>
          <button
            role="option"
            aria-selected={locale === "es"}
            onClick={() => changeLocale("es")}
            className="w-full text-left rounded-lg px-3 py-2 hover:bg-gray-100"
          >
            🇪🇸 {t("spanish")}
          </button>
        </div>
      )}
    </div>
  );
}
