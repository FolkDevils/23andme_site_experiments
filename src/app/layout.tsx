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
  title: "Bcore - Outthink.Outbuild.Outfight.",
  description: "Bcore delivers rapid mission impact for those charged with protecting the nation—through integrated intelligence, engineering, and tradecraft.",
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
