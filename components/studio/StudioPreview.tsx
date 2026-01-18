"use client";

import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "@/components/editor/store";
import { NodeRenderer } from "@/components/editor/NodeRenderer";
import { PreviewProvider } from "@/components/editor/context/PreviewContext";
import { VideoPlayerProvider, useVideoPlayer } from "@/components/editor/context/VideoPlayerContext";
import { MobileFrameProvider } from "@/components/editor/context/MobileFrameContext";
import { BackgroundVideoPlayer } from "@/components/card/BackgroundVideoPlayer";
import { MusicController } from "@/components/card/MusicController";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

export function StudioPreview() {
  const [loading, setLoading] = useState(true);
  const [hasTemplate, setHasTemplate] = useState(false);
  const rootId = useEditorStore((state) => state.rootId);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load preview data from localStorage
  useEffect(() => {
    const loadPreview = () => {
      try {
        const data = localStorage.getItem("wedding-card-preview-data");
        if (data) {
          const parsed = JSON.parse(data);
          // Check if there are actual nodes (not just empty root)
          const hasNodes = parsed.nodes && Object.keys(parsed.nodes).length > 1;
          setHasTemplate(hasNodes);
          
          useEditorStore.setState({
            nodes: parsed.nodes,
            rootId: parsed.rootId || 'root',
            selectedId: null,
            globalSettings: parsed.globalSettings || useEditorStore.getState().globalSettings,
            viewOptions: parsed.viewOptions || useEditorStore.getState().viewOptions
          });
        } else {
          setHasTemplate(false);
        }
      } catch (e) {
        console.error("Failed to load preview data", e);
        setHasTemplate(false);
      } finally {
        setLoading(false);
      }
    };

    loadPreview();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 text-gray-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto mb-2"></div>
          <p className="text-sm">Loading preview...</p>
        </div>
      </div>
    );
  }

  // Show message if no template is selected
  if (!hasTemplate) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center max-w-md px-6">
          <div className="mb-4">
            <Package className="w-16 h-16 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Card Template Has Been Chosen
          </h3>
          <p className="text-gray-600 mb-6">
            Please select a wedding card template from our catalog to get started with customizing your card.
          </p>
          <Button
            onClick={() => router.push('/catalogs')}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            <Package className="w-4 h-4 mr-2" />
            Go to Catalog Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PreviewProvider isPreview={true}>
      <VideoPlayerProvider>
        <div className="w-full h-full flex items-center justify-center p-4 bg-gray-100">
          {/* Mobile Frame Container */}
          <div className="relative">
            {/* Phone Frame */}
            <div
              className="relative bg-gray-900 rounded-[40px] p-2 shadow-2xl"
              style={{
                width: 'min(100%, 375px)',
                height: 'min(100%, 800px)',
                aspectRatio: '9 / 16',
                maxHeight: '800px',
              }}
            >
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-gray-900 rounded-b-[20px] z-50 pointer-events-none"></div>
              
              {/* Screen */}
              <div
                className="relative w-full h-full bg-white rounded-[32px] overflow-hidden"
                style={{
                  height: 'calc(100% - 16px)',
                }}
              >
                <MobileFrameProvider isMobile={true}>
                  <PreviewContent containerRef={containerRef} rootId={rootId} />
                </MobileFrameProvider>
              </div>
            </div>
          </div>
        </div>
      </VideoPlayerProvider>
    </PreviewProvider>
  );
}

function PreviewContent({ containerRef, rootId }: { containerRef: React.RefObject<HTMLDivElement | null>; rootId: string }) {
  const rootNode = useEditorStore((state) => state.nodes[rootId]);
  const nodes = useEditorStore((state) => state.nodes);
  const viewOptions = useEditorStore((state) => state.viewOptions);
  const globalSettings = useEditorStore((state) => state.globalSettings);
  const { playerRef, setPlayer } = useVideoPlayer();
  const router = useRouter();

  // Find door node
  const doorNodeEntry = Object.entries(nodes).find(([_, n]) => n.type === 'door');
  const doorNode = doorNodeEntry ? doorNodeEntry[1] : null;
  const hasDoor = doorNode && !doorNode.data.isHidden && viewOptions.showDoorOverlay;
  const [doorsOpen, setDoorsOpen] = useState(!hasDoor);

  // Listen for door open events
  useEffect(() => {
    if (!hasDoor) {
      setDoorsOpen(true);
      return;
    }

    const handleDoorOpen = () => setDoorsOpen(true);
    window.addEventListener('door-opened', handleDoorOpen);
    return () => window.removeEventListener('door-opened', handleDoorOpen);
  }, [hasDoor]);

  if (!rootNode) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center max-w-md px-6">
          <div className="mb-4">
            <Package className="w-16 h-16 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Card Template Has Been Chosen
          </h3>
          <p className="text-gray-600 mb-6">
            Please select a wedding card template from our catalog to get started with customizing your card.
          </p>
          <Button
            onClick={() => router.push('/catalogs')}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            <Package className="w-4 h-4 mr-2" />
            Go to Catalog Page
          </Button>
        </div>
      </div>
    );
  }

  const doorsClosed = hasDoor && !doorsOpen;

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full h-full overflow-y-auto overflow-x-hidden scrollbar-hide relative",
        doorsClosed && "overflow-hidden"
      )}
      style={{
        ...rootNode?.style,
      }}
    >
      {/* Content */}
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

      {/* Door Overlay */}
      {hasDoor && doorNodeEntry && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          <NodeRenderer nodeId={doorNodeEntry[0]} />
        </div>
      )}

      {/* Background Video */}
      {globalSettings?.backgroundMusic?.url && (
        <BackgroundVideoPlayer
          videoUrl={globalSettings.backgroundMusic.url}
          startTime={globalSettings.backgroundMusic.startTime || 0}
          duration={globalSettings.backgroundMusic.duration || 0}
          playerRef={playerRef}
          onPlayerReady={(player) => setPlayer(player)}
        />
      )}

      {/* Music Controller */}
      {globalSettings?.backgroundMusic?.url && (
        <MusicController playerRef={playerRef} />
      )}
    </div>
  );
}
