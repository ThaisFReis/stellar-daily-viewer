import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Registro — Blockchain em perspectiva",
  description: "Seu jornal diário de blockchain, Stellar e economia digital.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
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
