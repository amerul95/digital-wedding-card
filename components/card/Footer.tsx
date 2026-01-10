import { FooterButton } from "./UI";
import { IconCalendar, IconPhone, IconPin, IconRSVP } from "./Icons";

interface FooterProps {
  onCalendarClick: () => void;
  onContactClick: () => void;
  onLocationClick: () => void;
  onRSVPClick: () => void;
  rsvpMode?: "rsvp-speech" | "speech-only" | "thirdparty" | "none";
}

interface FooterStyle {
  background?: string; // hex or CSS background value
  color?: string;     // hex color for icons
  textColor?: string; // hex color for text under icons
  boxShadow?: string; // CSS box-shadow value
}

interface FooterIcons {
  calendar?: string; // URL or data URL for custom icon
  phone?: string;
  pin?: string;
  rsvp?: string;
}

export function Footer({
  onCalendarClick,
  onContactClick,
  onLocationClick,
  onRSVPClick,
  rsvpMode,
  customStyle,
  customIcons,
}: FooterProps & { customStyle?: FooterStyle; customIcons?: FooterIcons }) {
  // Hide RSVP button if rsvpMode is "none" or "speech-only"
  const shouldShowRSVP = rsvpMode !== "none" && rsvpMode !== "speech-only";
  const renderIcon = (type: 'calendar' | 'phone' | 'pin' | 'rsvp', defaultIcon: React.ReactNode) => {
    const customIconUrl = customIcons?.[type];
    if (customIconUrl) {
      // Check if it's an SVG (data URL with svg+xml or starts with <svg)
      const isSVG = customIconUrl.includes('svg+xml') || customIconUrl.trim().startsWith('<svg');
      
      if (isSVG && customStyle?.color) {
        // For SVG, try to inject color into the SVG string
        try {
          let svgContent = customIconUrl;
          if (svgContent.includes('data:image/svg+xml')) {
            // Decode base64 or URL-encoded SVG
            if (svgContent.includes('base64,')) {
              svgContent = atob(svgContent.split('base64,')[1]);
            } else if (svgContent.includes('svg+xml,')) {
              svgContent = decodeURIComponent(svgContent.split('svg+xml,')[1]);
            }
          }
          
          // Replace fill and stroke attributes with the theme color
          const coloredSVG = svgContent
            .replace(/fill="[^"]*"/g, `fill="${customStyle.color}"`)
            .replace(/fill='[^']*'/g, `fill='${customStyle.color}'`)
            .replace(/stroke="[^"]*"/g, `stroke="${customStyle.color}"`)
            .replace(/stroke='[^']*'/g, `stroke='${customStyle.color}'`)
            .replace(/<svg/, `<svg fill="${customStyle.color}"`);
          
          const svgDataUrl = `data:image/svg+xml;base64,${btoa(coloredSVG)}`;
          return (
            <img 
              src={svgDataUrl} 
              alt={type} 
              className="w-6 h-6 object-contain"
            />
          );
        } catch (error) {
          // Fallback to regular image if SVG processing fails
          console.error('Error processing SVG:', error);
        }
      }
      
      // For regular images or if SVG processing failed
      return (
        <img 
          src={customIconUrl} 
          alt={type} 
          className="w-6 h-6 object-contain"
          style={{ 
            filter: customStyle?.color && !isSVG ? `drop-shadow(0 0 0 ${customStyle.color})` : undefined,
          }}
        />
      );
    }
    return <div style={{ color: customStyle?.color }}>{defaultIcon}</div>;
  };

  // Get footer background style
  const getFooterBackgroundStyle = (): React.CSSProperties => {
    if (!customStyle?.background) return {};
    
    // If it's a gradient or color string, use directly
    if (customStyle.background.includes('gradient') || customStyle.background.startsWith('#')) {
      return { background: customStyle.background, border: 'none' };
    }
    
    // If it's an image URL
    if (customStyle.background.startsWith('url(')) {
      return { 
        backgroundImage: customStyle.background, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        border: 'none' 
      };
    }
    
    return { background: customStyle.background, border: 'none' };
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 p-3">
      <div
        className="mx-auto max-w-xs rounded-2xl bg-white/90 backdrop-blur border border-rose-200 px-3 py-2"
        style={{
          ...(customStyle?.background ? getFooterBackgroundStyle() : {}),
          boxShadow: customStyle?.boxShadow || '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        }}
      >
        <div className={`grid ${shouldShowRSVP ? 'grid-cols-4' : 'grid-cols-3'} gap-2 ${!customStyle?.color ? "text-rose-700" : ""}`}>
          <FooterButton label="Calendar" onClick={onCalendarClick} color={customStyle?.color} textColor={customStyle?.textColor}>
            {renderIcon('calendar', <IconCalendar />)}
          </FooterButton>
          <FooterButton label="Contact" onClick={onContactClick} color={customStyle?.color} textColor={customStyle?.textColor}>
            {renderIcon('phone', <IconPhone />)}
          </FooterButton>
          <FooterButton label="Location" onClick={onLocationClick} color={customStyle?.color} textColor={customStyle?.textColor}>
            {renderIcon('pin', <IconPin />)}
          </FooterButton>
          {shouldShowRSVP && (
            <FooterButton label="RSVP" onClick={onRSVPClick} color={customStyle?.color} textColor={customStyle?.textColor}>
              {renderIcon('rsvp', <IconRSVP />)}
            </FooterButton>
          )}
        </div>
      </div>
    </div>
  );
}





