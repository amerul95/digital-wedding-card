/**
 * Tools details panel - secondary panel that appears to the right of tools bar
 */

'use client';

import React from 'react';
import { useEditorUIStore } from '@/lib/store/editorUIStore';
import { useMediaQuery } from '@/lib/designer/useMediaQuery';
import { TextPanel } from './panels/TextPanel';
import { ElementsPanel } from './panels/ElementsPanel';
import { UploadsPanel } from './panels/UploadsPanel';
import { SectionsPanel } from './panels/SectionsPanel';
import { LayersPanel } from './panels/LayersPanel';
import { SettingsPanel } from './panels/SettingsPanel';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ToolsDetailsPanel() {
  const { activeTool, isPanelOpen, closePanel } = useEditorUIStore();
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (!isPanelOpen || activeTool === 'select') {
    return null;
  }

  const renderPanelContent = () => {
    switch (activeTool) {
      case 'text':
        return <TextPanel />;
      case 'elements':
        return <ElementsPanel />;
      case 'uploads':
        return <UploadsPanel />;
      case 'sections':
        return <SectionsPanel />;
      case 'layers':
        return <LayersPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  const getPanelTitle = () => {
    switch (activeTool) {
      case 'text':
        return 'Text';
      case 'elements':
        return 'Elements';
      case 'uploads':
        return 'Uploads';
      case 'sections':
        return 'Pages';
      case 'layers':
        return 'Layers';
      case 'settings':
        return 'Settings';
      default:
        return '';
    }
  };

  // Mobile: bottom drawer
  if (isMobile) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-lg border-t border-zinc-200 flex flex-col" style={{ height: '65vh', animation: 'slideInFromBottom 0.2s ease-out' }}>
        {/* Handle bar */}
        <div className="h-1 w-12 bg-zinc-300 rounded-full mx-auto mt-2 mb-1" />
        
        {/* Header */}
        <div className="h-14 border-b border-zinc-200 flex items-center justify-between px-4 shrink-0">
          <h2 className="text-sm font-semibold text-zinc-900">{getPanelTitle()}</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={closePanel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto">
          {renderPanelContent()}
        </div>
      </div>
    );
  }

  // Desktop: side panel
  return (
    <div
      className="w-[320px] h-full bg-white border-r border-zinc-200 flex flex-col shadow-sm"
      style={{
        animation: 'slideInFromLeft 0.15s ease-out',
      }}
    >
      {/* Header */}
      <div className="h-14 border-b border-zinc-200 flex items-center justify-between px-4 shrink-0">
        <h2 className="text-sm font-semibold text-zinc-900">{getPanelTitle()}</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={closePanel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-y-auto">
        {renderPanelContent()}
      </div>
    </div>
  );
}
