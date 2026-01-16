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

  if (!rootNode) return null;

  return (
    <div style={rootNode.style} className="min-h-screen relative">
      {rootNode.children.map((childId) => (
        <NodeRenderer key={childId} nodeId={childId} />
      ))}
    </div>
  );
}
