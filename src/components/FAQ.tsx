// cuddlesandcut/src/components/FAQ.tsx
"use client";

import { useId, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["800"] });

/* ==================== Multicolor Line (Section Title) ==================== */
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

/* ==================== Data ==================== */
type QA = { q: string; a: string | JSX.Element };

const FAQ_ITEMS: QA[] = [
  {
    q: "What types of services do you offer?",
    a: "We offer two service types: a breed-standard haircut, or a bath & maintenance package. Both include all the care your pup needs, delivered with love in the comfort of your home. We tailor each service to your dog’s size, temperament, and specific needs.",
  },
  {
    q: "What’s the difference between in-home and pick-up & drop-off?",
    a: (
      <div className="space-y-2">
        <p>
          <strong>In-home:</strong> We bring all the equipment and groom your pup right at your place.
        </p>
        <p>
          <strong>Pick-up & drop-off:</strong> We pick up your dog, groom at our studio, and bring them back clean, happy, and stylish.
        </p>
      </div>
    ),
  },
  {
    q: "Is the transportation (pick-up & drop-off) safe?",
    a: "Yes. Our vehicle is set up for your dog’s safety and comfort, and we only transport your pup—reducing stress and ensuring fully personalized care.",
  },
  {
    q: "How long does a grooming session take?",
    a: "It depends on size, breed, and service type—typically between 1 and 3 hours. We always take the time needed so your pup stays comfortable and never feels rushed.",
  },
  {
    q: "Do I need to be home during the in-home service?",
    a: "Ideally, yes—please be there at the start to let us in and help us set up a suitable workspace. You’re welcome to stay nearby or take the time to relax elsewhere at home. Our goal is for both you and your pup to feel safe and at ease.",
  },
  {
    q: "What’s needed for the In-Home service?",
    a: "Any corner of your house can be perfect! We only need a comfortable area with a pleasant temperature and access to both hot and cold water. We bring everything—our full spa setup—to pamper your furry friend right at home! 🐾💦",
  },
  {
    q: "How should I prepare my dog beforehand?",
    a: "Please make sure they’ve gone potty and that there’s a quiet space where we can work comfortably. We’ll handle the rest.",
  },
  {
    q: "Do you use special products?",
    a: "Yes. We work with Hydra’s professional line—world-renowned for canine coat care. These hypoallergenic, safe products enhance shine, softness, and overall coat health.",
  },
  {
    q: "What if my dog is nervous or not used to grooming?",
    a: "We have experience with sensitive or anxious pups. We use calm handling techniques and lots of kindness so they gradually associate grooming with a positive experience.",
  },
  {
    q: "Do you offer free transportation?",
    a: (
      <div className="space-y-2">
        <p>
          <strong>In-Home:</strong> Yes — travel is free within a{" "}
          <strong>15-mile</strong> radius from our HQ in Round Rock, TX. Beyond
          that, a fee of <strong>$2 per mile</strong> applies (round trip ={" "}
          <strong>2 trips</strong>).
        </p>
        <p>
          <strong>Pick-up / Drop-off:</strong> Free within <strong>5 miles</strong>. Beyond that, the same{" "}
          <strong>$2 per mile</strong> rate applies, calculated for{" "}
          <strong>4 trips</strong> (total pick-up + delivery × 2).
        </p>
      </div>
    ),
  },
];

/* ==================== FAQ Item ==================== */
function FAQItem({
  item,
  isOpen,
  onToggle,
  idx,
}: {
  item: QA;
  isOpen: boolean;
  onToggle: () => void;
  idx: number;
}) {
  const prefersReduced = useReducedMotion();
  const baseId = useId();
  const headerId = `${baseId}-faq-header-${idx}`;
  const panelId = `${baseId}-faq-panel-${idx}`;

  return (
    <div className="rounded-2xl border border-black/10 bg-white/90 shadow-sm focus-within:ring-2 focus-within:ring-indigo-300">
      <button
        id={headerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none"
      >
        <span className="text-base sm:text-lg font-semibold text-gray-900">
          {item.q}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={headerId}
            key="content"
            initial={prefersReduced ? false : { height: 0, opacity: 0 }}
            animate={prefersReduced ? {} : { height: "auto", opacity: 1 }}
            exit={prefersReduced ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-gray-700 leading-relaxed">
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==================== Main FAQ Section ==================== */
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions — Cuddles & Cuts"
      className="relative w-full bg-blue-50 py-14 sm:py-16 md:py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <SectionTitle>Frequently Asked Questions</SectionTitle>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true, amount: 0.4 }}
          className="mt-5 text-base sm:text-lg text-black/70 text-center max-w-3xl mx-auto"
        >
          Everything you need to know about our in-home and pick-up & drop-off grooming.
        </motion.p>

        <div className="mt-10 grid gap-4">
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              idx={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>

      {/* ===== Animation keyframes for the multicolor line ===== */}
      <style jsx global>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        .animate-gradient-flow {
          animation: gradient-flow 5s linear infinite;
        }
      `}</style>
    </section>
  );
}
