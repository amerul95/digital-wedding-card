"use client";

import { useEffect, useState } from "react";

interface CountingDaysProps {
  targetDate: string; // ISO date string from startEventDateTime
  color?: string; // Color for counter numbers and labels
  fontSize?: number; // Font size for counter numbers
  spacing?: number; // Spacing between counter units in px
}

export function CountingDays({ targetDate, color = "#be123c", fontSize = 20, spacing = 8 }: CountingDaysProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // Format numbers to always show 2 digits
  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, "0");
  };

  return (
    <div className="flex items-center justify-center px-4 py-4" style={{ gap: `${spacing}px` }}>
      <div className="flex flex-col items-center px-1">
        <div className="font-bold" style={{ fontSize: `${fontSize}px`, color }}>{formatNumber(timeLeft.days)}</div>
        <div className="text-xs uppercase tracking-wide" style={{ color }}>Days</div>
      </div>
      <div className="text-base" style={{ color }}>:</div>
      <div className="flex flex-col items-center px-1">
        <div className="font-bold" style={{ fontSize: `${fontSize}px`, color }}>{formatNumber(timeLeft.hours)}</div>
        <div className="text-xs uppercase tracking-wide" style={{ color }}>Hours</div>
      </div>
      <div className="text-base" style={{ color }}>:</div>
      <div className="flex flex-col items-center px-1">
        <div className="font-bold" style={{ fontSize: `${fontSize}px`, color }}>{formatNumber(timeLeft.minutes)}</div>
        <div className="text-xs uppercase tracking-wide" style={{ color }}>Minutes</div>
      </div>
      <div className="text-base" style={{ color }}>:</div>
      <div className="flex flex-col items-center px-1">
        <div className="font-bold" style={{ fontSize: `${fontSize}px`, color }}>{formatNumber(timeLeft.seconds)}</div>
        <div className="text-xs uppercase tracking-wide" style={{ color }}>Seconds</div>
      </div>
    </div>
  );
}
