import "./globals.css";
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { APP_NAME } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", weight: ["400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Panduan Fast Track 30 Hari Membuka Peluang Jodoh",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${montserrat.variable} font-sans`}>
      <body className="antialiased bg-[#141414] text-white selection:bg-[#E50914] selection:text-white">{children}</body>
    </html>
  );
}
