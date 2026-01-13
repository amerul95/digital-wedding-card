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
  showSegmentGallery: boolean;  // Show Segment: gallery

  // Page 14 - Counting Days Settings
  countingDaysTextAbove?: string;  // Text above counter (HTML from RichTextEditor)
  countingDaysTextAboveFontColor?: string;  // Font color for text above counter
  countingDaysTextMarginTop?: number;  // Margin top for text container
  countingDaysTextMarginRight?: number;  // Margin right for text container
  countingDaysTextMarginBottom?: number;  // Margin bottom for text container
  countingDaysTextMarginLeft?: number;  // Margin left for text container
  countingDaysTextBorderSize?: number;  // Border size for text container (px) - legacy
  countingDaysTextBorderTop?: number;  // Border top size for text container (px)
  countingDaysTextBorderRight?: number;  // Border right size for text container (px)
  countingDaysTextBorderBottom?: number;  // Border bottom size for text container (px)
  countingDaysTextBorderLeft?: number;  // Border left size for text container (px)
  countingDaysTextBorderRadius?: number;  // Border radius for text container (px)
  countingDaysCounterMarginTop?: number;  // Margin top for counter container
  countingDaysCounterMarginRight?: number;  // Margin right for counter container
  countingDaysCounterMarginBottom?: number;  // Margin bottom for counter container
  countingDaysCounterMarginLeft?: number;  // Margin left for counter container
  countingDaysCounterBorderSize?: number;  // Border size for counter container (px) - legacy
  countingDaysCounterBorderTop?: number;  // Border top size for counter container (px)
  countingDaysCounterBorderRight?: number;  // Border right size for counter container (px)
  countingDaysCounterBorderBottom?: number;  // Border bottom size for counter container (px)
  countingDaysCounterBorderLeft?: number;  // Border left size for counter container (px)
  countingDaysCounterBorderRadius?: number;  // Border radius for counter container (px)
  countingDaysColor?: string;  // Color for counter numbers and labels
  countingDaysFontSize?: number;  // Font size for counter numbers
  countingDaysSpacing?: number;  // Spacing between counter units (days, hours, minutes, seconds) in px

  // Page 15 - Attendance Settings
  attendanceText?: string;  // Attendance text/content (HTML from RichTextEditor)
  attendanceTextMarginTop?: number;  // Margin top for attendance text container
  attendanceTextMarginRight?: number;  // Margin right for attendance text container
  attendanceTextMarginBottom?: number;  // Margin bottom for attendance text container
  attendanceTextMarginLeft?: number;  // Margin left for attendance text container
  attendanceTextBorderTop?: number;  // Border top size for attendance text container (px)
  attendanceTextBorderRight?: number;  // Border right size for attendance text container (px)
  attendanceTextBorderBottom?: number;  // Border bottom size for attendance text container (px)
  attendanceTextBorderLeft?: number;  // Border left size for attendance text container (px)
  attendanceCounterMarginTop?: number;  // Margin top for attendance counter container
  attendanceCounterMarginRight?: number;  // Margin right for attendance counter container
  attendanceCounterMarginBottom?: number;  // Margin bottom for attendance counter container
  attendanceCounterMarginLeft?: number;  // Margin left for attendance counter container
  attendanceCounterBorderTop?: number;  // Border top size for attendance counter container (px)
  attendanceCounterBorderRight?: number;  // Border right size for attendance counter container (px)
  attendanceCounterBorderBottom?: number;  // Border bottom size for attendance counter container (px)
  attendanceCounterBorderLeft?: number;  // Border left size for attendance counter container (px)
  attendanceLabelFontSize?: number;  // Font size for attendance labels ("Attending", "Not Attending")
  attendanceLabelColor?: string;  // Color for attendance labels
  attendanceLabelFontFamily?: string;  // Font family for attendance labels
  attendanceNumberFontSize?: number;  // Font size for attendance numbers
  attendanceNumberColor?: string;  // Color for attendance numbers
  attendanceNumberFontFamily?: string;  // Font family for attendance numbers
  attendanceShowSeparator?: boolean;  // Show/hide separator between "Attending" and "Not Attending"

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

  // Page 13 - Body Card Settings
  cardPaddingTop?: number;  // Padding top inside card (px)
  cardPaddingRight?: number;  // Padding right inside card (px)
  cardPaddingBottom?: number;  // Padding bottom inside card (px)
  cardPaddingLeft?: number;  // Padding left inside card (px)

  // Page 16 - Congratulations Settings
  congratsTitleText?: string;  // "Ucapan Tahniah" title text (HTML from RichTextEditor)
  congratsTitleMarginTop?: number;  // Margin top for title container
  congratsTitleMarginRight?: number;  // Margin right for title container
  congratsTitleMarginBottom?: number;  // Margin bottom for title container
  congratsTitleMarginLeft?: number;  // Margin left for title container
  congratsTitleBorderTop?: number;  // Border top size for title container (px)
  congratsTitleBorderRight?: number;  // Border right size for title container (px)
  congratsTitleBorderBottom?: number;  // Border bottom size for title container (px)
  congratsTitleBorderLeft?: number;  // Border left size for title container (px)
  congratsMessages?: Array<{  // Array of congratulations messages
    id: string;
    speech: string;  // The congratulation speech
    author: string;  // Who gave the speech
  }>;
  congratsSpeechGap?: number;  // Gap between speech and author (px)
  congratsSpeechFontFamily?: string;  // Font family for speech text
  congratsSpeechFontColor?: string;  // Font color for speech text
  congratsSpeechFontWeight?: string;  // Font weight for speech text (e.g., "normal", "bold", "600")
  congratsSpeechFontSize?: number;  // Font size for speech text (px)
  congratsAuthorFontFamily?: string;  // Font family for author text
  congratsAuthorFontColor?: string;  // Font color for author text
  congratsAuthorFontWeight?: string;  // Font weight for author text
  congratsAuthorFontSize?: number;  // Font size for author text (px)
  congratsSectionMarginTop?: number;  // Margin top for congratulations section container
  congratsSectionMarginRight?: number;  // Margin right for congratulations section container
  congratsSectionMarginBottom?: number;  // Margin bottom for congratulations section container
  congratsSectionMarginLeft?: number;  // Margin left for congratulations section container
  congratsSectionBorderTop?: number;  // Border top size for congratulations section container (px)
  congratsSectionBorderRight?: number;  // Border right size for congratulations section container (px)
  congratsSectionBorderBottom?: number;  // Border bottom size for congratulations section container (px)
  congratsSectionBorderLeft?: number;  // Border left size for congratulations section container (px)
  congratsSectionWidth?: number;  // Width for congratulations messages container (px)
  congratsSectionHeight?: number;  // Height for congratulations messages container (px) - will auto-scroll if content exceeds
  showCongratsMessages?: boolean;  // Show/hide congratulations messages (designer preview only, always true for clients)
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
  showSegmentGallery: true,

  // Page 14 - Counting Days defaults
  countingDaysTextAbove: "",
  countingDaysTextAboveFontColor: undefined,
  countingDaysTextMarginTop: undefined,
  countingDaysTextMarginRight: undefined,
  countingDaysTextMarginBottom: undefined,
  countingDaysTextMarginLeft: undefined,
  countingDaysTextBorderSize: 0,  // Default no border (legacy)
  countingDaysTextBorderTop: 0,
  countingDaysTextBorderRight: 0,
  countingDaysTextBorderBottom: 0,
  countingDaysTextBorderLeft: 0,
  countingDaysTextBorderRadius: 0,  // Default no border radius
  countingDaysCounterMarginTop: undefined,
  countingDaysCounterMarginRight: undefined,
  countingDaysCounterMarginBottom: undefined,
  countingDaysCounterMarginLeft: undefined,
  countingDaysCounterBorderSize: 0,  // Default no border (legacy)
  countingDaysCounterBorderTop: 0,
  countingDaysCounterBorderRight: 0,
  countingDaysCounterBorderBottom: 0,
  countingDaysCounterBorderLeft: 0,
  countingDaysCounterBorderRadius: 0,  // Default no border radius
  countingDaysColor: "#be123c",  // rose-700 default
  countingDaysFontSize: 20,  // Default font size
  countingDaysSpacing: 8,  // Default spacing between units (px)

  // Page 15 - Attendance defaults
  attendanceText: "",  // Default empty attendance text
  attendanceTextMarginTop: undefined,
  attendanceTextMarginRight: undefined,
  attendanceTextMarginBottom: undefined,
  attendanceTextMarginLeft: undefined,
  attendanceTextBorderTop: 0,
  attendanceTextBorderRight: 0,
  attendanceTextBorderBottom: 0,
  attendanceTextBorderLeft: 0,
  attendanceCounterMarginTop: undefined,
  attendanceCounterMarginRight: undefined,
  attendanceCounterMarginBottom: undefined,
  attendanceCounterMarginLeft: undefined,
  attendanceCounterBorderTop: 0,
  attendanceCounterBorderRight: 0,
  attendanceCounterBorderBottom: 0,
  attendanceCounterBorderLeft: 0,
  attendanceLabelFontSize: 12,  // Default 12px for labels
  attendanceLabelColor: "#6b7280",  // Default gray-500
  attendanceLabelFontFamily: "",
  attendanceNumberFontSize: 24,  // Default 24px for numbers
  attendanceNumberColor: undefined,  // Will use green-600 for attending, red-600 for not attending if undefined
  attendanceNumberFontFamily: "",
  attendanceShowSeparator: true,  // Default show separator

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

  // Page 13 - Body Card defaults
  cardPaddingTop: 32,  // Default 32px (equivalent to px-8)
  cardPaddingRight: 32,  // Default 32px (equivalent to px-8)
  cardPaddingBottom: 32,  // Default 32px (equivalent to py-8)
  cardPaddingLeft: 32,  // Default 32px (equivalent to px-8)

  // Page 16 - Congratulations defaults
  congratsTitleText: "",  // Default empty, will use "Ucapan Tahniah" if empty
  congratsTitleMarginTop: undefined,
  congratsTitleMarginRight: undefined,
  congratsTitleMarginBottom: undefined,
  congratsTitleMarginLeft: undefined,
  congratsTitleBorderTop: 0,
  congratsTitleBorderRight: 0,
  congratsTitleBorderBottom: 0,
  congratsTitleBorderLeft: 0,
  congratsMessages: [
    { id: "1", speech: "Tahniah! Semoga berbahagia selalu.", author: "Ahmad bin Hassan" },
    { id: "2", speech: "Selamat atas majlis yang berlangsung dengan jayanya. Semoga keluarga sentiasa diberkati dan dikurniakan kebahagiaan yang berpanjangan. Doa kami sentiasa bersama anda.", author: "Siti Nurhaliza binti Abdul Rahman" },
    { id: "3", speech: "Dengan penuh rasa syukur dan kegembiraan, kami ingin mengucapkan tahniah yang tidak terhingga atas majlis yang sungguh bermakna ini. Semoga ikatan kasih sayang yang terjalin pada hari ini akan terus berkembang dan menjadi lebih kukuh dari masa ke semasa. Semoga kehidupan berkeluarga yang baru ini dipenuhi dengan kebahagiaan, kesabaran, dan saling memahami. Doa kami sentiasa mengiringi perjalanan hidup anda berdua. Semoga Allah SWT memberkati setiap langkah yang diambil dan memberikan rezeki yang melimpah ruah. Amin.", author: "Dato' Seri Dr. Mohd Zulkifli bin Abdullah" },
  ],  // Default mock messages: short, medium, long
  congratsSpeechGap: 8,  // Default 8px gap between speech and author
  congratsSpeechFontFamily: "",
  congratsSpeechFontColor: "#1f2937",  // Default gray-800
  congratsSpeechFontWeight: "normal",
  congratsSpeechFontSize: 14,
  congratsAuthorFontFamily: "",
  congratsAuthorFontColor: "#6b7280",  // Default gray-500
  congratsAuthorFontWeight: "normal",
  congratsAuthorFontSize: 12,
  congratsSectionMarginTop: undefined,
  congratsSectionMarginRight: undefined,
  congratsSectionMarginBottom: undefined,
  congratsSectionMarginLeft: undefined,
  congratsSectionBorderTop: 0,
  congratsSectionBorderRight: 0,
  congratsSectionBorderBottom: 0,
  congratsSectionBorderLeft: 0,
  congratsSectionWidth: undefined,  // Default undefined (full width)
  congratsSectionHeight: undefined,  // Default undefined (auto height)
  showCongratsMessages: true,  // Default show messages for designer preview
};
