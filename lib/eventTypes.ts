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

  // Page 1 - Main & Opening
  cardLanguage: "english" | "bahasa-melayu";  // Card language
  packageChoice: "gold" | "silver" | "bronze";  // Package choice
  designCode: string;  // Design code (Design A, B, etc.)
  openingStyle: "swing" | "slide" | "envelope";  // Opening style (door style)
  openingStyleColor: string;  // Door color
  doorOpacity?: number;  // Door opacity (0-100)
  animationEffect: "none" | "snow" | "petals" | "bubbles";  // Animation & effects
  animationEffectColor: string;  // Effect color
  doorButtonText: string;  // Door button text (HTML content from RichTextEditor)
  doorButtonTextFontFamily?: string;  // Font family for door button text
  doorButtonTextMarginTop?: number;  // Margin top for door button text container
  doorButtonTextMarginRight?: number;  // Margin right for door button text container
  doorButtonTextMarginBottom?: number;  // Margin bottom for door button text container
  doorButtonTextMarginLeft?: number;  // Margin left for door button text container
  doorButtonType?: "circle" | "square" | "rectangle";  // Door button type/shape
  doorButtonPaddingX?: number;  // Door button padding X (px)
  doorButtonPaddingY?: number;  // Door button padding Y (px)
  doorButtonMarginTop?: number;  // Door button margin top (px)
  doorButtonMarginRight?: number;  // Door button margin right (px)
  doorButtonMarginBottom?: number;  // Door button margin bottom (px)
  doorButtonMarginLeft?: number;  // Door button margin left (px)
  doorButtonBorderRadius?: number;  // Door button border radius (px)
  doorButtonWidth?: number;  // Door button container width (px)
  doorButtonBorderSize?: number;  // Door button border size (px)
  doorButtonBorderColor?: string;  // Door button border color (hex)
  doorButtonBackgroundColor?: string;  // Door button background color (hex)
  doorButtonBoxShadow?: string;  // Door button box shadow (CSS value)
  doorButtonOpenTextColor?: string;  // "OPEN" text color at bottom of button (hex)
  doorButtonAnimation?: "none" | "pulse" | "bounce" | "shake" | "glow" | "float";  // Button animation type

  // Page 2 - Front Page
  eventTitle: string;  // Type of event (event title name)
  eventTitleFontSize: number;  // Font size of event name
  eventTitleFontColor: string;  // Font color for event title
  eventTitleFontFamily: string;  // Font family for event title
  eventTitleMarginTop?: number;  // Margin top for event title container
  eventTitleMarginRight?: number;  // Margin right for event title container
  eventTitleMarginBottom?: number;  // Margin bottom for event title container
  eventTitleMarginLeft?: number;  // Margin left for event title container
  shortName: string;  // Short Name (Celebrated Person)
  shortNameFamilyFont: string;  // Family font for short name
  shortNameFontSize: number;  // Font size for short name
  shortNameFontColor: string;  // Font color for short name
  shortNameMarginTop?: number;  // Margin top for short name container
  shortNameMarginRight?: number;  // Margin right for short name container
  shortNameMarginBottom?: number;  // Margin bottom for short name container
  shortNameMarginLeft?: number;  // Margin left for short name container
  startEventDateTime: string;  // Start of Event (date and time)
  endEventDateTime: string;  // End of event (date and time)
  showStartEndEvent: boolean;  // Toggle to show/hide start and end event in card
  dayAndDate: string;  // Day and Date format: Days - dd.mm.yy
  dayAndDateShowName: boolean;  // Checkbox for name
  dayAndDateShowPhone: boolean;  // Checkbox for phone
  dayAndDateFontSize: number;  // Font size for day and date
  dayAndDateTextAlign: "left" | "center" | "right";  // Text alignment for day and date
  dayAndDateFontFamily: string;  // Font family for day and date
  dayAndDateFontColor?: string;  // Font color for day and date (supports gradient)
  showDayAndDate: boolean;  // Toggle to show/hide day and date in card
  venue: string;  // Place/hashtag/etc (venue)
  venueFontFamily: string;  // Font family for venue
  venueFontSize?: number;  // Font size for venue
  venueTextAlign?: "left" | "center" | "right";  // Text alignment for venue
  venueFontColor?: string;  // Font color for venue (supports gradient)

  // Page 3 - Invitation speech
  openingSpeech: string;  // Opening speech (Greeting with richtexteditor)
  openingSpeechFontFamily: string;  // Font family for opening speech
  openingSpeechMarginTop?: number;  // Margin top for opening speech container
  openingSpeechMarginRight?: number;  // Margin right for opening speech container
  openingSpeechMarginBottom?: number;  // Margin bottom for opening speech container
  openingSpeechMarginLeft?: number;  // Margin left for opening speech container
  numberOfOrganizers: "one" | "two" | "others";  // No. of Organizer (legacy, kept for backwards compatibility)
  organizerName1: string;  // Name of organizer 1 (legacy)
  organizerName2: string;  // Name of organizer 2 (legacy)
  organizerNames?: string[];  // Array of organizer names (new implementation)
  organizerNamesFontFamily: string;  // Font family for organizer names
  speechContent: string;  // Speech (multiline with richtexteditor)
  speechContentFontFamily: string;  // Font family for speech content
  speechContentMarginTop?: number;  // Margin top for speech content container
  speechContentMarginRight?: number;  // Margin right for speech content container
  speechContentMarginBottom?: number;  // Margin bottom for speech content container
  speechContentMarginLeft?: number;  // Margin left for speech content container

  // Page 4 - Location and Navigation
  section2DateTimeContent: string;  // Date and time content for section 2 (with richtexteditor)
  section2DateTimeFontFamily: string;  // Font family for section 2 date and time
  section2DateTimeMarginTop?: number;  // Margin top for section 2 date/time container
  section2DateTimeMarginRight?: number;  // Margin right for section 2 date/time container
  section2DateTimeMarginBottom?: number;  // Margin bottom for section 2 date/time container
  section2DateTimeMarginLeft?: number;  // Margin left for section 2 date/time container
  hijrahDate: string;  // Hijrah date (optional)
  hijrahDateFontFamily: string;  // Font family for hijrah date
  eventAddress: string;  // Event address (location full with richtexteditor)
  eventAddressFontFamily: string;  // Font family for event address
  eventAddressMarginTop?: number;  // Margin top for event address container
  eventAddressMarginRight?: number;  // Margin right for event address container
  eventAddressMarginBottom?: number;  // Margin bottom for event address container
  eventAddressMarginLeft?: number;  // Margin left for event address container
  navigationGoogleMap: string;  // Google map link (optional)
  navigationWaze: string;  // Waze link (optional)
  navigationOthers: string;  // Other navigation links (optional)

  // Page 5 - Tentative & More
  additionalInformation1: string;  // Additional information #1 (optional, textarea + richtexteditor)
  additionalInformation1FontFamily: string;  // Font family for additional information
  additionalInformation1MarginTop?: number;  // Margin top for additional information container
  additionalInformation1MarginRight?: number;  // Margin right for additional information container
  additionalInformation1MarginBottom?: number;  // Margin bottom for additional information container
  additionalInformation1MarginLeft?: number;  // Margin left for additional information container
  eventTentative: string;  // Event tentative (schedule Content)
  eventTentativeFontFamily: string;  // Font family for event tentative
  eventTentativeMarginTop?: number;  // Margin top for event tentative container
  eventTentativeMarginRight?: number;  // Margin right for event tentative container
  eventTentativeMarginBottom?: number;  // Margin bottom for event tentative container
  eventTentativeMarginLeft?: number;  // Margin left for event tentative container

  // Page 6 - Page In-Between
  bodyTextFontFamily: string;  // Body text font family
  bodyTextFontSize: number;  // Body text font size
  bodyTextFontColor: string;  // Body text font color
  titleTextFontFamily: string;  // Title text font family
  titleTextFontSize: number;  // Title text font size
  backgroundColor: string;  // Background Color
  sideMargin: number;  // Side margin (range input)
  uploadedFonts?: Array<{ name: string; url: string; fontFamily: string; format?: string }>;  // Uploaded font files

  // Page 7 - RSVP
  rsvpMode: "rsvp-speech" | "speech-only" | "thirdparty" | "none";  // RSVP Mode
  rsvpNotes: string;  // Notes (richtexteditor, optional)
  rsvpNotesMarginTop?: number;  // Margin top for RSVP notes container
  rsvpNotesMarginRight?: number;  // Margin right for RSVP notes container
  rsvpNotesMarginBottom?: number;  // Margin bottom for RSVP notes container
  rsvpNotesMarginLeft?: number;  // Margin left for RSVP notes container
  rsvpClosingDate: string;  // RSVP Closing Date (date and time)
  rsvpInputName: boolean;  // RSVP Input: Name checkbox
  rsvpInputPhone: boolean;  // RSVP Input: Phone checkbox
  rsvpInputEmail: boolean;  // RSVP Input: Email checkbox
  rsvpInputHomeAddress: boolean;  // RSVP Input: Home address checkbox
  rsvpInputCompanyName: boolean;  // RSVP Input: Company name checkbox
  rsvpInputPosition: boolean;  // RSVP Input: Position checkbox
  rsvpInputVehiclePlate: boolean;  // RSVP Input: Vehicle plate number checkbox
  rsvpInputNotes: boolean;  // RSVP Input: Notes checkbox
  rsvpInputSpeech: boolean;  // RSVP Input: Speech checkbox
  childrenAttendanceSeparation: boolean;  // Children attendance separation toggle

  // Page 8 - Contacts (uses existing contacts field)

  // Page 9 - Music and auto scroll
  musicPlaySeconds: number;  // Seconds of music will play
  showVideo: boolean;  // Show video checkbox
  autoplay: boolean;  // Autoplay checkbox

  // Page 10 - Final Segment
  showSegmentLocation: boolean;  // Show Segment: location
  showSegmentDate: boolean;  // Show Segment: date
  showSegmentTime: boolean;  // Show Segment: time
  showSegmentEndTime: boolean;  // Show Segment: end time
  showSegmentSaveDate: boolean;  // Show Segment: save date
  showSegmentEventTentative: boolean;  // Show Segment: event tentative
  showSegmentCountingDays: boolean;  // Show Segment: counting days
  showSegmentAttendance: boolean;  // Show Segment: attendance
  showSegmentSpeech: boolean;  // Show Segment: speech
  showSegmentConfirmAttendance: boolean;  // Show Segment: confirm attendance
  showSegmentWriteMessage: boolean;  // Show Segment: write a message

  // Page 11 - Button Settings
  // Save The Date button (Section 2)
  saveDateButtonText: string;
  saveDateButtonSize: number;  // Font size
  saveDateButtonPaddingX: number;  // Horizontal padding
  saveDateButtonPaddingY: number;  // Vertical padding
  saveDateButtonBorderRadius: number;
  saveDateButtonBackgroundColor: string;
  saveDateButtonFontFamily: string;
  saveDateButtonFontSize: number;
  saveDateButtonTextColor: string;
  saveDateButtonBoxShadow: string;

  // Sahkan Kehadiran button (Section 4)
  confirmAttendanceButtonText: string;
  confirmAttendanceButtonSize: number;
  confirmAttendanceButtonPaddingX: number;
  confirmAttendanceButtonPaddingY: number;
  confirmAttendanceButtonBorderRadius: number;
  confirmAttendanceButtonBackgroundColor: string;
  confirmAttendanceButtonFontFamily: string;
  confirmAttendanceButtonFontSize: number;
  confirmAttendanceButtonTextColor: string;
  confirmAttendanceButtonBoxShadow: string;

  // Tulis Ucapan Tahniah button (Section 4)
  writeMessageButtonText: string;
  writeMessageButtonSize: number;
  writeMessageButtonPaddingX: number;
  writeMessageButtonPaddingY: number;
  writeMessageButtonBorderRadius: number;
  writeMessageButtonBackgroundColor: string;
  writeMessageButtonFontFamily: string;
  writeMessageButtonFontSize: number;
  writeMessageButtonTextColor: string;
  writeMessageButtonBoxShadow: string;
  writeMessageButtonBorderColor: string;

  // Page 12 - Image Gallery Settings
  galleryImages: string[];  // Array of image URLs
  gallerySlidesPerView: number;  // How many images to show at once
  galleryAutoplay: boolean;  // Autoplay toggle
  galleryContainerWidth: "full" | "custom";  // Container width type
  galleryCustomWidth: number;  // Custom width (max width = main container)
  galleryEnablePagination: boolean;  // Enable pagination toggle
  galleryPaginationType: "dot" | "number" | "none";  // Pagination style
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

  // Page 1 - Main & Opening defaults
  cardLanguage: "english",
  packageChoice: "gold",
  designCode: "Design A",
  openingStyle: "swing",
  openingStyleColor: "#f43f5e",
  doorOpacity: 100,
  animationEffect: "none",
  animationEffectColor: "#f43f5e",
  doorButtonText: "",  // Default empty, will be rendered as eventTitle — Buka if empty
  doorButtonTextFontFamily: undefined,  // Default undefined uses component default
  doorButtonTextMarginTop: undefined,
  doorButtonTextMarginRight: undefined,
  doorButtonTextMarginBottom: undefined,
  doorButtonTextMarginLeft: undefined,
  doorButtonType: undefined,  // Default undefined means auto size based on content
  doorButtonPaddingX: 24,
  doorButtonPaddingY: 12,
  doorButtonMarginTop: 0,
  doorButtonMarginRight: 0,
  doorButtonMarginBottom: 0,
  doorButtonMarginLeft: 0,
  doorButtonBorderRadius: 9999,
  doorButtonWidth: undefined,  // Default undefined means auto width
  doorButtonBorderSize: 1,  // Default 1px border
  doorButtonBorderColor: undefined,  // Default undefined uses component default (rose-200)
  doorButtonBackgroundColor: undefined,  // Default undefined uses component default
  doorButtonBoxShadow: undefined,  // Default undefined means no box shadow
  doorButtonOpenTextColor: "#36463A",  // Default dark green color for "OPEN" text
  doorButtonAnimation: "none",  // Default no animation

  // Page 2 - Front Page defaults
  eventTitle: "Majlis Aqiqah",
  eventTitleFontSize: 24,
  eventTitleFontColor: "#f43f5e",
  eventTitleFontFamily: "",
  eventTitleMarginTop: undefined,
  eventTitleMarginRight: undefined,
  eventTitleMarginBottom: undefined,
  eventTitleMarginLeft: undefined,
  shortName: "Aqil",
  shortNameFamilyFont: "Arial",
  shortNameFontSize: 18,
  shortNameFontColor: "#f43f5e",
  shortNameMarginTop: undefined,
  shortNameMarginRight: undefined,
  shortNameMarginBottom: undefined,
  shortNameMarginLeft: undefined,
  startEventDateTime: "2025-10-29T11:00:00",
  endEventDateTime: "2025-10-29T15:00:00",
  showStartEndEvent: true,
  dayAndDate: "Rabu - 29.10.25",
  dayAndDateShowName: true,
  dayAndDateShowPhone: true,
  dayAndDateFontSize: 14,
  dayAndDateTextAlign: "center",
  dayAndDateFontFamily: "",
  dayAndDateFontColor: undefined,
  showDayAndDate: true,
  venue: "Dewan Seri Melati, Putrajaya",
  venueFontFamily: "",
  venueFontSize: undefined,
  venueTextAlign: undefined,
  venueFontColor: undefined,

  // Page 3 - Invitation speech defaults
  openingSpeech: "Assalamualaikum, hello & selamat sejahtera",
  openingSpeechFontFamily: "",
  openingSpeechMarginTop: 0,
  openingSpeechMarginRight: 0,
  openingSpeechMarginBottom: 0,
  openingSpeechMarginLeft: 0,
  numberOfOrganizers: "one",
  organizerName1: "",
  organizerName2: "",
  organizerNames: [""],
  organizerNamesFontFamily: "",
  speechContent: "Dengan penuh kesyukuran, kami mempersilakan...",
  speechContentFontFamily: "",
  speechContentMarginTop: 0,
  speechContentMarginRight: 0,
  speechContentMarginBottom: 0,
  speechContentMarginLeft: 0,

  // Page 4 - Location and Navigation defaults
  section2DateTimeContent: "",
  section2DateTimeFontFamily: "",
  section2DateTimeMarginTop: undefined,
  section2DateTimeMarginRight: undefined,
  section2DateTimeMarginBottom: undefined,
  section2DateTimeMarginLeft: undefined,
  hijrahDate: "",
  hijrahDateFontFamily: "",
  eventAddress: "Dewan Seri Melati, Putrajaya",
  eventAddressFontFamily: "",
  eventAddressMarginTop: undefined,
  eventAddressMarginRight: undefined,
  eventAddressMarginBottom: undefined,
  eventAddressMarginLeft: undefined,
  navigationGoogleMap: "",
  navigationWaze: "",
  navigationOthers: "",

  // Page 5 - Tentative & More defaults
  additionalInformation1: "",
  additionalInformation1FontFamily: "",
  eventTentative: "",
  eventTentativeFontFamily: "",

  // Page 6 - Page In-Between defaults
  bodyTextFontFamily: "Arial",
  bodyTextFontSize: 14,
  bodyTextFontColor: "#000000",
  titleTextFontFamily: "Arial",
  titleTextFontSize: 18,
  backgroundColor: "#ffffff",
  sideMargin: 20,
  uploadedFonts: [],

  // Page 7 - RSVP defaults
  rsvpMode: "rsvp-speech",
  rsvpNotes: "",
  rsvpNotesMarginTop: undefined,
  rsvpNotesMarginRight: undefined,
  rsvpNotesMarginBottom: undefined,
  rsvpNotesMarginLeft: undefined,
  rsvpClosingDate: "",
  rsvpInputName: true,
  rsvpInputPhone: true,
  rsvpInputEmail: false,
  rsvpInputHomeAddress: false,
  rsvpInputCompanyName: false,
  rsvpInputPosition: false,
  rsvpInputVehiclePlate: false,
  rsvpInputNotes: false,
  rsvpInputSpeech: false,
  childrenAttendanceSeparation: false,

  // Page 9 - Music and auto scroll defaults
  musicPlaySeconds: 30,
  showVideo: false,
  autoplay: false,

  // Page 10 - Final Segment defaults
  showSegmentLocation: true,
  showSegmentDate: true,
  showSegmentTime: true,
  showSegmentEndTime: true,
  showSegmentSaveDate: true,
  showSegmentEventTentative: true,
  showSegmentCountingDays: true,
  showSegmentAttendance: true,
  showSegmentSpeech: true,
  showSegmentConfirmAttendance: true,
  showSegmentWriteMessage: true,

  // Page 11 - Button Settings defaults
  saveDateButtonText: "Save The Date",
  saveDateButtonSize: 14,
  saveDateButtonPaddingX: 16,
  saveDateButtonPaddingY: 8,
  saveDateButtonBorderRadius: 9999,  // rounded-full
  saveDateButtonBackgroundColor: "#e11d48",  // rose-600
  saveDateButtonFontFamily: "",
  saveDateButtonFontSize: 14,
  saveDateButtonTextColor: "#ffffff",
  saveDateButtonBoxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",

  confirmAttendanceButtonText: "Sahkan Kehadiran",
  confirmAttendanceButtonSize: 14,
  confirmAttendanceButtonPaddingX: 16,
  confirmAttendanceButtonPaddingY: 8,
  confirmAttendanceButtonBorderRadius: 9999,
  confirmAttendanceButtonBackgroundColor: "#e11d48",  // rose-600
  confirmAttendanceButtonFontFamily: "",
  confirmAttendanceButtonFontSize: 14,
  confirmAttendanceButtonTextColor: "#ffffff",
  confirmAttendanceButtonBoxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",

  writeMessageButtonText: "Tulis Ucapan Tahniah",
  writeMessageButtonSize: 14,
  writeMessageButtonPaddingX: 16,
  writeMessageButtonPaddingY: 8,
  writeMessageButtonBorderRadius: 9999,
  writeMessageButtonBackgroundColor: "#ffffff",
  writeMessageButtonFontFamily: "",
  writeMessageButtonFontSize: 14,
  writeMessageButtonTextColor: "#be123c",  // rose-700
  writeMessageButtonBoxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
  writeMessageButtonBorderColor: "#fda4af",  // rose-300

  // Page 12 - Image Gallery defaults
  galleryImages: [],
  gallerySlidesPerView: 1,
  galleryAutoplay: false,
  galleryContainerWidth: "full",
  galleryCustomWidth: 300,
  galleryEnablePagination: true,
  galleryPaginationType: "dot",
};
