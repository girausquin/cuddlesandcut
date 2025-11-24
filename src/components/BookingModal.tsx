// cuddlesandcut/src/components/BookingModal.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineX } from "react-icons/hi";

// === PRECIOS (según imágenes) ===
const PRICES = {
  haircut: {
    label: "Full-Service Grooming with Haircut",
    tiers: [
      { maxLb: 10, price: 120 },
      { maxLb: 20, price: 130 },
      { maxLb: 45, price: 150 },
      { maxLb: 60, price: 180 },
      { maxLb: 80, price: 200 },
    ],
  },
  bath: {
    label: "Full-Service Bath & Maintenance",
    tiers: [
      { maxLb: 10, price: 90 },
      { maxLb: 20, price: 100 },
      { maxLb: 45, price: 120 },
      { maxLb: 60, price: 150 },
      { maxLb: 80, price: 170 },
    ],
  },
} as const;

type ServiceKey = keyof typeof PRICES;
type Fulfillment = "inHome" | "pickup";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function BookingModal({ open, onClose }: Props) {
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const firstFocusableRef = useRef<HTMLButtonElement | null>(null);

  // Wizard steps
  const [step, setStep] = useState(0); // 0..4
  const totalSteps = 5;

  // State
  const [petName, setPetName] = useState("");
  const [weight, setWeight] = useState<number | "">("");
  const [service, setService] = useState<ServiceKey | "">("");
  const [fulfillment, setFulfillment] = useState<Fulfillment | "">("");
  const [address, setAddress] = useState("");
  const [travelFee, setTravelFee] = useState<number>(0);

  // Reset al abrir/cerrar y manejo de ESC + bloqueo de scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    setTimeout(() => firstFocusableRef.current?.focus(), 0);

    // Lee ?travelFee=
    try {
      const url = new URL(window.location.href);
      const tf = url.searchParams.get("travelFee");
      setTravelFee(tf ? Math.max(0, Number(tf)) || 0 : 0);
    } catch {}

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      setStep(0);
      setPetName("");
      setWeight("");
      setService("");
      setFulfillment("");
      setAddress("");
    };
  }, [open, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) onClose();
  };

  // Precio base según servicio/peso (si >80 lb: sin precio)
  const basePrice = useMemo(() => {
    if (!service || typeof weight !== "number" || !Number.isFinite(weight)) return 0;
    const tier = PRICES[service].tiers.find((t) => weight <= t.maxLb);
    return tier ? tier.price : 0;
  }, [service, weight]);

  const over80 = typeof weight === "number" && weight > 80;

  const total = useMemo(() => basePrice + (travelFee > 0 ? travelFee : 0), [basePrice, travelFee]);

  const currency = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const canNext = () => {
    if (step === 0) return petName.trim().length > 0;
    if (step === 1) return typeof weight === "number" && weight > 0;
    if (step === 2) return service !== "";
    if (step === 3) return fulfillment !== "";
    if (step === 4) return address.trim().length > 0;
    return true;
  };

  const next = () => canNext() && setStep((s) => Math.min(s + 1, totalSteps - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={backdropRef}
          onMouseDown={handleBackdropClick}
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
          aria-labelledby="booking-title"
        >
          <motion.div
            className="fixed left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-4 shadow-xl md:p-6"
            initial={{ scale: 0.96, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <h2 id="booking-title" className="text-xl font-bold">
                Book your grooming ✂️
              </h2>
              <button
                ref={firstFocusableRef}
                onClick={onClose}
                className="rounded-lg p-2 text-black/60 hover:bg-black/5 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
                aria-label="Close booking modal"
              >
                <HiOutlineX size={22} />
              </button>
            </div>

            {/* Progress */}
            <div className="mt-3">
              <div className="mb-2 flex items-center justify-between text-xs text-black/60">
                <span>Step {step + 1} of {totalSteps}</span>
                <span className="font-medium">
                  {basePrice > 0 ? `Estimate: ${currency(total)} + tax` : "Estimate: --"}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-black/10">
                <div
                  className="h-1.5 rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Body (wizard) */}
            <div className="mt-5">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3 text-sm"
                  >
                    <label className="block">
                      <span className="mb-1 block text-base font-semibold">
                        Tell me your pup’s name (in English)
                      </span>
                      <input
                        type="text"
                        value={petName}
                        onChange={(e) => setPetName(e.target.value)}
                        placeholder="e.g., Coco"
                        className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      />
                    </label>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2 text-sm"
                  >
                    <label className="block">
                      <span className="mb-1 block text-base font-semibold">
                        What’s {petName || "your pup"}’s weight? (lb)
                      </span>
                      <input
                        type="number"
                        min={1}
                        step={1}
                        value={weight}
                        onChange={(e) => {
                          const v = e.target.value;
                          setWeight(v === "" ? "" : Math.max(1, Math.floor(Number(v))));
                        }}
                        placeholder="e.g., 18"
                        className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      />
                    </label>
                    <p className="text-xs text-black/60">
                      If you’re not sure, enter your best estimate — we’ll weigh {petName || "your pup"} at service time.
                    </p>
                    {over80 && (
                      <p className="text-xs font-medium text-rose-600">
                        For pups over 80 lb we’ll provide a custom quote. Base price not shown here.
                      </p>
                    )}
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3 text-sm"
                  >
                    <span className="mb-1 block text-base font-semibold">Which service would you like?</span>
                    <div className="grid gap-2">
                      <label className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-3 ${service === "haircut" ? "border-emerald-400 bg-emerald-50" : "border-black/10 bg-white hover:bg-black/5"}`}>
                        <div className="pr-3">
                          <div className="font-semibold">{PRICES.haircut.label}</div>
                          <div className="text-xs text-black/60">Bath, full haircut & style</div>
                        </div>
                        <input
                          type="radio"
                          name="service"
                          checked={service === "haircut"}
                          onChange={() => setService("haircut")}
                        />
                      </label>

                      <label className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-3 ${service === "bath" ? "border-emerald-400 bg-emerald-50" : "border-black/10 bg-white hover:bg-black/5"}`}>
                        <div className="pr-3">
                          <div className="font-semibold">{PRICES.bath.label}</div>
                          <div className="text-xs text-black/60">Bath, nails, ears, tidy-up</div>
                        </div>
                        <input
                          type="radio"
                          name="service"
                          checked={service === "bath"}
                          onChange={() => setService("bath")}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-black/60 mt-1">
                      Same care, same price — In-Home or Pick-Up & Drop-Off. Prices shown are before tax.
                    </p>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3 text-sm"
                  >
                    <span className="mb-1 block text-base font-semibold">How would you like the service?</span>
                    <div className="grid gap-2">
                      <label className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-3 ${fulfillment === "inHome" ? "border-emerald-400 bg-emerald-50" : "border-black/10 bg-white hover:bg-black/5"}`}>
                        <div className="pr-3">
                          <div className="font-semibold">In-home grooming</div>
                          <div className="text-xs text-black/60">We come to your place</div>
                        </div>
                        <input
                          type="radio"
                          name="fulfillment"
                          checked={fulfillment === "inHome"}
                          onChange={() => setFulfillment("inHome")}
                        />
                      </label>

                      <label className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-3 ${fulfillment === "pickup" ? "border-emerald-400 bg-emerald-50" : "border-black/10 bg-white hover:bg-black/5"}`}>
                        <div className="pr-3">
                          <div className="font-semibold">Pick up & drop-off</div>
                          <div className="text-xs text-black/60">We pick up, groom, and return</div>
                        </div>
                        <input
                          type="radio"
                          name="fulfillment"
                          checked={fulfillment === "pickup"}
                          onChange={() => setFulfillment("pickup")}
                        />
                      </label>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3 text-sm"
                  >
                    <label className="block">
                      <span className="mb-1 block text-base font-semibold">
                        What’s the service address?
                      </span>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Street, City, ZIP"
                          className="flex-1 rounded-lg border border-black/10 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        />
                        <a
                          href={`/travel-calculator${address ? `?address=${encodeURIComponent(address)}` : ""}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="whitespace-nowrap rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-200"
                          title="Open travel calculator"
                        >
                          Calculate distance
                        </a>
                      </div>
                      {travelFee > 0 && (
                        <p className="mt-2 text-xs text-black/70">
                          Travel fee: <span className="font-semibold">{currency(travelFee)}</span>
                        </p>
                      )}
                      <p className="mt-1 text-[11px] text-black/50">
                        * If your calculator returns with <code>?travelFee=</code>, we add it automatically.
                      </p>
                    </label>

                    {/* Resumen */}
                    <div className="mt-2 rounded-xl border border-black/10 bg-black/5 p-3">
                      <div className="flex items-center justify-between">
                        <span>Service</span>
                        <span className="font-semibold">
                          {service ? PRICES[service].label : "--"}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span>Weight</span>
                        <span className="font-semibold">
                          {typeof weight === "number" ? `${weight} lb` : "--"}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span>Base price</span>
                        <span className="font-semibold">
                          {basePrice > 0 ? `${currency(basePrice)} + tax` : over80 ? "Custom quote" : "--"}
                        </span>
                      </div>
                      {travelFee > 0 && (
                        <div className="mt-1 flex items-center justify-between">
                          <span>Travel fee</span>
                          <span className="font-semibold">{currency(travelFee)}</span>
                        </div>
                      )}
                      <hr className="my-2 border-black/10" />
                      <div className="flex items-center justify-between text-[15px]">
                        <span className="font-semibold">Estimated total</span>
                        <span className="font-extrabold">{currency(total)} + tax</span>
                      </div>
                      <p className="mt-1 text-[11px] text-black/60">
                        * Final total may vary depending on coat condition and behavior.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer actions */}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  disabled={step === 0}
                  className="rounded-full border border-black/15 px-4 py-2 text-sm font-medium text-black/80 disabled:opacity-40"
                >
                  Back
                </button>
                {step < totalSteps - 1 ? (
                  <button
                    onClick={next}
                    disabled={!canNext()}
                    className="rounded-full bg-[#FCE3E4] px-4 py-2 text-sm font-semibold text-black disabled:opacity-40 hover:scale-[1.02] hover:bg-[#f9cfd1] hover:shadow"
                  >
                    Continue
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        alert(
                          `Thanks! Summary:\n` +
                            `Pup: ${petName}\n` +
                            `Weight: ${typeof weight === "number" ? weight : "(n/a)"} lb\n` +
                            `Service: ${service ? PRICES[service].label : "(n/a)"}\n` +
                            `Mode: ${
                              fulfillment === "inHome"
                                ? "In-home grooming"
                                : fulfillment === "pickup"
                                ? "Pick up & drop-off"
                                : "(n/a)"
                            }\n` +
                            `Address: ${address || "(n/a)"}\n` +
                            (travelFee > 0 ? `Travel fee: ${currency(travelFee)}\n` : "") +
                            (over80
                              ? `Note: Over 80 lb, custom quote.\n`
                              : `Estimated total: ${currency(total)} + tax`)
                        );
                        onClose();
                      }}
                      disabled={!canNext()}
                      className="rounded-full bg-[#FCE3E4] px-4 py-2 text-sm font-semibold text-black disabled:opacity-40 hover:scale-[1.02] hover:bg-[#f9cfd1] hover:shadow"
                    >
                      Send request
                    </button>
                    <a
                      href={`https://wa.me/15125550123?text=${encodeURIComponent(
                        `Hi Cuddles & Cuts! I’d like to book:\n` +
                          `Pup: ${petName}\n` +
                          `Weight: ${typeof weight === "number" ? `${weight} lb` : "(n/a)"}\n` +
                          `Service: ${service ? PRICES[service].label : "(n/a)"}\n` +
                          `Mode: ${
                            fulfillment === "inHome"
                              ? "In-home grooming"
                              : fulfillment === "pickup"
                              ? "Pick up & drop-off"
                              : "(n/a)"
                          }\n` +
                          (address ? `Address: ${address}\n` : "") +
                          (travelFee > 0 ? `Travel fee: ${currency(travelFee)}\n` : "") +
                          (over80
                            ? `Note: Over 80 lb, custom quote.`
                            : `Estimated total: ${currency(total)} + tax`)
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-green-600 bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600"
                    >
                      WhatsApp now
                    </a>
                  </div>
                )}
              </div>

              <div className="text-right text-xs text-black/60">
                {step < totalSteps - 1 ? "You can go back anytime." : "Ready to send your request."}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
