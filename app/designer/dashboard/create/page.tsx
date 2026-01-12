/**
 * Main editor page
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useProjectStore } from '@/src/store/projectStore';
import { useHistoryStore } from '@/src/store/historyStore';
import { useHotkeys } from 'react-hotkeys-hook';
import { EditorCanvas } from '@/src/designer/editor/canvas/EditorCanvas';
import { Toolbar } from '@/src/designer/editor/components/Toolbar';
import { SectionsPanel } from '@/src/designer/editor/panels/SectionsPanel';
import { LayersPanel } from '@/src/designer/editor/panels/LayersPanel';
import { PropertiesPanel } from '@/src/designer/editor/panels/PropertiesPanel';
import { TextEditOverlay } from '@/src/designer/editor/components/TextEditOverlay';
import { useSearchParams, useRouter } from 'next/navigation';

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loadProject, project, currentSectionId, setCurrentSection, selectedIds, setSelectedIds, deleteObject, duplicateObject, setClipboard, clipboard, setClipboardStyle, clipboardStyle, updateObject } = useProjectStore();
  const { push, undo, redo } = useHistoryStore();
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  // Load project on mount
  useEffect(() => {
    loadProject();
  }, [loadProject]);

  // Sync section from URL
  useEffect(() => {
    const sectionIdParam = searchParams.get('sectionId');
    if (sectionIdParam && project) {
      const section = project.sections.find((s) => s.id === sectionIdParam);
      if (section && section.id !== currentSectionId) {
        setCurrentSection(sectionIdParam);
      }
    }
  }, [searchParams, project, currentSectionId, setCurrentSection]);

  // Update URL when section changes
  useEffect(() => {
    if (currentSectionId) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('sectionId', currentSectionId);
      router.replace(`/designer/dashboard/create?${params.toString()}`, { scroll: false });
    }
  }, [currentSectionId, router, searchParams]);

  // Save to history on project changes
  useEffect(() => {
    if (project) {
      push(project);
    }
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
    const project = undo();
    if (project) {
      useProjectStore.getState().updateProject(() => project);
    }
  }, { enabled: true });

  useHotkeys('ctrl+shift+z, cmd+shift+z', (e) => {
    e.preventDefault();
    const project = redo();
    if (project) {
      useProjectStore.getState().updateProject(() => project);
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
        <SectionsPanel />
        <div className="flex-1 relative">
          <EditorCanvas onTextEdit={(id) => setEditingTextId(id)} />
        </div>
        <LayersPanel />
        <PropertiesPanel />
      </div>
      {editingTextId && (
        <TextEditOverlay
          objectId={editingTextId}
          onClose={() => setEditingTextId(null)}
        />
      )}
    </div>
  );
}
