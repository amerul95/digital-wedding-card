# Files Used in `/designer/create` Page

This document lists all files that are used in the designer create page (`app/designer/create/page.tsx`).

## Main Page
- `app/designer/create/page.tsx` - Main editor page component

## Store Files (State Management)
- `src/store/projectStore.ts` - Project state management (Zustand)
- `src/store/historyStore.ts` - Undo/redo history management
- `src/store/editorUIStore.ts` - UI state (panels, active tool, etc.)
- `src/store/types.ts` - TypeScript type definitions

## Canvas Components
- `src/designer/editor/canvas/EditorCanvas.tsx` - Main canvas component
- `src/designer/editor/canvas/SectionRenderer.tsx` - Renders individual sections
- `src/designer/editor/canvas/CanvasObjectRenderer.tsx` - Renders canvas objects
- `src/designer/editor/canvas/KonvaText.tsx` - Text object renderer
- `src/designer/editor/canvas/KonvaRect.tsx` - Rectangle object renderer
- `src/designer/editor/canvas/KonvaCircle.tsx` - Circle object renderer
- `src/designer/editor/canvas/KonvaLine.tsx` - Line object renderer
- `src/designer/editor/canvas/KonvaImage.tsx` - Image object renderer

## Editor Components
- `src/designer/editor/components/Toolbar.tsx` - Top toolbar with actions
- `src/designer/editor/components/TextEditOverlay.tsx` - Text editing overlay
- `src/designer/editor/components/ExportModal.tsx` - Export dialog
- `src/designer/editor/components/ContextMenu.tsx` - Context menu (if used)

## Tools & Panels
- `src/designer/editor/tools/ToolsBar.tsx` - Left vertical tools bar
- `src/designer/editor/tools/ToolsDetailsPanel.tsx` - Right side details panel
- `src/designer/editor/tools/panels/TextPanel.tsx` - Text tool panel
- `src/designer/editor/tools/panels/ElementsPanel.tsx` - Elements tool panel
- `src/designer/editor/tools/panels/ShapesPanel.tsx` - Shapes tool panel
- `src/designer/editor/tools/panels/UploadsPanel.tsx` - Uploads tool panel
- `src/designer/editor/tools/panels/SectionsPanel.tsx` - Sections management panel
- `src/designer/editor/tools/panels/LayersPanel.tsx` - Layers panel
- `src/designer/editor/tools/panels/SettingsPanel.tsx` - Settings panel

## Panels
- `src/designer/editor/panels/SectionsBar.tsx` - Bottom sections bar
- `src/designer/editor/panels/SectionThumbnail.tsx` - Section thumbnail component
- `src/designer/editor/panels/SectionsPanel.tsx` - Sections panel (alternative)
- `src/designer/editor/panels/LayersPanel.tsx` - Layers panel (alternative)
- `src/designer/editor/panels/PropertiesPanel.tsx` - Properties panel (if used)
- `src/designer/editor/panels/ToolsPanel.tsx` - Tools panel (if used)

## Hooks
- `src/designer/editor/hooks/useRafScroll.ts` - RAF-throttled scroll hook
- `src/designer/editor/hooks/useArtboardViewport.ts` - Viewport calculation hook
- `src/designer/editor/hooks/useSnapping.ts` - Snapping logic hook

## Utils
- `src/designer/editor/utils/getActiveSectionFromScroll.ts` - Scroll-based section detection
- `src/designer/editor/utils/sectionSnapshot.ts` - Section snapshot generation
- `src/designer/editor/export/exportUtils.ts` - Export utilities

## UI Components (from components/ui)
- `components/ui/button.tsx` - Button component
- `components/ui/tooltip.tsx` - Tooltip component
- `components/ui/dialog.tsx` - Dialog component (used in Toolbar)
- `components/ui/input.tsx` - Input component (used in Toolbar)
- `components/ui/label.tsx` - Label component (used in Toolbar)
- `components/ui/select.tsx` - Select component (used in Toolbar)

## External Libraries
- `react` - React framework
- `react-dom` - React DOM
- `react-konva` - Konva React bindings
- `konva` - 2D canvas library
- `react-hotkeys-hook` - Keyboard shortcuts
- `next/navigation` - Next.js navigation (useRouter, useSearchParams)
- `lucide-react` - Icons (ZoomIn, ZoomOut, etc.)
- `sonner` - Toast notifications (used in Toolbar)

## Utility Files
- `src/lib/geometry.ts` - Geometry utilities (used by snapping)
- `src/lib/useMediaQuery.ts` - Media query hook (used in ToolsDetailsPanel)

## Summary
- **Total Files**: ~50+ files
- **Main Components**: 1 page + 3 stores + ~20 components
- **Canvas Components**: 7 files
- **Tools & Panels**: 9 files
- **Hooks & Utils**: 6 files
- **UI Components**: 6+ files
