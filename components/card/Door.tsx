interface DoorProps {
  side: "left" | "right";
  color?: string;
  opacity?: number; // 0-100, default 100
  blur?: number; // 0-100 in pixels, default 0
}

// Helper function to check if color is white or very light
function isWhiteColor(color: string): boolean {
  const normalizedColor = color.toLowerCase().trim();
  if (normalizedColor === '#ffffff' || normalizedColor === '#fff' || normalizedColor === 'white') {
    return true;
  }
  // Check if it's a very light color (RGB values all > 240)
  if (normalizedColor.startsWith('#')) {
    const hex = normalizedColor.replace('#', '');
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return r > 240 && g > 240 && b > 240;
    } else if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return r > 240 && g > 240 && b > 240;
    }
  }
  return false;
}

// Helper function to apply opacity to hex color
function applyOpacityToHex(hex: string, opacity: number): string {
  // Convert opacity from 0-100 to 0-1
  const opacityValue = opacity / 100;
  
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Parse RGB values
  let r: number, g: number, b: number;
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  }
  
  return `rgba(${r}, ${g}, ${b}, ${opacityValue})`;
}

export function Door({ side, color = "#f43f5e", opacity = 100, blur = 0 }: DoorProps) {
  const isWhite = isWhiteColor(color);
  // Use solid color - if white, use white; otherwise use the provided color
  const baseColor = isWhite ? '#ffffff' : color;
  
  // Apply opacity to background color
  const backgroundColor = opacity < 100 ? applyOpacityToHex(baseColor, opacity) : baseColor;
  
  // Calculate border colors - still use slightly darker for contrast, but solid
  const lighterColor = color + "33"; // For borders
  const borderColor = color + "66"; // For borders
  
  // Apply backdrop blur filter if blur > 0 - this blurs content behind, not the door itself
  const backdropBlurFilter = blur > 0 ? `blur(${blur}px)` : 'none';
  
  return (
    <div className="relative h-full w-full">
      <div 
        className="absolute inset-0 border-l border-r" 
        style={{ 
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          backdropFilter: backdropBlurFilter, // Blurs content behind the door
          WebkitBackdropFilter: backdropBlurFilter, // Safari support
        }}
      >
        {!isWhite && (
          <svg className="absolute inset-0 h-full w-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`petals-${side}-${color.replace('#', '')}`} patternUnits="userSpaceOnUse" width="80" height="80">
                <path d="M40 10c6 12-6 24-18 18 12 6 24-6 18-18Z" fill={color} />
                <path d="M40 70c-6-12 6-24 18-18-12-6-24 6-18 18Z" fill={color} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#petals-${side}-${color.replace('#', '')})`} />
          </svg>
        )}

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


