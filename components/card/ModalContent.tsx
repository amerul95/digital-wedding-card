import { EventData, ModalView } from "./types";
import { getGoogleCalUrl, downloadICS, getGoogleMapsUrl, getWazeUrl } from "./utils";
import { IconApple, IconGoogle, IconPhone, IconWhatsApp, IconWaze } from "./Icons";

interface CalendarModalProps {
  event: EventData;
  onDownloadICS: () => void;
}

export function CalendarModal({ event, onDownloadICS }: CalendarModalProps) {
  const googleCalUrl = getGoogleCalUrl(event);

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-rose-700 mb-1">Calendar</h3>
      <p className="text-sm text-rose-900/80">{event.dateFull}</p>
      <p className="text-sm text-rose-900/60 mb-4">{event.timeRange}</p>
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
}

export function ContactModal({ contacts }: ContactModalProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-rose-700 mb-3 text-center">Contact</h3>
      <ul className="space-y-3">
        {contacts.map((c) => (
          <li
            key={c.phone}
            className="flex items-center justify-between bg-rose-50/60 rounded-xl px-3 py-2 border border-rose-100"
          >
            <span className="text-sm text-rose-800">{c.name}</span>
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
}

export function LocationModal({ locationFull, mapQuery }: LocationModalProps) {
  const googleMapsUrl = getGoogleMapsUrl(mapQuery);
  const wazeUrl = getWazeUrl(mapQuery);

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-rose-700 mb-1">Location</h3>
      <p className="text-sm text-rose-900/80 mb-4">{locationFull}</p>
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
}

export function RSVPModal({ onSelectHadir, onSelectTidak }: RSVPModalProps) {
  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-rose-700 mb-4">RSVP</h3>
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





