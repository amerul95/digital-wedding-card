import React, { useEffect, useRef, useState, useCallback } from "react";
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
  // Helper function to get section background style - memoized to prevent infinite loops
  const getSectionBackgroundStyle = useCallback((sectionNumber: 1 | 2 | 3 | 4): React.CSSProperties => {
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
  }, [themeConfig]);

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

    const initialIndex = api.selectedScrollSnap();
    if (selectedIndex !== initialIndex) {
      setSelectedIndex(initialIndex);
    }
    
    // Set up event listener
    const onSelect = () => {
      const idx = api.selectedScrollSnap();
      setSelectedIndex((prev: number) => (prev === idx ? prev : idx));
    };
    
    api.on("select", onSelect);
    
    // Cleanup: remove event listener when component unmounts or api changes
    return () => {
      api.off("select", onSelect);
    };
  }, [api, selectedIndex]);

  // Disable autoplay if setting is off, memoized to prevent re-inits
  const plugins = React.useMemo(
    () => (event.galleryAutoplay ? [autoplayPlugin.current] : []),
    [event.galleryAutoplay]
  );

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
        className={`flex flex-col justify-center items-center text-center transition-all duration-300 ${themeConfig?.section1Height ? '' : 'min-h-full'}`}
        style={{
          ...getSectionBackgroundStyle(1),
          paddingTop: `${event.cardPaddingTop ?? 32}px`,
          paddingRight: `${event.cardPaddingRight ?? 32}px`,
          paddingBottom: `${event.cardPaddingBottom ?? 32}px`,
          paddingLeft: `${event.cardPaddingLeft ?? 32}px`,
          ...(themeConfig?.section1Height ? { height: `${themeConfig.section1Height}px` } : {}),
        }}
      >
        <div 
          className={`flex flex-col items-center w-full ${isEditorMode && onSectionClick ? 'cursor-pointer hover:opacity-80 active:opacity-60 transition-opacity focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 rounded px-4 py-2' : ''}`}
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
            className="w-full"
            style={{
              marginTop: event.eventTitleMarginTop ? `${event.eventTitleMarginTop}px` : undefined,
              marginRight: event.eventTitleMarginRight ? `${event.eventTitleMarginRight}px` : undefined,
              marginBottom: event.eventTitleMarginBottom ? `${event.eventTitleMarginBottom}px` : undefined,
              marginLeft: event.eventTitleMarginLeft ? `${event.eventTitleMarginLeft}px` : undefined,
            }}
          >
            <div 
              className="text-xs tracking-[0.3em] uppercase mb-2 w-full"
              style={{
                fontFamily: event.eventTitleFontFamily || undefined,
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
          </div>
          <div
            className="w-full"
            style={{
              marginTop: event.shortNameMarginTop ? `${event.shortNameMarginTop}px` : undefined,
              marginRight: event.shortNameMarginRight ? `${event.shortNameMarginRight}px` : undefined,
              marginBottom: event.shortNameMarginBottom ? `${event.shortNameMarginBottom}px` : undefined,
              marginLeft: event.shortNameMarginLeft ? `${event.shortNameMarginLeft}px` : undefined,
            }}
          >
            <h1 
              className="font-serif text-4xl md:text-5xl lg:text-6xl w-full"
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
          </div>

          {/* Day and Date */}
          {event.showDayAndDate && (
            <div className="w-full mt-3">
              <p 
                className="text-sm md:text-base w-full"
                style={{ 
                  textAlign: event.dayAndDateTextAlign || "center",
                  fontSize: event.dayAndDateFontSize ? `${event.dayAndDateFontSize}px` : undefined,
                  fontFamily: event.dayAndDateFontFamily || undefined,
                  color: event.dayAndDateFontColor && !event.dayAndDateFontColor.startsWith('linear-gradient') 
                    ? event.dayAndDateFontColor 
                    : '#be123c',
                  background: event.dayAndDateFontColor && event.dayAndDateFontColor.startsWith('linear-gradient')
                    ? event.dayAndDateFontColor
                    : undefined,
                  WebkitBackgroundClip: event.dayAndDateFontColor && event.dayAndDateFontColor.startsWith('linear-gradient')
                    ? 'text'
                    : undefined,
                  WebkitTextFillColor: event.dayAndDateFontColor && event.dayAndDateFontColor.startsWith('linear-gradient')
                    ? 'transparent'
                    : undefined,
                  backgroundClip: event.dayAndDateFontColor && event.dayAndDateFontColor.startsWith('linear-gradient')
                    ? 'text'
                    : undefined,
                }}
              >
                {event.dayAndDate || event.dateShort}
              </p>
            </div>
          )}
          <div className="w-full">
            <p 
              className="text-xs md:text-sm w-full"
              style={{ 
                textAlign: event.venueTextAlign || "center",
                fontSize: event.venueFontSize ? `${event.venueFontSize}px` : undefined,
                fontFamily: event.venueFontFamily || undefined,
                color: event.venueFontColor && !event.venueFontColor.startsWith('linear-gradient') 
                  ? event.venueFontColor 
                  : '#6b7280',
                background: event.venueFontColor && event.venueFontColor.startsWith('linear-gradient')
                  ? event.venueFontColor
                  : undefined,
                WebkitBackgroundClip: event.venueFontColor && event.venueFontColor.startsWith('linear-gradient')
                  ? 'text'
                  : undefined,
                WebkitTextFillColor: event.venueFontColor && event.venueFontColor.startsWith('linear-gradient')
                  ? 'transparent'
                  : undefined,
                backgroundClip: event.venueFontColor && event.venueFontColor.startsWith('linear-gradient')
                  ? 'text'
                  : undefined,
              }}
            >
              {event.venue}
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section
        id="card-sec-2"
        className={`flex flex-col justify-center items-center text-center transition-all duration-300 ${themeConfig?.section2Height ? '' : 'min-h-full'}`}
        style={{
          ...getSectionBackgroundStyle(2),
          paddingTop: `${event.cardPaddingTop ?? 32}px`,
          paddingRight: `${event.cardPaddingRight ?? 32}px`,
          paddingBottom: `${event.cardPaddingBottom ?? 32}px`,
          paddingLeft: `${event.cardPaddingLeft ?? 32}px`,
          ...(themeConfig?.section2Height ? { height: `${themeConfig.section2Height}px` } : {}),
        }}
      >
        <div 
          className={`flex flex-col items-center w-full ${isEditorMode && onSectionClick ? 'cursor-pointer hover:opacity-80 active:opacity-60 transition-opacity focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 rounded px-4 py-2' : ''}`}
          onClick={() => isEditorMode && onSectionClick && onSectionClick(3)}
          onKeyDown={(e) => {
            if (isEditorMode && onSectionClick && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onSectionClick(3);
            }
          }}
          tabIndex={isEditorMode && onSectionClick ? 0 : undefined}
        >
          {event.openingSpeech && (
            <div
              className="w-full"
              style={{
                marginTop: event.openingSpeechMarginTop ? `${event.openingSpeechMarginTop}px` : undefined,
                marginRight: event.openingSpeechMarginRight ? `${event.openingSpeechMarginRight}px` : undefined,
                marginBottom: event.openingSpeechMarginBottom ? `${event.openingSpeechMarginBottom}px` : undefined,
                marginLeft: event.openingSpeechMarginLeft ? `${event.openingSpeechMarginLeft}px` : undefined,
              }}
            >
              <div 
                className="text-rose-800 text-sm mb-2 w-full"
                dangerouslySetInnerHTML={{ __html: event.openingSpeech }}
              />
            </div>
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
              className="w-full"
              style={{
                marginTop: event.speechContentMarginTop ? `${event.speechContentMarginTop}px` : undefined,
                marginRight: event.speechContentMarginRight ? `${event.speechContentMarginRight}px` : undefined,
                marginBottom: event.speechContentMarginBottom ? `${event.speechContentMarginBottom}px` : undefined,
                marginLeft: event.speechContentMarginLeft ? `${event.speechContentMarginLeft}px` : undefined,
              }}
            >
              <div 
                className="text-rose-900/80 text-sm leading-relaxed w-full"
                dangerouslySetInnerHTML={{ __html: event.speechContent }}
              />
            </div>
          )}
          {/* Hijrah Date - under speech if set */}
          {event.hijrahDate && (
            <p className="mt-4 text-sm text-rose-700">
              {event.hijrahDate}
            </p>
          )}
        </div>
        <div 
          className={`mt-4 text-sm text-rose-700 w-full ${isEditorMode && onSectionClick ? 'cursor-pointer hover:opacity-80 active:opacity-60 transition-opacity focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 rounded px-4 py-2' : ''}`}
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
            <div
              className="w-full"
              style={{
                marginTop: event.eventAddressMarginTop ? `${event.eventAddressMarginTop}px` : undefined,
                marginRight: event.eventAddressMarginRight ? `${event.eventAddressMarginRight}px` : undefined,
                marginBottom: event.eventAddressMarginBottom ? `${event.eventAddressMarginBottom}px` : undefined,
                marginLeft: event.eventAddressMarginLeft ? `${event.eventAddressMarginLeft}px` : undefined,
              }}
            >
              <p className="w-full break-words"><span className="w-full" dangerouslySetInnerHTML={{ __html: event.eventAddress }} /></p>
            </div>
          )}
          {event.showStartEndEvent && event.section2DateTimeContent && (
            <div
              className="w-full"
              style={{
                marginTop: event.section2DateTimeMarginTop ? `${event.section2DateTimeMarginTop}px` : undefined,
                marginRight: event.section2DateTimeMarginRight ? `${event.section2DateTimeMarginRight}px` : undefined,
                marginBottom: event.section2DateTimeMarginBottom ? `${event.section2DateTimeMarginBottom}px` : undefined,
                marginLeft: event.section2DateTimeMarginLeft ? `${event.section2DateTimeMarginLeft}px` : undefined,
              }}
            >
              <div 
                className="text-sm text-rose-700 w-full break-words"
                style={{
                  fontFamily: event.section2DateTimeFontFamily || undefined,
                }}
                dangerouslySetInnerHTML={{ __html: event.section2DateTimeContent }}
              />
            </div>
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
          className={`flex flex-col justify-center items-center text-center transition-all duration-300 ${themeConfig?.section3Height ? '' : 'min-h-full'}`}
          style={{
            ...getSectionBackgroundStyle(3),
            paddingTop: `${event.cardPaddingTop ?? 32}px`,
            paddingRight: `${event.cardPaddingRight ?? 32}px`,
            paddingBottom: `${event.cardPaddingBottom ?? 32}px`,
            paddingLeft: `${event.cardPaddingLeft ?? 32}px`,
            ...(themeConfig?.section3Height ? { height: `${themeConfig.section3Height}px` } : {}),
          }}
        >
          <div
            className={`flex flex-col items-center w-full ${isEditorMode && onSectionClick ? 'cursor-pointer hover:opacity-80 active:opacity-60 transition-opacity focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 rounded px-4 py-2' : ''}`}
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
                className="w-full"
                style={{
                  marginTop: event.additionalInformation1MarginTop ? `${event.additionalInformation1MarginTop}px` : undefined,
                  marginRight: event.additionalInformation1MarginRight ? `${event.additionalInformation1MarginRight}px` : undefined,
                  marginBottom: event.additionalInformation1MarginBottom ? `${event.additionalInformation1MarginBottom}px` : undefined,
                  marginLeft: event.additionalInformation1MarginLeft ? `${event.additionalInformation1MarginLeft}px` : undefined,
                }}
              >
                <div
                  className="text-sm text-rose-800 mb-4 w-full [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-1 [&_strong]:font-semibold [&_em]:italic"
                  dangerouslySetInnerHTML={{ __html: event.additionalInformation1 }}
                />
              </div>
            )}
            {/* Event Tentative */}
            {event.eventTentative && (
              <div
                className="w-full"
                style={{
                  marginTop: event.eventTentativeMarginTop ? `${event.eventTentativeMarginTop}px` : undefined,
                  marginRight: event.eventTentativeMarginRight ? `${event.eventTentativeMarginRight}px` : undefined,
                  marginBottom: event.eventTentativeMarginBottom ? `${event.eventTentativeMarginBottom}px` : undefined,
                  marginLeft: event.eventTentativeMarginLeft ? `${event.eventTentativeMarginLeft}px` : undefined,
                }}
              >
                <div
                  className="text-sm text-rose-800 w-full [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-1 [&_strong]:font-semibold [&_em]:italic"
                  dangerouslySetInnerHTML={{ __html: event.eventTentative }}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Section 4 */}
      {shouldShowSection4 && (
        <section
          id="card-sec-4"
          className={`flex flex-col justify-center items-center text-center transition-all duration-300 ${themeConfig?.section4Height ? '' : 'min-h-full'}`}
          style={{
            ...getSectionBackgroundStyle(4),
            paddingTop: `${event.cardPaddingTop ?? 32}px`,
            paddingRight: `${event.cardPaddingRight ?? 32}px`,
            paddingBottom: `${event.cardPaddingBottom ?? 32}px`,
            paddingLeft: `${event.cardPaddingLeft ?? 32}px`,
            ...(themeConfig?.section4Height ? { height: `${themeConfig.section4Height}px` } : {}),
          }}
        >
          <div 
            className={`flex flex-col items-center w-full ${isEditorMode && onSectionClick ? 'cursor-pointer hover:opacity-80 active:opacity-60 transition-opacity focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 rounded px-4 py-2' : ''}`}
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
              <div className="mb-6 pointer-events-none w-full">
                {/* Text Above Counter Container */}
                {event.countingDaysTextAbove && (
                  <div 
                    className="w-full"
                    style={{
                      marginTop: event.countingDaysTextMarginTop ? `${event.countingDaysTextMarginTop}px` : undefined,
                      marginRight: event.countingDaysTextMarginRight ? `${event.countingDaysTextMarginRight}px` : undefined,
                      marginBottom: event.countingDaysTextMarginBottom ? `${event.countingDaysTextMarginBottom}px` : undefined,
                      marginLeft: event.countingDaysTextMarginLeft ? `${event.countingDaysTextMarginLeft}px` : undefined,
                      borderTopWidth: (event.countingDaysTextBorderTop ?? event.countingDaysTextBorderSize) ? `${event.countingDaysTextBorderTop ?? event.countingDaysTextBorderSize}px` : undefined,
                      borderRightWidth: (event.countingDaysTextBorderRight ?? event.countingDaysTextBorderSize) ? `${event.countingDaysTextBorderRight ?? event.countingDaysTextBorderSize}px` : undefined,
                      borderBottomWidth: (event.countingDaysTextBorderBottom ?? event.countingDaysTextBorderSize) ? `${event.countingDaysTextBorderBottom ?? event.countingDaysTextBorderSize}px` : undefined,
                      borderLeftWidth: (event.countingDaysTextBorderLeft ?? event.countingDaysTextBorderSize) ? `${event.countingDaysTextBorderLeft ?? event.countingDaysTextBorderSize}px` : undefined,
                      borderStyle: [
                        event.countingDaysTextBorderTop ?? event.countingDaysTextBorderSize,
                        event.countingDaysTextBorderRight ?? event.countingDaysTextBorderSize,
                        event.countingDaysTextBorderBottom ?? event.countingDaysTextBorderSize,
                        event.countingDaysTextBorderLeft ?? event.countingDaysTextBorderSize,
                      ].some((v) => !!v) ? 'solid' : undefined,
                      borderColor: [
                        event.countingDaysTextBorderTop ?? event.countingDaysTextBorderSize,
                        event.countingDaysTextBorderRight ?? event.countingDaysTextBorderSize,
                        event.countingDaysTextBorderBottom ?? event.countingDaysTextBorderSize,
                        event.countingDaysTextBorderLeft ?? event.countingDaysTextBorderSize,
                      ].some((v) => !!v) ? '#e5e7eb' : undefined,
                      borderRadius: event.countingDaysTextBorderRadius ? `${event.countingDaysTextBorderRadius}px` : undefined,
                      color: event.countingDaysTextAboveFontColor && !event.countingDaysTextAboveFontColor.startsWith('linear-gradient') 
                        ? event.countingDaysTextAboveFontColor 
                        : undefined,
                      background: event.countingDaysTextAboveFontColor && event.countingDaysTextAboveFontColor.startsWith('linear-gradient')
                        ? event.countingDaysTextAboveFontColor
                        : undefined,
                      WebkitBackgroundClip: event.countingDaysTextAboveFontColor && event.countingDaysTextAboveFontColor.startsWith('linear-gradient')
                        ? 'text'
                        : undefined,
                      WebkitTextFillColor: event.countingDaysTextAboveFontColor && event.countingDaysTextAboveFontColor.startsWith('linear-gradient')
                        ? 'transparent'
                        : undefined,
                      backgroundClip: event.countingDaysTextAboveFontColor && event.countingDaysTextAboveFontColor.startsWith('linear-gradient')
                        ? 'text'
                        : undefined,
                    }}
                    dangerouslySetInnerHTML={{ __html: event.countingDaysTextAbove }}
                  />
                )}
                {/* Counter Container */}
                <div
                  style={{
                    marginTop: event.countingDaysCounterMarginTop ? `${event.countingDaysCounterMarginTop}px` : undefined,
                    marginRight: event.countingDaysCounterMarginRight ? `${event.countingDaysCounterMarginRight}px` : undefined,
                    marginBottom: event.countingDaysCounterMarginBottom ? `${event.countingDaysCounterMarginBottom}px` : undefined,
                    marginLeft: event.countingDaysCounterMarginLeft ? `${event.countingDaysCounterMarginLeft}px` : undefined,
                    borderTopWidth: (event.countingDaysCounterBorderTop ?? event.countingDaysCounterBorderSize) ? `${event.countingDaysCounterBorderTop ?? event.countingDaysCounterBorderSize}px` : undefined,
                    borderRightWidth: (event.countingDaysCounterBorderRight ?? event.countingDaysCounterBorderSize) ? `${event.countingDaysCounterBorderRight ?? event.countingDaysCounterBorderSize}px` : undefined,
                    borderBottomWidth: (event.countingDaysCounterBorderBottom ?? event.countingDaysCounterBorderSize) ? `${event.countingDaysCounterBorderBottom ?? event.countingDaysCounterBorderSize}px` : undefined,
                    borderLeftWidth: (event.countingDaysCounterBorderLeft ?? event.countingDaysCounterBorderSize) ? `${event.countingDaysCounterBorderLeft ?? event.countingDaysCounterBorderSize}px` : undefined,
                    borderStyle: [
                      event.countingDaysCounterBorderTop ?? event.countingDaysCounterBorderSize,
                      event.countingDaysCounterBorderRight ?? event.countingDaysCounterBorderSize,
                      event.countingDaysCounterBorderBottom ?? event.countingDaysCounterBorderSize,
                      event.countingDaysCounterBorderLeft ?? event.countingDaysCounterBorderSize,
                    ].some((v) => !!v) ? 'solid' : undefined,
                    borderColor: [
                      event.countingDaysCounterBorderTop ?? event.countingDaysCounterBorderSize,
                      event.countingDaysCounterBorderRight ?? event.countingDaysCounterBorderSize,
                      event.countingDaysCounterBorderBottom ?? event.countingDaysCounterBorderSize,
                      event.countingDaysCounterBorderLeft ?? event.countingDaysCounterBorderSize,
                    ].some((v) => !!v) ? '#e5e7eb' : undefined,
                    borderRadius: event.countingDaysCounterBorderRadius ? `${event.countingDaysCounterBorderRadius}px` : undefined,
                  }}
                >
                  <CountingDays 
                    targetDate={event.startEventDateTime}
                    color={event.countingDaysColor}
                    fontSize={event.countingDaysFontSize}
                    spacing={event.countingDaysSpacing}
                  />
                </div>
              </div>
            )}

            {/* Image Gallery - Between countdown and attendance */}
            {event.showSegmentGallery && event.galleryImages && event.galleryImages.length > 0 && (
              <ImageGallery event={event} />
            )}

            {/* Attendance - Moved to top of section 4 */}
            {event.showSegmentAttendance && (
              <div className="mb-6 pointer-events-none w-full">
                {/* Attendance Text Container */}
                {event.attendanceText && (
                  <div 
                    className="w-full mb-4"
                    style={{
                      marginTop: event.attendanceTextMarginTop ? `${event.attendanceTextMarginTop}px` : undefined,
                      marginRight: event.attendanceTextMarginRight ? `${event.attendanceTextMarginRight}px` : undefined,
                      marginBottom: event.attendanceTextMarginBottom ? `${event.attendanceTextMarginBottom}px` : undefined,
                      marginLeft: event.attendanceTextMarginLeft ? `${event.attendanceTextMarginLeft}px` : undefined,
                      borderTopWidth: event.attendanceTextBorderTop ? `${event.attendanceTextBorderTop}px` : undefined,
                      borderRightWidth: event.attendanceTextBorderRight ? `${event.attendanceTextBorderRight}px` : undefined,
                      borderBottomWidth: event.attendanceTextBorderBottom ? `${event.attendanceTextBorderBottom}px` : undefined,
                      borderLeftWidth: event.attendanceTextBorderLeft ? `${event.attendanceTextBorderLeft}px` : undefined,
                      borderStyle: [
                        event.attendanceTextBorderTop,
                        event.attendanceTextBorderRight,
                        event.attendanceTextBorderBottom,
                        event.attendanceTextBorderLeft,
                      ].some((v) => !!v) ? 'solid' : undefined,
                      borderColor: [
                        event.attendanceTextBorderTop,
                        event.attendanceTextBorderRight,
                        event.attendanceTextBorderBottom,
                        event.attendanceTextBorderLeft,
                      ].some((v) => !!v) ? '#e5e7eb' : undefined,
                    }}
                    dangerouslySetInnerHTML={{ __html: event.attendanceText }}
                  />
                )}
                {/* Attendance Counter */}
                <Attendance eventId={undefined} event={event} />
              </div>
            )}

            {/* Congratulations Title */}
            {(event.congratsTitleText || !event.allowCongrats) && (
              <div
                className="w-full mb-4"
                style={{
                  marginTop: event.congratsTitleMarginTop ? `${event.congratsTitleMarginTop}px` : undefined,
                  marginRight: event.congratsTitleMarginRight ? `${event.congratsTitleMarginRight}px` : undefined,
                  marginBottom: event.congratsTitleMarginBottom ? `${event.congratsTitleMarginBottom}px` : undefined,
                  marginLeft: event.congratsTitleMarginLeft ? `${event.congratsTitleMarginLeft}px` : undefined,
                  borderTopWidth: event.congratsTitleBorderTop ? `${event.congratsTitleBorderTop}px` : undefined,
                  borderRightWidth: event.congratsTitleBorderRight ? `${event.congratsTitleBorderRight}px` : undefined,
                  borderBottomWidth: event.congratsTitleBorderBottom ? `${event.congratsTitleBorderBottom}px` : undefined,
                  borderLeftWidth: event.congratsTitleBorderLeft ? `${event.congratsTitleBorderLeft}px` : undefined,
                  borderStyle: [
                    event.congratsTitleBorderTop,
                    event.congratsTitleBorderRight,
                    event.congratsTitleBorderBottom,
                    event.congratsTitleBorderLeft,
                  ].some((v) => !!v) ? 'solid' : undefined,
                  borderColor: [
                    event.congratsTitleBorderTop,
                    event.congratsTitleBorderRight,
                    event.congratsTitleBorderBottom,
                    event.congratsTitleBorderLeft,
                  ].some((v) => !!v) ? '#e5e7eb' : undefined,
                }}
              >
                {event.congratsTitleText ? (
                  <div dangerouslySetInnerHTML={{ __html: event.congratsTitleText }} />
                ) : (
                  <h2 className="text-lg font-semibold text-rose-700 mb-2 pointer-events-none">Ucapan Tahniah</h2>
                )}
              </div>
            )}

            {event.allowCongrats ? (
              <>
                {/* Congratulations Messages Section */}
                {/* Show messages if: not in editor mode (client view) OR in editor mode and toggle is enabled */}
                {event.congratsMessages && event.congratsMessages.length > 0 && (!isEditorMode || event.showCongratsMessages !== false) && (
                  <div
                    className="mb-4"
                    style={{
                      width: event.congratsSectionWidth ? `${event.congratsSectionWidth}px` : '100%',
                      height: event.congratsSectionHeight ? `${event.congratsSectionHeight}px` : undefined,
                      overflowY: event.congratsSectionHeight ? 'auto' : undefined,
                      overflowX: 'hidden',
                      marginTop: event.congratsSectionMarginTop ? `${event.congratsSectionMarginTop}px` : undefined,
                      marginRight: event.congratsSectionMarginRight ? `${event.congratsSectionMarginRight}px` : undefined,
                      marginBottom: event.congratsSectionMarginBottom ? `${event.congratsSectionMarginBottom}px` : undefined,
                      marginLeft: event.congratsSectionMarginLeft ? `${event.congratsSectionMarginLeft}px` : undefined,
                      borderTopWidth: event.congratsSectionBorderTop ? `${event.congratsSectionBorderTop}px` : undefined,
                      borderRightWidth: event.congratsSectionBorderRight ? `${event.congratsSectionBorderRight}px` : undefined,
                      borderBottomWidth: event.congratsSectionBorderBottom ? `${event.congratsSectionBorderBottom}px` : undefined,
                      borderLeftWidth: event.congratsSectionBorderLeft ? `${event.congratsSectionBorderLeft}px` : undefined,
                      borderStyle: [
                        event.congratsSectionBorderTop,
                        event.congratsSectionBorderRight,
                        event.congratsSectionBorderBottom,
                        event.congratsSectionBorderLeft,
                      ].some((v) => !!v) ? 'solid' : undefined,
                      borderColor: [
                        event.congratsSectionBorderTop,
                        event.congratsSectionBorderRight,
                        event.congratsSectionBorderBottom,
                        event.congratsSectionBorderLeft,
                      ].some((v) => !!v) ? '#e5e7eb' : undefined,
                    }}
                  >
                    <div className="space-y-4">
                      {event.congratsMessages.map((message) => (
                        <div key={message.id} className="w-full">
                          {/* Speech with quotes */}
                          <div
                            style={{
                              fontFamily: event.congratsSpeechFontFamily || undefined,
                              color: event.congratsSpeechFontColor || "#1f2937",
                              fontWeight: event.congratsSpeechFontWeight || "normal",
                              fontSize: `${event.congratsSpeechFontSize ?? 14}px`,
                            }}
                          >
                            &ldquo;{message.speech}&rdquo;
                          </div>
                          {/* Author */}
                          <div
                            style={{
                              marginTop: `${event.congratsSpeechGap ?? 8}px`,
                              fontFamily: event.congratsAuthorFontFamily || undefined,
                              color: event.congratsAuthorFontColor || "#6b7280",
                              fontWeight: event.congratsAuthorFontWeight || "normal",
                              fontSize: `${event.congratsAuthorFontSize ?? 12}px`,
                            }}
                          >
                            — {message.author}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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


