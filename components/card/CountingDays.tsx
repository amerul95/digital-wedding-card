"use client";

import { useEffect, useState } from "react";

interface CountingDaysProps {
  targetDate: string; // ISO date string from startEventDateTime
}

export function CountingDays({ targetDate }: CountingDaysProps) {
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
    <div className="flex items-center justify-center gap-2 px-4 py-4">
      <div className="flex flex-col items-center px-1">
        <div className="text-lg md:text-xl font-bold text-rose-700">{formatNumber(timeLeft.days)}</div>
        <div className="text-xs text-rose-600 uppercase tracking-wide">Days</div>
      </div>
      <div className="text-rose-400 text-base">:</div>
      <div className="flex flex-col items-center px-1">
        <div className="text-lg md:text-xl font-bold text-rose-700">{formatNumber(timeLeft.hours)}</div>
        <div className="text-xs text-rose-600 uppercase tracking-wide">Hours</div>
      </div>
      <div className="text-rose-400 text-base">:</div>
      <div className="flex flex-col items-center px-1">
        <div className="text-lg md:text-xl font-bold text-rose-700">{formatNumber(timeLeft.minutes)}</div>
        <div className="text-xs text-rose-600 uppercase tracking-wide">Minutes</div>
      </div>
      <div className="text-rose-400 text-base">:</div>
      <div className="flex flex-col items-center px-1">
        <div className="text-lg md:text-xl font-bold text-rose-700">{formatNumber(timeLeft.seconds)}</div>
        <div className="text-xs text-rose-600 uppercase tracking-wide">Seconds</div>
      </div>
    </div>
  );
}
