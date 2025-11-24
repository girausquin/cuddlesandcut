"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Logo / Marca */}
        <div className="text-lg font-semibold">
          Cuddles & Cuts 🐾
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-6 text-sm">
          <a href="#services" className="hover:text-pink-400 transition">Services</a>
          <a href="#about" className="hover:text-pink-400 transition">About Us</a>
          <a href="#faq" className="hover:text-pink-400 transition">FAQ</a>
          <a href="#contact" className="hover:text-pink-400 transition">Contact</a>
        </div>

        {/* Derechos */}
        <div className="text-xs text-gray-400">
          © {new Date().getFullYear()} Cuddles & Cuts. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
