import type { Metadata } from "next";
import { IBM_Plex_Mono, Literata } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Serifa de leitura longa, servida pelo próprio app (next/font baixa no build).
// A pilha de sistema caía em fontes diferentes em cada máquina; no Linux, numa
// Times apertada que cansava a leitura.
const editorial = Literata({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-literata",
  display: "swap",
});

// Monoespaçada para a camada de dados: datas, contagens, rótulos. É a voz
// "onchain" do jornal, em contraste com a serifa do texto.
const dados = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const display = localFont({
  src: "./fonts/instrument-serif-latin.woff2",
  variable: "--font-instrument-serif",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Íris — Um olhar sobre a Stellar",
  description: "Uma leitura diária da Stellar: o que mudou, por que importa e o que ainda está em observação.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${editorial.variable} ${dados.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        {/* Aplica o tema antes da pintura para não piscar branco no escuro. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{const s=localStorage.getItem("sd-theme");const d=s?s==="dark":matchMedia("(prefers-color-scheme:dark)").matches;if(d)document.documentElement.classList.add("dark")}catch{}})()`,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
