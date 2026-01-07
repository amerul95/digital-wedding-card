import { FooterButton } from "./UI";
import { IconCalendar, IconPhone, IconPin, IconRSVP } from "./Icons";

interface FooterProps {
  onCalendarClick: () => void;
  onContactClick: () => void;
  onLocationClick: () => void;
  onRSVPClick: () => void;
}

interface FooterStyle {
  background?: string; // hex or CSS background value
  color?: string;     // hex color for icons
  textColor?: string; // hex color for text under icons
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
  customStyle,
  customIcons,
}: FooterProps & { customStyle?: FooterStyle; customIcons?: FooterIcons }) {
  const renderIcon = (type: 'calendar' | 'phone' | 'pin' | 'rsvp', defaultIcon: React.ReactNode) => {
    const customIconUrl = customIcons?.[type];
    if (customIconUrl) {
      return (
        <img 
          src={customIconUrl} 
          alt={type} 
          className="w-6 h-6 object-contain"
          style={{ 
            filter: customStyle?.color ? `drop-shadow(0 0 0 ${customStyle.color})` : undefined,
            color: customStyle?.color 
          }}
        />
      );
    }
    return <div style={{ color: customStyle?.color }}>{defaultIcon}</div>;
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 p-3">
      <div
        className="mx-auto max-w-xs rounded-2xl bg-white/90 backdrop-blur border border-rose-200 shadow px-3 py-2"
        style={customStyle?.background ? { background: customStyle.background, border: 'none' } : undefined}
      >
        <div className={`grid grid-cols-4 gap-2 ${!customStyle?.color ? "text-rose-700" : ""}`}>
          <FooterButton label="Calendar" onClick={onCalendarClick} color={customStyle?.color} textColor={customStyle?.textColor}>
            {renderIcon('calendar', <IconCalendar />)}
          </FooterButton>
          <FooterButton label="Contact" onClick={onContactClick} color={customStyle?.color} textColor={customStyle?.textColor}>
            {renderIcon('phone', <IconPhone />)}
          </FooterButton>
          <FooterButton label="Location" onClick={onLocationClick} color={customStyle?.color} textColor={customStyle?.textColor}>
            {renderIcon('pin', <IconPin />)}
          </FooterButton>
          <FooterButton label="RSVP" onClick={onRSVPClick} color={customStyle?.color} textColor={customStyle?.textColor}>
            {renderIcon('rsvp', <IconRSVP />)}
          </FooterButton>
        </div>
      </div>
    </div>
  );
}





