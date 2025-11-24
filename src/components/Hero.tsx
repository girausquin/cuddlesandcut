// cuddlesandcut/src/components/Hero.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import PawButton from "@/components/PawButton";

type FloatingItem = {
  id: string;
  char?: string;
  leftPct: number;
  sizePx: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
  popAt: number;
  isEmoji?: boolean;
};

export default function Hero() {
  const shouldReduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(max-width: 640px)");
      const update = () => setIsMobile(mq.matches);
      update();
      mq.addEventListener?.("change", update);
      return () => mq.removeEventListener?.("change", update);
    }
  }, []);

  const items: FloatingItem[] = useMemo(() => {
    if (!mounted) return [];
    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    const totalBubbles = isMobile ? 10 : 18;
    const totalExtras = isMobile ? 4 : 10;

    const bubbles = Array.from({ length: totalBubbles }).map((_, i) => ({
      id: `bubble-${i}`,
      leftPct: rand(2, 98),
      sizePx: rand(isMobile ? 12 : 16, isMobile ? 28 : 40),
      duration: rand(9, 15),
      delay: rand(0, 4),
      drift: rand(-22, 22),
      opacity: rand(0.35, 0.6),
      popAt: rand(0.45, 0.8),
    }));

    const emojis = ["🐾", "✂️", "❤️"];
    const extras: FloatingItem[] = Array.from({ length: totalExtras }).map((_, i) => ({
      id: `extra-${i}`,
      char: emojis[i % emojis.length],
      leftPct: rand(2, 98),
      sizePx: rand(isMobile ? 18 : 20, isMobile ? 32 : 42),
      duration: rand(9, 15),
      delay: rand(0, 4),
      drift: rand(-22, 22),
      opacity: rand(0.5, 0.8),
      popAt: rand(0.45, 0.8),
      isEmoji: true,
    }));

    return [...bubbles, ...extras];
  }, [mounted, isMobile]);

  return (
    <section
      id="hero"
      className="
        relative min-h-screen overflow-hidden scroll-mt-20
        bg-[url('/back-mobile.jpg')] sm:bg-[url('/back.jpg')]
        bg-cover bg-center
      "
    >
      {/* Tint sutil con color de marca */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(252, 227, 228, 0.30)" }} />

      {/* Partículas */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {items.map((item) => (
          <motion.div
            key={item.id}
            aria-hidden
            initial={{ y: "100vh", x: 0, opacity: 0, scale: 1 }}
            animate={
              shouldReduce
                ? { y: ["98vh", "90vh", "98vh"], opacity: item.opacity, scale: [0.97, 1, 0.97] }
                : {
                    y: "-12vh",
                    x: [0, item.drift, 0],
                    scale: [1, 1, 1.2, 0.94, 1],
                    opacity: [0, item.opacity, Math.min(1, item.opacity + 0.2), item.opacity * 0.7, 0],
                  }
            }
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
              times: shouldReduce ? undefined : [0, item.popAt * 0.98, item.popAt, item.popAt * 1.06, 1],
              repeatType: shouldReduce ? "mirror" : undefined,
            }}
            className="absolute will-change-transform flex items-center justify-center"
            style={{
              left: `${item.leftPct}%`,
              width: item.sizePx,
              height: item.sizePx,
              fontSize: item.isEmoji ? item.sizePx : undefined,
              color: item.isEmoji ? "#000" : undefined,
            }}
          >
            {item.isEmoji ? (
              <span>{item.char}</span>
            ) : (
              <div
                className="rounded-full"
                style={{
                  width: "100%",
                  height: "100%",
                  background: "rgba(255,255,255,0.35)",
                  border: "1px solid rgba(0,0,0,0.18)",
                  boxShadow:
                    "inset 0 0 10px rgba(255,255,255,0.3), 0 0 10px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.08)",
                  backdropFilter: "blur(1.5px)",
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* LOGO (más arriba y animación SOLO una vez) */}
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-start pt-0 sm:pt-2 px-4 text-center">
        {/* Halo suave más alto */}
        <div
          aria-hidden
          className="absolute"
          style={{
            top: "0.25rem",
            insetInline: 0,
            marginInline: "auto",
            width: "min(72vw, 700px)",
            height: "min(72vw, 700px)",
            borderRadius: "9999px",
            background:
              "radial-gradient(closest-side, rgba(252,227,228,0.35), rgba(252,227,228,0.18) 60%, transparent 70%)",
            filter: "blur(6px)",
            pointerEvents: "none",
          }}
        />

        <motion.img
          src="/logo.png"
          alt="Cuddles & Cuts logo"
          initial={{ opacity: 0, scale: 0.9, rotate: -2, y: -14 }}
          animate={
            shouldReduce
              ? { opacity: 1, scale: 1, rotate: 0, y: 0 }
              : {
                  // misma “coreografía” de antes, pero SIN repeat
                  opacity: 1,
                  scale: [1, 1.005, 1],
                  rotate: [-1.2, 0.6, -0.8, 0.4, 0],
                  y: [0, -4, 0, 4, 0],
                }
          }
          transition={
            shouldReduce
              ? { duration: 0.8, ease: "easeOut" }
              : { duration: 1.1, ease: "easeOut" } // sin repeat: corre una vez y queda quieto
          }
          className="relative mx-auto drop-shadow-[0_4px_18px_rgba(0,0,0,0.25)]"
          style={{
            width: "clamp(170px, 20vw, 420px)", // aún más arriba y un pelín más compacto
            height: "auto",
            filter:
              "drop-shadow(0 0 20px rgba(252,227,228,0.35)) drop-shadow(0 6px 14px rgba(0,0,0,0.25))",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* PawButton centrado abajo */}
        <div className="absolute inset-x-0 bottom-0 z-30 flex justify-center pb-[max(env(safe-area-inset-bottom),0px)] sm:pb-0">
        <PawButton />
        </div>
    </section>
  );
}
