// lib/eventTypes.ts
export type Contact = { name: string; phone: string };

export type EventData = {
  // Existing fields
  title: string;
  dateShort: string;
  dateFull: string;
  startISO: string;
  endISO: string;
  timeRange: string;
  locationShort: string;
  locationFull: string;
  contacts: Contact[];
  mapQuery: string;

  // NEW: per-section editable fields
  uiTitlePrefix: string;        // e.g. "Majlis Aqiqah"
  uiName: string;               // e.g. "Aqil"
  greeting: string;
  speech: string;               // Section 2 speech as plain text
  aturcaraTitleUseDefault: boolean;
  aturcaraTitle: string;        // Used when toggle is OFF
  aturcaraHtml: string;         // TipTap HTML
  allowCongrats: boolean;       // Section 4 toggle
  congratsNote: string;         // Short description if disabled
  
  // Section 5: Appearance
  doorStyle: "swing" | "slide" | "envelope";  // Door animation style
  doorColor: string;  // Door color (hex)
  effect: "none" | "snow" | "petals" | "bubbles";  // Background effect
  effectColor: string;  // Effect color (hex)
  
  // Section 6: Song and Autoscroll
  autoScrollDelay: number;  // Delay in seconds before auto scroll starts (0-100)
  songUrl: string;  // YouTube URL for background song
};

export const defaultEvent: EventData = {
  // Existing defaults...
  title: "Majlis Aqiqah Aqil",
  dateShort: "Rabu • 29.10.25",
  dateFull: "29 Oktober 2025",
  startISO: "2025-10-29T11:00:00+08:00",
  endISO: "2025-10-29T15:00:00+08:00",
  timeRange: "11:00 pagi - 3:00 petang",
  locationShort: "Kuala Lumpur",
  locationFull: "Dewan Seri Melati, Putrajaya",
  contacts: [
    { name: "Hafiz", phone: "+60123456789" },
    { name: "Aina", phone: "+60198765432" },
  ],
  mapQuery: "Dewan Seri Melati, Putrajaya",

  // NEW defaults
  uiTitlePrefix: "Majlis Aqiqah",
  uiName: "Aqil",
  greeting: "Assalamualaikum, hello & selamat sejahtera",
  speech:
    "Dengan penuh kesyukuran, kami mempersilakan\nDato' | Datin | Tuan | Puan | Encik | Cik\nseisi keluarga hadir ke majlis aqiqah anakanda kami.",
  aturcaraTitleUseDefault: true,
  aturcaraTitle: "Aturcara Majlis",
  aturcaraHtml:
    `<p>11:00 pagi - Ketibaan Tetamu</p>
<p>11:30 pagi - Bacaan Doa & Tahlil</p>
<p>12:00 tengah hari - Jamuan Makan</p>
<p>3:00 petang - Majlis Bersurai</p>`,
  allowCongrats: true,
  congratsNote: "Tetamu boleh menulis ucapan tahniah.",
  
  // Section 5: Appearance defaults
  doorStyle: "swing",
  doorColor: "#f43f5e",  // Rose-500
  effect: "none",
  effectColor: "#f43f5e",  // Rose-500 (used for petals, can be adjusted per effect)
  
  // Section 6: Song and Autoscroll defaults
  autoScrollDelay: 5,  // 5 seconds delay by default
  songUrl: "",  // No song by default
};
