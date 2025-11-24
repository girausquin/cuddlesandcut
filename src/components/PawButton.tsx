"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function PawButton() {
  return (
    <motion.a
      href="#contact"
      aria-label="Book Now"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.0, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      className="
        block relative z-30 mx-auto
        w-[clamp(140px,42vw,230px)]
        sm:w-[clamp(180px,28vw,300px)]
        md:w-[min(22vw,320px)]
        lg:w-[min(18vw,340px)]
        xl:w-[min(15vw,360px)]
      "
    >
      <Image
        src="/paw.png"
        alt="Book Now"
        width={420}
        height={480}
        priority
        sizes="(max-width: 640px) 42vw, (max-width: 1024px) 28vw, 320px"
        className="w-full h-auto object-contain drop-shadow-xl opacity-90 select-none pointer-events-none"
        style={{ maxHeight: "32vh" }}
      />
    </motion.a>
  );
}
