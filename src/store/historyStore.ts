/**
 * Zustand store for undo/redo history
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Project } from './types';

interface HistoryState {
  past: Project[];
  present: Project | null;
  future: Project[];
  maxHistory: number;
  
  // Actions
  push: (project: Project) => void;
  undo: () => Project | null;
  redo: () => Project | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clear: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  immer((set, get) => ({
    past: [],
    present: null,
    future: [],
    maxHistory: 50,

    push: (project) => {
      set((state) => {
        // Create a deep copy to avoid proxy issues
        const projectCopy = JSON.parse(JSON.stringify(project)) as Project;
        if (state.present) {
          state.past.push(state.present);
          if (state.past.length > state.maxHistory) {
            state.past.shift();
          }
        }
        state.present = projectCopy;
        state.future = [];
      });
    },

    undo: () => {
      let result: Project | null = null;
      set((state) => {
        if (state.past.length === 0 || !state.present) {
          return;
        }
        state.future.unshift(state.present);
        const popped = state.past.pop();
        if (popped) {
          // Create a deep copy to avoid proxy issues
          result = JSON.parse(JSON.stringify(popped)) as Project;
          state.present = result;
        }
      });
      return result;
    },

    redo: () => {
      let result: Project | null = null;
      set((state) => {
        if (state.future.length === 0) {
          return;
        }
        if (state.present) {
          state.past.push(state.present);
        }
        const shifted = state.future.shift();
        if (shifted) {
          // Create a deep copy to avoid proxy issues
          result = JSON.parse(JSON.stringify(shifted)) as Project;
          state.present = result;
        }
      });
      return result;
    },

    canUndo: () => {
      return get().past.length > 0;
    },

    canRedo: () => {
      return get().future.length > 0;
    },

    clear: () => {
      set((state) => {
        state.past = [];
        state.present = null;
        state.future = [];
      });
    },
  }))
);
