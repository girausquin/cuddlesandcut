// cuddlesandcut/src/components/BookNowModal.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, PawPrint, ArrowRight, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

import dynamic from "next/dynamic";
const TravelCalculator = dynamic(() => import("@/components/TravelCalculator"), {
  ssr: false,
  loading: () => (
    <div className="p-6">
      <div className="h-6 w-48 rounded bg-muted mb-4" />
      <div className="h-10 w-full rounded bg-muted mb-3" />
      <div className="h-24 w-full rounded bg-muted" />
    </div>
  ),
});

// Utility functions
function digits(s: string) {
  return (s ?? "").replace(/\D+/g, "");
}
const round2 = (n: number) => Math.round(Number(n) * 100) / 100;

// Pricing tables (no tax)
const PRICES: Record<
  "full-service-grooming-haircut" | "full-service-bath-maintenance",
  { range: [number, number]; price: number }[]
> = {
  "full-service-grooming-haircut": [
    { range: [0, 10], price: 120 },
    { range: [11, 20], price: 130 },
    { range: [21, 45], price: 150 },
    { range: [46, 60], price: 180 },
    { range: [61, 80], price: 200 },
  ],
  "full-service-bath-maintenance": [
    { range: [0, 10], price: 90 },
    { range: [11, 20], price: 100 },
    { range: [21, 45], price: 120 },
    { range: [46, 60], price: 150 },
    { range: [61, 80], price: 170 },
  ],
};

function getServicePrice(service: string, weightLbs: number): number | null {
  const table = PRICES[service as keyof typeof PRICES];
  if (!table) return null;
  for (const t of table) {
    if (weightLbs >= t.range[0] && weightLbs <= t.range[1]) return t.price;
  }
  return null;
}

export default function BookNowModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const [petName, setPetName] = useState("");
  const [sex, setSex] = useState<"male" | "female" | "">("");
  const [parentName, setParentName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [weightLbs, setWeightLbs] = useState("");
  const [notes, setNotes] = useState("");
  const [travelFee, setTravelFee] = useState<number | null>(null);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const theme = useMemo(() => {
    if (sex === "female") return "from-[#F97384] to-pink-500";
    if (sex === "male") return "from-[#2FDDDD] to-cyan-400";
    return "from-slate-700 to-slate-900";
  }, [sex]);

  const canNext0 = petName.trim().length > 0 && !!sex;
  const canNext1 = parentName.trim().length > 2 && digits(phone).length >= 10;
  const weightNum = Number(digits(weightLbs) || "0");
  const canNext2 =
    service.length > 0 && breed.trim().length >= 2 && weightNum >= 1 && weightNum <= 200;

  // Computed prices
  const servicePrice = useMemo(() => getServicePrice(service, weightNum), [service, weightNum]);
  const travelFeeNum = travelFee == null ? null : Number(travelFee);
  const totalEstimate =
    servicePrice != null && travelFeeNum != null ? round2(servicePrice + travelFeeNum) : null;

  function resetAll() {
    setStep(0);
    setPetName("");
    setSex("");
    setParentName("");
    setPhone("");
    setEmail("");
    setService("");
    setBreed("");
    setAge("");
    setWeightLbs("");
    setNotes("");
    setTravelFee(null);
  }

  function onOpenChange(v: boolean) {
    setOpen(v);
    if (!v) resetAll();
  }

  function handleScheduleClose() {
    setOpen(false);
    resetAll();
  }

  const stepTitle = [
    "Tell us about your pet",
    "Pet Parent Info",
    "Service Details",
    "Travel Area",
    "Finished",
  ][step];

  const progressPct = [20, 40, 60, 80, 100][step];
  const dialogWidth =
    step >= 2 ? "sm:max-w-[640px] md:max-w-[780px] lg:max-w-[900px]" : "sm:max-w-[540px]";
  const travelMode = service === "full-service-grooming-haircut" ? "IN_HOME" : "PICKUP";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="px-6 py-5 text-base font-semibold rounded-2xl shadow-lg">
          BOOK NOW
        </Button>
      </DialogTrigger>

      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className={cn(dialogWidth, "p-0 overflow-hidden rounded-3xl border-0 max-h-[90vh]")}
      >
        {!isClient ? null : (
          <>
            {/* Header */}
            <div className={cn("relative p-6 text-white", "bg-gradient-to-r", theme)}>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <PawPrint className="h-5 w-5" /> {stepTitle}
                </DialogTitle>
                <DialogDescription className="text-white/90">
                  {step === 0 && "Let's start with your pet's name and gender."}
                  {step === 1 && "Now tell us about the Pet Parent."}
                  {step === 2 && "Choose service, breed, weight and notes."}
                  {step === 3 && "Check if travel is included in your area."}
                  {step === 4 && "Process completed."}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-3 h-2 w-full rounded-full bg-white/25">
                <motion.div
                  className="h-2 rounded-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>
            </div>

            {/* Steps */}
            <Card className="border-0 shadow-none">
              <CardContent className="px-6 pt-3 pb-6 overflow-y-auto max-h-[65vh]">
                <AnimatePresence mode="wait">
                  {/* Step 0 */}
                  {step === 0 && (
                    <motion.div key="step0" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1 }}>
                      <div className="space-y-5">
                        <div>
                          <Label htmlFor="petName">What's your pet's name?</Label>
                          <Input
                            id="petName"
                            placeholder="e.g., Lucky"
                            value={petName}
                            onChange={(e) => setPetName(e.target.value)}
                            className="h-11 rounded-xl"
                          />
                        </div>

                        <div>
                          <Label>{petName || "Your pet"}'s gender</Label>
                          <RadioGroup
                            value={sex}
                            onValueChange={(v) => setSex(v as any)}
                            className="grid grid-cols-2 gap-3"
                          >
                            <label
                              className={cn(
                                "flex items-center gap-3 rounded-xl border p-3 cursor-pointer",
                                sex === "male" && "ring-2 ring-[#2FDDDD]"
                              )}
                            >
                              <RadioGroupItem value="male" id="male" />
                              <span>Male</span>
                            </label>
                            <label
                              className={cn(
                                "flex items-center gap-3 rounded-xl border p-3 cursor-pointer",
                                sex === "female" && "ring-2 ring-[#F97384]"
                              )}
                            >
                              <RadioGroupItem value="female" id="female" />
                              <span>Female</span>
                            </label>
                          </RadioGroup>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                          <Button variant="secondary" onClick={() => onOpenChange(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => setStep(1)} disabled={!canNext0}>
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 1 */}
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1 }}>
                      <div className="space-y-5">
                        <div>
                          <Label>Pet Parent name</Label>
                          <Input
                            value={parentName}
                            onChange={(e) => setParentName(e.target.value)}
                            placeholder="Full name"
                            className="h-11 rounded-xl"
                          />
                        </div>

                        <div>
                          <Label>Phone number</Label>
                          <Input
                            inputMode="numeric"
                            maxLength={15}
                            value={phone}
                            onChange={(e) => setPhone(digits(e.target.value))}
                            placeholder="7375551234"
                            className="h-11 rounded-xl"
                          />
                        </div>

                        <div>
                          <Label>(Optional) Email</Label>
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@email.com"
                            className="h-11 rounded-xl"
                          />
                        </div>

                        <div className="flex justify-between pt-2">
                          <Button variant="ghost" onClick={() => setStep(0)}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                          </Button>
                          <Button onClick={() => setStep(2)} disabled={!canNext1}>
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2 */}
                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1 }}>
                      <div className="space-y-5">
                        {/* Service + Breed + Age + Weight in one row */}
                        <div className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_auto_auto] gap-3">
                          <div>
                            <Label>Which service does {petName || "your pet"} need?</Label>
                            <Select value={service} onValueChange={setService}>
                              <SelectTrigger className="h-11 rounded-xl">
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="full-service-grooming-haircut">
                                  Full-Service Grooming with Haircut
                                </SelectItem>
                                <SelectItem value="full-service-bath-maintenance">
                                  Full-Service Bath & Maintenance
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Dog breed</Label>
                            <Input
                              placeholder="e.g., Poodle"
                              value={breed}
                              onChange={(e) => setBreed(e.target.value)}
                              className="h-11 rounded-xl"
                            />
                          </div>
                          <div>
                            <Label>Age (years)</Label>
                            <Input
                              inputMode="numeric"
                              maxLength={2}
                              placeholder="3"
                              value={age}
                              onChange={(e) => setAge(digits(e.target.value).slice(0, 2))}
                              className="h-11 rounded-xl text-center w-[90px]"
                            />
                          </div>
                          <div>
                            <Label>Lbs</Label>
                            <Input
                              inputMode="numeric"
                              maxLength={3}
                              placeholder="15"
                              value={weightLbs}
                              onChange={(e) => setWeightLbs(digits(e.target.value).slice(0, 3))}
                              className="h-11 rounded-xl text-center w-[90px]"
                            />
                          </div>
                        </div>

                        {/* ✅ Notes full width */}
                        <div>
                          <Label>Notes</Label>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="min-h-[120px] w-full rounded-xl border p-4 text-base resize-none focus:border-slate-400 focus:ring focus:ring-slate-100"
                            placeholder="Allergies, anxiety, preferences, or anything else we should know."
                          />
                        </div>

                        <div className="flex justify-between pt-2">
                          <Button variant="ghost" onClick={() => setStep(1)}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                          </Button>
                          <Button onClick={() => setStep(3)} disabled={!canNext2}>
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3 - Travel Calculator */}
                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1 }}>
                      <TravelCalculator defaultService={travelMode} locked onFeeChange={setTravelFee} />
                      <div className="flex justify-between pt-4">
                        <Button variant="ghost" onClick={() => setStep(2)}>
                          <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button onClick={() => setStep(4)} disabled={travelFee === null}>
                          Next <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4 - Finished */}
                  {step === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1 }}>
                      <div className="py-10 flex flex-col items-center justify-center gap-4 text-center">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                          <Check className="h-6 w-6 text-emerald-700" />
                        </div>
                        <h3 className="text-2xl font-semibold">Finished</h3>
                        <p className="text-muted-foreground max-w-md">
                          Thanks! Your information has been recorded.
                        </p>

                        {servicePrice != null && (
                          <p className="text-sm font-medium text-gray-700">
                            Service cost:{" "}
                            <span className="font-semibold text-gray-900">
                              ${servicePrice.toFixed(2)}
                            </span>
                            .
                          </p>
                        )}

                        {travelFeeNum !== null && !Number.isNaN(travelFeeNum) && (
                          <p className="text-sm font-medium text-gray-700">
                            Travel cost:{" "}
                            <span className="font-semibold text-gray-900">
                              {travelFeeNum === 0 ? "free" : `$${travelFeeNum.toFixed(2)}`}
                            </span>
                            .
                          </p>
                        )}

                        {totalEstimate != null && (
                          <p className="text-base font-semibold text-gray-900 mt-1">
                            Estimated total: ${totalEstimate.toFixed(2)}{" "}
                            <span className="text-xs text-muted-foreground align-middle">
                              (before tax)
                            </span>
                          </p>
                        )}

                     <Button
  size="lg"
  className="mt-2"
  onClick={async () => {
    // 1) Enviar correo con TODA la información
    try {
      await fetch("/api/booknow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petName,
          sex,
          parentName,
          phone,
          email,
          service,
          breed,
          age,
          weightLbs,
          notes,
          travelFee,
          servicePrice,
          travelFeeNum,
          totalEstimate,
          ts: new Date().toISOString(),
          source: "cuddlesandcut.com/booknow",
        }),
      });
    } catch (err) {
      console.error("Failed to send booking email", err);
      // Importante: igual redirigimos a Square aunque falle el email
    }

    // 2) Redirigir a Square Appointments sí o sí
    window.location.href =
      "https://app.squareup.com/appointments/book/kex5gpj1py34rx/LEKB5ZSK8FPEM/start";
  }}
>
  Schedule
</Button>


                     



			 </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            <DialogFooter className="px-6 pb-6">
              <p className="text-xs text-muted-foreground text-center w-full">
                By continuing, you agree to our service and privacy policies.
              </p>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
