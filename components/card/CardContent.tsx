import { EventData } from "./types";
import { ThemeConfig, BackgroundStyle } from "@/components/creator/ThemeTypes";
import { CountingDays } from "./CountingDays";
import { Attendance } from "./Attendance";

interface CardContentProps {
  event: EventData;
  onCalendarClick: () => void;
  onRSVPClick: () => void;
  onUcapanClick: () => void;
  themeConfig?: ThemeConfig;
  onSectionClick?: (sectionNumber: number) => void;
  isEditorMode?: boolean;
}

export function CardContent({
  event,
  onCalendarClick,
  onRSVPClick,
  onUcapanClick,
  themeConfig,
  onSectionClick,
  isEditorMode = false,
}: CardContentProps) {
  // Helper function to get section background style
  const getSectionBackgroundStyle = (sectionNumber: 1 | 2 | 3 | 4): React.CSSProperties => {
    if (!themeConfig) return {};
    
    const bgStyle: BackgroundStyle | undefined = 
      sectionNumber === 1 ? themeConfig.section1Background :
      sectionNumber === 2 ? themeConfig.section2Background :
      sectionNumber === 3 ? themeConfig.section3Background :
      themeConfig.section4Background;
    
    if (!bgStyle) return {};
    
    if (bgStyle.type === 'color') {
      return { backgroundColor: bgStyle.value };
    }
    if (bgStyle.type === 'image') {
      return {
        backgroundImage: `url(${bgStyle.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }
    if (bgStyle.type === 'gradient') {
      return { background: bgStyle.value };
    }
    return {};
  };

  // Format end time from endEventDateTime
  const formatEndTime = (dateTimeString: string): string => {
    if (!dateTimeString) return "";
    try {
      const date = new Date(dateTimeString);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const period = hours >= 12 ? "petang" : "pagi";
      const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
      return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    } catch {
      return "";
    }
  };

  // Determine if section 4 should be shown based on rsvpMode
  const shouldShowSection4 = event.rsvpMode !== "none";
  
  // Determine button visibility based on rsvpMode and showSegment flags
  // If RSVP + Speech is selected, show "Sahkan Kehadiran" button in section 4
  const shouldShowConfirmAttendance = event.rsvpMode === "rsvp-speech" && event.showSegmentConfirmAttendance;
  
  // Write message button: show only if writeMessage toggle is on AND speech toggle is on
  const shouldShowWriteMessage = event.showSegmentWriteMessage && event.showSegmentSpeech;

  return (
    <div className="absolute inset-0 overflow-y-auto scrollbar-hide pb-24 scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
      {/* Section 1 */}
      <section 
        id="card-sec-1" 
        className="min-h-full flex flex-col justify-center items-center text-center px-8 py-8 transition-all duration-300"
        style={getSectionBackgroundStyle(1)}
      >
        <div 
          className={`flex flex-col items-center ${isEditorMode && onSectionClick ? 'cursor-pointer hover:opacity-80 active:opacity-60 transition-opacity focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 rounded px-4 py-2' : ''}`}
          onClick={() => isEditorMode && onSectionClick && onSectionClick(2)}
          onKeyDown={(e) => {
            if (isEditorMode && onSectionClick && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onSectionClick(2);
            }
          }}
          tabIndex={isEditorMode && onSectionClick ? 0 : undefined}
        >
          <div 
            className="text-xs tracking-[0.3em] uppercase mb-2"
            style={{
              color: event.eventTitleFontColor && !event.eventTitleFontColor.startsWith('linear-gradient') 
                ? event.eventTitleFontColor 
                : '#f43f5e',
              background: event.eventTitleFontColor && event.eventTitleFontColor.startsWith('linear-gradient')
                ? event.eventTitleFontColor
                : undefined,
              WebkitBackgroundClip: event.eventTitleFontColor && event.eventTitleFontColor.startsWith('linear-gradient')
                ? 'text'
                : undefined,
              WebkitTextFillColor: event.eventTitleFontColor && event.eventTitleFontColor.startsWith('linear-gradient')
                ? 'transparent'
                : undefined,
              backgroundClip: event.eventTitleFontColor && event.eventTitleFontColor.startsWith('linear-gradient')
                ? 'text'
                : undefined,
            }}
          >
            {event.eventTitle || event.uiTitlePrefix}
          </div>
          <h1 
            className="font-serif text-4xl md:text-5xl lg:text-6xl"
            style={{
              fontFamily: event.shortNameFamilyFont || 'serif',
              fontSize: event.shortNameFontSize ? `${event.shortNameFontSize}px` : undefined,
              color: event.shortNameFontColor && !event.shortNameFontColor.startsWith('linear-gradient') 
                ? event.shortNameFontColor 
                : undefined,
              background: event.shortNameFontColor && event.shortNameFontColor.startsWith('linear-gradient')
                ? event.shortNameFontColor
                : undefined,
              WebkitBackgroundClip: event.shortNameFontColor && event.shortNameFontColor.startsWith('linear-gradient')
                ? 'text'
                : undefined,
              WebkitTextFillColor: event.shortNameFontColor && event.shortNameFontColor.startsWith('linear-gradient')
                ? 'transparent'
                : undefined,
              backgroundClip: event.shortNameFontColor && event.shortNameFontColor.startsWith('linear-gradient')
                ? 'text'
                : undefined,
            }}
          >
            {event.shortName || event.uiName}
          </h1>
          <p className="mt-3 text-sm md:text-base text-rose-900/70">
            {event.dateShort}
          </p>
          <p className="text-xs md:text-sm text-rose-900/60">
            {event.locationShort}
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section 
        id="card-sec-2" 
        className="min-h-full flex flex-col justify-center items-center text-center px-8 py-8 transition-all duration-300"
        style={getSectionBackgroundStyle(2)}
      >
        <div 
          className={`flex flex-col items-center ${isEditorMode && onSectionClick ? 'cursor-pointer hover:opacity-80 active:opacity-60 transition-opacity focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 rounded px-4 py-2' : ''}`}
          onClick={() => isEditorMode && onSectionClick && onSectionClick(3)}
          onKeyDown={(e) => {
            if (isEditorMode && onSectionClick && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onSectionClick(3);
            }
          }}
          tabIndex={isEditorMode && onSectionClick ? 0 : undefined}
        >
          <p className="text-rose-800 text-sm italic mb-2">{event.greeting}</p>
          <p className="text-rose-900/80 text-sm leading-relaxed max-w-[90%] mx-auto whitespace-pre-line">
            {event.speech}
          </p>
        </div>
        <div 
          className={`mt-4 text-sm text-rose-700 ${isEditorMode && onSectionClick ? 'cursor-pointer hover:opacity-80 active:opacity-60 transition-opacity focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 rounded px-4 py-2' : ''}`}
          onClick={() => isEditorMode && onSectionClick && onSectionClick(4)}
          onKeyDown={(e) => {
            if (isEditorMode && onSectionClick && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onSectionClick(4);
            }
          }}
          tabIndex={isEditorMode && onSectionClick ? 0 : undefined}
        >
          {event.showSegmentLocation && (
            <p>Tempat: {event.locationFull}</p>
          )}
          {event.showSegmentDate && (
            <p>Tarikh: {event.dateFull}</p>
          )}
          {event.showSegmentTime && (
            <p>Masa: {event.timeRange}</p>
          )}
          {event.showSegmentEndTime && event.endEventDateTime && (
            <p>Masa Tamat: {formatEndTime(event.endEventDateTime)}</p>
          )}
        </div>
        {event.showSegmentSaveDate && (
          <button
            className="mt-4 px-4 py-2 rounded-full bg-rose-600 text-white text-sm shadow hover:bg-rose-700"
            onClick={onCalendarClick}
          >
            Save The Date
          </button>
        )}
      </section>

      {/* Section 3 */}
      {event.showSegmentEventTentative && (
        <section 
          id="card-sec-3" 
          className="min-h-full flex flex-col justify-center items-center text-center px-8 py-8 transition-all duration-300"
          style={getSectionBackgroundStyle(3)}
        >
          <div 
            className={`flex flex-col items-center ${isEditorMode && onSectionClick ? 'cursor-pointer hover:opacity-80 active:opacity-60 transition-opacity focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 rounded px-4 py-2' : ''}`}
            onClick={() => isEditorMode && onSectionClick && onSectionClick(5)}
            onKeyDown={(e) => {
              if (isEditorMode && onSectionClick && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onSectionClick(5);
              }
            }}
            tabIndex={isEditorMode && onSectionClick ? 0 : undefined}
          >
            <h2 className="text-lg font-semibold mb-4 text-rose-700">
              {event.aturcaraTitleUseDefault ? "Aturcara Majlis" : event.aturcaraTitle}
            </h2>
            <div 
              className="text-sm text-rose-800 text-left max-w-[90%] [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-1 [&_strong]:font-semibold [&_em]:italic pointer-events-none"
              dangerouslySetInnerHTML={{ __html: event.aturcaraHtml }}
            />
          </div>
        </section>
      )}

      {/* Section 4 */}
      {shouldShowSection4 && (
        <section 
          id="card-sec-4" 
          className={`min-h-full flex flex-col justify-center items-center text-center px-8 py-8 transition-all duration-300 ${isEditorMode && onSectionClick ? 'cursor-pointer hover:opacity-95 active:opacity-90 focus:outline-2 focus:outline-blue-500 focus:outline-offset-2' : ''}`}
          style={getSectionBackgroundStyle(4)}
          onClick={() => isEditorMode && onSectionClick && onSectionClick(10)}
          onKeyDown={(e) => {
            if (isEditorMode && onSectionClick && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onSectionClick(10);
            }
          }}
          tabIndex={isEditorMode && onSectionClick ? 0 : undefined}
        >
          {/* Counting Days - Moved to top of section 4 */}
          {event.showSegmentCountingDays && event.startEventDateTime && (
            <div className="mb-6 pointer-events-none">
              <CountingDays targetDate={event.startEventDateTime} />
            </div>
          )}

          {/* Attendance - Moved to top of section 4 */}
          {event.showSegmentAttendance && (
            <div className="mb-6 pointer-events-none">
              <Attendance eventId={undefined} />
            </div>
          )}

          <h2 className="text-lg font-semibold text-rose-700 mb-2 pointer-events-none">Ucapan Tahniah</h2>
          {event.allowCongrats ? (
            <>
              <p className="text-sm text-rose-900/80 mb-4 pointer-events-none">Kongsikan ucapan tahniah anda atau sahkan kehadiran.</p>
              <div className="flex items-center justify-center gap-3 pointer-events-auto">
                {shouldShowConfirmAttendance && (
                  <button
                    className="px-4 py-2 rounded-full bg-rose-600 text-white text-sm shadow hover:bg-rose-700"
                    onClick={onRSVPClick}
                  >
                    Sahkan Kehadiran
                  </button>
                )}
                {shouldShowWriteMessage && (
                  <button
                    className="px-4 py-2 rounded-full border border-rose-300 text-rose-700 bg-white text-sm shadow hover:bg-rose-50"
                    onClick={onUcapanClick}
                  >
                    Tulis Ucapan Tahniah
                  </button>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-rose-900/80 mb-4 pointer-events-none">{event.congratsNote}</p>
          )}
        </section>
      )}
    </div>
  );
}


