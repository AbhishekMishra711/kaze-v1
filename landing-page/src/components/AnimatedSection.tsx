"use client";

import React, { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "slide-right" | "slide-left";
  delay?: number;
  id?: string;
  style?: React.CSSProperties;
}

export default function AnimatedSection({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  id,
  style,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    // Set initial state
    const fromVars: gsap.TweenVars = { opacity: 0, duration: 0.9, ease: "power3.out", delay };
    if (animation === "fade-up") fromVars.y = 40;
    if (animation === "slide-right") fromVars.x = -48;
    if (animation === "slide-left") fromVars.x = 48;

    gsap.set(el, { opacity: 0, y: animation === "fade-up" ? 40 : 0, x: animation === "slide-right" ? -48 : animation === "slide-left" ? 48 : 0 });

    const anim = gsap.to(el, {
      ...fromVars,
      opacity: 1,
      y: 0,
      x: 0,
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [animation, delay]);

  return (
    <div ref={ref} className={className} id={id} style={style}>
      {children}
    </div>
  );
}
