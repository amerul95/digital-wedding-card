"use client";

import { useEffect, useState, useRef } from "react";
import { useEditorStore } from "@/components/editor/store";
import { NodeRenderer } from "@/components/editor/NodeRenderer";
import { BottomNavBar } from "@/components/editor/canvas/BottomNavBar";
import { SectionNavigator } from "@/components/editor/canvas/SectionNavigator";
import { PreviewProvider } from "@/components/editor/context/PreviewContext";
import { VideoPlayerProvider, useVideoPlayer } from "@/components/editor/context/VideoPlayerContext";

export default function PreviewPage() {
  const [loading, setLoading] = useState(true);
  const rootId = useEditorStore((state) => state.rootId);

  // We need to hydrate the store from localStorage on mount
  useEffect(() => {
    const loadPreview = () => {
      try {
        const data = localStorage.getItem("wedding-card-preview-data");
        if (data) {
          const parsed = JSON.parse(data);

          // Manually hydrate the store
          // We can't use store.setState directly because of immer middleware potentially?
          // actually zustand store.setState works fine.
          useEditorStore.setState({
            nodes: parsed.nodes,
            rootId: parsed.rootId || 'root',
            selectedId: null, // Clear selection in preview
            globalSettings: parsed.globalSettings || useEditorStore.getState().globalSettings, // Load globalSettings (background music/video)
            viewOptions: parsed.viewOptions || useEditorStore.getState().viewOptions // Load viewOptions
          });
        }
      } catch (e) {
        console.error("Failed to load preview data", e);
      } finally {
        setLoading(false);
      }
    };

    loadPreview();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-500">Loading Preview...</div>;
  }

  // Since TopBar sets rootId in localStorage, but if defaults are different
  // we use the store hook after hydration

  // In preview, we want to simulate the mobile view 
  // But since it's a web page, we just render full width
  // The "Mobile Frame" is a design-time aid. The actual card is responsive.
  // However, usually these cards are strictly mobile-width centered on desktop.

  // Let's implement the standard "Central Column" layout for desktop views

  return (
    <PreviewProvider isPreview={true}>
      <VideoPlayerProvider>
        <div className="min-h-screen bg-gray-100 flex justify-center">
          <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative">
            {/* Render Root */}
            <PreviewRoot />

            {/* Overlays - SectionNavigator hidden in preview mode */}
          </div>
        </div>
      </VideoPlayerProvider>
    </PreviewProvider>
  );
}

function PreviewRoot() {
  const rootId = useEditorStore((state) => state.rootId);
  const rootNode = useEditorStore((state) => state.nodes[rootId]);
  const nodes = useEditorStore((state) => state.nodes);
  const viewOptions = useEditorStore((state) => state.viewOptions);

  // Track door state - check if door exists and should be shown
  const doorNodeEntry = Object.entries(nodes).find(([_, n]) => n.type === 'door');
  const doorNode = doorNodeEntry ? doorNodeEntry[1] : null;
  const hasDoor = doorNode && !doorNode.data.isHidden && viewOptions.showDoorOverlay;

  const containerRef = useRef<HTMLDivElement>(null);
  const globalSettings = useEditorStore((state) => state.globalSettings);
  const { playerRef, containerRef: videoContainerRef, setPlayer, setContainer } = useVideoPlayer();

  // Track if doors are open - start with doors closed
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [showDoors, setShowDoors] = useState(hasDoor ? true : false);

  // Autoscroll Effect
  useEffect(() => {
    // Only run if autoscroll is enabled, doors are open, and we have a valid delay
    if (!doorsOpen || !globalSettings?.autoscroll) return;

    // Default to 5 seconds if not set (though store defaults to 0, which might mean immediate? User asked for 5s default in prompt context implies safety)
    // The store default is 0. If user inputs 5, it is 5.
    const delay = (globalSettings.autoscrollDelay || 0) * 1000;

    const scrollTimer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      const maxScroll = container.scrollHeight - container.clientHeight;
      if (maxScroll <= 0) return;

      // Slow smooth scroll similar to CeremonyCard
      const scrollDuration = 30000; // 30 seconds to scroll to bottom
      const startTime = performance.now();
      const startScroll = container.scrollTop;

      const animateScroll = (currentTime: number) => {
        // Check if user manually intervened? (Complex, skip for now)

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / scrollDuration, 1);

        // Ease-in-out
        const easeProgress = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        container.scrollTop = startScroll + (maxScroll * easeProgress);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);

    }, delay);

    return () => clearTimeout(scrollTimer);
  }, [doorsOpen, globalSettings?.autoscroll, globalSettings?.autoscrollDelay]);

  // Listen for door open events from DoorWidget
  useEffect(() => {
    if (!hasDoor) {
      // No door, show content immediately
      setDoorsOpen(true);
      setShowDoors(false);
      return;
    }

    // Listen for custom events from DoorWidget when doors open
    const handleDoorOpen = () => {
      setDoorsOpen(true);
    };

    const handleDoorAnimationComplete = () => {
      setShowDoors(false);
    };

    // Listen for door state changes via custom events
    window.addEventListener('door-opened', handleDoorOpen);
    window.addEventListener('door-animation-complete', handleDoorAnimationComplete);

    return () => {
      window.removeEventListener('door-opened', handleDoorOpen);
      window.removeEventListener('door-animation-complete', handleDoorAnimationComplete);
    };
  }, [hasDoor]);

  // Fallback: Monitor door state by checking DOM
  useEffect(() => {
    if (!hasDoor || doorsOpen) return;

    const observer = new MutationObserver(() => {
      // Check if door open button exists - if it disappears, doors are opening
      const doorButton = document.querySelector('button[aria-label*="Buka"]');
      const buttonVisible = doorButton && window.getComputedStyle(doorButton).display !== 'none' &&
        window.getComputedStyle(doorButton).opacity !== '0';

      if (!buttonVisible && showDoors) {
        // Button disappeared, doors are opening
        setDoorsOpen(true);
      }
    });

    // Observe the document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    return () => observer.disconnect();
  }, [hasDoor, doorsOpen, showDoors]);

  if (!rootNode) return null;

  // When doors are closed, content should be visible (for blur effect) but not scrollable/interactive
  const doorsClosed = hasDoor && showDoors && !doorsOpen;

  return (
    <div
      ref={containerRef}
      style={{
        ...rootNode.style,
        overflow: doorsClosed ? 'hidden' : 'auto',
        height: doorsClosed ? '100vh' : 'auto',
        maxHeight: doorsClosed ? '100vh' : 'none',
        position: 'relative', // Ensure relative positioning
        width: '100%',        // Ensure width
      }}
      className={doorsClosed ? "min-h-screen relative overflow-hidden" : "min-h-screen relative"}
    >
      {/* Content wrapper - visible but not interactive when doors are closed (for blur effect) */}
      <div
        style={{
          opacity: 1, // Keep visible so backdrop-filter can blur it
          visibility: 'visible', // Keep visible so backdrop-filter can blur it
          pointerEvents: doorsClosed ? 'none' : 'auto', // Disable interaction when doors closed
          overflow: doorsClosed ? 'hidden' : 'auto', // Prevent scrolling when doors closed
          position: 'relative',
          zIndex: 1, // Behind the door
        }}
      >
        {rootNode.children
          .filter((childId) => nodes[childId]?.type !== 'door') // Filter out door - rendered separately
          .map((childId) => (
            <NodeRenderer key={childId} nodeId={childId} />
          ))}
      </div>

      {/* Render door separately on top */}
      {hasDoor && doorNodeEntry && (
        <NodeRenderer nodeId={doorNodeEntry[0]} />
      )}
    </div>
  );
}
