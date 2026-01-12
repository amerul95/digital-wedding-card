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
        if (state.present) {
          state.past.push(state.present);
          if (state.past.length > state.maxHistory) {
            state.past.shift();
          }
        }
        state.present = project;
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
        result = state.past.pop() || null;
        state.present = result;
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
        result = state.future.shift() || null;
        state.present = result;
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
