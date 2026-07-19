"use client";

import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
      if (barRef.current) barRef.current.style.width = `${pct}%`;
      if (glowRef.current) glowRef.current.style.left = `calc(${pct}% - 8px)`;
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9998] h-[3px] pointer-events-none"
      aria-hidden="true"
    >
      {/* Track */}
      <div className="absolute inset-0 bg-border/40" />
      {/* Fill */}
      <div
        ref={barRef}
        className="absolute top-0 left-0 h-full transition-none"
        style={{
          background: "linear-gradient(90deg, #2563eb 0%, #7c3aed 50%, #0891b2 100%)",
          width: "0%",
        }}
      />
      {/* Glow tip */}
      <div
        ref={glowRef}
        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full pointer-events-none"
        style={{
          left: "-8px",
          background: "#2563eb",
          boxShadow: "0 0 10px 4px rgba(37,99,235,0.6), 0 0 20px 8px rgba(124,58,237,0.3)",
          transition: "left 16ms linear",
        }}
      />
    </div>
  );
}
