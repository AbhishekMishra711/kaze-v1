import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kaze — Feel the Wind",
  description:
    "A cinematic scroll experience that brings motion to life. Powered by GSAP ScrollTrigger.",
  openGraph: {
    title: "Kaze — Feel the Wind",
    description: "A cinematic scroll experience.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
