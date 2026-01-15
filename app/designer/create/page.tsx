/**
 * Main editor page - Full view without dashboard sidebar
 */

'use client';

import React, { useEffect, useState, useRef } from 'react';
import type Konva from 'konva';
import { useProjectStore } from '@/lib/store/projectStore';
import { useHistoryStore } from '@/lib/store/historyStore';
import { useHotkeys } from 'react-hotkeys-hook';
import { EditorCanvas } from '@/components/designer/editor/canvas/EditorCanvas';
import { Toolbar } from '@/components/designer/editor/components/Toolbar';
import { ToolsBar } from '@/components/designer/editor/tools/ToolsBar';
import { ToolsDetailsPanel } from '@/components/designer/editor/tools/ToolsDetailsPanel';
import { SectionsBar } from '@/components/designer/editor/panels/SectionsBar';
import { TextEditOverlay } from '@/components/designer/editor/components/TextEditOverlay';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEditorUIStore } from '@/lib/store/editorUIStore';
import { useRafScroll } from '@/components/designer/editor/hooks/useRafScroll';
import { getActiveSectionFromScroll } from '@/components/designer/editor/utils/getActiveSectionFromScroll';

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loadProject, project, currentSectionId, setCurrentSection, selectedIds, setSelectedIds, deleteObject, duplicateObject, setClipboard, clipboard, setClipboardStyle, clipboardStyle, updateObject } = useProjectStore();
  const { push, undo, redo } = useHistoryStore();
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [workspaceScale, setWorkspaceScale] = useState(1);
  const stageRef = useRef<Konva.Stage | null>(null);
  
  // Global zoom constants
  const MIN_SCALE = 0.2;
  const MAX_SCALE = 4;
  
  // Refs to prevent infinite loops
  const lastUrlSectionIdRef = React.useRef<string | null>(null);
  const lastProjectUpdatedAtRef = React.useRef<number | null>(null);
  const isRestoringRef = React.useRef<boolean>(false);
  
  // Canvas viewport refs (must be at top level before any returns)
  const canvasViewportRef = useRef<HTMLDivElement>(null);
  const isScrollingProgrammaticallyRef = useRef(false);

  // Load project on mount
  useEffect(() => {
    loadProject();
  }, [loadProject]);

  // Sync section from URL (only on mount or when URL changes externally)
  useEffect(() => {
    const sectionIdParam = searchParams.get('sectionId');
    if (sectionIdParam && project) {
      const section = project.sections.find((s) => s.id === sectionIdParam);
      if (section && section.id !== currentSectionId && sectionIdParam !== lastUrlSectionIdRef.current) {
        // Only sync if URL changed externally (not from our own update)
        // Reset ref when URL changes externally
        lastUrlSectionIdRef.current = sectionIdParam;
        setCurrentSection(sectionIdParam);
      }
    }
  }, [searchParams, project, currentSectionId, setCurrentSection]);

  // Update URL when section changes (but not if we just synced from URL)
  useEffect(() => {
    if (currentSectionId && currentSectionId !== lastUrlSectionIdRef.current) {
      lastUrlSectionIdRef.current = currentSectionId;
      const params = new URLSearchParams(window.location.search);
      params.set('sectionId', currentSectionId);
      // Use current path to maintain route
      const currentPath = window.location.pathname;
      router.replace(`${currentPath}?${params.toString()}`, { scroll: false });
    }
  }, [currentSectionId, router]);

  // Save to history on project changes
  useEffect(() => {
    if (project && project.updatedAt !== lastProjectUpdatedAtRef.current && !isRestoringRef.current) {
      // Only push if project was actually updated (check timestamp) and not restoring from undo/redo
      lastProjectUpdatedAtRef.current = project.updatedAt;
      push(project);
    }
    isRestoringRef.current = false; // Reset flag after effect runs
  }, [project, push]);

  // Keyboard shortcuts
  useHotkeys('delete', () => {
    if (selectedIds.length > 0 && currentSectionId) {
      selectedIds.forEach((id) => deleteObject(currentSectionId, id));
      setSelectedIds([]);
    }
  }, { enabled: true });

  useHotkeys('backspace', () => {
    if (selectedIds.length > 0 && currentSectionId) {
      selectedIds.forEach((id) => deleteObject(currentSectionId, id));
      setSelectedIds([]);
    }
  }, { enabled: true });

  useHotkeys('ctrl+z, cmd+z', (e) => {
    e.preventDefault();
    const restoredProject = undo();
    if (restoredProject) {
      isRestoringRef.current = true; // Prevent history push
      const store = useProjectStore.getState();
      store.updateProject((p) => {
        // Replace all properties
        p.id = restoredProject.id;
        p.name = restoredProject.name;
        p.createdAt = restoredProject.createdAt;
        p.updatedAt = restoredProject.updatedAt;
        p.settings = restoredProject.settings;
        p.sections = restoredProject.sections;
        p.player = restoredProject.player;
      });
      lastProjectUpdatedAtRef.current = restoredProject.updatedAt;
    }
  }, { enabled: true });

  useHotkeys('ctrl+shift+z, cmd+shift+z', (e) => {
    e.preventDefault();
    const restoredProject = redo();
    if (restoredProject) {
      isRestoringRef.current = true; // Prevent history push
      const store = useProjectStore.getState();
      store.updateProject((p) => {
        // Replace all properties
        p.id = restoredProject.id;
        p.name = restoredProject.name;
        p.createdAt = restoredProject.createdAt;
        p.updatedAt = restoredProject.updatedAt;
        p.settings = restoredProject.settings;
        p.sections = restoredProject.sections;
        p.player = restoredProject.player;
      });
      lastProjectUpdatedAtRef.current = restoredProject.updatedAt;
    }
  }, { enabled: true });

  useHotkeys('ctrl+c, cmd+c', (e) => {
    if (selectedIds.length === 0 || !currentSectionId) return;
    e.preventDefault();
    const currentSection = project?.sections.find((s) => s.id === currentSectionId);
    if (!currentSection) return;
    const objects = currentSection.objects.filter((o) => selectedIds.includes(o.id));
    setClipboard(objects.map((obj) => ({ ...obj })));
  }, { enabled: true });

  useHotkeys('ctrl+v, cmd+v', (e) => {
    if (!clipboard || clipboard.length === 0 || !currentSectionId) return;
    e.preventDefault();
    const { addObject, setSelectedIds } = useProjectStore.getState();
    const newIds: string[] = [];
    clipboard.forEach((obj) => {
      const id = addObject(currentSectionId, {
        ...obj,
        id: '', // Will be generated
        x: obj.x + 20,
        y: obj.y + 20,
      });
      newIds.push(id);
    });
    setSelectedIds(newIds);
  }, { enabled: true });

  useHotkeys('ctrl+d, cmd+d', (e) => {
    if (selectedIds.length === 0 || !currentSectionId) return;
    e.preventDefault();
    const { duplicateObject, setSelectedIds } = useProjectStore.getState();
    const newIds: string[] = [];
    selectedIds.forEach((id) => {
      const newId = duplicateObject(currentSectionId, id);
      newIds.push(newId);
    });
    setSelectedIds(newIds);
  }, { enabled: true });

  useHotkeys('ctrl+a, cmd+a', (e) => {
    if (!currentSectionId) return;
    e.preventDefault();
    const currentSection = project?.sections.find((s) => s.id === currentSectionId);
    if (currentSection) {
      setSelectedIds(currentSection.objects.map((o) => o.id));
    }
  }, { enabled: true });

  // Copy/Paste style (Phase 2)
  useHotkeys('alt+shift+c', (e) => {
    if (selectedIds.length === 0 || !currentSectionId) return;
    e.preventDefault();
    const currentSection = project?.sections.find((s) => s.id === currentSectionId);
    if (!currentSection) return;
    const obj = currentSection.objects.find((o) => o.id === selectedIds[0]);
    if (!obj) return;
    
    // Extract style properties based on type
    const style: any = {};
    if (obj.type === 'text') {
      style.fontFamily = (obj as any).fontFamily;
      style.fontSize = (obj as any).fontSize;
      style.fill = (obj as any).fill;
      style.fontStyle = (obj as any).fontStyle;
    } else if (obj.type === 'rect' || obj.type === 'circle') {
      style.fill = (obj as any).fill;
      style.stroke = (obj as any).stroke;
      style.strokeWidth = (obj as any).strokeWidth;
    }
    setClipboardStyle(style);
  }, { enabled: true });

  useHotkeys('alt+shift+v', (e) => {
    if (!clipboardStyle || selectedIds.length === 0 || !currentSectionId) return;
    e.preventDefault();
    const currentSection = project?.sections.find((s) => s.id === currentSectionId);
    if (!currentSection) return;
    
    selectedIds.forEach((id) => {
      const obj = currentSection.objects.find((o) => o.id === id);
      if (!obj) return;
      
      // Apply style if types match
      if (obj.type === 'text' && clipboardStyle.fontFamily) {
        updateObject(currentSectionId, id, {
          fontFamily: clipboardStyle.fontFamily,
          fontSize: clipboardStyle.fontSize,
          fill: clipboardStyle.fill,
          fontStyle: clipboardStyle.fontStyle,
        });
      } else if ((obj.type === 'rect' || obj.type === 'circle') && clipboardStyle.fill) {
        updateObject(currentSectionId, id, {
          fill: clipboardStyle.fill,
          stroke: clipboardStyle.stroke,
          strokeWidth: clipboardStyle.strokeWidth,
        });
      }
    });
  }, { enabled: true });

  // Arrow keys for nudging
  useHotkeys('arrowup', (e) => {
    if (selectedIds.length === 0 || !currentSectionId) return;
    e.preventDefault();
    const nudge = e.shiftKey ? 10 : 1;
    selectedIds.forEach((id) => {
      const currentSection = project?.sections.find((s) => s.id === currentSectionId);
      const obj = currentSection?.objects.find((o) => o.id === id);
      if (obj) {
        updateObject(currentSectionId, id, { y: obj.y - nudge });
      }
    });
  }, { enabled: true });

  useHotkeys('arrowdown', (e) => {
    if (selectedIds.length === 0 || !currentSectionId) return;
    e.preventDefault();
    const nudge = e.shiftKey ? 10 : 1;
    selectedIds.forEach((id) => {
      const currentSection = project?.sections.find((s) => s.id === currentSectionId);
      const obj = currentSection?.objects.find((o) => o.id === id);
      if (obj) {
        updateObject(currentSectionId, id, { y: obj.y + nudge });
      }
    });
  }, { enabled: true });

  useHotkeys('arrowleft', (e) => {
    if (selectedIds.length === 0 || !currentSectionId) return;
    e.preventDefault();
    const nudge = e.shiftKey ? 10 : 1;
    selectedIds.forEach((id) => {
      const currentSection = project?.sections.find((s) => s.id === currentSectionId);
      const obj = currentSection?.objects.find((o) => o.id === id);
      if (obj) {
        updateObject(currentSectionId, id, { x: obj.x - nudge });
      }
    });
  }, { enabled: true });

  useHotkeys('arrowright', (e) => {
    if (selectedIds.length === 0 || !currentSectionId) return;
    e.preventDefault();
    const nudge = e.shiftKey ? 10 : 1;
    selectedIds.forEach((id) => {
      const currentSection = project?.sections.find((s) => s.id === currentSectionId);
      const obj = currentSection?.objects.find((o) => o.id === id);
      if (obj) {
        updateObject(currentSectionId, id, { x: obj.x + nudge });
      }
    });
  }, { enabled: true });

  // Global zoom handlers
  const handleZoomIn = () => {
    setWorkspaceScale((prev) => {
      const newScale = prev * 1.1;
      return Math.min(newScale, MAX_SCALE);
    });
  };

  const handleZoomOut = () => {
    setWorkspaceScale((prev) => {
      const newScale = prev / 1.1;
      return Math.max(newScale, MIN_SCALE);
    });
  };

  const handleZoomReset = () => {
    setWorkspaceScale(1);
  };

  const handleFitToScreen = () => {
    if (!project) return;
    const DESIGN_W = 900;
    const DESIGN_H = 1600;
    const editScale = 0.4;
    const scaledWidth = DESIGN_W * editScale;
    const scaledHeight = DESIGN_H * editScale;
    
    // Calculate viewport size (accounting for toolbars and sections bar)
    const viewportWidth = window.innerWidth - 64; // ToolsPanel width
    const viewportHeight = window.innerHeight - 56 - 192; // Toolbar + SectionsBar
    
    const scaleX = viewportWidth / scaledWidth;
    const scaleY = viewportHeight / scaledHeight;
    const fitScale = Math.min(scaleX, scaleY) * 0.9; // 90% to add some padding
    
    setWorkspaceScale(Math.max(MIN_SCALE, Math.min(fitScale, MAX_SCALE)));
  };

  // Close details panel on ESC key
  useHotkeys('escape', () => {
    const { isPanelOpen, closePanel, setActiveTool } = useEditorUIStore.getState();
    if (isPanelOpen) {
      closePanel();
    } else {
      setActiveTool('select');
    }
  }, { enabled: true });

  // Global zoom with mouse wheel (Ctrl/Cmd + wheel)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();

      if (e.deltaY > 0) {
        setWorkspaceScale((prev) => {
          const newScale = prev / 1.1;
          return Math.max(newScale, MIN_SCALE);
        });
      } else {
        setWorkspaceScale((prev) => {
          const newScale = prev * 1.1;
          return Math.min(newScale, MAX_SCALE);
        });
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Scroll to selected section with smooth transition
  useEffect(() => {
    if (!currentSectionId || !canvasViewportRef.current) return;
    
    const sectionElement = canvasViewportRef.current.querySelector(
      `[data-section-id="${currentSectionId}"]`
    ) as HTMLElement;
    
    if (sectionElement) {
      isScrollingProgrammaticallyRef.current = true;
      
      // Use rAF to ensure DOM is ready
      requestAnimationFrame(() => {
        sectionElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        
        // Reset flag after scroll animation completes (typically 300-500ms)
        setTimeout(() => {
          isScrollingProgrammaticallyRef.current = false;
        }, 600);
      });
    }
  }, [currentSectionId]);

  // Optimized scroll handler using rAF throttling
  // This prevents React state updates on every scroll tick
  useRafScroll(canvasViewportRef, {
    onScroll: (scrollTop, container) => {
      // Skip if programmatically scrolling
      if (isScrollingProgrammaticallyRef.current) return;
      if (!project) return;

      // Calculate active section without triggering React state updates
      // Only update state if section actually changed
      const activeSectionId = getActiveSectionFromScroll(scrollTop, {
        container,
        sectionIds: project.sections.map((s) => s.id),
        visibilityThreshold: 0.3,
        centerBias: true,
      });

      // Only update state if section changed (prevents unnecessary re-renders)
      if (activeSectionId && activeSectionId !== currentSectionId) {
        setCurrentSection(activeSectionId);
      }
    },
    enabled: !!project,
  });

  if (!project) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <ToolsBar />
        <ToolsDetailsPanel />
        {/* CanvasViewport - fixed size container with overflow */}
        <div 
          ref={canvasViewportRef}
          className="flex-1 relative overflow-auto scroll-smooth" 
          style={{ background: 'transparent' }}
        >
          {/* Workspace container (scale handled inside Konva for accuracy) */}
          <div
            className="flex flex-col items-center justify-center min-h-full"
            style={{ paddingTop: '30px', paddingBottom: '30px' }}
          >
            <EditorCanvas
              onTextEdit={(id) => setEditingTextId(id)}
              workspaceScale={workspaceScale}
              stageRef={stageRef}
              editingTextId={editingTextId}
            />
          </div>
        </div>
      </div>
      
      {/* Floating Zoom Controls - positioned above sections bar (h-48 = 192px, so 192 + 30 = 222px) */}
      <div className="fixed bottom-[222px] left-1/2 transform -translate-x-1/2 z-30 flex flex-row items-center gap-2 bg-white rounded-lg shadow-lg px-3 py-2 border border-gray-200">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleZoomOut}
                disabled={workspaceScale <= MIN_SCALE}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="px-3 text-sm font-medium text-gray-700 min-w-[60px] text-center">
          {Math.round(workspaceScale * 100)}%
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleZoomIn}
                disabled={workspaceScale >= MAX_SCALE}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="h-6 w-px bg-gray-300 mx-1" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={handleZoomReset}
              >
                Reset
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset to 100%</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={handleFitToScreen}
              >
                Fit
              </Button>
            </TooltipTrigger>
            <TooltipContent>Fit to Screen</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <SectionsBar />
      {editingTextId && (
        <TextEditOverlay
          objectId={editingTextId}
          onClose={() => setEditingTextId(null)}
          stageRef={stageRef}
          workspaceScale={workspaceScale}
        />
      )}
    </div>
  );
}
