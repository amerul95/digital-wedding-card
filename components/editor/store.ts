import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import React from 'react';

export type WidgetType =
    | 'root'
    | 'section'
    | 'container'
    | 'text'
    | 'image'
    | 'button'
    | 'card-stage'
    | 'video'
    | 'divider'
    | 'spacer'
    | 'icon'
    | 'map'
    | 'couple-header'
    | 'event-details'
    | 'slider'
    | 'countdown'
    | 'bottom-nav'
    | 'door'
    | 'modal'
    | 'congratulation-speech';

export interface NodeAnimation {
    enabled: boolean;
    trigger: "scroll" | "door" | "load" | "none";
    preset: "fadeUp" | "fade" | "slideLeft" | "slideRight";
    replay: boolean;
    duration?: number;
    delay?: number;
    threshold?: number;
}

export interface EditorNode {
    id: string;
    type: WidgetType;
    parentId: string | null;
    children: string[];
    data: Record<string, any>;
    style: Record<string, any>;
    animation?: NodeAnimation;
}

export interface GlobalSettings {
    autoscroll: boolean;
    autoscrollDelay: number; // in seconds
    backgroundMusic: {
        url: string;
        showVideo: boolean;
        duration: number; // in seconds
        startTime: number; // in seconds
    };
}

interface EditorState {
    nodes: Record<string, EditorNode>;
    rootId: string;
    selectedId: string | null;
    globalSettings: GlobalSettings;

    // View Options (Transient)
    viewOptions: {
        showDoorOverlay: boolean;
        showAnimation: boolean;
    };
    toggleViewOption: (key: 'showDoorOverlay' | 'showAnimation') => void;

    // Animation & Scroll State
    doorStatus: "closed" | "opening" | "opened";
    setDoorStatus: (status: "closed" | "opening" | "opened") => void;
    cardScrollElement: HTMLElement | null;
    setCardScrollElement: (element: HTMLElement | null) => void;
    bottomNavbarHeight: number;
    setBottomNavbarHeight: (height: number) => void;

    // Actions
    addNode: (node: EditorNode, parentId: string, index?: number) => void;
    removeNode: (id: string) => void;
    updateNodeData: (id: string, data: Partial<Record<string, any>>) => void;
    updateNodeStyle: (id: string, style: Partial<Record<string, any>>) => void;
    updateNodeAnimation: (id: string, animation: Partial<NodeAnimation>) => void;
    updateGlobalSettings: (settings: Partial<GlobalSettings | GlobalSettings['backgroundMusic']>) => void;
    moveNode: (id: string, newParentId: string, index: number) => void;
    selectNode: (id: string | null) => void;

    // Helpers
    getNode: (id: string) => EditorNode | undefined;
}

const INITIAL_ROOT_ID = 'root';

const createInitialState = () => ({
    nodes: {
        [INITIAL_ROOT_ID]: {
            id: INITIAL_ROOT_ID,
            type: 'root' as WidgetType,
            parentId: null,
            children: [],
            data: {},
            style: {
                width: '100%',
                minHeight: '100vh',
                backgroundColor: '#ffffff',
            },
        },
    },
    rootId: INITIAL_ROOT_ID,
    selectedId: null,
    globalSettings: {
        autoscroll: false,
        autoscrollDelay: 0,
        backgroundMusic: {
            url: '',
            showVideo: false,
            duration: 0,
            startTime: 0,
        },
    },
    viewOptions: {
        showDoorOverlay: true,
        showAnimation: true,
    },
    doorStatus: "closed" as const,
    cardScrollElement: null,
    bottomNavbarHeight: 80,
});

export const useEditorStore = create<EditorState>()(
    immer((set, get) => ({
        ...createInitialState(),

        toggleViewOption: (key) =>
            set((state) => {
                state.viewOptions[key] = !state.viewOptions[key];
            }),

        setDoorStatus: (status) =>
            set((state) => {
                state.doorStatus = status;
            }),

        setCardScrollElement: (element) =>
            set((state) => {
                state.cardScrollElement = element;
            }),

        setBottomNavbarHeight: (height) =>
            set((state) => {
                state.bottomNavbarHeight = height;
            }),

        addNode: (node, parentId, index) =>
            set((state) => {
                state.nodes[node.id] = node;
                const parent = state.nodes[parentId];
                if (parent) {
                    if (typeof index === 'number' && index >= 0 && index <= parent.children.length) {
                        parent.children.splice(index, 0, node.id);
                    } else {
                        parent.children.push(node.id);
                    }
                }
            }),

        removeNode: (id) =>
            set((state) => {
                const node = state.nodes[id];
                if (!node) return;

                // Remove from parent's children list
                if (node.parentId) {
                    const parent = state.nodes[node.parentId];
                    if (parent) {
                        parent.children = parent.children.filter((childId) => childId !== id);
                    }
                }

                // Recursive deletion function
                const deleteRecursive = (nodeId: string) => {
                    const n = state.nodes[nodeId];
                    if (n) {
                        n.children.forEach(deleteRecursive);
                        delete state.nodes[nodeId];
                    }
                };

                deleteRecursive(id);

                if (state.selectedId === id) {
                    state.selectedId = null;
                }
            }),

        updateNodeData: (id, data) =>
            set((state) => {
                if (state.nodes[id]) {
                    state.nodes[id].data = { ...state.nodes[id].data, ...data };
                }
            }),

        updateNodeStyle: (id, style) =>
            set((state) => {
                if (state.nodes[id]) {
                    state.nodes[id].style = { ...state.nodes[id].style, ...style };
                }
            }),

        updateNodeAnimation: (id, animation) =>
            set((state) => {
                if (state.nodes[id]) {
                    state.nodes[id].animation = {
                        ...state.nodes[id].animation,
                        ...animation,
                    } as NodeAnimation;
                }
            }),

        updateGlobalSettings: (settings) =>
            set((state) => {
                // handle nested backgroundMusic updates carefully if passed as a partial of the sub-object
                // But simplified: accept Partial<GlobalSettings> and merge.
                // Actually, let's make it robust to handle top-level keys.
                if ('url' in settings || 'showVideo' in settings || 'duration' in settings) {
                    state.globalSettings.backgroundMusic = { ...state.globalSettings.backgroundMusic, ...settings };
                } else {
                    // It's a top level update (like autoscroll)
                    Object.assign(state.globalSettings, settings);
                }
            }),

        moveNode: (id, newParentId, index) =>
            set((state) => {
                const node = state.nodes[id];
                const oldParent = node?.parentId ? state.nodes[node.parentId] : null;
                const newParent = state.nodes[newParentId];

                if (!node || !oldParent || !newParent) return;

                // Remove from old parent
                oldParent.children = oldParent.children.filter((childId) => childId !== id);

                // Add to new parent at index
                newParent.children.splice(index, 0, id);

                // Update node's parent reference
                node.parentId = newParentId;
            }),

        selectNode: (id) =>
            set((state) => {
                state.selectedId = id;
            }),

        getNode: (id) => get().nodes[id],
    }))
);
