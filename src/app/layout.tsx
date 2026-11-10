import type { Metadata } from "next";
import { IBM_Plex_Mono, Literata } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Hubble — Blockchain em perspectiva",
  description: "Seu jornal diário de blockchain, Stellar e economia digital.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${editorial.variable} ${dados.variable}`} suppressHydrationWarning>
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
