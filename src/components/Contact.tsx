// cuddlesandcut/src/components/Contact.tsx
"use client";

import { useMemo, useState } from "react";

type FormData = {
  name: string;
  phone: string;
  email: string;
  city: string;
  zip: string;
  service: string;
  message: string;
  consent: boolean;
  company: string; // honeypot
};

const initialData: FormData = {
  name: "",
  phone: "",
  email: "",
  city: "",
  zip: "",
  service: "",
  message: "",
  consent: false,
  company: "",
};

/* ==== Validaciones ==== */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const zipRegex = /^\d{5}$/;
const digits = (s: string) => s.replace(/\D/g, "");
function formatUSPhone(input: string) {
  const d = digits(input).slice(0, 10);
  const len = d.length;
  if (len < 4) return d;
  if (len < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState<null | "ok" | "err">(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isValid = useMemo(() => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = "Please enter your full name.";
    if (!emailRegex.test(formData.email)) e.email = "Enter a valid email.";
    if (digits(formData.phone).length !== 10)
      e.phone = "Enter a 10-digit US phone.";
    if (!zipRegex.test(formData.zip)) e.zip = "ZIP must be 5 digits.";
    if (!formData.city.trim()) e.city = "Enter your city.";
    if (!formData.service) e.service = "Choose a service type.";
    if (!formData.consent)
      e.consent = "You must agree to be contacted to proceed.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target;

    if (name === "phone") {
      return setFormData((s) => ({ ...s, phone: formatUSPhone(value) }));
    }
    if (name === "zip") {
      const v = digits(value).slice(0, 5);
      return setFormData((s) => ({ ...s, zip: v }));
    }

    setFormData((s) => ({
      ...s,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSent(null);

    // honeypot
    if (formData.company.trim()) {
      setSent("ok");
      return;
    }
    if (!isValid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const endpoint = "/api/contact";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone_raw: digits(formData.phone),
          source: "cuddlesandcut.com/contact",
          ts: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      setSent("ok");
      setFormData(initialData);
    } catch (err) {
      console.error(err);
      setSent("err");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-20"
      style={{
        backgroundImage: "url('/back.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // 🎯 Parallax effect
      }}
    >
      {/* Overlay: beige cálido translúcido con blur */}
      <div className="absolute inset-0 bg-[#faf5ef]/70 backdrop-blur-sm" />

      <div className="relative max-w-5xl mx-auto px-4">
        <div className="bg-white/75 backdrop-blur-md shadow-xl rounded-2xl p-6 sm:p-8">
          <h2 className="text-3xl font-extrabold mb-2 text-center text-gray-900">
            Contact Us
          </h2>
          <p className="text-center text-gray-800/90 mb-8">
            Tell us about your pup and where you’re located in Central Texas.
            We’ll text or call you back ASAP.
          </p>

          {/* Mensajes estado */}
          {sent === "ok" && (
            <div
              role="status"
              className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800"
            >
              Thank you! We’ll get back to you shortly.
            </div>
          )}
          {sent === "err" && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800"
            >
              Something went wrong. Please try again or text/call us.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Honeypot */}
            <div className="hidden" aria-hidden>
              <label htmlFor="company">Company</label>
              <input
                id="company"
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="(512) 555-0123"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* City + ZIP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="zip"
                  className="block text-sm font-medium text-gray-700"
                >
                  ZIP Code
                </label>
                <input
                  id="zip"
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                  pattern="\d{5}"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
                {errors.zip && (
                  <p className="mt-1 text-sm text-red-600">{errors.zip}</p>
                )}
              </div>
            </div>

            {/* Service */}
            <div>
              <label
                htmlFor="service"
                className="block text-sm font-medium text-gray-700"
              >
                Service Type
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white"
              >
                <option value="">Choose a service</option>
                <option value="inhome">In-Home Grooming</option>
                <option value="pickup">Pick-up &amp; Drop-off</option>
                <option value="general">General Inquiry</option>
              </select>
              {errors.service && (
                <p className="mt-1 text-sm text-red-600">{errors.service}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message (optional)
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 min-h-[120px]"
              />
            </div>

            {/* Consent */}
            <div className="flex items-start gap-3">
              <input
                id="consent"
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                required
                className="mt-1 h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="consent" className="text-sm text-gray-800">
                I agree to be contacted by Cuddles &amp; Cuts via phone, text, or
                email.
              </label>
            </div>
            {errors.consent && (
              <p className="mt-1 text-sm text-red-600">{errors.consent}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-md bg-black text-white hover:bg-black/90 disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
