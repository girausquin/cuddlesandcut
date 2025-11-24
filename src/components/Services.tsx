// src/services.tsx
"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Inter } from "next/font/google";
import { useLocale } from "@/context/LocaleProvider";

/* 🆕 Cards modulares */
import {
  GroomingWithHaircutCard,
  BathMaintenanceCard,
  ReservationCard,
} from "@/components/services";

/* 🆕 Funciones dinámicas de idioma */
import { getTXT } from "@/components/services/constants";

/* 🆕 Importa tu calculadora existente */
import TravelCalculator from "@/components/TravelCalculator";

const inter = Inter({ subsets: ["latin"], weight: ["800"] });

/* ===== Decorative Bubbles (background) ===== */
const BUBBLES = [
  { size: 90, left: "5%", delay: "0s", duration: "18s", topStart: "-12%" },
  { size: 60, left: "18%", delay: "3s", duration: "14s", topStart: "-8%" },
  { size: 110, left: "30%", delay: "6s", duration: "22s", topStart: "-15%" },
  { size: 70, left: "45%", delay: "1s", duration: "16s", topStart: "-10%" },
  { size: 50, left: "58%", delay: "4s", duration: "12s", topStart: "-6%" },
  { size: 80, left: "72%", delay: "2s", duration: "19s", topStart: "-14%" },
  { size: 55, left: "82%", delay: "5s", duration: "15s", topStart: "-9%" },
  { size: 95, left: "92%", delay: "7s", duration: "20s", topStart: "-11%" },
];

export default function Services() {
  const { locale: ctxLocale } = useLocale();

  // Fallback robusto: si el contexto aún no trae locale, usamos <html lang> o navigator
  const effectiveLocale = useMemo(() => {
    if (ctxLocale && typeof ctxLocale === "string" && ctxLocale.length > 0) {
      return ctxLocale;
    }
    if (typeof document !== "undefined") {
      const docLang = document.documentElement.lang;
      if (docLang) return docLang;
      const navLang = navigator.language || (navigator as any).userLanguage;
      if (navLang) return navLang;
    }
    return "en";
  }, [ctxLocale]);

  const TXT = useMemo(() => getTXT(effectiveLocale), [effectiveLocale]);

  return (
    <section
      id="services"
      aria-label={TXT.sectionAria}
      className="relative scroll-mt-20 w-full bg-blue-100 pt-8 sm:pt-10 md:pt-12 pb-16 sm:pb-20 md:pb-24 overflow-hidden"
    >
      {/* Background falling bubbles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        {BUBBLES.map((b, idx) => (
          <span
            key={idx}
            className="absolute rounded-full bg-white/90 ring-1 ring-white/70 drop-shadow-lg animate-bubble-fall"
            style={{
              filter: "blur(0.3px)",
              left: b.left,
              width: `${b.size}px`,
              height: `${b.size}px`,
              top: b.topStart,
              animationDelay: b.delay,
              animationDuration: b.duration,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-8 md:px-10">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2
            className={`
              ${inter.className}
              text-[1.65rem] sm:text-[1.9rem] md:text-4xl 
              font-extrabold tracking-tight leading-tight
              whitespace-nowrap
            `}
          >
            {TXT.h2}
          </h2>

          <div
            className="mt-2 h-[3px] w-fit mx-auto"
            style={{
              background:
                "linear-gradient(to right, #2FDDDD, #F97384, #60C666)",
            }}
          />

          <p className="mt-4 text-lg text-black/75">{TXT.lead}</p>
        </motion.header>

        {/* === Card 1: Grooming with Haircut === */}
        <div className="relative mx-auto mt-10 w-full">
          <GroomingWithHaircutCard />
        </div>

        {/* === Card 2: Bath & Maintenance === */}
        <BathMaintenanceCard />

        {/* === Card 3: Reservation === */}
        <ReservationCard />

        {/* === Card 4: Travel Calculator === */}
        <motion.article
          aria-labelledby="svc-travelcalc-title"
          aria-describedby="svc-travelcalc-desc"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          className="relative z-10 mx-auto mt-10 w-full rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-xl text-center"
        >
          <div className="w-fit mx-auto text-center mb-2">
            <h3
              id="svc-travelcalc-title"
              className="text-xl font-extrabold tracking-tight"
            >
              {TXT.travelCalcTitle}
            </h3>

            <div
              className="mt-2 h-[3px] w-full mb-4"
              style={{
                background:
                  "linear-gradient(to right, #2FDDDD, #F97384, #60C666)",
              }}
            />
          </div>

          <div id="svc-travelcalc-desc" className="mt-6">
            <TravelCalculator />
          </div>
        </motion.article>
      </div>

      {/* Global keyframes (animaciones burbujas) */}
      <style jsx global>{`
        @keyframes bubble-fall {
          0% {
            transform: translateY(-10vh) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(120vh) scale(0.98);
            opacity: 0;
          }
        }
        .animate-bubble-fall {
          animation-name: bubble-fall;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }
      `}</style>
    </section>
  );
}
