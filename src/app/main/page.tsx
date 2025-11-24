// cuddlesandcut/src/app/page.tsx
"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import InGrooming from "@/components/InGrooming";
import Services from "@/components/Services";
import AboutUs from "@/components/AboutUs";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery"; // <-- nuevo

export default function Page() {
  // Scroll suave cuando hay hash (#section) al cargar y al cambiar
  useEffect(() => {
    const scrollToHash = () => {
      const { hash } = window.location;
      if (!hash) return;
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return (
    <main className="relative min-h-screen bg-white">
      {/* Navbar fija */}
      <Navbar />

      {/* HERO */}
      <section id="home" className="scroll-mt-24">
        <Hero />
      </section>

      {/* In-Home Grooming (entre Hero y Services) */}
      <section id="in-grooming" className="scroll-mt-24">
        <InGrooming />
      </section>

      {/* SERVICES — coincide con NAVBAR: Services */}
      <section id="services" className="scroll-mt-24">
        <Services />
      </section>

      {/* ABOUT US */}
      <section id="about" className="scroll-mt-24">
        <AboutUs />
      </section>

      {/* GALLERY — coincide con NAVBAR: Gallery */}
      {/* La sección completa vive dentro del componente Gallery (incluye id="gallery") */}
      <Gallery />

      {/* CONTACT — coincide con NAVBAR: Contact */}
      <section id="contact" className="scroll-mt-24">
        <Contact />
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <FAQ />
      </section>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
