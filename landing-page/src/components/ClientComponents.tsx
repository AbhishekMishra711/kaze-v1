"use client";

import dynamic from "next/dynamic";

export const VideoScroller = dynamic(
  () => import("@/components/VideoScroller"),
  { ssr: false }
);

export const ScrollProgressBar = dynamic(
  () => import("@/components/ScrollProgressBar"),
  { ssr: false }
);

// SOSButton is already "use client" — we can import directly,
// but keep it here so the server page has a single clean import path.
export { default as SOSButton } from "@/components/SOSButton";
