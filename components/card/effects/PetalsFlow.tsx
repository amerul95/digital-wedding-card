// effects/Petals.tsx
"use client";
import { useEffect, useRef } from "react";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

type Props = {
  density?: number;     // particles per 10,000px²
  size?: number;        // base size (px)
  speed?: number;       // base fall speed multiplier
  color?: string;       // petal color (customizable)
  zIndex?: number;
  opacity?: number;     // 0..1
};

export default function Petals({
  density = 0.18,
  size = 7,
  speed = 1,
  color = "#f43f5e",  // default rose color, can be overridden
  zIndex = 0,
  opacity = 0.35,
}: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const spawnCount = Math.max(
      6,
      Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 10000 * density)
    );

    type Petal = {
      x: number; y: number; r: number;
      vy: number; vx: number; rot: number; vr: number; wob: number;
    };

    const reset = (p: Petal, fromTop = false) => {
      p.x = Math.random() * canvas.offsetWidth;
      p.y = fromTop ? -size : Math.random() * canvas.offsetHeight;
      p.r = size * (0.6 + Math.random() * 0.8);
      p.vy = (0.35 + Math.random() * 0.6) * speed;
      p.vx = (Math.random() - 0.5) * 0.4 * speed;
      p.rot = Math.random() * Math.PI * 2;
      p.vr = (Math.random() - 0.5) * 0.01;
      p.wob = Math.random() * Math.PI * 2;
    };

    const petals: Petal[] = Array.from({ length: spawnCount }, () => {
      const p = {} as Petal;
      reset(p);
      return p;
    });

    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(33, now - last);
      last = now;

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;

      for (const p of petals) {
        p.wob += 0.003 * dt;
        p.rot += p.vr * dt;
        p.x += (p.vx + Math.sin(p.wob) * 0.12) * dt * 0.06;
        p.y += p.vy * dt * 0.06;

        if (p.y - p.r > canvas.offsetHeight) reset(p, true);
        if (p.x < -20) p.x = canvas.offsetWidth + 20;
        if (p.x > canvas.offsetWidth + 20) p.x = -20;

        // Draw a simple teardrop/leaf
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.beginPath();
        ctx.moveTo(0, -p.r * 0.8);
        ctx.quadraticCurveTo(p.r * 0.7, 0, 0, p.r);
        ctx.quadraticCurveTo(-p.r * 0.7, 0, 0, -p.r * 0.8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    const onResize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };

    window.addEventListener("resize", onResize);
    if (!reduced) rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [density, size, speed, color, opacity, reduced]);

  return (
    <canvas
      ref={ref}
      style={{ 
        position: "absolute", 
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none", 
        zIndex 
      }}
    />
  );
}
