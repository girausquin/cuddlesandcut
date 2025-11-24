// cuddlesandcut/src/components/BookNowModal.tsx

"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, PawPrint, Phone, Mail, Calendar, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function digits(s: string) {
  return (s ?? "").replace(/\D+/g, "");
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
  const [zip, setZip] = useState("");
  const [notes, setNotes] = useState("");

  const theme = useMemo(() => (sex === "female" ? "from-pink-500 to-fuchsia-500" : "from-blue-500 to-cyan-500"), [sex]);

  const canNext0 = petName.trim().length > 0 && !!sex;
  const canNext1 = parentName.trim().length > 2 && digits(phone).length >= 10;
  const canSubmit = service.length > 0 && zip.trim().length === 5;

  function resetAll() {
    setStep(0);
    setPetName("");
    setSex("");
    setParentName("");
    setPhone("");
    setEmail("");
    setService("");
    setZip("");
    setNotes("");
  }

  function onOpenChange(v: boolean) {
    setOpen(v);
    if (!v) resetAll();
  }

  function handleSubmit() {
    const payload = { petName, sex, parentName, phone: digits(phone), email, service, zip, notes };
    console.log("Booking payload:", payload);
    setOpen(false);
    resetAll();
  }

  const stepTitle = [
    "Tell us about your pet",
    `${petName || "your pet"}'s Pet Parent Info`,
    "Service & Confirmation",
  ][step];

  const progressPct = [33, 66, 100][step];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="px-6 py-5 text-base font-semibold rounded-2xl shadow-lg">BOOK NOW</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden rounded-3xl border-0">
        <div className={cn("relative p-6 text-white", "bg-gradient-to-r", theme, sex === "" && "from-slate-700 to-slate-900")}> 
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <PawPrint className="h-5 w-5" /> {stepTitle}
            </DialogTitle>
            <DialogDescription className="text-white/90">
              {step === 0 && "Let's start with your pet's name and gender so we can personalize the experience."}
              {step === 1 && `Now, ${petName ? petName : "your pet"} would like to introduce their Pet Parent.`}
              {step === 2 && "Choose the service and confirm your booking."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 h-2 w-full rounded-full bg-white/25">
            <motion.div
              className="h-2 rounded-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        </div>

        <Card className="border-0 shadow-none">
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                  <div className="space-y-5">
                    <div className="grid gap-2">
                      <Label htmlFor="petName" className="text-base">What's your pet's name?</Label>
                      <Input id="petName" placeholder="Ex: Lucky" value={petName} onChange={(e) => setPetName(e.target.value)} className="h-11 rounded-xl" />
                    </div>

                    <div className="grid gap-3">
                      <Label className="text-base">{petName || "Your pet"}'s gender</Label>
                      <RadioGroup value={sex} onValueChange={(v) => setSex(v as any)} className="grid grid-cols-2 gap-3">
                        <label className={cn("flex items-center gap-3 rounded-xl border p-3 cursor-pointer", sex === "male" && "ring-2 ring-blue-400")}> 
                          <RadioGroupItem value="male" id="male" />
                          <span>Male</span>
                        </label>
                        <label className={cn("flex items-center gap-3 rounded-xl border p-3 cursor-pointer", sex === "female" && "ring-2 ring-fuchsia-400")}>
                          <RadioGroupItem value="female" id="female" />
                          <span>Female</span>
                        </label>
                      </RadioGroup>
                      <p className="text-sm text-muted-foreground">The modal color will adapt automatically (blue / pink).</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <Button variant="secondary" className="rounded-xl" onClick={() => onOpenChange(false)}>Cancel</Button>
                      <Button className="rounded-xl" onClick={() => setStep(1)} disabled={!canNext0}>
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                  <div className="space-y-5">
                    <div className="grid gap-2">
                      <Label htmlFor="parentName" className="text-base">Please tell us the name of {petName || "your pet"}'s Pet Parent:</Label>
                      <Input id="parentName" placeholder="Full name" value={parentName} onChange={(e) => setParentName(e.target.value)} className="h-11 rounded-xl" />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="phone" className="text-base flex items-center gap-2"><Phone className="h-4 w-4" /> What's the Pet Parent's phone number?</Label>
                      <Input id="phone" inputMode="tel" placeholder="(737) 555-1234" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 rounded-xl" />
                      <p className="text-xs text-muted-foreground">At least 10 digits required.</p>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-base flex items-center gap-2"><Mail className="h-4 w-4" /> (Optional) Pet Parent's email</Label>
                      <Input id="email" type="email" placeholder="name@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl" />
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button variant="ghost" className="rounded-xl" onClick={() => setStep(0)}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <Button className="rounded-xl" onClick={() => setStep(2)} disabled={!canNext1}>
                        Next <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                  <div className="space-y-5">
                    <div className="grid gap-2">
                      <Label className="text-base flex items-center gap-2"><Calendar className="h-4 w-4" /> Which service does {petName || "your pet"} need?</Label>
                      <Select value={service} onValueChange={setService}>
                        <SelectTrigger className="h-11 rounded-xl">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bath">Bath (In‑Home)</SelectItem>
                          <SelectItem value="full-groom">Full Groom</SelectItem>
                          <SelectItem value="nails">Nail Trim</SelectItem>
                          <SelectItem value="deshedding">Deshedding</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="zip" className="text-base">ZIP code (to confirm coverage & travel fee)</Label>
                      <Input id="zip" inputMode="numeric" maxLength={5} placeholder="78665" value={zip} onChange={(e) => setZip(e.target.value.replace(/\D+/g, "").slice(0,5))} className="h-11 rounded-xl" />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="notes" className="text-base">Notes for {petName || "your pet"} (allergies, anxiety, etc.)</Label>
                      <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-[88px] rounded-xl border p-3 focus:outline-none" placeholder="Anything important we should know" />
                    </div>

                    <div className="rounded-2xl border p-4 bg-muted/40">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="secondary" className="rounded-full">{sex === "female" ? "Female" : sex === "male" ? "Male" : "Gender"}</Badge>
                        {service && <Badge className="rounded-full">{service}</Badge>}
                        {zip && <Badge className="rounded-full">ZIP {zip}</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">You'll review all details upon confirmation. No payment required at this step.</p>
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button variant="ghost" className="rounded-xl" onClick={() => setStep(1)}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <Button className="rounded-xl" onClick={handleSubmit} disabled={!canSubmit}>
                        Confirm Request <Check className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <DialogFooter className="px-6 pb-6">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our service and privacy policies.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
