import React, { useEffect, useRef, useState } from "react";
import { EventData } from "./types";
import { ThemeConfig, BackgroundStyle } from "@/components/creator/ThemeTypes";
import { CountingDays } from "./CountingDays";
import { Attendance } from "./Attendance";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

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
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'local'
      };
    }
    if (bgStyle.type === 'gradient') {
      return { background: bgStyle.value };
    }
    return {};
  };

  // Format date and time from dateTimeString
  const formatDateTime = (dateTimeString: string): string => {
    if (!dateTimeString) return "";
    try {
      const date = new Date(dateTimeString);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dayNum = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear().toString().slice(-2);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const period = hours >= 12 ? "petang" : "pagi";
      const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
      return `${day}, ${dayNum} ${month} ${year} - ${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    } catch {
      return "";
    }
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

  // Format date in Malay format: "29 Oktober 2025"
  const formatDateMalay = (dateTimeString: string): string => {
    if (!dateTimeString) return "";
    try {
      const date = new Date(dateTimeString);
      const day = date.getDate();
      const monthNames = [
        "Januari", "Februari", "Mac", "April", "Mei", "Jun",
        "Julai", "Ogos", "September", "Oktober", "November", "Disember"
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch {
      return "";
    }
  };

  // Format time range: "11:00 pagi - 3:00 petang"
  const formatTimeRange = (startDateTime: string, endDateTime: string): string => {
    if (!startDateTime) return "";
    try {
      const startDate = new Date(startDateTime);
      const startHours = startDate.getHours();
      const startMinutes = startDate.getMinutes();
      const startPeriod = startHours >= 12 ? "petang" : "pagi";
      const startDisplayHours = startHours > 12 ? startHours - 12 : startHours === 0 ? 12 : startHours;
      const startTime = `${startDisplayHours}:${startMinutes.toString().padStart(2, "0")} ${startPeriod}`;
      
      if (!endDateTime) return startTime;
      
      const endDate = new Date(endDateTime);
      const endHours = endDate.getHours();
      const endMinutes = endDate.getMinutes();
      const endPeriod = endHours >= 12 ? "petang" : "pagi";
      const endDisplayHours = endHours > 12 ? endHours - 12 : endHours === 0 ? 12 : endHours;
      const endTime = `${endDisplayHours}:${endMinutes.toString().padStart(2, "0")} ${endPeriod}`;
      
      return `${startTime} - ${endTime}`;
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

  // Image Gallery Component
  function ImageGallery({ event }: { event: EventData }) {
    const autoplayPlugin = useRef(
      Autoplay({
        delay: 3000,
        stopOnInteraction: true,
      })
    );
    
    const [api, setApi] = useState<any>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
      if (!api) return;

      setSelectedIndex(api.selectedScrollSnap());
      
      api.on("select", () => {
        setSelectedIndex(api.selectedScrollSnap());
      });
    }, [api]);

    // Disable autoplay if setting is off
    const plugins = event.galleryAutoplay ? [autoplayPlugin.current] : [];

    const isFullWidth = event.galleryContainerWidth === "full";
    
    const containerStyle: React.CSSProperties = {
      width: isFullWidth ? "calc(100% + 64px)" : `${Math.min(event.galleryCustomWidth || 300, 100)}%`,
      maxWidth: isFullWidth ? "none" : "100%",
      marginLeft: isFullWidth ? "-32px" : undefined,
      marginRight: isFullWidth ? "-32px" : undefined,
    };

    const slidesPerView = Math.max(1, event.gallerySlidesPerView || 1);
    const basisValue = 100 / slidesPerView;

    return (
      <div 
        className="mb-6 pointer-events-none w-full"
        style={containerStyle}
      >
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            slidesToScroll: 1,
          }}
          plugins={plugins}
          className="w-full"
        >
          <CarouselContent className={isFullWidth ? "ml-0" : "-ml-2 md:-ml-4"}>
            {event.galleryImages.map((image, index) => (
              <CarouselItem
                key={index}
                className={isFullWidth ? "pl-0" : "pl-2 md:pl-4"}
                style={{ flexBasis: `${basisValue}%` }}
              >
                <div className={`relative aspect-video overflow-hidden ${isFullWidth ? "rounded-none" : "rounded-lg"}`}>
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Pagination */}
        {event.galleryEnablePagination && event.galleryPaginationType !== "none" && (
          <div className="flex justify-center items-center gap-2 mt-4 pointer-events-none">
            {event.galleryPaginationType === "dot" ? (
              event.galleryImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === selectedIndex
                      ? "bg-rose-600 w-6"
                      : "bg-rose-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))
            ) : (
              <span className="text-xs text-gray-600">
                {selectedIndex + 1} / {event.galleryImages.length}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

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
              fontSize: event.eventTitleFontSize ? `${event.eventTitleFontSize}px` : undefined,
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
            dangerouslySetInnerHTML={{ 
              __html: event.eventTitle && event.eventTitle.includes('<') 
                ? event.eventTitle 
                : (event.eventTitle || event.uiTitlePrefix || '') 
            }}
          />
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
            dangerouslySetInnerHTML={{ 
              __html: event.shortName && event.shortName.includes('<') 
                ? event.shortName 
                : (event.shortName || event.uiName || '') 
            }}
          />

          {/* Day and Date */}
          {event.showDayAndDate && (
            <p 
              className="mt-3 text-sm md:text-base text-rose-900/70"
              style={{ 
                textAlign: event.dayAndDateTextAlign || "center",
                fontSize: event.dayAndDateFontSize ? `${event.dayAndDateFontSize}px` : undefined
              }}
            >
              {event.dayAndDate || event.dateShort}
            </p>
          )}
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
          style={{
            marginTop: event.openingSpeechMarginTop ? `${event.openingSpeechMarginTop}px` : undefined,
            marginRight: event.openingSpeechMarginRight ? `${event.openingSpeechMarginRight}px` : undefined,
            marginBottom: event.openingSpeechMarginBottom ? `${event.openingSpeechMarginBottom}px` : undefined,
            marginLeft: event.openingSpeechMarginLeft ? `${event.openingSpeechMarginLeft}px` : undefined,
          }}
        >
          {event.openingSpeech && (
            <div 
              className="text-rose-800 text-sm italic mb-2"
              dangerouslySetInnerHTML={{ __html: event.openingSpeech }}
            />
          )}
          {event.organizerNames && event.organizerNames.length > 0 && event.organizerNames.some(name => name.trim()) && (
            <div className="text-rose-900/80 text-sm mb-4">
              {event.organizerNames.filter(name => name.trim()).map((name, index) => (
                <p key={index}>{name}</p>
              ))}
            </div>
          )}
          {event.speechContent && (
            <div 
              className="text-rose-900/80 text-sm leading-relaxed max-w-[90%] mx-auto"
              style={{
                marginTop: event.speechContentMarginTop ? `${event.speechContentMarginTop}px` : undefined,
                marginRight: event.speechContentMarginRight ? `${event.speechContentMarginRight}px` : undefined,
                marginBottom: event.speechContentMarginBottom ? `${event.speechContentMarginBottom}px` : undefined,
                marginLeft: event.speechContentMarginLeft ? `${event.speechContentMarginLeft}px` : undefined,
              }}
              dangerouslySetInnerHTML={{ __html: event.speechContent }}
            />
          )}
          {/* Hijrah Date - under speech if set */}
          {event.hijrahDate && (
            <p className="mt-4 text-sm text-rose-700">
              {event.hijrahDate}
            </p>
          )}
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
          {event.showSegmentLocation && event.eventAddress && (
            <p><span dangerouslySetInnerHTML={{ __html: event.eventAddress }} /></p>
          )}
          {event.showStartEndEvent && event.section2DateTimeContent && (
            <div 
              className="text-sm text-rose-700"
              style={{
                fontFamily: event.section2DateTimeFontFamily || undefined,
              }}
              dangerouslySetInnerHTML={{ __html: event.section2DateTimeContent }}
            />
          )}
        </div>
        {event.showSegmentSaveDate && (
          <button
            className="mt-4 hover:opacity-90 transition-opacity"
            style={{
              padding: `${event.saveDateButtonPaddingY ?? 8}px ${event.saveDateButtonPaddingX ?? 16}px`,
              borderRadius: `${event.saveDateButtonBorderRadius ?? 9999}px`,
              backgroundColor: event.saveDateButtonBackgroundColor || "#e11d48",
              color: event.saveDateButtonTextColor || "#ffffff",
              fontFamily: event.saveDateButtonFontFamily || undefined,
              fontSize: `${event.saveDateButtonFontSize ?? 14}px`,
              boxShadow: event.saveDateButtonBoxShadow || "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
              border: "none",
              cursor: "pointer",
            }}
            onClick={onCalendarClick}
          >
            {event.saveDateButtonText || "Save The Date"}
          </button>
        )}
      </section>

      {/* Section 3 */}
      {event.showSegmentEventTentative && (event.additionalInformation1 || event.eventTentative) && (
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
            {/* Additional Information at top if content exists */}
            {event.additionalInformation1 && (
              <div
                className="text-sm text-rose-800 mb-4 max-w-[90%] [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-1 [&_strong]:font-semibold [&_em]:italic"
                dangerouslySetInnerHTML={{ __html: event.additionalInformation1 }}
              />
            )}
            {/* Event Tentative */}
            {event.eventTentative && (
              <div
                className="text-sm text-rose-800 text-left max-w-[90%] [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-1 [&_strong]:font-semibold [&_em]:italic"
                dangerouslySetInnerHTML={{ __html: event.eventTentative }}
              />
            )}
          </div>
        </section>
      )}

      {/* Section 4 */}
      {shouldShowSection4 && (
        <section 
          id="card-sec-4" 
          className="min-h-full flex flex-col justify-center items-center text-center px-8 py-8 transition-all duration-300"
          style={getSectionBackgroundStyle(4)}
        >
          <div 
            className={`flex flex-col items-center ${isEditorMode && onSectionClick ? 'cursor-pointer hover:opacity-80 active:opacity-60 transition-opacity focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 rounded px-4 py-2' : ''}`}
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

            {/* Image Gallery - Between countdown and attendance */}
            {event.galleryImages && event.galleryImages.length > 0 && (
              <ImageGallery event={event} />
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
                      className="hover:opacity-90 transition-opacity"
                      style={{
                        padding: `${event.confirmAttendanceButtonPaddingY ?? 8}px ${event.confirmAttendanceButtonPaddingX ?? 16}px`,
                        borderRadius: `${event.confirmAttendanceButtonBorderRadius ?? 9999}px`,
                        backgroundColor: event.confirmAttendanceButtonBackgroundColor || "#e11d48",
                        color: event.confirmAttendanceButtonTextColor || "#ffffff",
                        fontFamily: event.confirmAttendanceButtonFontFamily || undefined,
                        fontSize: `${event.confirmAttendanceButtonFontSize ?? 14}px`,
                        boxShadow: event.confirmAttendanceButtonBoxShadow || "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onClick={onRSVPClick}
                    >
                      {event.confirmAttendanceButtonText || "Sahkan Kehadiran"}
                    </button>
                  )}
                  {shouldShowWriteMessage && (
                    <button
                      className="hover:opacity-90 transition-opacity"
                      style={{
                        padding: `${event.writeMessageButtonPaddingY ?? 8}px ${event.writeMessageButtonPaddingX ?? 16}px`,
                        borderRadius: `${event.writeMessageButtonBorderRadius ?? 9999}px`,
                        backgroundColor: event.writeMessageButtonBackgroundColor || "#ffffff",
                        color: event.writeMessageButtonTextColor || "#be123c",
                        fontFamily: event.writeMessageButtonFontFamily || undefined,
                        fontSize: `${event.writeMessageButtonFontSize ?? 14}px`,
                        boxShadow: event.writeMessageButtonBoxShadow || "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
                        border: `1px solid ${event.writeMessageButtonBorderColor || "#fda4af"}`,
                        cursor: "pointer",
                      }}
                      onClick={onUcapanClick}
                    >
                      {event.writeMessageButtonText || "Tulis Ucapan Tahniah"}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm text-rose-900/80 mb-4 pointer-events-none">{event.congratsNote}</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}


