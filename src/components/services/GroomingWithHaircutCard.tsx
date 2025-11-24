"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Inter } from "next/font/google";
import { FeatureList, useAnims } from "./ui";
import { getTXT, getFEATURES, TIERS } from "./constants";
import { useLocale } from "@/context/LocaleProvider";

const inter = Inter({ subsets: ["latin"], weight: ["800"] });

/* Fallback animaciones */
const fallbackFadeInUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.26 } },
};
const fallbackStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, when: "beforeChildren" } },
};

/* Card compacta */
function PriceCard({ label, price }: { label: string; price: number }) {
  return (
    <div className="group rounded-2xl border-2 border-sky-300 bg-white shadow-[0_1px_6px_rgba(0,0,0,0.05)] p-2">
      <div className="flex items-center justify-between gap-2">
        {/* Precio + tax */}
        <div className="flex items-baseline gap-1">
          <span
            className={`${inter.className} font-extrabold text-gray-900 leading-none text-[clamp(0.95rem,3vw,1.35rem)]`}
          >
            ${price}
          </span>
          <span className="text-[10px] text-gray-600 lowercase">+tax</span>
        </div>

        {/* Rango de LBS */}
        <span
          className={`${inter.className} font-extrabold text-gray-800 uppercase tracking-wide leading-none text-[clamp(0.95rem,3vw,1.35rem)]`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

const pickFive = <T,>(arr: T[]) => arr.slice(0, 5) as T[];

export default function GroomingWithHaircutCard() {
  const { locale } = useLocale(); // 👈 idioma actual
  const TXT = getTXT(locale); // 👈 textos dinámicos
  const FEATURES = getFEATURES(locale); // 👈 lista traducida

  const anims = (typeof useAnims === "function" ? useAnims() : {}) as {
    fadeInUp?: any;
    staggerContainer?: any;
  };
  const fadeInUp = anims.fadeInUp || fallbackFadeInUp;
  const staggerContainer = anims.staggerContainer || fallbackStagger;

  const tiers5 = useMemo(
    () => pickFive(TIERS as { label: string; base: number }[]),
    []
  );

  /* Igualar altura total */
  const includesRef = useRef<HTMLDivElement | null>(null);
  const [stackH, setStackH] = useState<number | null>(null);

  useEffect(() => {
    const el = includesRef.current;
    if (!el) return;
    const mq = window.matchMedia("(min-width: 768px)");

    const applyHeight = () => {
      if (!mq.matches) {
        setStackH(null);
        return;
      }
      setStackH(Math.round(el.getBoundingClientRect().height));
    };

    const ro = new ResizeObserver(applyHeight);
    ro.observe(el);
    applyHeight();
    mq.addEventListener?.("change", applyHeight);

    return () => {
      ro.disconnect();
      mq.removeEventListener?.("change", applyHeight);
    };
  }, []);

  const COUNT = 5;
  const GAP_PX = 1;
  const cardsVars: React.CSSProperties = stackH
    ? ({
        ["--stack-h" as any]: `${stackH}px`,
        ["--gap" as any]: `${GAP_PX}px`,
        ["--count" as any]: COUNT,
      } as React.CSSProperties)
    : {};

  return (
    <motion.article
      aria-label={TXT.withCutTitle}
      variants={fadeInUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="relative z-10 w-full mt-10 rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-xl"
    >
      {/* Título */}
      <div className="w-fit mx-auto text-center mb-2">
        <h3
          className={`${inter.className} text-2xl font-extrabold tracking-tight`}
        >
          {TXT.withCutTitle}
        </h3>
        <div
          className="mt-2 h-[3px] w-full mb-4 bg-gradient-to-r from-teal-300 via-pink-400 to-green-400"
          aria-hidden="true"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
        {/* Includes */}
        <div ref={includesRef}>
          <p className="font-bold text-lg text-gray-900 mb-4 text-center">
            {TXT.includes}
          </p>
          <FeatureList features={FEATURES} />
        </div>

        {/* Pricing */}
        <div className="md:pl-8 md:border-l md:border-black/10">
          <p className="font-bold text-lg text-gray-900 mb-4 text-center">
            {TXT.priceByWeight}
          </p>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col gap-0"
            style={cardsVars}
          >
            {tiers5.map((t) => (
              <motion.div
                key={t.label}
                variants={fadeInUp}
                style={
                  stackH
                    ? ({
                        height:
                          "calc((var(--stack-h) - (var(--count) - 1) * var(--gap)) / var(--count))",
                      } as React.CSSProperties)
                    : undefined
                }
              >
                <PriceCard label={t.label} price={t.base} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Texto informativo */}
      <div className="w-fit mx-auto text-center mt-1">
        <p className="text-sm font-medium text-gray-700">
          Same care, same price — In-Home or Pick-Up & Drop-Off.
        </p>
      </div>

      {TXT.priceDisclaimer && (
        <p className="mt-2 text-xs sm:text-sm text-gray-500 text-center">
          {TXT.priceDisclaimer}
        </p>
      )}
    </motion.article>
  );
}
