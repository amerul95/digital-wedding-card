/**
 * Zustand store for project state
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { generateId } from '@/lib/designer/ids';
import { loadProject, saveProject } from '@/lib/designer/storage';
import {
  Project,
  Section,
  CanvasObject,
  ProjectSettings,
  PlayerSettings,
  DESIGN_W,
  DESIGN_H,
} from './types';

interface ProjectState {
  project: Project | null;
  currentSectionId: string | null;
  selectedIds: string[];
  tool: 'select' | 'text' | 'rect' | 'circle' | 'line' | 'image';
  clipboard: CanvasObject[] | null;
  clipboardStyle: Partial<CanvasObject> | null;
  
  // Actions
  loadProject: () => void;
  createNewProject: () => void;
  updateProject: (updater: (project: Project) => void) => void;
  setCurrentSection: (sectionId: string) => void;
  addSection: (name?: string) => string;
  duplicateSection: (sectionId: string) => string;
  deleteSection: (sectionId: string) => void;
  reorderSection: (fromIndex: number, toIndex: number) => void;
  addObject: (sectionId: string, object: Omit<CanvasObject, 'id'>) => string;
  updateObject: (sectionId: string, objectId: string, updates: Partial<CanvasObject>) => void;
  deleteObject: (sectionId: string, objectId: string) => void;
  duplicateObject: (sectionId: string, objectId: string) => string;
  setSelectedIds: (ids: string[]) => void;
  setTool: (tool: 'select' | 'text' | 'rect' | 'circle' | 'line' | 'image') => void;
  setClipboard: (objects: CanvasObject[] | null) => void;
  setClipboardStyle: (style: Partial<CanvasObject> | null) => void;
  reorderObject: (sectionId: string, objectId: string, direction: 'up' | 'down' | 'top' | 'bottom') => void;
  groupObjects: (sectionId: string, objectIds: string[]) => string;
  ungroupObject: (sectionId: string, groupId: string) => void;
}

function createDefaultProject(): Project {
  const section1: Section = {
    id: generateId(),
    name: 'Section 1',
    size: { w: DESIGN_W, h: DESIGN_H },
    background: { fill: '#ffffff' },
    objects: [],
  };

  const section2: Section = {
    id: generateId(),
    name: 'Section 2',
    size: { w: DESIGN_W, h: DESIGN_H },
    background: { fill: '#ffffff' },
    objects: [],
  };

  const section3: Section = {
    id: generateId(),
    name: 'Section 3',
    size: { w: DESIGN_W, h: DESIGN_H },
    background: { fill: '#ffffff' },
    objects: [],
  };

  const section4: Section = {
    id: generateId(),
    name: 'Section 4',
    size: { w: DESIGN_W, h: DESIGN_H },
    background: { fill: '#ffffff' },
    objects: [],
  };

  return {
    id: generateId(),
    name: 'New Project',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    settings: {
      themeFonts: ['Arial', 'Helvetica', 'Times New Roman', 'Georgia'],
      themeColors: ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff'],
      bleedMm: 3,
      safePaddingPx: 20,
    },
    sections: [section1, section2, section3, section4],
    player: {
      autoScrollEnabled: false,
      autoScrollSpeed: 50,
      snapEnabled: false,
      music: {
        volume: 0.5,
        loop: true,
      },
    },
  };
}

export const useProjectStore = create<ProjectState>()(
  immer((set, get) => ({
    project: null,
    currentSectionId: null,
    selectedIds: [],
    tool: 'select',
    clipboard: null,
    clipboardStyle: null,

    loadProject: () => {
      const saved = loadProject();
      if (saved) {
        set((state) => {
          state.project = saved;
          state.currentSectionId = saved.sections[0]?.id || null;
        });
      } else {
        const newProject = createDefaultProject();
        set((state) => {
          state.project = newProject;
          state.currentSectionId = newProject.sections[0]?.id || null;
        });
        saveProject(newProject);
      }
    },

    createNewProject: () => {
      const newProject = createDefaultProject();
      set((state) => {
        state.project = newProject;
        state.currentSectionId = newProject.sections[0]?.id || null;
        state.selectedIds = [];
      });
      saveProject(newProject);
    },

    updateProject: (updater) => {
      set((state) => {
        if (state.project) {
          updater(state.project);
          state.project.updatedAt = Date.now();
          saveProject(state.project);
        }
      });
    },

    setCurrentSection: (sectionId) => {
      set((state) => {
        state.currentSectionId = sectionId;
        state.selectedIds = [];
      });
    },

    addSection: (name) => {
      let newId = '';
      set((state) => {
        if (!state.project) return;
        const section: Section = {
          id: generateId(),
          name: name || `Section ${state.project.sections.length + 1}`,
          size: { w: DESIGN_W, h: DESIGN_H },
          background: { fill: '#ffffff' },
          objects: [],
        };
        newId = section.id;
        state.project.sections.push(section);
        state.project.updatedAt = Date.now();
        saveProject(state.project);
      });
      return newId;
    },

    duplicateSection: (sectionId) => {
      let newId = '';
      set((state) => {
        if (!state.project) return;
        const section = state.project.sections.find((s) => s.id === sectionId);
        if (!section) return;
        const duplicated: Section = {
          ...section,
          id: generateId(),
          name: `${section.name} (Copy)`,
          objects: section.objects.map((obj) => ({
            ...obj,
            id: generateId(),
            x: obj.x + 20,
            y: obj.y + 20,
          })),
        };
        newId = duplicated.id;
        const index = state.project.sections.findIndex((s) => s.id === sectionId);
        state.project.sections.splice(index + 1, 0, duplicated);
        state.project.updatedAt = Date.now();
        saveProject(state.project);
      });
      return newId;
    },

    deleteSection: (sectionId) => {
      set((state) => {
        if (!state.project) return;
        if (state.project.sections.length <= 1) return;
        state.project.sections = state.project.sections.filter(
          (s) => s.id !== sectionId
        );
        if (state.currentSectionId === sectionId) {
          state.currentSectionId = state.project.sections[0]?.id || null;
        }
        state.selectedIds = [];
        state.project.updatedAt = Date.now();
        saveProject(state.project);
      });
    },

    reorderSection: (fromIndex, toIndex) => {
      set((state) => {
        if (!state.project) return;
        const [removed] = state.project.sections.splice(fromIndex, 1);
        state.project.sections.splice(toIndex, 0, removed);
        state.project.updatedAt = Date.now();
        saveProject(state.project);
      });
    },

    addObject: (sectionId, object) => {
      let newId = '';
      set((state) => {
        if (!state.project) return;
        const section = state.project.sections.find((s) => s.id === sectionId);
        if (!section) return;
        const newObject = { ...object, id: generateId() } as CanvasObject;
        newId = newObject.id;
        section.objects.push(newObject);
        state.project.updatedAt = Date.now();
        saveProject(state.project);
      });
      return newId;
    },

    updateObject: (sectionId, objectId, updates) => {
      set((state) => {
        if (!state.project) return;
        const section = state.project.sections.find((s) => s.id === sectionId);
        if (!section) return;
        const obj = section.objects.find((o) => o.id === objectId);
        if (!obj) return;
        Object.assign(obj, updates);
        state.project.updatedAt = Date.now();
        saveProject(state.project);
      });
    },

    deleteObject: (sectionId, objectId) => {
      set((state) => {
        if (!state.project) return;
        const section = state.project.sections.find((s) => s.id === sectionId);
        if (!section) return;
        section.objects = section.objects.filter((o) => o.id !== objectId);
        state.selectedIds = state.selectedIds.filter((id) => id !== objectId);
        state.project.updatedAt = Date.now();
        saveProject(state.project);
      });
    },

    duplicateObject: (sectionId, objectId) => {
      let newId = '';
      set((state) => {
        if (!state.project) return;
        const section = state.project.sections.find((s) => s.id === sectionId);
        if (!section) return;
        const obj = section.objects.find((o) => o.id === objectId);
        if (!obj) return;
        const duplicated = { ...obj, id: generateId(), x: obj.x + 20, y: obj.y + 20 };
        newId = duplicated.id;
        section.objects.push(duplicated);
        state.project.updatedAt = Date.now();
        saveProject(state.project);
      });
      return newId;
    },

    setSelectedIds: (ids) => {
      set((state) => {
        state.selectedIds = ids;
      });
    },

    setTool: (tool) => {
      set((state) => {
        state.tool = tool;
        if (tool !== 'select') {
          state.selectedIds = [];
        }
      });
    },

    setClipboard: (objects) => {
      set((state) => {
        state.clipboard = objects;
      });
    },

    setClipboardStyle: (style) => {
      set((state) => {
        state.clipboardStyle = style;
      });
    },

    reorderObject: (sectionId, objectId, direction) => {
      set((state) => {
        if (!state.project) return;
        const section = state.project.sections.find((s) => s.id === sectionId);
        if (!section) return;
        const index = section.objects.findIndex((o) => o.id === objectId);
        if (index === -1) return;

        if (direction === 'up' && index < section.objects.length - 1) {
          [section.objects[index], section.objects[index + 1]] = [
            section.objects[index + 1],
            section.objects[index],
          ];
        } else if (direction === 'down' && index > 0) {
          [section.objects[index], section.objects[index - 1]] = [
            section.objects[index - 1],
            section.objects[index],
          ];
        } else if (direction === 'top') {
          const [obj] = section.objects.splice(index, 1);
          section.objects.push(obj);
        } else if (direction === 'bottom') {
          const [obj] = section.objects.splice(index, 1);
          section.objects.unshift(obj);
        }
        state.project.updatedAt = Date.now();
        saveProject(state.project);
      });
    },

    groupObjects: (sectionId, objectIds) => {
      let groupId = '';
      set((state) => {
        if (!state.project) return;
        const section = state.project.sections.find((s) => s.id === sectionId);
        if (!section) return;
        if (objectIds.length < 2) return;

        const objects = section.objects.filter((o) => objectIds.includes(o.id));
        if (objects.length < 2) return;

        // Calculate group bounds
        let minX = Infinity,
          minY = Infinity,
          maxX = -Infinity,
          maxY = -Infinity;
        objects.forEach((obj) => {
          minX = Math.min(minX, obj.x);
          minY = Math.min(minY, obj.y);
          maxX = Math.max(maxX, obj.x + obj.width);
          maxY = Math.max(maxY, obj.y + obj.height);
        });

        // Create group
        const group: any = {
          id: generateId(),
          type: 'group',
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
          rotation: 0,
          opacity: 1,
          locked: false,
          hidden: false,
          children: objects.map((obj) => ({
            ...obj,
            x: obj.x - minX,
            y: obj.y - minY,
          })),
        };
        groupId = group.id;

        // Remove original objects and add group
        section.objects = section.objects.filter((o) => !objectIds.includes(o.id));
        section.objects.push(group);
        state.project.updatedAt = Date.now();
        saveProject(state.project);
      });
      return groupId;
    },

    ungroupObject: (sectionId, groupId) => {
      set((state) => {
        if (!state.project) return;
        const section = state.project.sections.find((s) => s.id === sectionId);
        if (!section) return;
        const group = section.objects.find((o) => o.id === groupId) as any;
        if (!group || group.type !== 'group') return;

        // Restore children with group position
        const children = group.children.map((child: any) => ({
          ...child,
          id: generateId(),
          x: child.x + group.x,
          y: child.y + group.y,
        }));

        // Remove group and add children
        section.objects = section.objects.filter((o) => o.id !== groupId);
        section.objects.push(...children);
        state.project.updatedAt = Date.now();
        saveProject(state.project);
      });
    },
  }))
);
