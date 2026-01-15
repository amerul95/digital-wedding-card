/**
 * Zustand store for editor UI state (tools panel)
 */

import { create } from 'zustand';

export type ActiveTool = 
  | 'select' 
  | 'text' 
  | 'elements' 
  | 'shapes' 
  | 'uploads' 
  | 'sections' 
  | 'layers'
  | 'settings';

interface EditorUIState {
  activeTool: ActiveTool;
  isPanelOpen: boolean;
  lastNonSelectTool: ActiveTool;
  setActiveTool: (tool: ActiveTool) => void;
  toggleTool: (tool: ActiveTool) => void;
  togglePanel: () => void;
  closePanel: () => void;
  openPanel: () => void;
}

export const useEditorUIStore = create<EditorUIState>((set) => ({
  activeTool: 'select',
  isPanelOpen: false,
  lastNonSelectTool: 'text',
  
  setActiveTool: (tool) => {
    set((state) => {
      if (tool === 'select') {
        return {
          activeTool: tool,
          isPanelOpen: false,
        };
      }
      return {
        activeTool: tool,
        isPanelOpen: true,
        lastNonSelectTool: tool,
      };
    });
  },
  
  toggleTool: (tool) => {
    set((state) => {
      if (tool === 'select') {
        return {
          activeTool: tool,
          isPanelOpen: false,
        };
      }
      // If clicking the same tool and panel is open, close it
      if (state.activeTool === tool && state.isPanelOpen) {
        return {
          activeTool: 'select',
          isPanelOpen: false,
        };
      }
      // Otherwise, set tool and open panel
      return {
        activeTool: tool,
        isPanelOpen: true,
        lastNonSelectTool: tool,
      };
    });
  },
  
  togglePanel: () => {
    set((state) => ({
      isPanelOpen: !state.isPanelOpen,
    }));
  },
  
  closePanel: () => {
    set((state) => ({
      isPanelOpen: false,
      // Optionally return to select tool when closing
      activeTool: 'select',
    }));
  },
  
  openPanel: () => {
    set((state) => ({
      isPanelOpen: true,
      // If no tool selected, use last non-select tool
      activeTool: state.activeTool === 'select' ? state.lastNonSelectTool : state.activeTool,
    }));
  },
}));
