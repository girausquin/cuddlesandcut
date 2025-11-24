import type { LucideIcon } from "lucide-react";
import {
  ShowerHead,
  Sparkles,
  Droplets,
  Wind,
  Scissors,
  Hand,
  Footprints,
  ShieldCheck,
  Droplet,
  Beaker,
  SprayCan,
  Gift,
} from "lucide-react";

/* =========================================================
   🧠 CONFIGURACIONES BASE
   ========================================================= */
export const DISCOUNT = 30;
export const DOG_IMG = "/images/dog.png";

/* ===== CTA Links ===== */
export const CALENDLY_URL = "https://calendly.com/REPLACE_ME";
export const WHATSAPP_NUMBER = "15125551234"; // formato internacional sin +
export const PHONE_NUMBER = "+1 (512) 555-1234";

/* =========================================================
   🌎 FUNCIONES DE IDIOMA
   ========================================================= */

/** 🔤 Textos dinámicos traducibles */
export const getTXT = (locale: string) => {
  const isES = locale?.toLowerCase().startsWith("es");

  return isES
    ? {
        sectionAria: "Servicios",
        h2: "Más cuidado, menos extras.",
        lead: "Todo lo que tu perrito necesita en un solo servicio:",
        withCutTitle: "Grooming completo con corte",
        noCutTitle: "Baño y mantenimiento completo",
        includes: "Incluye:",
        priceByWeight: "Precio por peso:",
        chipWithCut: "+ impuestos",
        chipNoCut: "+ impuestos",
        noteNoCut1: "*Este paquete cuesta",
        noteNoCut2: "menos que el servicio con corte.",
        reservationTitle:
          "Reserva tu cita con un depósito de $25 y asegura a Cuddles & Cuts para tu peludo 🐾💖",
        reservationLead:
          "Tu depósito se descuenta del total. 100% reembolsable con 24h de aviso. Servicio en Round Rock y Alrededores.",
        reservationCtaBook: "Reservar ahora",
        reservationCtaAria: "Reservar ahora en Calendly",
        reservationCtaWhatsappAria: "Chatear por WhatsApp",
        reservationCtaWhatsappTitle: "Abrir WhatsApp",
        reservationWhatsappText:
          "¡Hola! Me gustaría agendar un servicio de grooming en Round Rock o alrededores. ¿Podrías ayudarme con la cita?",
        travelCalcTitle: "Calculadora de viaje",
        priceDisclaimer:
          "Los precios pueden variar según el tipo de pelo y comportamiento.",
      }
    : {
        sectionAria: "Services",
        h2: "More care, fewer add-ons.",
        lead: "Everything your pup needs in one service:",
        withCutTitle: "Full-Service Grooming with Haircut",
        noCutTitle: "Full-Service Bath & Maintenance",
        includes: "Includes:",
        priceByWeight: "Pricing by weight:",
        chipWithCut: "+ tax",
        chipNoCut: "+ tax",
        noteNoCut1: "*This package is",
        noteNoCut2: "less than the haircut service.",
        reservationTitle:
          "Reserve your appointment with a $25 deposit and secure Cuddles & Cuts for your pup 🐾💖",
        reservationLead:
          "Your deposit goes toward the final total. Fully refundable with 24h notice. Serving Round Rock & North Austin.",
        reservationCtaBook: "Book now",
        reservationCtaAria: "Book now on Calendly",
        reservationCtaWhatsappAria: "Chat on WhatsApp",
        reservationCtaWhatsappTitle: "Chat on WhatsApp",
        reservationWhatsappText:
          "Hi! I'd like to book a grooming appointment in Round Rock & Surroundings. Can you help me schedule?",
        travelCalcTitle: "Travel Calculator",
        priceDisclaimer:
          "Prices may vary depending on coat condition and behavior.",
      };
};

/** 🐾 Lista de Features traducibles */
export const getFEATURES = (
  locale: string
): ReadonlyArray<{ icon: LucideIcon; text: string }> => {
  const isES = locale?.toLowerCase().startsWith("es");

  return isES
    ? [
        { icon: ShowerHead, text: "Baño con shampoo marca Hydra" },
        { icon: Sparkles, text: "Cepillado dental" },
        { icon: Droplets, text: "Limpieza de oídos y lágrimas" },
        { icon: Wind, text: "Secado completo" },
        { icon: Scissors, text: "Corte según la raza" },
        { icon: Hand, text: "Corte y limado de uñas" },
        { icon: Footprints, text: "Recorte de almohadillas" },
        { icon: ShieldCheck, text: "Recorte sanitario" },
        { icon: Droplet, text: "Hidratación de patas y nariz" },
        { icon: Beaker, text: "Expresión de glándulas anales si es necesario" },
        { icon: SprayCan, text: "Colonia" },
        { icon: Gift, text: "Pañuelo, moño o cinta" },
      ]
    : [
        { icon: ShowerHead, text: "Bath with Hydra-brand shampoo" },
        { icon: Sparkles, text: "Teeth brushing" },
        { icon: Droplets, text: "Ear and tear-stain cleaning" },
        { icon: Wind, text: "Drying" },
        { icon: Scissors, text: "Breed-specific haircut" },
        { icon: Hand, text: "Nail trim & file" },
        { icon: Footprints, text: "Paw pad trim" },
        { icon: ShieldCheck, text: "Sanitary trim" },
        { icon: Droplet, text: "Paw, pads & nose hydration" },
        { icon: Beaker, text: "Anal gland expression if needed" },
        { icon: SprayCan, text: "Cologne" },
        { icon: Gift, text: "Bandana, bow, or ribbon" },
      ];
};

/* =========================================================
   💰 Tiers (Precios)
   ========================================================= */
export type Tier = { label: string; base: number };

export const TIERS: Tier[] = [
  { label: "0–10 lbs", base: 120 },
  { label: "11–20 lbs", base: 130 },
  { label: "21–45 lbs", base: 150 },
  { label: "46–60 lbs", base: 180 },
  { label: "61–80 lbs", base: 200 },
];

export const priceNoCut = (base: number, discount: number) =>
  Math.max(base - discount, 0);
