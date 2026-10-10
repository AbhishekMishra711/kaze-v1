"use client";

/**
 * VideoScroller — GSAP ScrollTrigger-driven video scrubbing component.
 *
 * Performance strategy:
 * 1. `preload="auto"` + `muted` + `playsInline` for optimal browser decoding
 * 2. We DON'T play the video normally; instead we seek frame-by-frame
 * 3. `requestAnimationFrame` debouncing prevents redundant currentTime writes
 * 4. ScrollTrigger `scrub: true` + `invalidateOnRefresh: true` for smooth mapping
 * 5. GPU layer promotion via `transform: translateZ(0)` in CSS
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function VideoScroller() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // -- State for rAF debouncing -----------------------------------------
    let rafId: number | null = null;
    let targetTime = 0;

    /** Flush pending seek on the next animation frame */
    const flushSeek = () => {
      if (video.readyState >= 2) {
        video.currentTime = targetTime;
      }
      rafId = null;
    };

    /** Called by ScrollTrigger on every scroll tick */
    const onProgress = (progress: number) => {
      const duration = video.duration;
      if (!isFinite(duration) || duration === 0) return;

      targetTime = Math.max(0, Math.min(duration, progress * duration));

      if (rafId === null) {
        rafId = requestAnimationFrame(flushSeek);
      }
    };

    // -- Wait for metadata so duration is known ----------------------------
    const init = () => {
      // Pause immediately — we control playback via scroll
      video.pause();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5, // slight ease for smoothness (0 = instant, higher = lag)
          invalidateOnRefresh: true,
          onUpdate: (self) => onProgress(self.progress),
        },
      });

      // Dummy tween so ScrollTrigger has something to track
      tl.to({}, { duration: 1 });

      return tl;
    };

    let tl: gsap.core.Timeline | null = null;

    if (video.readyState >= 1) {
      tl = init();
    } else {
      video.addEventListener("loadedmetadata", () => {
        tl = init();
      }, { once: true });
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="video-wrapper" aria-hidden="true">
      <video
        ref={videoRef}
        id="bg-video"
        src="/video.mp4"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="video-overlay" />
    </div>
  );
}
