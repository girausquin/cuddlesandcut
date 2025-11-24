"use client";

import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * BubblesBackground
 * ---------------------------------------------------------------------------
 * Burbujeo de jabón flotando en toda la landing. Ligero en performance y
 * totalmente en capa de fondo (no bloquea clicks).
 *
 * Props
 * - count: cantidad de burbujas simultáneas
 * - className: estilos extra (por ejemplo z-index)
 *
 * Uso
 * <div className="relative min-h-screen overflow-hidden">
 *   <BubblesBackground className="absolute inset-0 -z-10" />
 *   ... contenido de tu landing ...
 * </div>
 */
export default function BubblesBackground({
  count = 18,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  const shouldReduce = useReducedMotion();

  // Creamos una lista estable de "burbujas" con parámetros randomizados
  const bubbles = useMemo(() =>
    Array.from({ length: count }).map((_, i) => {
      // tamaños en px (entre 28 y 96)
      const size = Math.floor(28 + Math.random() * 68);
      const startX = Math.random() * 100; // vw
      const driftX = (Math.random() * 30 - 15); // -15 a 15 vw
      const duration = 18 + Math.random() * 16; // 18s - 34s
      const delay = Math.random() * 10; // 0s - 10s
      const blur = Math.random() < 0.5 ? 0 : 1; // algunas con blur suave
      const opacity = 0.25 + Math.random() * 0.4; // 0.25 - 0.65
      return {
        id: i,
        size,
        startX,
        driftX,
        duration,
        delay,
        blur,
        opacity,
      };
    }),
  [count]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Degradado sutil de fondo para dar profundidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-white/0" />

      {bubbles.map((b) => (
        <Bubble key={b.id} {...b} reduced={shouldReduce} />
      ))}
    </div>
  );
}

function Bubble({
  size,
  startX,
  driftX,
  duration,
  delay,
  blur,
  opacity,
  reduced,
}: {
  size: number;
  startX: number; // en vw
  driftX: number; // en vw
  duration: number; // segundos
  delay: number; // segundos
  blur: number; // 0 | 1
  opacity: number; // 0..1
  reduced: boolean;
}) {
  // Keyframes para animación completa (sube desde abajo hasta arriba)
  const yFrom = 110; // %
  const yTo = -15; // % por arriba del viewport

  // Trayectoria horizontal con leve vaivén
  const xKeyframes = [startX, startX + driftX * 0.3, startX - driftX * 0.15, startX + driftX * 0.6, startX];
  const yKeyframes = [yFrom, yFrom - 25, yFrom - 52, yFrom - 78, yTo];

  // En modo reduced motion, flotación sutil sin desplazamiento grande
  if (reduced) {
    return (
      <motion.div
        initial={{
          x: `${startX}vw`,
          y: `${yFrom}%`,
          opacity: 0,
          scale: 0.9,
        }}
        animate={{
          y: ["100%", "90%", "100%"],
          opacity,
          scale: [0.95, 1, 0.95],
        }}
        transition={{
          duration: 6 + Math.random() * 6,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
          delay,
        }}
        className="absolute"
      >
        <BubbleVisual size={size} blur={blur} opacity={opacity} />
      </motion.div>
    );
  }

  // Animación completa
  return (
    <motion.div
      initial={{ x: `${startX}vw`, y: `${yFrom}%`, opacity: 0 }}
      animate={{ x: xKeyframes.map((v) => `${v}vw`), y: yKeyframes.map((v) => `${v}%`), opacity }}
      transition={{ duration, ease: "linear", repeat: Infinity, delay }}
      className="absolute"
    >
      <BubbleVisual size={size} blur={blur} opacity={opacity} />
    </motion.div>
  );
}

function BubbleVisual({ size, blur, opacity }: { size: number; blur: number; opacity: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        opacity,
        filter: blur ? "blur(0.5px)" : undefined,
      }}
      className="relative rounded-full backdrop-blur-[2px]"
    >
      {/* Círculo base translúcido con borde iridiscente */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.2) 35%, rgba(255,255,255,0.08) 55%, rgba(255,255,255,0.0) 65%)",
          boxShadow:
            "inset 0 0 8px rgba(255,255,255,0.6), inset 0 0 18px rgba(173,216,230,0.35), 0 3px 12px rgba(0,0,0,0.06)",
        }}
      />

      {/* Halo exterior sutil tipo jabón (mix-blend para brillo) */}
      <div
        className="absolute -inset-0.5 rounded-full mix-blend-screen"
        style={{
          background:
            "conic-gradient(from 10deg, rgba(255,0,153,0.18), rgba(255,255,255,0.25), rgba(0,204,255,0.18), rgba(255,255,255,0.25), rgba(255,0,153,0.18))",
          filter: "blur(2px)",
        }}
      />

      {/* Brillo especular pequeño */}
      <div
        className="absolute rounded-full"
        style={{
          width: Math.max(8, size * 0.18),
          height: Math.max(8, size * 0.18),
          left: size * 0.18,
          top: size * 0.16,
          background: "radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0.2))",
          filter: "blur(0.5px)",
        }}
      />
    </div>
  );
}
