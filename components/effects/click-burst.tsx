"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  color: string;
  shape: "star" | "dot" | "ring";
  lifetime: number;
  born: number;
}

const COLORS = [
  "#2563eb", // blue
  "#7c3aed", // purple
  "#0891b2", // cyan
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ffffff",
];

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerR: number,
  innerR: number
) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerR);
  ctx.closePath();
}

export function ClickBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const counterRef = useRef(0);

  const spawn = useCallback((x: number, y: number) => {
    const count = 16;
    const now = performance.now();
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
      const shape: Particle["shape"] =
        i % 3 === 0 ? "star" : i % 3 === 1 ? "ring" : "dot";
      particlesRef.current.push({
        id: counterRef.current++,
        x,
        y,
        angle,
        speed: 2.5 + Math.random() * 4,
        size: shape === "star" ? 5 + Math.random() * 5 : 3 + Math.random() * 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape,
        lifetime: 600 + Math.random() * 300,
        born: now,
      });
    }
    // Extra 4 large stars
    for (let i = 0; i < 4; i++) {
      particlesRef.current.push({
        id: counterRef.current++,
        x,
        y,
        angle: Math.random() * Math.PI * 2,
        speed: 1.5 + Math.random() * 2,
        size: 8 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: "star",
        lifetime: 700 + Math.random() * 200,
        born: now,
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleClick = (e: MouseEvent | TouchEvent) => {
      let cx: number, cy: number;
      if (e instanceof TouchEvent) {
        const t = e.changedTouches[0];
        cx = t.clientX;
        cy = t.clientY;
      } else {
        cx = e.clientX;
        cy = e.clientY;
      }
      spawn(cx, cy);
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("touchend", handleClick as EventListener);

    const ctx = canvas.getContext("2d")!;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = performance.now();
      particlesRef.current = particlesRef.current.filter((p) => {
        const age = now - p.born;
        if (age > p.lifetime) return false;
        const t = age / p.lifetime;
        const eased = 1 - t * t; // ease out
        const px = p.x + Math.cos(p.angle) * p.speed * age * 0.06;
        const py = p.y + Math.sin(p.angle) * p.speed * age * 0.06 + 0.02 * age * t * 20;
        const alpha = eased;
        const scale = eased;
        const r = p.size * scale;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;

        if (p.shape === "star") {
          ctx.translate(px, py);
          ctx.rotate(age * 0.004);
          drawStar(ctx, 0, 0, 5, r, r * 0.45);
          ctx.fill();
        } else if (p.shape === "ring") {
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(px, py, r * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        return true;
      });
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchend", handleClick as EventListener);
    };
  }, [spawn]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      aria-hidden="true"
    />
  );
}
