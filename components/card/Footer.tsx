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
  color?: string;     // hex color for icons/text
}

export function Footer({
  onCalendarClick,
  onContactClick,
  onLocationClick,
  onRSVPClick,
  customStyle,
}: FooterProps & { customStyle?: FooterStyle }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 p-3">
      <div
        className="mx-auto max-w-xs rounded-2xl bg-white/90 backdrop-blur border border-rose-200 shadow px-3 py-2"
        style={customStyle?.background ? { background: customStyle.background, border: 'none' } : undefined}
      >
        <div className={`grid grid-cols-4 gap-2 ${!customStyle?.color ? "text-rose-700" : ""}`}>
          <FooterButton label="Calendar" onClick={onCalendarClick} color={customStyle?.color}>
            <IconCalendar />
          </FooterButton>
          <FooterButton label="Contact" onClick={onContactClick} color={customStyle?.color}>
            <IconPhone />
          </FooterButton>
          <FooterButton label="Location" onClick={onLocationClick} color={customStyle?.color}>
            <IconPin />
          </FooterButton>
          <FooterButton label="RSVP" onClick={onRSVPClick} color={customStyle?.color}>
            <IconRSVP />
          </FooterButton>
        </div>
      </div>
    </div>
  );
}





