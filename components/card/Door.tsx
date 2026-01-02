interface DoorProps {
  side: "left" | "right";
  color?: string;
}

export function Door({ side, color = "#f43f5e" }: DoorProps) {
  // Calculate lighter shades for borders
  const lighterColor = color + "33"; // Add transparency
  const borderColor = color + "66"; // Add transparency
  
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm border-l border-r" style={{ borderColor: lighterColor }}>
        <svg className="absolute inset-0 h-full w-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`petals-${side}-${color.replace('#', '')}`} patternUnits="userSpaceOnUse" width="80" height="80">
              <path d="M40 10c6 12-6 24-18 18 12 6 24-6 18-18Z" fill={color} />
              <path d="M40 70c-6-12 6-24 18-18-12-6-24 6-18 18Z" fill={color} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#petals-${side}-${color.replace('#', '')})`} />
        </svg>

        <div
          className={`absolute top-1/2 -translate-y-1/2 ${
            side === "left" ? "right-2" : "left-2"
          } h-10 w-10 rounded-full border bg-white shadow-md flex items-center justify-center`}
          style={{ borderColor: lighterColor }}
        >
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
        </div>

        <div
          className={`absolute top-0 ${side === "left" ? "right-0" : "left-0"} h-full w-[3px]`}
          style={{ backgroundColor: lighterColor }}
        />
      </div>
    </div>
  );
}


