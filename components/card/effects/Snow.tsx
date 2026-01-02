// effects/Snow.tsx
"use client";
import { useEffect, useRef } from "react";
import usePrefersReducedMotion from "./usePrefersReducedMotion";

type Props = {
  density?: number;     // flakes per 10,000px²
  minSize?: number;     // px
  maxSize?: number;     // px
  speed?: number;       // base fall speed multiplier
  zIndex?: number;
  opacity?: number;     // 0..1
  color?: string;       // snow color
};

export default function Snow({
  density = 0.25,
  minSize = 1,
  maxSize = 2.5,
  speed = 1,
  zIndex = 0,
  opacity = 0.6,
  color = "#ffffff",
}: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    let h = canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const spawnCount = Math.max(
      8,
      Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 10000 * density)
    );

    type Flake = { x: number; y: number; r: number; vy: number; vx: number; a: number; ao: number; };
    let flakes: Flake[] = [];

    const resetFlake = (f: Flake, top = false) => {
      f.x = Math.random() * canvas.offsetWidth;
      f.y = top ? -maxSize : Math.random() * canvas.offsetHeight;
      f.r = minSize + Math.random() * (maxSize - minSize);
      f.vy = (0.4 + Math.random() * 0.8) * speed;
      f.vx = (Math.random() - 0.5) * 0.3 * speed;
      f.a = Math.random() * Math.PI * 2;
      f.ao = 0.005 + Math.random() * 0.01;
    };

    flakes = Array.from({ length: spawnCount }, () => {
      const f: Flake = { x: 0, y: 0, r: 0, vy: 0, vx: 0, a: 0, ao: 0 };
      resetFlake(f);
      return f;
    });

    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(33, now - last);
      last = now;

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;

      for (const f of flakes) {
        f.a += f.ao * dt;
        f.x += (f.vx + Math.sin(f.a) * 0.1) * dt * 0.06;
        f.y += f.vy * dt * 0.06;

        if (f.y - f.r > canvas.offsetHeight) resetFlake(f, true);
        if (f.x < -10) f.x = canvas.offsetWidth + 10;
        if (f.x > canvas.offsetWidth + 10) f.x = -10;

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
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
