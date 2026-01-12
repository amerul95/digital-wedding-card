# Mini Canva Editor - Wedding E-Card Editor

A Canva-like web editor for creating digital wedding e-cards with print export capabilities.

## Features

### Core Editor
- **Multi-section Projects**: Create projects with multiple sections (9:16 portrait ratio)
- **Object Tools**: Text, Rectangle, Circle, Line, Image
- **Selection & Transform**: Click to select, drag to move, resize/rotate with handles
- **Layers Panel**: View and manage object layers, lock/hide, reorder
- **Properties Panel**: Edit position, size, rotation, opacity, and type-specific properties
- **Sections Panel**: Add, duplicate, delete, and reorder sections
- **Undo/Redo**: Full history support (50 actions)

### Advanced Features (Phase 2)
- **Alignment & Distribution**: Align and distribute multiple selected objects
- **Grouping**: Group/ungroup objects for easier manipulation
- **Copy/Paste**: Copy objects with offset, duplicate shortcut
- **Copy/Paste Style**: Copy visual styles between objects
- **Snap to Objects**: Smart snapping to other objects' edges and centers
- **Context Menu**: Right-click for quick actions (bring forward, duplicate, delete, etc.)
- **Zoom & Pan**: Ctrl/Cmd + mouse wheel to zoom, spacebar + drag to pan

### Preview/Player Mode
- **Scrollable View**: All sections combined in one scrollable card
- **Auto-scroll**: Configurable speed with play/pause
- **Snap to Sections**: Automatically snap to section boundaries
- **Background Music**: Upload audio, play/pause, volume, loop
- **Mobile Support**: Tap-to-start overlay for autoplay restrictions

### Export
- **Digital PNG**: Export sections as high-resolution PNG (2x pixel ratio)
- **Print PNG**: Export with print presets:
  - 5x7 inch @ 300 DPI
  - 4x6 inch @ 300 DPI
  - A6 (105x148mm) @ 300 DPI
- **Bleed Support**: Configurable bleed (default 3mm) with visual guides
- **Safe Zone**: Visual guides for safe content area

## Technical Details

### Scaling Logic

#### Editor Mode
- Always uses `scaleContain` = `min(vw/DW, vh/DH)`
- Artboard is centered with side margins
- Full viewport height maintained

#### Preview Mode
- **Desktop**: `scaleContain` (same as editor)
- **Mobile**: `scaleCover` = `max(vw/DW, vh/DH)`
  - Full width and height coverage
  - May crop content (safe zone guides help)

### Design Units
- Fixed design dimensions: 900px × 1600px (9:16 ratio)
- All objects use design coordinates
- Scaling applied at render time

### Print DPI Presets

All print exports use 300 DPI:

1. **5x7 inch**: 1500 × 2100 pixels
2. **4x6 inch**: 1200 × 1800 pixels
3. **A6**: 1240 × 1748 pixels (105×148mm converted)

Bleed is added to all sides:
- Default: 3mm = ~35 pixels at 300 DPI
- Configurable in project settings

### Audio Persistence

**Limitation**: Audio files are stored as object URLs (blob URLs) in localStorage. These URLs are:
- Browser-specific
- Session-specific (may expire)
- Not shareable across devices

**Recommendation**: For production, implement server-side storage for audio files.

## Keyboard Shortcuts

- `Delete` / `Backspace`: Delete selected objects
- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Shift + Z`: Redo
- `Ctrl/Cmd + C`: Copy
- `Ctrl/Cmd + V`: Paste (with offset)
- `Ctrl/Cmd + D`: Duplicate
- `Ctrl/Cmd + A`: Select all in current section
- `Arrow Keys`: Nudge selected objects (Shift for bigger nudge)
- `Alt + Shift + C`: Copy style
- `Alt + Shift + V`: Paste style
- `Ctrl/Cmd + Mouse Wheel`: Zoom
- `Spacebar + Drag`: Pan canvas

## Project Structure

```
src/
  designer/
    editor/
      canvas/          # Konva canvas components
      components/      # UI components (toolbar, modals, etc.)
      panels/          # Sidebar panels
      hooks/           # Custom hooks (viewport, snapping)
      export/          # Export utilities
  store/              # Zustand stores
  lib/                 # Utilities (geometry, storage, etc.)
app/
  designer/dashboard/create/
    page.tsx          # Main editor page
    preview/
      page.tsx        # Preview/player page
```

## Data Model

Projects are stored in localStorage with the following structure:

```typescript
Project {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  settings: {
    themeFonts: string[]
    themeColors: string[]
    bleedMm: number
    safePaddingPx: number
  }
  sections: Section[]
  player: {
    autoScrollEnabled: boolean
    autoScrollSpeed: number
    snapEnabled: boolean
    music: {
      src?: string
      volume: number
      loop: boolean
    }
  }
}
```

## Usage

1. Navigate to `/designer/dashboard/create`
2. Select a tool from the toolbar
3. Click on canvas to add objects
4. Select objects to edit properties
5. Use sections panel to manage multiple sections
6. Click Preview button to view combined card
7. Export via Export button in toolbar

## Future Enhancements

- Server-side PDF export
- Cloud storage for projects
- Templates library
- Collaboration features
- Advanced image editing (crop, filters)
- More shape tools (polygon, curve)
- Text effects (shadows, outlines)
