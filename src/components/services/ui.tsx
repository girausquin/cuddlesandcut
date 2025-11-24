"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";

/* ===== Anims ===== */
export function useAnims() {
  const prefersReduced = useReducedMotion();
  const fadeInUp = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 24 },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: prefersReduced
        ? { duration: 0.01 }
        : { duration: 0.6, ease: "easeOut", delay: i * 0.08 },
    }),
  };
  const fadeInList = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 15 },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: prefersReduced
        ? { duration: 0.01 }
        : { duration: 0.5, ease: "easeOut", delay: i * 0.06 },
    }),
  };
  return { fadeInUp, fadeInList };
}

/* ===== Utils ===== */
export const fmtUSD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/* ===== Feature List ===== */
import type { LucideIcon } from "lucide-react";
export function FeatureList({
  features,
}: {
  features: { icon: LucideIcon; text: string }[];
}) {
  const { fadeInList } = useAnims();
  return (
    <ul className="grid gap-4 sm:grid-cols-2" role="list">
      {features.map((f, i) => (
        <motion.li
          key={`${f.text}-${i}`}
          variants={fadeInList}
          custom={i}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="flex items-start gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100 shrink-0">
            <f.icon className="h-5 w-5" />
          </div>
          <p className="text-gray-900 leading-snug">{f.text}</p>
        </motion.li>
      ))}
    </ul>
  );
}

/* ===== Price Bubbles ===== */
export function PriceBubble({
  label,
  price,
  accent = "indigo",
  chipText = "+ tax",
}: {
  label: string;
  price: number;
  accent?: "indigo" | "pink";
  chipText?: string;
}) {
  const ring = accent === "indigo" ? "ring-indigo-200" : "ring-pink-200";
  const bg = accent === "indigo" ? "bg-indigo-50" : "bg-pink-50";
  const text = accent === "indigo" ? "text-indigo-900" : "text-pink-900";
  const chip =
    accent === "indigo"
      ? "bg-indigo-100 text-indigo-700"
      : "bg-pink-100 text-pink-700";
  const headingId = useId();

  return (
    <div
      role="group"
      aria-roledescription="price option"
      aria-labelledby={headingId}
      className={`relative flex flex-col items-center justify-center rounded-full ${bg} ${text} ring-1 ${ring} shadow-sm w-40 h-40 sm:w-44 sm:h-44`}
      tabIndex={0}
    >
      <div className={`absolute -top-2 px-3 py-1 rounded-full text-sm font-medium ${chip} shadow-sm`}>
        {label}
      </div>

      <h4 id={headingId} className="sr-only">
        {label} — {fmtUSD.format(price)} {chipText}
      </h4>

      <div className="mt-2 text-[32px] sm:text-[36px] font-bold tabular-nums">
        {fmtUSD.format(price)}
      </div>
      <div className="mt-1 text-xs opacity-70">{chipText}</div>
    </div>
  );
}

export function PriceBubbleNoCut({ label, price }: { label: string; price: number }) {
  return <PriceBubble label={label} price={price} accent="indigo" chipText="+ tax" />;
}
