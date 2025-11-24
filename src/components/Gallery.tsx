"use client";

import Image from "next/image";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Scissors, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState, useCallback, useEffect } from "react";

/* ===================== Tipado ===================== */
type GalleryItem = {
  id: number;
  before: string;
  after: string;
  caption: string;
};

/* ===================== Imágenes ===================== */
const galleryImages: GalleryItem[] = [
  { id: 1, before: "/gallery/before1.jpg", after: "/gallery/after1.jpg", caption: "Rocco — Full Groom" },
  { id: 2, before: "/gallery/before2.jpg", after: "/gallery/after2.jpg", caption: "Bella — Full Groom" },
  { id: 3, before: "/gallery/before3.jpg", after: "/gallery/after3.jpg", caption: "Benji — Bath & Maintenance" },
  { id: 4, before: "/gallery/before4.jpg", after: "/gallery/after4.jpg", caption: "Lucky — Full Groom" },
];

/* ===================== Animaciones ===================== */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 180, damping: 18 } },
};

/* ===================== Hook: slides visibles ===================== */
function useSlidesVisible() {
  const compute = () => {
    if (typeof window === "undefined") return 3;
    const w = window.innerWidth;
    if (w < 640) return 1;       // móvil
    if (w < 1024) return 2;      // tablet
    return 3;                    // desktop
  };
  const [n, setN] = useState<number>(compute);

  useEffect(() => {
    const onResize = () => setN(compute());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return n;
}

/* ===================== Componente Tarjeta ===================== */
function GalleryCard({ item }: { item: GalleryItem }) {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <motion.figure
      variants={cardVariants}
      className="group relative rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-white/40 bg-white/70 backdrop-blur-md"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      <div
        className="relative w-full aspect-[9/16] cursor-pointer"
        onClick={() => setShowAfter(v => !v)}
        onMouseEnter={() => setShowAfter(true)}
        onMouseLeave={() => setShowAfter(false)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setShowAfter(v => !v)}
        role="button"
        tabIndex={0}
        aria-pressed={showAfter}
        aria-label={`Toggle before/after for ${item.caption}`}
      >
        <Image
          src={item.before}
          alt={`${item.caption} — before grooming`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width:1024px) 50vw, 33vw"
          priority={item.id <= 3}
        />

        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: showAfter ? 1 : 0, pointerEvents: showAfter ? "auto" : "none" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <Image
            src={item.after}
            alt={`${item.caption} — after grooming`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width:1024px) 50vw, 33vw"
            loading="lazy"
            decoding="async"
          />
        </motion.div>

        {/* Badge único */}
        <div className="absolute left-3 top-3">
          {showAfter ? (
            <span className="rounded-full bg-emerald-600/90 backdrop-blur-sm ring-1 ring-white/10 text-white text-xs tracking-wide px-2 py-1">
              AFTER
            </span>
          ) : (
            <span className="rounded-full bg-black/70 backdrop-blur-sm ring-1 ring-white/10 text-white text-xs tracking-wide px-2 py-1">
              BEFORE
            </span>
          )}
        </div>

        {/* Hint móvil */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 sm:hidden">
          <span className="rounded-full bg-black/60 text-white text-[11px] px-3 py-1">Tap to toggle</span>
        </div>
      </div>

      <figcaption className="p-5 text-center">
        <p className="text-gray-900 font-semibold">{item.caption}</p>
        <p className="text-gray-600 text-sm mt-1 flex items-center justify-center gap-1">
          <Scissors className="w-4 h-4" aria-hidden />
          Love in one hand, style in the other.
        </p>

        <div className="mt-4">
          <button
            onClick={() => setShowAfter(v => !v)}
            aria-pressed={showAfter}
            className="inline-flex items-center gap-2 rounded-full border border-gray-900/10 bg-white px-4 py-2 text-sm font-medium shadow hover:shadow-md transition"
          >
            <Sparkles className="w-4 h-4" />
            {showAfter ? "Show Before" : "Show After"}
          </button>
        </div>
      </figcaption>

      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-2 ring-transparent group-hover:ring-emerald-400/60 transition" />
    </motion.figure>
  );
}

/* ===================== Carousel Helpers ===================== */
function getVisible(items: GalleryItem[], start: number, count: number): GalleryItem[] {
  const res: GalleryItem[] = [];
  for (let i = 0; i < count; i++) res.push(items[(start + i) % items.length]);
  return res;
}

/* ===================== Galería Principal ===================== */
export default function Gallery() {
  const items = galleryImages;

  // responsive: 1 (movil), 2 (tablet), 3 (desktop)
  const slidesVisible = useSlidesVisible();

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const visible = useMemo(
    () => getVisible(items, index, slidesVisible),
    [items, index, slidesVisible]
  );

  const slideLeft = useCallback(() => {
    setDirection(-1);
    setIndex(prev => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const slideRight = useCallback(() => {
    setDirection(1);
    setIndex(prev => (prev + 1) % items.length);
  }, [items.length]);

  const rowVariants: Variants = {
    enter: (dir: 1 | -1) => ({ x: dir * 40, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 220, damping: 22 } },
    exit: (dir: 1 | -1) => ({ x: dir * -40, opacity: 0, transition: { duration: 0.18 } }),
  };

  return (
    <section id="gallery" className="scroll-mt-24 py-28 relative" aria-labelledby="gallery-title">
      {/* Fondo con burbujas pastel */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#2FDDDD]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0)_60%)]" />
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-[#DDF4E1] blur-2xl opacity-70" />
        <div className="absolute top-10 right-[-60px] w-80 h-80 rounded-full bg-[#FCE3E4] blur-2xl opacity-70" />
        <div className="absolute bottom-[-60px] left-1/4 w-72 h-72 rounded-full bg-[#BBFAF8] blur-2xl opacity-70" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-soft-light" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="text-center">
          <motion.h2
            id="gallery-title"
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 drop-shadow-sm"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            Before & After Gallery
          </motion.h2>
          <motion.p
            className="mt-4 text-gray-800/90 text-lg max-w-3xl mx-auto"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 }}
          >
            See transformations that wag tails and melt hearts. ✂️🐶
          </motion.p>

          <motion.div
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="px-3 py-1 text-sm rounded-full bg-white/80 backdrop-blur border border-white/60 shadow">
              In-Home Grooming
            </span>
            <span className="px-3 py-1 text-sm rounded-full bg-white/80 backdrop-blur border border-white/60 shadow">
              Pick-Up & Delivery
            </span>
            <span className="px-3 py-1 text-sm rounded-full bg-white/80 backdrop-blur border border-white/60 shadow">
              Gentle Care
            </span>
          </motion.div>
        </div>

        {/* Carrusel */}
        <div
          className="relative mt-14"
          role="region"
          aria-roledescription="carousel"
          aria-label="Before and after gallery carousel"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") slideLeft();
            if (e.key === "ArrowRight") slideRight();
          }}
        >
          {/* Botones */}
          <button
            type="button"
            onClick={slideLeft}
            aria-label="Previous"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full bg-white/90 border border-black/10 shadow p-2 hover:shadow-md hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={slideRight}
            aria-label="Next"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full bg-white/90 border border-black/10 shadow p-2 hover:shadow-md hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Ventana */}
          <div className="overflow-hidden">
            <AnimatePresence custom={direction} initial={false} mode="popLayout">
              <motion.div
                key={`${index}-${slidesVisible}`}
                custom={direction}
                variants={rowVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className={`grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`}
              >
                {visible.map(item => (
                  <GalleryCard key={item.id} item={item} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-6 py-3 text-sm font-semibold shadow-lg hover:shadow-xl transition"
          >
            <Scissors className="w-4 h-4" />
            Book your pet’s glow-up
          </a>
        </motion.div>
      </div>
    </section>
  );
}
