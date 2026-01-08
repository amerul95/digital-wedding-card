import { EventData } from "./types";
import { ThemeConfig, BackgroundStyle } from "@/components/creator/ThemeTypes";

interface CardContentProps {
  event: EventData;
  onCalendarClick: () => void;
  onRSVPClick: () => void;
  onUcapanClick: () => void;
  themeConfig?: ThemeConfig;
}

export function CardContent({
  event,
  onCalendarClick,
  onRSVPClick,
  onUcapanClick,
  themeConfig,
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
  return (
    <div className="absolute inset-0 overflow-y-auto scrollbar-hide pb-24 scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
      {/* Section 1 */}
      <section 
        id="card-sec-1" 
        className="min-h-full flex flex-col justify-center items-center text-center px-8 py-8 transition-all duration-300"
        style={getSectionBackgroundStyle(1)}
      >
        <div className="text-xs tracking-[0.3em] uppercase text-rose-400 mb-2">{event.uiTitlePrefix}</div>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-rose-700">{event.uiName}</h1>
        <p className="mt-3 text-sm md:text-base text-rose-900/70">{event.dateShort}</p>
        <p className="text-xs md:text-sm text-rose-900/60">{event.locationShort}</p>
      </section>

      {/* Section 2 */}
      <section 
        id="card-sec-2" 
        className="min-h-full flex flex-col justify-center items-center text-center px-8 py-8 transition-all duration-300"
        style={getSectionBackgroundStyle(2)}
      >
        <p className="text-rose-800 text-sm italic mb-2">{event.greeting}</p>
        <p className="text-rose-900/80 text-sm leading-relaxed max-w-[90%] mx-auto whitespace-pre-line">
          {event.speech}
        </p>
        <div className="mt-4 text-sm text-rose-700">
          <p>Tempat: {event.locationFull}</p>
          <p>Tarikh: {event.dateFull}</p>
          <p>Masa: {event.timeRange}</p>
        </div>
        <button
          className="mt-4 px-4 py-2 rounded-full bg-rose-600 text-white text-sm shadow hover:bg-rose-700"
          onClick={onCalendarClick}
        >
          Save The Date
        </button>
      </section>

      {/* Section 3 */}
      <section 
        id="card-sec-3" 
        className="min-h-full flex flex-col justify-center items-center text-center px-8 py-8 transition-all duration-300"
        style={getSectionBackgroundStyle(3)}
      >
        <h2 className="text-lg font-semibold mb-4 text-rose-700">
          {event.aturcaraTitleUseDefault ? "Aturcara Majlis" : event.aturcaraTitle}
        </h2>
        <div 
          className="text-sm text-rose-800 text-left max-w-[90%] [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-1 [&_strong]:font-semibold [&_em]:italic"
          dangerouslySetInnerHTML={{ __html: event.aturcaraHtml }}
        />
      </section>

      {/* Section 4 */}
      <section 
        id="card-sec-4" 
        className="min-h-full flex flex-col justify-center items-center text-center px-8 py-8 transition-all duration-300"
        style={getSectionBackgroundStyle(4)}
      >
        <h2 className="text-lg font-semibold text-rose-700 mb-2">Ucapan Tahniah</h2>
        {event.allowCongrats ? (
          <>
            <p className="text-sm text-rose-900/80 mb-4">Kongsikan ucapan tahniah anda atau sahkan kehadiran.</p>
            <div className="flex items-center justify-center gap-3">
              <button
                className="px-4 py-2 rounded-full bg-rose-600 text-white text-sm shadow hover:bg-rose-700"
                onClick={onRSVPClick}
              >
                Sahkan Kehadiran
              </button>
              <button
                className="px-4 py-2 rounded-full border border-rose-300 text-rose-700 bg-white text-sm shadow hover:bg-rose-50"
                onClick={onUcapanClick}
              >
                Tulis Ucapan Tahniah
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-rose-900/80 mb-4">{event.congratsNote}</p>
        )}
      </section>
    </div>
  );
}


