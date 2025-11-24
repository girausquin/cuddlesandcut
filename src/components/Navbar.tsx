// cuddlesandcut/src/components/Navbar.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import BookNowModal from "@/components/BookNowModal";
import { useLocale } from "@/context/LocaleProvider";
import LanguageFlags from "@/components/LanguageFlags"; // ✅ banderitas

type NavItem = { href: `#${string}`; label: string };

const NAV_ITEMS = [
  { href: "#services", label: "nav.services" },
  { href: "#about", label: "nav.about" },
  { href: "#gallery", label: "nav.gallery" },
  { href: "#contact", label: "nav.contact" },
  { href: "#faq", label: "nav.faq" },
] as const satisfies ReadonlyArray<NavItem>;

const HOME_PATH = "/main";

function navHref(hash: string) {
  return { pathname: HOME_PATH, hash };
}

export default function Navbar() {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<`#${string}` | "">("");
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const mobileNavRef = useRef<HTMLElement | null>(null);
  const { t } = useLocale();

  useMotionValueEvent(scrollYProgress, "change", (v) => setScrolled(v > 0.01));

  useEffect(() => {
    if (pathname !== HOME_PATH) return;
    const ids = NAV_ITEMS.map((n) => n.href.replace("#", ""));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id)
          setActive(("#" + visible.target.id) as `#${string}`);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0.3, 0.6] }
    );

    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [pathname]);

  const headerMotion = useMemo(
    () =>
      reduce
        ? { initial: {}, animate: {}, exit: {} }
        : {
            initial: { y: -80, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            exit: { y: -80, opacity: 0 },
          },
    [reduce]
  );

  const bgClass =
    "bg-[#DDF4E1]/80 supports-[backdrop-filter]:bg-[#DDF4E1]/60 supports-[backdrop-filter]:backdrop-blur";

  useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const nav = mobileNavRef.current;

    const focusables = nav
      ? (Array.from(
          nav.querySelectorAll<HTMLElement>(
            'a, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter(
          (el) =>
            !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
        ) as HTMLElement[])
      : [];

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
      else if (e.key === "Tab" && focusables.length > 0) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      toggleBtnRef.current?.focus();
    };
  }, [mobileOpen]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-black focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <AnimatePresence>
        <motion.header
          {...headerMotion}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`fixed inset-x-0 top-0 z-40 border-b border-black/5 ${bgClass} ${
            scrolled ? "shadow-md" : "shadow-none"
          }`}
          role="banner"
        >
          {!reduce && (
            <motion.div
              className="h-0.5 bg-black/50 origin-left"
              style={{ scaleX: scrollYProgress }}
            />
          )}

          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-4 md:px-2">
            {/* Logo + tagline */}
            <div className="flex items-center gap-3 overflow-hidden">
              <Link
                href={{ pathname: HOME_PATH, hash: "hero" }}
                className="flex items-center gap-2"
                aria-label="Go to homepage"
              >
                <Image
                  src="/logo.png"
                  alt="Cuddles & Cuts Logo"
                  width={42}
                  height={42}
                  priority
                  className="h-10 w-auto object-contain"
                />
                <h1 className="font-extrabold tracking-tight text-black text-[18px] sm:text-[20px] flex items-center">
                  Cuddles & Cuts
                </h1>
              </Link>

              {/* ✅ Banderitas solo en versión móvil */}
              <div className="flex md:hidden items-center ml-1">
                <LanguageFlags />
              </div>

              <p className="hidden sm:flex items-center text-black/70 text-[14px]">
                Love in one hand, style in the other 🐾 ✂️ ❤️
              </p>
            </div>

            {/* Desktop Nav */}
            <nav
              className="hidden md:flex items-center gap-6 text-sm text-black/80"
              aria-label="Primary"
            >
              {NAV_ITEMS.map((item) => {
                const isActive =
                  active === item.href && pathname === HOME_PATH;
                return (
                  <Link
                    key={item.href}
                    href={navHref(item.href.replace("#", ""))}
                    className={`transition focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 rounded-md px-1 underline-offset-4 hover:underline ${
                      isActive
                        ? "text-black font-semibold"
                        : "hover:opacity-80"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setActive(item.href)}
                  >
                    {t(item.label)}
                  </Link>
                );
              })}
              <BookNowModal />
            </nav>

            {/* Redes sociales + banderas en desktop */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href="https://www.facebook.com/Cuddlesandcut"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black/70 hover:text-black transition p-1 rounded-md focus-visible:ring-2 focus-visible:ring-black/30"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/cuddlesandcut/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black/70 hover:text-black transition p-1 rounded-md focus-visible:ring-2 focus-visible:ring-black/30"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://wa.me/15129831650"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 transition p-1 rounded-md focus-visible:ring-2 focus-visible:ring-green-400"
              >
                <FaWhatsapp size={22} />
              </a>
              <LanguageFlags />
            </div>

            {/* Mobile toggler */}
            <button
              ref={toggleBtnRef}
              className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-black/80 hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-black/30 min-w-[44px] min-h-[44px]"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-primary-nav"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <HiOutlineX size={26} />
              ) : (
                <HiOutlineMenu size={26} />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.nav
                id="mobile-primary-nav"
                ref={mobileNavRef}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="md:hidden border-t border-black/5 bg-[#DDF4E1]/80 backdrop-blur-md"
              >
                <ul className="flex flex-col p-3">
                  {NAV_ITEMS.map((item) => {
                    const isActive =
                      active === item.href && pathname === HOME_PATH;
                    return (
                      <li key={item.href}>
                        <Link
                          href={navHref(item.href.replace("#", ""))}
                          onClick={() => {
                            setActive(item.href);
                            setMobileOpen(false);
                          }}
                          className={`block rounded-lg px-3 py-3 text-[15px] transition ${
                            isActive
                              ? "bg-black/5 text-black font-semibold"
                              : "text-black/80 hover:bg-black/5"
                          }`}
                        >
                          {t(item.label)}
                        </Link>
                      </li>
                    );
                  })}

                  <li className="mt-3">
                    <BookNowModal />
                  </li>

                  <li className="mt-3 flex justify-center">
                    <LanguageFlags />
                  </li>

                  <li className="mt-3 flex items-center gap-4 px-1 justify-center">
                    <a
                      href="https://www.facebook.com/Cuddlesandcut"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black/70 hover:text-black transition p-1 rounded-md focus-visible:ring-2 focus-visible:ring-black/30"
                    >
                      <FaFacebook size={22} />
                    </a>
                    <a
                      href="https://www.instagram.com/cuddlesandcut/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black/70 hover:text-black transition p-1 rounded-md focus-visible:ring-2 focus-visible:ring-black/30"
                    >
                      <FaInstagram size={22} />
                    </a>
                    <a
                      href="https://wa.me/15129831650"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 transition p-1 rounded-md focus-visible:ring-2 focus-visible:ring-green-400"
                    >
                      <FaWhatsapp size={22} />
                    </a>
                  </li>
                </ul>
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.header>
      </AnimatePresence>

      <div aria-hidden className="h-16" />
    </>
  );
}
