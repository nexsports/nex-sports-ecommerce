import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://nexsportts.com.br"),
  title: { default: "NEX SPORTS — O universo esportivo da nova geração", template: "%s · NEX SPORTS" },
  description:
    "Loja oficial NEX SPORTS. Futebol, academia, beach, padel, corrida, basquete, tênis, estilo e tech. Marcas premium, entrega rápida.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "NEX SPORTS",
    title: "NEX SPORTS — O universo esportivo da nova geração",
    description: "Performance, estilo e exclusividade reunidos em um só lugar.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
