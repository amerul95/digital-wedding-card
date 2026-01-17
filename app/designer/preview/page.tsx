"use client";

import { useEffect, useState } from "react";
import { useEditorStore } from "@/components/editor/store";
import { NodeRenderer } from "@/components/editor/NodeRenderer";
import { BottomNavBar } from "@/components/editor/canvas/BottomNavBar";
import { SectionNavigator } from "@/components/editor/canvas/SectionNavigator";
import { PreviewProvider } from "@/components/editor/context/PreviewContext";

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
            selectedId: null // Clear selection in preview
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
      <div className="min-h-screen bg-gray-100 flex justify-center">
        <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative">
          {/* Render Root */}
          <PreviewRoot />

          {/* Overlays - SectionNavigator hidden in preview mode */}
        </div>
      </div>
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
  
  // Track if doors are open - start with doors closed
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [showDoors, setShowDoors] = useState(hasDoor ? true : false);
  
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
      style={{
        ...rootNode.style,
        overflow: doorsClosed ? 'hidden' : 'auto',
        height: doorsClosed ? '100vh' : 'auto',
        maxHeight: doorsClosed ? '100vh' : 'none',
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
