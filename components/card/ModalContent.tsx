import { EventData, ModalView } from "./types";
import { getGoogleCalUrl, downloadICS, getGoogleMapsUrl, getWazeUrl } from "./utils";
import { IconApple, IconGoogle, IconPhone, IconWhatsApp, IconWaze } from "./Icons";
import { formatDate, formatTime, DateFormat, TimeFormat } from "@/lib/modalFormatters";

interface ModalStyles {
  title?: {
    fontSize?: string | number;
    color?: string;
    fontFamily?: string;
    fontWeight?: string;
  };
  date?: {
    fontSize?: string | number;
    color?: string;
    fontFamily?: string;
  };
  time?: {
    fontSize?: string | number;
    color?: string;
    fontFamily?: string;
  };
  location?: {
    fontSize?: string | number;
    color?: string;
    fontFamily?: string;
  };
  contactName?: {
    fontSize?: string | number;
    color?: string;
    fontFamily?: string;
  };
}

interface CalendarModalProps {
  event: EventData;
  onDownloadICS: () => void;
  styles?: ModalStyles;
  dateFormat?: DateFormat;
  timeFormat?: TimeFormat;
}

export function CalendarModal({ event, onDownloadICS, styles = {}, dateFormat, timeFormat }: CalendarModalProps) {
  const googleCalUrl = getGoogleCalUrl(event);
  
  const formattedDate = dateFormat && event.startISO 
    ? formatDate(event.startISO, dateFormat)
    : event.dateFull || '';
  
  const formattedTime = timeFormat && event.startISO && event.endISO
    ? formatTime(event.startISO, event.endISO, timeFormat)
    : event.timeRange || '';

  return (
    <div className="text-center">
      <h3 
        className="text-lg font-semibold text-rose-700 mb-1"
        style={{
          fontSize: styles.title?.fontSize || undefined,
          color: styles.title?.color || undefined,
          fontFamily: styles.title?.fontFamily || undefined,
          fontWeight: styles.title?.fontWeight || undefined,
        }}
      >
        Calendar
      </h3>
      <p 
        className="text-sm text-rose-900/80"
        style={{
          fontSize: styles.date?.fontSize || undefined,
          color: styles.date?.color || undefined,
          fontFamily: styles.date?.fontFamily || undefined,
        }}
      >
        {formattedDate}
      </p>
      <p 
        className="text-sm text-rose-900/60 mb-4"
        style={{
          fontSize: styles.time?.fontSize || undefined,
          color: styles.time?.color || undefined,
          fontFamily: styles.time?.fontFamily || undefined,
        }}
      >
        {formattedTime}
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          className="p-3 rounded-xl border border-rose-200 hover:bg-rose-50"
          aria-label="Add to Apple Calendar"
          onClick={onDownloadICS}
        >
          <IconApple />
        </button>
        <a
          className="p-3 rounded-xl border border-rose-200 hover:bg-rose-50"
          aria-label="Add to Google Calendar"
          href={googleCalUrl}
          target="_blank"
          rel="noreferrer"
        >
          <IconGoogle />
        </a>
      </div>
    </div>
  );
}

interface ContactModalProps {
  contacts: Array<{ name: string; phone: string }>;
  styles?: ModalStyles;
}

export function ContactModal({ contacts, styles = {} }: ContactModalProps) {
  return (
    <div>
      <h3 
        className="text-lg font-semibold text-rose-700 mb-3 text-center"
        style={{
          fontSize: styles.title?.fontSize || undefined,
          color: styles.title?.color || undefined,
          fontFamily: styles.title?.fontFamily || undefined,
          fontWeight: styles.title?.fontWeight || undefined,
        }}
      >
        Contact
      </h3>
      <ul className="space-y-3">
        {contacts.map((c) => (
          <li
            key={c.phone}
            className="flex items-center justify-between bg-rose-50/60 rounded-xl px-3 py-2 border border-rose-100"
          >
            <span 
              className="text-sm text-rose-800"
              style={{
                fontSize: styles.contactName?.fontSize || undefined,
                color: styles.contactName?.color || undefined,
                fontFamily: styles.contactName?.fontFamily || undefined,
              }}
            >
              {c.name}
            </span>
            <div className="flex items-center gap-2">
              <a
                className="p-2 rounded-full border border-rose-200 hover:bg-white"
                href={`tel:${c.phone}`}
                aria-label={`Call ${c.name}`}
              >
                <IconPhone />
              </a>
              <a
                className="p-2 rounded-full border border-rose-200 hover:bg-white"
                href={`https://wa.me/${c.phone.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`WhatsApp ${c.name}`}
              >
                <IconWhatsApp />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface LocationModalProps {
  locationFull: string;
  mapQuery: string;
  styles?: ModalStyles;
}

export function LocationModal({ locationFull, mapQuery, styles = {} }: LocationModalProps) {
  const googleMapsUrl = getGoogleMapsUrl(mapQuery);
  const wazeUrl = getWazeUrl(mapQuery);

  return (
    <div className="text-center">
      <h3 
        className="text-lg font-semibold text-rose-700 mb-1"
        style={{
          fontSize: styles.title?.fontSize || undefined,
          color: styles.title?.color || undefined,
          fontFamily: styles.title?.fontFamily || undefined,
          fontWeight: styles.title?.fontWeight || undefined,
        }}
      >
        Location
      </h3>
      <p 
        className="text-sm text-rose-900/80 mb-4"
        style={{
          fontSize: styles.location?.fontSize || undefined,
          color: styles.location?.color || undefined,
          fontFamily: styles.location?.fontFamily || undefined,
        }}
      >
        {locationFull}
      </p>
      <div className="flex items-center justify-center gap-3">
        <a
          className="flex items-center gap-2 px-3 py-2 rounded-full border border-rose-200 hover:bg-rose-50 text-sm"
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
        >
          <IconGoogle /> <span>Google Maps</span>
        </a>
        <a
          className="flex items-center gap-2 px-3 py-2 rounded-full border border-rose-200 hover:bg-rose-50 text-sm"
          href={wazeUrl}
          target="_blank"
          rel="noreferrer"
        >
          <IconWaze /> <span>Waze</span>
        </a>
      </div>
    </div>
  );
}

interface RSVPModalProps {
  onSelectHadir: () => void;
  onSelectTidak: () => void;
  styles?: ModalStyles;
}

export function RSVPModal({ onSelectHadir, onSelectTidak, styles = {} }: RSVPModalProps) {
  return (
    <div className="text-center">
      <h3 
        className="text-lg font-semibold text-rose-700 mb-4"
        style={{
          fontSize: styles.title?.fontSize || undefined,
          color: styles.title?.color || undefined,
          fontFamily: styles.title?.fontFamily || undefined,
          fontWeight: styles.title?.fontWeight || undefined,
        }}
      >
        RSVP
      </h3>
      <div className="flex gap-3 justify-center">
        <button
          className="px-4 py-2 rounded-full bg-rose-600 text-white text-sm shadow hover:bg-rose-700"
          onClick={onSelectHadir}
        >
          Hadir
        </button>
        <button
          className="px-4 py-2 rounded-full border border-rose-300 text-rose-700 bg-white text-sm shadow hover:bg-rose-50"
          onClick={onSelectTidak}
        >
          Tidak Hadir
        </button>
      </div>
    </div>
  );
}





