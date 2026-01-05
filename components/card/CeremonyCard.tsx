"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EventData, FormData, ModalView } from "./types";
import { downloadICS } from "./utils";
import { Modal } from "./Modal";
import {
  CalendarModal,
  ContactModal,
  LocationModal,
  RSVPModal,
} from "./ModalContent";
import { FormHadir, FormTidak, FormUcapan } from "./Forms";
import { CardContent } from "./CardContent";
import { Footer } from "./Footer";
import { useEvent } from "@/context/EventContext";
import { SwingDoor } from "./doorStyles/SwingDoor";
import { SlideDoors } from "./doorStyles/SlideDoors";
import { EnvelopeDoors } from "./doorStyles/EnvelopeDoors";
import Snow from "./effects/Snow";
import Petals from "./effects/PetalsFlow";
import Bubbles from "./effects/Bubbles";
import { YouTubePlayer } from "./YouTubePlayer";

interface CeremonyCardProps {
  event?: EventData;
  editorSection?: number;  // Current editor section (1-5), undefined means not in editor
}

export function CeremonyCard({ event: eventProp, editorSection }: CeremonyCardProps) {
  const { event: eventFromContext } = useEvent();
  const event = eventProp || eventFromContext;
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [showDoors, setShowDoors] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeVideoId = getYouTubeId(event.songUrl);
  const shouldShowPlayer = editorSection === undefined && youtubeVideoId && doorsOpen;

  console.log('🎵 CeremonyCard YouTube check:', {
    songUrl: event.songUrl,
    youtubeVideoId,
    editorSection,
    doorsOpen,
    shouldShowPlayer
  });

  // --------- Watch for doorStyle changes and reset doors ---------
  useEffect(() => {
    // When door style changes, close the doors so user can see the new animation
    // Note: doorColor changes are handled via React keys, no need to reset here
    setDoorsOpen(false);
    setShowDoors(true);
  }, [event.doorStyle]);

  // --------- Auto-open doors when not viewing Appearance section ---------
  useEffect(() => {
    if (editorSection !== undefined) {
      // In editor mode
      if (editorSection === 1) {
        // Section 1 (Appearance) - Keep doors closed for preview
        setDoorsOpen(false);
        setShowDoors(true);
      } else {
        // Other sections - Auto-open doors so user can see content
        setShowDoors(true);
        setDoorsOpen(false);
        // Open on next frame to trigger animation
        requestAnimationFrame(() => setDoorsOpen(true));
      }
    }
  }, [editorSection]);

  // --------- Auto scroll after doors open ---------
  useEffect(() => {
    console.log('🔄 Auto scroll effect triggered', { 
      doorsOpen, 
      editorSection, 
      scrollDelay: event.autoScrollDelay,
      hasContainer: !!scrollContainerRef.current 
    });

    if (!doorsOpen || !scrollContainerRef.current) {
      console.log('❌ Early return: doors not open or no container');
      return;
    }
    
    // Only auto scroll if not in editor mode or not in Section 1 (Appearance)
    const shouldAutoScroll = editorSection === undefined || editorSection !== 1;
    console.log('🎯 Should auto scroll?', shouldAutoScroll, { editorSection });
    if (!shouldAutoScroll) return;

    const scrollDelay = event.autoScrollDelay * 1000; // Convert to milliseconds
    console.log(`⏰ Starting auto scroll in ${event.autoScrollDelay} seconds`);
    
    const scrollTimer = setTimeout(() => {
      console.log('🚀 Auto scroll timer fired!');
      const wrapper = scrollContainerRef.current;
      if (!wrapper) {
        console.log('❌ No wrapper found');
        return;
      }

      // Find the actual scrollable container (overflow-y-auto div)
      const scrollableDiv = wrapper.querySelector('.overflow-y-auto') as HTMLElement;
      if (!scrollableDiv) {
        console.log('❌ No scrollable div found');
        return;
      }

      const maxScroll = scrollableDiv.scrollHeight - scrollableDiv.clientHeight;
      console.log('📏 Scroll dimensions:', { 
        scrollHeight: scrollableDiv.scrollHeight,
        clientHeight: scrollableDiv.clientHeight,
        maxScroll 
      });
      
      if (maxScroll <= 0) {
        console.log('❌ No scrollable content');
        return;
      }

      console.log('✅ Starting smooth scroll animation');
      // Calculate scroll duration (approximately 30 seconds for full scroll)
      const scrollDuration = 30000; // 30 seconds
      const startTime = performance.now();
      const startScroll = scrollableDiv.scrollTop;

      // Smooth continuous scroll animation
      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / scrollDuration, 1);
        
        // Ease-in-out function for smoother animation
        const easeProgress = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        const scrollTo = startScroll + (maxScroll * easeProgress);
        scrollableDiv.scrollTop = scrollTo;

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          console.log('✅ Scroll animation completed');
        }
      };

      requestAnimationFrame(animateScroll);
    }, scrollDelay);

    return () => {
      console.log('🧹 Cleaning up auto scroll timer');
      clearTimeout(scrollTimer);
    };
  }, [doorsOpen, event.autoScrollDelay, editorSection]);

  // --------- Door opening handlers ---------
  const openDoors = () => {
    // Ensure doors visible, then trigger animation on next frame
    setShowDoors(true);
    setDoorsOpen(false);
    requestAnimationFrame(() => setDoorsOpen(true));
  };

  const replay = () => {
    setDoorsOpen(false);
    setShowDoors(true);
    requestAnimationFrame(() => setDoorsOpen(true));
  };

  // --------- Modals / Forms state ---------
  const [modal, setModal] = useState<ModalView>("none");
  const [form, setForm] = useState<FormData>({
    nama: "",
    phone: "",
    jumlah: 1,
    ucapan: "",
  });
  const resetForm = () => setForm({ nama: "", phone: "", jumlah: 1, ucapan: "" });
  const closeModal = () => {
    setModal("none");
    resetForm();
  };
  const submit = (kind: ModalView) => {
    console.log("Submit:", kind, form);
    alert("Terima kasih! Maklum balas anda telah direkodkan.");
    closeModal();
  };

  const handleDownloadICS = () => {
    downloadICS(event);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div
        className="relative rounded-3xl shadow-2xl border bg-white"
        style={{
          aspectRatio: "420 / 945",
          width: "min(90vw, calc(90vh * 420 / 945))",
          borderColor: "#e5e7eb",
          perspective: 1200,
          transformStyle: "preserve-3d",
          overflow: "hidden",
        }}
      >
        {/* BACKGROUND */}
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50 via-white to-rose-100" />
        <div className="absolute inset-5 rounded-2xl border border-rose-200/70 shadow-inner" />
        
        {/* BACKGROUND EFFECTS - positioned to cover entire card */}
        <div className="absolute pointer-events-none" style={{ 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999 
        }}>
          {event.effect === "snow" && <Snow zIndex={9999} color={event.effectColor} />}
          {event.effect === "petals" && <Petals zIndex={9999} color={event.effectColor} />}
          {event.effect === "bubbles" && <Bubbles zIndex={9999} color={event.effectColor} />}
        </div>

        {/* SCROLLABLE CONTENT */}
        <div ref={scrollContainerRef} className="absolute inset-0">
          <CardContent
            event={event}
            onCalendarClick={() => setModal("calendar")}
            onRSVPClick={() => setModal("rsvp")}
            onUcapanClick={() => setModal("ucapan")}
          />
        </div>

        {/* FIXED FOOTER */}
        <Footer
          onCalendarClick={() => setModal("calendar")}
          onContactClick={() => setModal("contact")}
          onLocationClick={() => setModal("location")}
          onRSVPClick={() => setModal("rsvp")}
        />

        {/* DOOR OVERLAY (dynamic based on doorStyle) */}
        {event.doorStyle === "swing" && (
          <SwingDoor
            eventTitle={event.title}
            doorsOpen={doorsOpen}
            showDoors={showDoors}
            onOpen={openDoors}
            onReplay={replay}
            color={event.doorColor}
            showReplayButton={editorSection === undefined || editorSection === 1}
            onAnimationComplete={() => {
              if (doorsOpen) setShowDoors(false);
            }}
          />
        )}
        {event.doorStyle === "slide" && (
          <SlideDoors
            eventTitle={event.title}
            doorsOpen={doorsOpen}
            showDoors={showDoors}
            onOpen={openDoors}
            onReplay={replay}
            color={event.doorColor}
            showReplayButton={editorSection === undefined || editorSection === 1}
            onAnimationComplete={() => {
              if (doorsOpen) setShowDoors(false);
            }}
          />
        )}
        {event.doorStyle === "envelope" && (
          <EnvelopeDoors
            eventTitle={event.title}
            doorsOpen={doorsOpen}
            showDoors={showDoors}
            onOpen={openDoors}
            onReplay={replay}
            color={event.doorColor}
            showReplayButton={editorSection === undefined || editorSection === 1}
            onAnimationComplete={() => {
              if (doorsOpen) setShowDoors(false);
            }}
          />
        )}

        {/* MODALS */}
        <AnimatePresence>
          {modal !== "none" && (
            <Modal onClose={closeModal}>
              {/* Calendar Modal */}
              {modal === "calendar" && (
                <CalendarModal event={event} onDownloadICS={handleDownloadICS} />
              )}

              {/* Contact Modal */}
              {modal === "contact" && <ContactModal contacts={event.contacts} />}

              {/* Location Modal */}
              {modal === "location" && (
                <LocationModal locationFull={event.locationFull} mapQuery={event.mapQuery} />
              )}

              {/* RSVP choice */}
              {modal === "rsvp" && (
                <RSVPModal
                  onSelectHadir={() => setModal("hadir")}
                  onSelectTidak={() => setModal("tidak")}
                />
              )}

              {modal === "hadir" && (
                <FormHadir
                  form={form}
                  setForm={setForm}
                  onSubmit={() => submit("hadir")}
                  onCancel={closeModal}
                />
              )}

              {modal === "tidak" && (
                <FormTidak
                  form={form}
                  setForm={setForm}
                  onSubmit={() => submit("tidak")}
                  onCancel={closeModal}
                />
              )}

              {modal === "ucapan" && (
                <FormUcapan
                  form={form}
                  setForm={setForm}
                  onSubmit={() => submit("ucapan")}
                  onCancel={closeModal}
                />
              )}
            </Modal>
          )}
        </AnimatePresence>

        {/* YouTube Player - Only in preview mode */}
        {shouldShowPlayer && <YouTubePlayer videoId={youtubeVideoId} />}
      </div>
    </div>
  );
}


