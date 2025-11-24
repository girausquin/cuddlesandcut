// cuddlesandcut/src/app/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/main#hero"); // cambia la ruta de destino si tu página/logo está en otra
  }, [router]);

  // No renderizamos nada: salta directo a /main#hero
  return null;
}
