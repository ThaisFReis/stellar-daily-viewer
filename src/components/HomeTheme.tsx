"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const REFRESH_MS = 15_000;

function toggleTheme() {
  const dark = document.documentElement.classList.toggle("dark");
  try {
    localStorage.setItem("sd-theme", dark ? "dark" : "light");
  } catch {
    // Sem armazenamento local, o tema vale só para esta visita.
  }
}

/** Botão de tema da home; também recarrega os dados quando sai plantão novo. */
export default function HomeTheme() {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), REFRESH_MS);
    return () => clearInterval(id);
  }, [router]);

  return (
    <button
      type="button"
      className="home-theme"
      aria-label="Alternar tema claro e escuro"
      onClick={toggleTheme}
    >
      ◐ <span>Tema</span>
    </button>
  );
}
