"use client";

import { motion } from "framer-motion";
import { Inter } from "next/font/google";
import { Calendar, MessageCircle } from "lucide-react";
import { useAnims } from "./ui";
import { getTXT, CALENDLY_URL } from "./constants";
import { useLocale } from "@/context/LocaleProvider";

const inter = Inter({ subsets: ["latin"], weight: ["800"] });

// 🔧 Tu número oficial en formato internacional limpio
const WHATSAPP_NUMBER = "17373461478";

function sanitizeDigits(input?: string) {
  return (input ?? "").replace(/\D+/g, "");
}

export default function ReservationCard() {
  const { locale } = useLocale(); // 👈 idioma actual
  const TXT = getTXT(locale); // 👈 textos dinámicos
  const { fadeInUp, reducedMotion } = useAnims?.() ?? { fadeInUp: {}, reducedMotion: true };

  // Sanitizar número de WhatsApp
  const safeWa = sanitizeDigits(WHATSAPP_NUMBER);

  // Calendly seguro
  const calendlyHref = CALENDLY_URL ?? "#";

  // Mensaje predeterminado de WhatsApp (ya traducible)
  const waText =
    TXT?.reservationWhatsappText ??
    "Hi! I'd like to book a grooming appointment in Round Rock & Surroundings. Can you help me schedule?";

  // Construir URL de WhatsApp
  const waHref = safeWa
    ? `https://wa.me/${safeWa}?text=${encodeURIComponent(waText)}`
    : undefined;

  return (
    <motion.article
      aria-labelledby="svc-reservation-title"
      aria-describedby="svc-reservation-desc"
      variants={fadeInUp}
      custom={3}
      initial={reducedMotion ? undefined : "hidden"}
      whileInView={reducedMotion ? undefined : "show"}
      viewport={{ once: true, amount: 0.25 }}
      className="relative z-10 mx-auto mt-10 w-full rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-xl text-center"
      role="region"
    >
      {/* ===== Título ===== */}
      <div className="w-fit mx-auto text-center mb-2">
        <h3
          id="svc-reservation-title"
          className={`${inter.className} text-xl font-extrabold tracking-tight`}
        >
          {TXT.reservationTitle}
        </h3>
        <div
          className="mt-2 h-[3px] w-full mb-4 rounded-full"
          style={{
            background: "linear-gradient(to right, #2FDDDD, #F97384, #60C666)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* ===== Descripción ===== */}
      <p id="svc-reservation-desc" className="text-lg text-gray-700 leading-snug">
        {TXT.reservationLead.replace(
          "Round Rock & North Austin",
          "Round Rock & Surroundings"
        )}
      </p>

      {/* ===== Botón Calendly ===== */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <a
          href={calendlyHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.98] transition"
          aria-label={TXT?.reservationCtaAria ?? "Book now on Calendly"}
          aria-describedby="svc-reservation-desc"
          data-analytics-id="cta-calendly"
          title={TXT?.reservationCtaBook}
        >
          <Calendar className="h-5 w-5" aria-hidden="true" />
          {TXT.reservationCtaBook}
        </a>
      </div>

      {/* ===== WhatsApp ===== */}
      {waHref && (
        <div className="mt-6 flex justify-center">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 transition"
            aria-label={TXT?.reservationCtaWhatsappAria ?? "Chat on WhatsApp"}
            title={TXT?.reservationCtaWhatsappTitle ?? "Chat on WhatsApp"}
            data-analytics-id="cta-whatsapp"
          >
            <MessageCircle className="h-10 w-10" aria-hidden="true" />
          </a>
        </div>
      )}
    </motion.article>
  );
}
