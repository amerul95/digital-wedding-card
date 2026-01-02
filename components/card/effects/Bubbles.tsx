// effects/Bubbles.tsx
"use client";
import { useEffect, useRef } from "react";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

type Props = {
  density?: number;     // bubbles per 10,000px²
  minSize?: number;
  maxSize?: number;
  speed?: number;
  zIndex?: number;
  opacity?: number;
  color?: string;       // bubble color
};

export default function Bubbles({
  density = 0.2,
  minSize = 2,
  maxSize = 5,
  speed = 1,
  zIndex = 0,
  opacity = 0.25,
  color = "#94a3b8",
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

    type Bubble = { x: number; y: number; r: number; vy: number; wob: number; };
    const reset = (b: Bubble, bottom = false) => {
      b.x = Math.random() * canvas.offsetWidth;
      b.y = bottom ? canvas.offsetHeight + maxSize : Math.random() * canvas.offsetHeight;
      b.r = minSize + Math.random() * (maxSize - minSize);
      b.vy = (0.25 + Math.random() * 0.5) * speed;
      b.wob = Math.random() * Math.PI * 2;
    };

    const bubbles: Bubble[] = Array.from({ length: spawnCount }, () => {
      const b = {} as Bubble;
      reset(b);
      return b;
    });

    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(33, now - last);
      last = now;

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = color;

      for (const b of bubbles) {
        b.wob += 0.004 * dt;
        b.y -= b.vy * dt * 0.06;
        const xOffset = Math.sin(b.wob) * 0.5;

        if (b.y + b.r < 0) reset(b, true);

        ctx.beginPath();
        ctx.arc(b.x + xOffset, b.y, b.r, 0, Math.PI * 2);
        ctx.stroke();
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
  }, [density, minSize, maxSize, speed, opacity, color, reduced]);

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
