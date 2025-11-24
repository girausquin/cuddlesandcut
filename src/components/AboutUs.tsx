"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Inter } from "next/font/google";
import { useLocale } from "@/context/LocaleProvider";
import { useEffect, useMemo, useState } from "react";

/* === Textos dinámicos === */
function getTXT(locale: string) {
  const isES = locale?.startsWith("es");

  return isES
    ? {
        title: "Sobre Nosotros",
        lead:
          "Nacimos del profundo amor de nuestra fundadora por sus propias mascotas — quienes le enseñaron a cuidar y amar a cada animal como parte de la familia. Ese mismo cariño inspira cada servicio, creando una experiencia cálida, confiable y con estilo, donde cada perrito se siente en casa.",
        values: [
          { icon: "🐾", title: "Amor y Cuidado", desc: "Cuidamos a cada perrito como si fuera nuestro." },
          { icon: "✂️", title: "Toque Profesional", desc: "Productos seguros y técnicas profesionales para cada pelaje." },
          { icon: "🚐", title: "Comodidad", desc: "Servicio a domicilio o recogida y entrega para adaptarse a tu día." },
          { icon: "🧘", title: "Bienestar", desc: "Sin prisas — manejo respetuoso para sesiones tranquilas y positivas." },
        ],
        founder: {
          title: "Conoce a Juli",
          p1: "Juli es una joven emprendedora latina y fundadora de Cuddles & Cuts. Inspirada por sus mascotas y las familias locales, se formó como groomer hace tres años, creando un servicio de lujo accesible que ofrece verdadera comodidad: grooming a domicilio o con recogida y entrega.",
          p2: "Cree firmemente que “la esencia de la vida es amar lo que haces”, y su proyecto también refleja su gratitud hacia Estados Unidos y Texas por abrirle nuevas oportunidades.",
          quote: "“Amor en una mano, estilo en la otra.”",
        },
        whyTitle: "¿Por qué elegirnos?",
        reasons: [
          { icon: "❤️", title: "Cuidado Real", desc: "Tratamos a cada perrito como familia." },
          { icon: "🧩", title: "Personalizado", desc: "Adaptado a la raza, pelaje y temperamento." },
          { icon: "⏳", title: "Sin Prisas", desc: "Respetamos el ritmo de cada perrito para reducir el estrés." },
          { icon: "🛡️", title: "Bienestar Primero", desc: "Sesiones positivas con productos seguros." },
          { icon: "✨", title: "Estilo con Corazón", desc: "Técnica y creatividad para resaltar su belleza natural." },
        ],
      }
    : {
        title: "About Us",
        lead:
          "Born from our founder’s deep love for her own pets—who taught her to love and care for every animal as if it were family. That same care inspires every service, creating a grooming experience that is warm, trustworthy, and stylish, where every pup is treated like part of the family.",
        values: [
          { icon: "🐾", title: "Love & Care", desc: "Genuine love and care—we treat every pup like family." },
          { icon: "✂️", title: "Professional Touch", desc: "Safe products and professional techniques for every coat." },
          { icon: "🚐", title: "Convenience", desc: "In-home grooming or pickup & drop-off to fit your day." },
          { icon: "🧘", title: "Well-being", desc: "Never rushed—respectful handling for calm, positive sessions." },
        ],
        founder: {
          title: "Meet Juli",
          p1: "Juli is a young Latina entrepreneur and the founder of Cuddles & Cuts. Inspired by her pets and the needs of local families, she trained as a groomer three years ago, creating an accessible luxury service that offers true convenience: at-home grooming or pick-up and delivery.",
          p2: "Believing that “the essence of life is to love what you do,” her project also reflects her gratitude to the United States and Texas for opening new opportunities.",
          quote: "“Love in one hand, style in the other.”",
        },
        whyTitle: "Why choose us?",
        reasons: [
          { icon: "❤️", title: "Genuine Care", desc: "We care like family—every pup’s comfort matters." },
          { icon: "🧩", title: "Personalized", desc: "Tailored approach for breed, coat, and temperament." },
          { icon: "⏳", title: "Never Rushed", desc: "We honor each dog’s pace to keep stress low." },
          { icon: "🛡️", title: "Well-being First", desc: "Calm, positive sessions with safe products." },
          { icon: "✨", title: "Style with Heart", desc: "Technique + creativity to highlight natural beauty." },
        ],
      };
}

/* === Animaciones === */
const inter = Inter({ subsets: ["latin"], weight: ["800"] });
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

/* === Título === */
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

/* === MAIN === */
export default function AboutUs() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();

  const [safeTXT, setSafeTXT] = useState(() => getTXT(locale));
  const TXT = useMemo(() => getTXT(locale), [locale]);

  // 💡 Si el idioma cambia, se actualiza, pero sin desmontar el anterior
  useEffect(() => {
    setSafeTXT(TXT);
  }, [TXT]);

  const base = reduce ? {} : fadeUp;
  const list = reduce ? {} : stagger;

  return (
    <section
      className="relative bg-white pt-14 pb-16 md:pt-16 md:pb-20"
      aria-labelledby="about-title"
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 md:px-10">
        {/* === Título === */}
        <motion.div variants={base} initial="hidden" whileInView="show">
          <SectionTitle>{safeTXT.title}</SectionTitle>
        </motion.div>

        <motion.p
          variants={base}
          initial="hidden"
          whileInView="show"
          className="mt-6 text-lg text-gray-700 text-center mx-auto max-w-3xl"
        >
          {safeTXT.lead}
        </motion.p>

        {/* === Valores === */}
        <section className="mt-12">
          <motion.div
            role="list"
            variants={list}
            initial="hidden"
            whileInView="show"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {safeTXT.values.map((v) => (
              <motion.div
                key={v.title}
                variants={base}
                role="listitem"
                className="rounded-2xl border bg-white p-6 shadow-sm text-center"
              >
                <div className="text-4xl mb-3">{v.icon}</div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {v.title}
                </h4>
                <p className="mt-2 text-gray-600">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* === Fundadora === */}
        <section className="mt-14">
          <motion.div
            variants={base}
            initial="hidden"
            whileInView="show"
            className="rounded-3xl bg-gradient-to-br from-pink-50 to-blue-50 p-1"
          >
            <div className="rounded-3xl bg-white p-6 md:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-1 md:order-1">
                <h4 className="text-2xl font-bold text-gray-900">
                  {safeTXT.founder.title}
                </h4>
                <p className="mt-2 text-gray-700">{safeTXT.founder.p1}</p>
                <p className="mt-2 text-gray-700">{safeTXT.founder.p2}</p>
                <p className="mt-2 italic text-gray-700">
                  {safeTXT.founder.quote}
                </p>
              </div>
              <div className="md:order-2 w-full md:w-[280px]">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-gray-200">
                  <Image
                    src="/juli.jpg"
                    alt="Juli with her dogs"
                    fill
                    sizes="(max-width: 768px) 100vw, 280px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* === Por qué elegirnos === */}
        <section className="mt-12">
          <motion.h3
            variants={base}
            initial="hidden"
            whileInView="show"
            className="text-2xl font-semibold text-gray-900 text-center"
          >
            {safeTXT.whyTitle}
          </motion.h3>

          <motion.div
            role="list"
            variants={list}
            initial="hidden"
            whileInView="show"
            className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-5"
          >
            {safeTXT.reasons.map((c) => (
              <motion.div
                key={c.title}
                variants={base}
                role="listitem"
                className="rounded-2xl border bg-white p-6 shadow-sm text-center"
              >
                <div className="text-3xl mb-3">{c.icon}</div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {c.title}
                </h4>
                <p className="mt-2 text-gray-600">{c.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </section>
  );
}
