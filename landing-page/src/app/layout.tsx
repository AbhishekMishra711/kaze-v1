import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KAZE — Real-Time Emergency Resource Allocation",
  description:
    "KAZE intelligently routes ambulances, matches hospital resources, and coordinates emergency dispatch in under 200ms. Saving lives through zero-latency dispatch technology.",
  keywords: ["emergency", "ambulance dispatch", "hospital allocation", "real-time", "SOS", "EMS"],
  openGraph: {
    title: "KAZE — Real-Time Emergency Resource Allocation",
    description:
      "Frictionless SOS routing. Intelligent ambulance dispatch. Real-time hospital bed allocation. Every millisecond saved saves lives.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "KAZE — Emergency Dispatch Intelligence",
    description: "Sub-200ms SOS dispatch. Live hospital matching. Zero double-booking.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
