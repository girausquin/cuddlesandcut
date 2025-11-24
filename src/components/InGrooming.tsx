// src/components/InGrooming.tsx

"use client";

import { useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, MapPin } from "lucide-react";
import { Inter } from "next/font/google";
import { useLocale } from "@/context/LocaleProvider";

/* =========================================================⚙️ Fuente ========================================================= */
const inter = Inter({ subsets: ["latin"], weight: ["800"] });

/* =========================================================⚙️ Configuración de burbujas ========================================================= */
const BUBBLE_COUNT = 38;
const SIZE_RANGE: [number, number] = [8, 28];
const DURATION_RANGE: [number, number] = [8, 18];
const DELAY_RANGE: [number, number] = [0, 8];
const HORIZONTAL_DRIFT = 24;
const GLOBAL_OPACITY = 0.75;
const BUBBLE_COLORS = [
  "rgba(255,255,255,0.95)",
  "rgba(255,255,255,0.85)",
  "rgba(245,245,255,0.85)",
  "rgba(240,250,255,0.85)",
];

/* =========================================================⚙️ Textos ========================================================= */
const TEXTS = {
  en: {
    titleInHome: "Benefits of our In-Home Grooming",
    inHome: [
      "Total convenience: we come to your home; you provide a small space, we handle the magic.",
      "Your pup stays in their own environment—calmer, safer, and less stressed.",
      "Everything your pup needs in a single, all-inclusive service.",
      "Personalized care tailored to temperament and coat needs, with professional tools and techniques.",
      "Trust & transparency: you can be present and see the love and respect we put into every session.",
    ],
    titlePickup: "Benefits of our Pick-up • Drop-off",
    pickup: [
      "Maximum convenience: keep your day going, we take care of the rest.",
      "End-to-end service: from pick-up to a happy, styled return home.",
      "Everything your pup needs in a single, all-inclusive service.",
      "Personalized care tailored to temperament and coat needs, with professional tools and techniques.",
      "Results you can feel: your pup comes back clean, comfy, and rocking the Cuddles & Cuts style.",
    ],
    freeTransport: "FREE TRANSPORT INCLUDED *",
    transportCoverage: "Transport coverage & conditions",
    inHomeCoverage: "In-Home Grooming:",
    pickupCoverage: "Pick-Up & Drop-Off:",
    inHomeFree: "free transport within 15 miles.",
    pickupFree: "free transport within 5 miles.",
    cityNote:
      "The cities below are common examples within or near our coverage. Eligibility depends on the actual mileage from Round Rock.",
    travelCalculator: "Travel Calculator",
  },
  es: {
    titleInHome: "Beneficios de nuestro Grooming a Domicilio",
    inHome: [
      "Comodidad total: vamos hasta tu casa; solo necesitas un pequeño espacio, nosotros hacemos la magia.",
      "Tu perrito permanece en su propio entorno—más tranquilo, seguro y sin estrés.",
      "Todo lo que tu perrito necesita en un solo servicio, completo y todo incluido.",
      "Cuidado personalizado adaptado al temperamento y tipo de pelaje, con herramientas y técnicas profesionales.",
      "Confianza y transparencia: puedes estar presente y ver el amor y respeto que ponemos en cada sesión.",
    ],
    titlePickup: "Beneficios de nuestro Servicio de Recogida y Entrega",
    pickup: [
      "Máxima comodidad: continúa con tu día, nosotros nos encargamos de todo.",
      "Servicio completo: desde la recogida hasta el regreso feliz y con estilo.",
      "Todo lo que tu perrito necesita en un solo servicio, completo y todo incluido.",
      "Cuidado personalizado adaptado al temperamento y tipo de pelaje, con herramientas y técnicas profesionales.",
      "Resultados que se notan: tu perrito regresa limpio, cómodo y con el estilo Cuddles & Cuts.",
    ],
    freeTransport: "TRANSPORTE GRATIS INCLUIDO *",
    transportCoverage: "Cobertura y condiciones de transporte",
    inHomeCoverage: "Grooming a Domicilio:",
    pickupCoverage: "Recogida y Entrega:",
    inHomeFree: "transporte gratuito dentro de 15 millas.",
    pickupFree: "transporte gratuito dentro de 5 millas.",
    cityNote:
      "Las ciudades a continuación son ejemplos comunes dentro o cerca de nuestra cobertura. La elegibilidad depende de la distancia real desde Round Rock.",
    travelCalculator: "Calcular Distancia",
  },
};

/* =========================================================⚙️ Ciudades con traslado gratis ========================================================= */
const INCLUDED_CITIES = [
  "Jarrell",
  "Georgetown",
  "Leander",
  "Cedar Park",
  "Round Rock",
  "Hutto",
  "Pflugerville",
];

/* =========================================================⚙️ Animaciones ========================================================= */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: i * 0.06 },
  }),
};

/* =========================================================⚙️ BubbleField ========================================================= */
type Bubble = {
  left: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  drift: number;
};

function rnd(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function BubbleField({
  count = BUBBLE_COUNT,
  sizeRange = SIZE_RANGE,
  durationRange = DURATION_RANGE,
  delayRange = DELAY_RANGE,
  colors = BUBBLE_COLORS,
  opacity = GLOBAL_OPACITY,
  driftMax = HORIZONTAL_DRIFT,
}: {
  count?: number;
  sizeRange?: [number, number];
  durationRange?: [number, number];
  delayRange?: [number, number];
  colors?: string[];
  opacity?: number;
  driftMax?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const seeded = useRef<Bubble[] | null>(null);

  const bubbles = useMemo<Bubble[]>(() => {
    if (seeded.current) return seeded.current;
    const arr = Array.from({ length: count }).map(() => ({
      left: rnd(0, 100),
      size: rnd(sizeRange[0], sizeRange[1]),
      color: colors[Math.floor(rnd(0, colors.length))],
      duration: rnd(durationRange[0], durationRange[1]),
      delay: rnd(delayRange[0], delayRange[1]),
      drift: rnd(-driftMax, driftMax),
    }));
    seeded.current = arr;
    return arr;
  }, [count, sizeRange, durationRange, delayRange, colors, driftMax]);

  if (prefersReducedMotion) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {bubbles.map((b, i) => (
        <motion.span
          key={i}
          initial={{ y: "-10%", x: 0, opacity: 0 }}
          animate={{ y: "110%", x: b.drift, opacity }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="absolute rounded-full will-change-transform"
          style={{
            left: `${b.left}%`,
            top: "-5%",
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), ${b.color})`,
            boxShadow:
              "0 0 10px rgba(255,255,255,0.35), inset 0 0 10px rgba(255,255,255,0.35)",
            outline: "1px solid rgba(255,255,255,0.35)",
            mixBlendMode: "screen",
          }}
        />
      ))}
    </div>
  );
}

/* =========================================================⚙️ Separador ========================================================= */
function Separator() {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0.6 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="origin-left h-px w-full rounded-full bg-gradient-to-r from-gray-300 via-gray-400 to-transparent"
      aria-hidden
    />
  );
}

/* =========================================================⚙️ Cobertura local ========================================================= */
function LocalCoverageNotice({ t }: { t: (key: keyof typeof TEXTS["en"]) => string }) {
  return (
    <div className="mt-12">
      <div className="mx-auto max-w-6xl text-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0.9 }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.95, 1, 0.95] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto inline-block rounded-full px-5 py-1.5 text-base font-extrabold tracking-tight text-white shadow-lg md:text-lg lg:text-xl"
          style={{
            background:
              "linear-gradient(90deg, #2FDDDD, #F97384, #60C666, #2FDDDD)",
            backgroundSize: "300% 100%",
            animation: "gradient-flow 4.5s ease-in-out infinite",
            textShadow:
              "0 2px 6px rgba(0,0,0,0.25), 0 6px 14px rgba(0,0,0,0.15)",
          }}
        >
          {t("freeTransport")}
        </motion.div>

        <div
          className="relative mx-auto mt-6 max-w-6xl rounded-2xl p-[2px] animate-gradient-flow"
          style={{
            background:
              "linear-gradient(90deg, #2FDDDD, #F97384, #60C666, #2FDDDD)",
            backgroundSize: "300% 100%",
          }}
        >
          <div className="rounded-2xl bg-[#DDF4E1] p-4 text-left md:p-6">
            <div className="flex items-start gap-2">
              <MapPin aria-hidden className="mt-1 h-6 w-6 shrink-0 text-emerald-600" />
              <h3 className="m-0 text-lg font-semibold leading-snug text-emerald-900 md:text-xl">
                {t("transportCoverage")}
              </h3>
            </div>

            <div className="mt-3 grid gap-2 text-emerald-950 md:grid-cols-2">
              <div className="rounded-xl border border-emerald-200/60 bg-white/70 p-3 shadow-sm">
                <p className="text-sm leading-snug">
                  <span className="font-bold text-emerald-800">{t("inHomeCoverage")}</span>{" "}
                  {t("inHomeFree")}
                </p>
              </div>
              <div className="rounded-xl border border-emerald-200/60 bg-white/70 p-3 shadow-sm">
                <p className="text-sm leading-snug">
                  <span className="font-bold text-emerald-800">{t("pickupCoverage")}</span>{" "}
                  {t("pickupFree")}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-emerald-900/80 leading-snug text-justify sm:text-left">
              {t("cityNote")}
            </p>

            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {INCLUDED_CITIES.map((c) => (
                <span
                  key={c}
                  className="select-none rounded-full border border-emerald-300 bg-white px-3 py-1 text-xs font-semibold text-emerald-900 shadow-sm transition-transform duration-150 hover:-translate-y-0.5"
                >
                  {c}
                </span>
              ))}
            </div>

            <div className="mt-5 text-center">
              <a
                href="#travel-check"
                className="inline-block rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                {t("travelCalculator")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================⚙️ Título ========================================================= */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl text-center">
      <div className="inline-block">
        <h2
          className={`${inter.className} text-pretty text-3xl font-extrabold tracking-tight leading-tight sm:text-4xl md:text-5xl`}
        >
          {children}
        </h2>
        <motion.div
          initial={{ scaleX: 0, opacity: 0.7 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mt-3 h-1 w-full origin-left rounded-full animate-gradient-flow"
          style={{
            background:
              "linear-gradient(90deg, #2FDDDD, #F97384, #60C666, #2FDDDD)",
            backgroundSize: "300% 100%",
            boxShadow:
              "0 0 10px rgba(47,221,221,0.5), 0 0 10px rgba(249,115,132,0.3), 0 0 10px rgba(96,198,102,0.3)",
          }}
          aria-hidden
        />
      </div>
    </div>
  );
}

/* =========================================================⚙️ UI principal ========================================================= */
export default function InGrooming() {
  const prefersReducedMotion = useReducedMotion();
  const { locale } = useLocale();

  const currentLang = TEXTS[locale as keyof typeof TEXTS] ? locale : "en";
  const t = (key: keyof typeof TEXTS["en"]) => TEXTS[currentLang][key];

  const renderList = (items: string[]) => (
    <ul className="mx-auto mt-10 max-w-6xl space-y-6 text-justify sm:text-left text-lg leading-relaxed">
      {items.map((item, i) => (
        <li key={i} className="space-y-4">
          <motion.div
            custom={i}
            variants={fadeInUp}
            initial="hidden"
            whileInView={prefersReducedMotion ? "hidden" : "show"}
            viewport={{ once: true, amount: 0.3 }}
            className="flex gap-3"
          >
            <CheckCircle2
              aria-hidden
              className="mt-1 h-6 w-6 shrink-0 text-emerald-600"
            />
            <span>{item}</span>
          </motion.div>
          {i < items.length - 1 && <Separator />}
        </li>
      ))}
    </ul>
  );

  return (
    <section
      id="in-grooming"
      aria-label="Cuddles & Cuts grooming service options and benefits"
      className="scroll-mt-20"
    >
      <div className="relative w-full overflow-hidden bg-[#FCE3E4]">
        <div className="absolute inset-0 z-0 bg-black/10" aria-hidden />
        <BubbleField />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-8 text-center text-gray-900 sm:py-10 md:py-12">
          {/* In-Home Grooming */}
          <motion.header
            variants={fadeInUp}
            initial="hidden"
            whileInView={prefersReducedMotion ? "hidden" : "show"}
            viewport={{ once: true, amount: 0.3 }}
            className="mx-auto max-w-6xl"
          >
            <SectionTitle>{t("titleInHome")}</SectionTitle>
          </motion.header>
          {renderList(TEXTS[currentLang].inHome)}

          <div className="my-8 mx-auto w-full sm:w-5/6 md:w-2/3 border-t border-gray-300" />

          {/* Pick-up / Drop-off */}
          <motion.header
            variants={fadeInUp}
            initial="hidden"
            whileInView={prefersReducedMotion ? "hidden" : "show"}
            viewport={{ once: true, amount: 0.3 }}
            className="mx-auto max-w-6xl"
          >
            <SectionTitle>{t("titlePickup")}</SectionTitle>
          </motion.header>
          {renderList(TEXTS[currentLang].pickup)}

          {/* 🚐 Nota de cobertura local */}
          <LocalCoverageNotice t={t} />
        </div>
      </div>
    </section>
  );
}
