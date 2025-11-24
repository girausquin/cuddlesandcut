// src/components/TravelCalculator.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import { motion } from "framer-motion";
import { MapPin, Car, Info, Loader2, AlertTriangle, RefreshCcw } from "lucide-react";

/* ===================== Props ===================== */
interface TravelCalculatorProps {
  defaultService?: "IN_HOME" | "PICKUP";
  locked?: boolean;
  // ✅ Ahora el modal recibe un número o null
  onFeeChange?: (fee: number | null) => void;
}

/* ===================== Service Types ===================== */
type ServiceType = "IN_HOME" | "PICKUP";

/* ===================== Business Rules ==================== */
// IN-HOME
const INHOME_FREE_RADIUS_MI = 15;
const INHOME_RATE_PER_MILE = 2.0;
const INHOME_MAX_SERVICE_MI = 25;
const INHOME_TRIPS = 2;

// PICK-UP / DROP-OFF
const PUDO_FREE_RADIUS_MI = 5;
const PUDO_RATE_PER_MILE = 2.0;
const PUDO_MAX_SERVICE_MI = 15;
const PUDO_TRIPS = 4;

/* ===================== Shared Config ===================== */
const ORIGIN_ADDRESS = "1400 Avery Nelson Pkwy, Round Rock, TX 78665";

type Config = {
  FREE_RADIUS_MI: number;
  RATE_PER_MILE: number;
  MAX_SERVICE_MI: number;
  TRIPS: number;
  label: string;
};

const CONFIGS: Record<ServiceType, Config> = {
  IN_HOME: {
    FREE_RADIUS_MI: INHOME_FREE_RADIUS_MI,
    RATE_PER_MILE: INHOME_RATE_PER_MILE,
    MAX_SERVICE_MI: INHOME_MAX_SERVICE_MI,
    TRIPS: INHOME_TRIPS,
    label: "In-Home Grooming",
  },
  PICKUP: {
    FREE_RADIUS_MI: PUDO_FREE_RADIUS_MI,
    RATE_PER_MILE: PUDO_RATE_PER_MILE,
    MAX_SERVICE_MI: PUDO_MAX_SERVICE_MI,
    TRIPS: PUDO_TRIPS,
    label: "Pick-up / Drop-off",
  },
};

/* ======================== Types ========================= */
type ResultStatus = "included" | "fee" | "out_of_range" | "error" | "idle";
interface Result {
  status: ResultStatus;
  rawMiles?: number;
  milesBeyond?: number;
  billableMiles?: number;
  feeUSD?: number;
  message?: string;
}

/* ======================= Helpers ======================== */
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const miFmt = (n: number) => `${n.toFixed(1)} mi`;
const round2 = (n: number) => Math.round(n * 100) / 100;

function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getDistanceMatrixSafe(
  dm: google.maps.DistanceMatrixService,
  req: google.maps.DistanceMatrixRequest
) {
  return new Promise<google.maps.DistanceMatrixResponse>((resolve, reject) => {
    dm.getDistanceMatrix(req, (res, status) => {
      if (status === google.maps.DistanceMatrixStatus.OK && res) resolve(res);
      else reject(new Error(`DistanceMatrix ${status}`));
    });
  });
}

/* ======================= Component ======================= */
export default function TravelCalculator({
  defaultService = "IN_HOME",
  locked = false,
  onFeeChange,
}: TravelCalculatorProps) {
  const [loaded, setLoaded] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);
  const [service, setService] = useState<ServiceType>(defaultService);
  const [result, setResult] = useState<Result>({ status: "idle" });
  const [isComputing, setIsComputing] = useState(false);

  const activeCfg = CONFIGS[service];
  const cfgRef = useRef<Config>(activeCfg);
  cfgRef.current = activeCfg;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapsUrl = useMemo(() => {
    const libs = ["places"];
    return `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libs.join(",")}`;
  }, [apiKey]);

  /* =================== Google Autocomplete =================== */
  useEffect(() => {
    if (!loaded || !window.google || !inputRef.current) return;

    try {
      const ac = new window.google.maps.places.Autocomplete(inputRef.current!, {
        fields: ["formatted_address", "geometry", "name", "place_id"],
        types: ["geocode"],
        componentRestrictions: { country: ["us"] },
      });

      ac.setOptions({
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(30.0, -98.2),
          new google.maps.LatLng(30.9, -97.2)
        ),
        strictBounds: false,
      });

      autocompleteRef.current = ac;

      const onPlace = () => {
        const place = ac.getPlace();
        const formatted = place?.formatted_address || place?.name || inputRef.current?.value || "";
        if (inputRef.current) inputRef.current.value = formatted;
        inputRef.current?.blur();
        safeRun(formatted);
      };
      ac.addListener("place_changed", onPlace);

      const clickHandler = (e: MouseEvent) => {
        const el = e.target as HTMLElement | null;
        if (el && el.closest(".pac-item")) {
          requestAnimationFrame(() => {
            const v = inputRef.current?.value?.trim();
            if (v) safeRun(v);
          });
        }
      };
      document.addEventListener("click", clickHandler, true);

      setMapsReady(true);

      return () => {
        ac.unbindAll();
        document.removeEventListener("click", clickHandler, true);
      };
    } catch {
      setMapsReady(false);
    }
  }, [loaded]);

  /* ================= Debounce / Compute =================== */
  const lastRun = useRef<number>(0);
  function safeRun(addr: string) {
    const now = Date.now();
    if (now - lastRun.current < 800) return;
    lastRun.current = now;
    computeDistance(addr, cfgRef.current);
  }

  async function computeDistance(destinationAddress: string, cfg: Config) {
    setIsComputing(true);
    setResult({ status: "idle" });

    try {
      if (!window.google) throw new Error("Google not loaded");

      const dm = new window.google.maps.DistanceMatrixService();
      const req: google.maps.DistanceMatrixRequest = {
        origins: [ORIGIN_ADDRESS],
        destinations: [destinationAddress],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
      };

      const dmRes = await getDistanceMatrixSafe(dm, req);
      const el = dmRes.rows?.[0]?.elements?.[0];
      if (el?.status === "OK" && el.distance) {
        const miles = el.distance.value / 1609.344;
        evaluateMiles(miles, cfg);
        return;
      }

      const geocoder = new google.maps.Geocoder();
      const [originGeo, destGeo] = await Promise.all([
        geocoder.geocode({ address: ORIGIN_ADDRESS }),
        geocoder.geocode({ address: destinationAddress }),
      ]);
      const oLoc = originGeo.results?.[0]?.geometry?.location;
      const dLoc = destGeo.results?.[0]?.geometry?.location;
      if (oLoc && dLoc) {
        const miles = haversineMiles(oLoc.lat(), oLoc.lng(), dLoc.lat(), dLoc.lng());
        evaluateMiles(miles, cfg);
        return;
      }

      throw new Error("ZERO_RESULTS");
    } catch (err: any) {
      const msg = String(err?.message || "");
      let friendly =
        "We couldn't calculate the distance right now. Please double-check the address or try again.";
      if (msg.includes("OVER_QUERY_LIMIT")) friendly = "We reached our daily map limit. Please try later.";
      if (msg.includes("REQUEST_DENIED")) friendly = "Maps request was denied. Please contact support.";
      if (msg.includes("ZERO_RESULTS") || msg.includes("NOT_FOUND"))
        friendly = "We couldn't find that address. Please try a nearby street address.";
      setResult({ status: "error", message: friendly });

      // ❌ No hay fee utilizable
      onFeeChange?.(null);
    } finally {
      setIsComputing(false);
    }
  }

  function evaluateMiles(drivingMiles: number, cfg: Config) {
    let computed: Result;

    if (drivingMiles > cfg.MAX_SERVICE_MI) {
      computed = {
        status: "out_of_range",
        rawMiles: drivingMiles,
        message: `Your address is ${miFmt(
          drivingMiles
        )} away. For ${cfg.label}, we currently serve up to ${cfg.MAX_SERVICE_MI} miles.`,
      };
      setResult(computed);
      onFeeChange?.(null); // 🔸 Fuera de rango → null
      return;
    }

    const extraOneWay = Math.max(0, drivingMiles - cfg.FREE_RADIUS_MI);
    const billable = extraOneWay * cfg.TRIPS;
    const fee = round2(billable * cfg.RATE_PER_MILE);

    if (extraOneWay <= 0) {
      computed = {
        status: "included",
        rawMiles: drivingMiles,
        milesBeyond: 0,
        billableMiles: 0,
        feeUSD: 0,
        message: `Your address is ${miFmt(
          drivingMiles
        )}. Travel is included — no extra charge for ${cfg.label.toLowerCase()}.`,
      };
      setResult(computed);
      onFeeChange?.(0); // ✅ Incluido → 0
    } else {
      computed = {
        status: "fee",
        rawMiles: drivingMiles,
        milesBeyond: extraOneWay,
        billableMiles: billable,
        feeUSD: fee,
        message: `Your address is ${miFmt(drivingMiles)}. That is ${miFmt(
          extraOneWay
        )} beyond the ${miFmt(cfg.FREE_RADIUS_MI)} included radius. Billing uses ${
          cfg.TRIPS
        } trips. Additional travel: ${miFmt(billable)} × ${usd.format(cfg.RATE_PER_MILE)} = ${usd.format(fee)}.`,
      };
      setResult(computed);
      onFeeChange?.(fee); // ✅ Cargo → número con 2 decimales
    }
  }

  /* ========================= UI =========================== */
  return (
    <section id="travel-check" className="relative mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-4 sm:py-6">
      {apiKey && <Script src={mapsUrl} strategy="afterInteractive" onLoad={() => setLoaded(true)} />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 md:p-8 shadow-xl"
      >
        <div className="mb-4 sm:mb-6 flex flex-col items-center gap-3 md:flex-row md:items-start">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-slate-900 text-white md:mr-3">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-semibold leading-tight">
              Check if travel is included
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              From our HQ at 1400 Avery Nelson Pkwy, Round Rock, TX 78665
            </p>
          </div>
        </div>

        {!mapsReady && (
          <div className="mb-4 flex flex-col items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-800">
            <p className="text-sm text-center">
              If address suggestions are not appearing, click the button below to reload Google Maps.
            </p>
            <button
              onClick={() => {
                setLoaded(false);
                setMapsReady(false);
                setTimeout(() => setLoaded(true), 300);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
            >
              <RefreshCcw className="h-4 w-4" /> Fix Autocomplete
            </button>
          </div>
        )}

        {/* Selector */}
        <div className="mb-3 sm:mb-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-2 md:inline-flex md:items-center md:gap-2">
            {(["IN_HOME", "PICKUP"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => !locked && setService(t)}
                className={`rounded-full px-4 py-2 text-sm font-semibold text-center transition ${
                  service === t
                    ? "bg-slate-900 text-white shadow"
                    : locked
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {t === "IN_HOME" ? "In-Home" : "Pick-up / Drop-off"}
              </button>
            ))}
          </div>
        </div>

        {/* Address input */}
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="address-input">
          Enter your address
        </label>

        <div className="relative">
          <input
            id="address-input"
            ref={inputRef}
            placeholder="Start typing (Google will suggest addresses)"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[16px] sm:text-base shadow-sm outline-none ring-slate-900/5 focus:border-slate-400 focus:ring"
          />

          <button
            type="button"
            onClick={() => {
              const v = inputRef.current?.value?.trim();
              if (v) safeRun(v);
            }}
            disabled={isComputing}
            aria-busy={isComputing}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isComputing ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Calculating
              </span>
            ) : (
              "Check"
            )}
          </button>
        </div>

        {/* Results */}
        <div className="mt-5 sm:mt-6" aria-live="polite" aria-atomic="true">
          {result.status === "idle" && (
            <p className="text-sm text-slate-500">
              We’ll calculate driving distance and any additional travel fee if it applies.
            </p>
          )}

          {result.status !== "idle" && result.status !== "error" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border p-3 sm:p-4 ${
                result.status === "included"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : result.status === "fee"
                  ? "border-amber-200 bg-amber-50 text-amber-900"
                  : "border-rose-200 bg-rose-50 text-rose-900"
              }`}
            >
              <div className="flex items-start gap-3">
                {result.status === "included" && <Car className="h-5 w-5" />}
                {result.status === "fee" && <Info className="h-5 w-5" />}
                {result.status === "out_of_range" && <AlertTriangle className="h-5 w-5" />}
                <div>
                  <p className="font-medium text-sm sm:text-base">{result.message}</p>
                </div>
              </div>
            </motion.div>
          )}

          {result.status === "error" && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-rose-600">
              {result.message}
            </motion.p>
          )}
        </div>

        <p className="mt-5 sm:mt-6 text-[11px] sm:text-xs text-slate-400">
          Note: Distance is computed from our HQ address. For apartments/complexes, please include unit
          details at booking.
        </p>
      </motion.div>

      {/* ✅ FIXES */}
      <style jsx global>{`
        .pac-container {
          z-index: 999999 !important;
          position: absolute !important;
          pointer-events: auto !important;
        }
        .pac-container,
        .pac-item {
          pointer-events: auto !important;
        }
        .pac-item {
          cursor: pointer !important;
        }
        [role="dialog"] {
          overflow: visible !important;
        }
      `}</style>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('mousedown', function (e) {
              if (e.target && e.target.closest('.pac-container')) {
                e.stopPropagation();
              }
            }, true);
          `,
        }}
      />
    </section>
  );
}
