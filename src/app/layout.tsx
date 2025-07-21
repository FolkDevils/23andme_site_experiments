import type { Metadata } from "next";
import { JetBrains_Mono, Kode_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["300", "400", "500"],
});

const kodeMono = Kode_Mono({
  subsets: ["latin"],
  variable: "--font-kode-mono",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "DNA Genetic Testing for Health, Ancestry & More",
  description: "23andMe offers a saliva‑based DNA testing service that delivers comprehensive ancestry breakdowns across 4,000+ regions, personalized health insights, wellness and trait reports, and tools to connect with DNA relatives."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} ${kodeMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
