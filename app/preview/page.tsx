"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEditorStore } from "@/components/editor/store";
import { NodeRenderer } from "@/components/editor/NodeRenderer";
import { PreviewProvider } from "@/components/editor/context/PreviewContext";
import { VideoPlayerProvider, useVideoPlayer } from "@/components/editor/context/VideoPlayerContext";
import { BackgroundVideoPlayer } from "@/components/card/BackgroundVideoPlayer";
import { MusicController } from "@/components/card/MusicController";
import axios from "axios";

function PreviewContent() {
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');
  const rootId = useEditorStore((state) => state.rootId);

  useEffect(() => {
    const loadTemplate = async () => {
      if (templateId) {
        // Load template from API
        try {
          const response = await axios.get(`/api/catalog/templates/${templateId}`);
          const template = response.data;

          if (template.editorData) {
            useEditorStore.setState({
              nodes: template.editorData.nodes || {},
              rootId: template.editorData.rootId || 'root',
              selectedId: null,
              globalSettings: template.editorData.globalSettings || {},
              viewOptions: template.editorData.viewOptions || {},
            });

            // Also save to localStorage
            localStorage.setItem('wedding-card-preview-data', JSON.stringify({
              nodes: template.editorData.nodes || {},
              rootId: template.editorData.rootId || 'root',
              globalSettings: template.editorData.globalSettings || {},
              viewOptions: template.editorData.viewOptions || {},
            }));
          }
        } catch (error) {
          console.error('Error loading template:', error);
        }
      } else {
        // Load from localStorage (for designer preview)
        try {
          const data = localStorage.getItem("wedding-card-preview-data");
          if (data) {
            const parsed = JSON.parse(data);
            const currentGlobalSettings = useEditorStore.getState().globalSettings;
            useEditorStore.setState({
              nodes: parsed.nodes,
              rootId: parsed.rootId || 'root',
              selectedId: null,
              globalSettings: {
                ...currentGlobalSettings,
                ...(parsed.globalSettings || {}),
                // Ensure new fields have defaults if not present
                scrollAnimationBottomMargin: parsed.globalSettings?.scrollAnimationBottomMargin ?? currentGlobalSettings.scrollAnimationBottomMargin ?? 90,
                scrollAnimationThreshold: parsed.globalSettings?.scrollAnimationThreshold ?? currentGlobalSettings.scrollAnimationThreshold ?? 0.1,
              },
              viewOptions: parsed.viewOptions || useEditorStore.getState().viewOptions
            });
          }
        } catch (e) {
          console.error("Failed to load preview data", e);
        }
      }
      setLoading(false);
    };

    loadTemplate();
  }, [templateId]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-500">Loading Preview...</div>;
  }

  return (
    <PreviewProvider isPreview={true}>
      <VideoPlayerProvider>
        <div className="min-h-screen bg-gray-100 flex justify-center">
          <div className="w-full max-w-md bg-white h-screen shadow-2xl relative overflow-hidden">
            <PreviewRoot />
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
  const globalSettings = useEditorStore((state) => state.globalSettings);
  const setCardScrollElement = useEditorStore((state) => state.setCardScrollElement);
  const setDoorStatus = useEditorStore((state) => state.setDoorStatus);
  const { playerRef, setPlayer } = useVideoPlayer();
  const containerRef = useRef<HTMLDivElement>(null);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [doorAnimationComplete, setDoorAnimationComplete] = useState(false);

  const doorNodeEntry = Object.entries(nodes).find(([_, n]) => n.type === 'door');
  const doorNode = doorNodeEntry ? doorNodeEntry[1] : null;
  const hasDoor = doorNode && !doorNode.data.isHidden && viewOptions.showDoorOverlay;

  // Ensure animations are enabled in preview and set initial door status
  useEffect(() => {
    const currentViewOptions = useEditorStore.getState().viewOptions;
    if (!currentViewOptions.showAnimation) {
      useEditorStore.setState({
        viewOptions: { ...currentViewOptions, showAnimation: true }
      });
    }
    
    // Set initial door status
    if (hasDoor) {
      setDoorStatus("closed");
    } else {
      setDoorStatus("opened");
    }

    // Debug: Log autoscroll settings
    console.log('[Preview] Autoscroll settings:', {
      autoscroll: globalSettings?.autoscroll,
      delay: globalSettings?.autoscrollDelay,
      speed: globalSettings?.autoscrollSpeed,
      hasDoor,
      doorsOpen
    });
  }, [hasDoor, setDoorStatus, globalSettings]);

  // Set card scroll element for animations and autoscroll
  useEffect(() => {
    if (containerRef.current) {
      setCardScrollElement(containerRef.current);
    }
    return () => {
      setCardScrollElement(null);
    };
  }, [setCardScrollElement]);

  // Autoscroll Effect - Only start after door animation is 100% complete
  useEffect(() => {
    // Only run if autoscroll is enabled, door animation is complete, and we have a valid delay
    if (!doorAnimationComplete || !globalSettings?.autoscroll) {
      return;
    }

    // Delay after door animation completes before starting autoscroll (in milliseconds)
    const delay = (globalSettings.autoscrollDelay || 0) * 1000;

    const scrollTimer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) {
        console.log('[Autoscroll] No container found');
        return;
      }

      // Function to check and start autoscroll
      const checkAndStartScroll = (attempts = 0) => {
        // Wait for content to be rendered - check multiple times
        // Force a reflow to ensure accurate measurements
        container.scrollTop = 0;
        const maxScroll = container.scrollHeight - container.clientHeight;
        
        if (maxScroll <= 0) {
          // Content might not be rendered yet, try again after a short delay
          if (attempts < 20) {
            setTimeout(() => checkAndStartScroll(attempts + 1), 200);
            return;
          }
          console.log('[Autoscroll] No scrollable content after retries', {
            scrollHeight: container.scrollHeight,
            clientHeight: container.clientHeight,
            maxScroll,
            attempts
          });
          return;
        }

        console.log('[Autoscroll] Starting scroll', {
          scrollHeight: container.scrollHeight,
          clientHeight: container.clientHeight,
          maxScroll,
          speed: globalSettings.autoscrollSpeed
        });

        // Calculate scroll duration based on speed (1-10)
        // Speed 1 = 60 seconds (slowest)
        // Speed 5 = 12 seconds (medium)
        // Speed 10 = 6 seconds (fastest)
        const speed = globalSettings.autoscrollSpeed || 5;
        const scrollDuration = (60 / speed) * 1000; // Convert to milliseconds
        
        const startTime = performance.now();
        const startScroll = container.scrollTop;

        const animateScroll = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / scrollDuration, 1);

          // Ease-in-out
          const easeProgress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

          container.scrollTop = startScroll + (maxScroll * easeProgress);

          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          } else {
            console.log('[Autoscroll] Scroll completed');
          }
        };

        requestAnimationFrame(animateScroll);
      };

      // Wait for DOM to settle after door animation, then check for scrollable content
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          checkAndStartScroll();
        });
      });

    }, delay);

    return () => clearTimeout(scrollTimer);
  }, [doorAnimationComplete, globalSettings?.autoscroll, globalSettings?.autoscrollDelay, globalSettings?.autoscrollSpeed]);

  useEffect(() => {
    if (!hasDoor) {
      setDoorsOpen(true);
      setDoorAnimationComplete(true); // No animation, so mark as complete
      setDoorStatus("opened");
      return;
    }

    const handleDoorOpen = () => {
      console.log('[Preview] Door opened event received - animation starting');
      setDoorsOpen(true);
      setDoorStatus("opening");
      setDoorAnimationComplete(false); // Reset to false when door starts opening
    };

    const handleDoorAnimationComplete = () => {
      console.log('[Preview] Door animation complete - autoscroll can start');
      setDoorStatus("opened");
      setDoorAnimationComplete(true); // Mark animation as complete - this triggers autoscroll
    };
    
    console.log('[Preview] Setting up door event listener');
    window.addEventListener('door-opened', handleDoorOpen);
    window.addEventListener('door-animation-complete', handleDoorAnimationComplete);
    return () => {
      window.removeEventListener('door-opened', handleDoorOpen);
      window.removeEventListener('door-animation-complete', handleDoorAnimationComplete);
    };
  }, [hasDoor, setDoorStatus]);

  if (!rootNode) return null;

  const doorsClosed = hasDoor && !doorsOpen;

  return (
    <div
      ref={containerRef}
      className={`h-screen relative ${doorsClosed ? '' : 'scrollbar-hide'}`}
      style={{
        ...rootNode.style,
        overflow: doorsClosed ? 'hidden' : 'auto',
        height: '100vh',
      }}
    >
      <div
        style={{
          opacity: 1,
          visibility: 'visible',
          pointerEvents: doorsClosed ? 'none' : 'auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {rootNode.children
          .filter((childId) => nodes[childId]?.type !== 'door')
          .map((childId) => (
            <NodeRenderer key={childId} nodeId={childId} />
          ))}
      </div>

      {hasDoor && doorNodeEntry && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          <NodeRenderer nodeId={doorNodeEntry[0]} />
        </div>
      )}

      {globalSettings?.backgroundMusic?.url && (
        <>
          <BackgroundVideoPlayer
            videoUrl={globalSettings.backgroundMusic.url}
            startTime={globalSettings.backgroundMusic.startTime || 0}
            duration={globalSettings.backgroundMusic.duration || 0}
            playerRef={playerRef}
            onPlayerReady={(player) => setPlayer(player)}
          />
          <MusicController playerRef={playerRef} />
        </>
      )}
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-500">Loading Preview...</div>
    }>
      <PreviewContent />
    </Suspense>
  );
}
