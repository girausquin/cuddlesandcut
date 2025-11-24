// NO "use client"
import QRHubClient from "./QRHubClient";
import Navbar from "@/components/Navbar";

// Fuerza pre-render estático para que aparezca /qr en el export
export const dynamic = "force-static";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Cuddles & Cuts — Quick Connect",
  description: "WhatsApp, Instagram, Facebook — connect & book.",
};

export default function Page() {
  return (
    <>
      {/* Navbar solo en MOBILE */}
      <div className="block md:hidden">
        <Navbar />
      </div>

      {/* Rest of the QR page */}
      <QRHubClient />
    </>
  );
}
