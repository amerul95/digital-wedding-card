# Canvas Editor Architecture

This document explains how the canvas editor works at `http://localhost:3000/designer/create`.

## 🏗️ Architecture Overview

The canvas editor follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│  EditorPage (app/designer/create/page.tsx)              │
│  - Main container, keyboard shortcuts, URL sync          │
└─────────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼──────┐
│  Toolbar     │ │ EditorCanvas│ │ SectionsBar│
│  (Top)       │ │  (Center)   │ │  (Bottom)  │
└──────────────┘ └──────────────┘ └────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼──────┐
│  ToolsBar    │ │ SectionRenderer│ │ ToolsPanel│
│  (Left)      │ │  (Konva Stage) │ │  (Right) │
└──────────────┘ └──────────────┘ └────────────┘
                        │
                ┌───────▼────────┐
                │ CanvasObject   │
                │   Renderer     │
                └───────┬────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼──────┐
│ KonvaText    │ │ KonvaRect   │ │ KonvaCircle│
│ KonvaLine    │ │ KonvaImage  │ │ ...        │
└──────────────┘ └─────────────┘ └────────────┘
```

## 📊 Data Flow

### 1. **State Management (Zustand Stores)**

Three main stores manage the application state:

#### `projectStore.ts` - Core Data
```typescript
{
  project: Project | null          // The entire project data
  currentSectionId: string | null  // Currently active section
  selectedIds: string[]            // Selected object IDs
  tool: 'select' | 'text' | ...    // Active tool
  clipboard: CanvasObject[]        // Copied objects
}
```

**Project Structure:**
```
Project
├── id, name, createdAt, updatedAt
├── settings (themeFonts, themeColors, bleedMm, safePaddingPx)
├── sections[] (multiple pages/sections)
│   ├── id, name, size
│   ├── background (fill color)
│   └── objects[] (all canvas objects)
│       ├── TextObject
│       ├── RectObject
│       ├── CircleObject
│       ├── LineObject
│       └── ImageObject
└── player (auto-scroll, music settings)
```

#### `historyStore.ts` - Undo/Redo
```typescript
{
  past: Project[]      // History of previous states
  present: Project     // Current state
  future: Project[]    // Redo stack
}
```

#### `editorUIStore.ts` - UI State
```typescript
{
  activeTool: ActiveTool      // Which tool panel is open
  isPanelOpen: boolean        // Is right panel visible
  lastNonSelectTool: ActiveTool
}
```

### 2. **Rendering Pipeline**

#### Step 1: EditorPage loads project
```typescript
useEffect(() => {
  loadProject(); // Loads from localStorage
}, []);
```

#### Step 2: EditorCanvas receives project data
```typescript
const { project, currentSectionId, selectedIds, tool } = useProjectStore();
```

#### Step 3: Virtualization calculation
```typescript
// Only render active section + 1 before/after (max 3 Konva Stages)
const visibleSectionIndices = useMemo(() => {
  // Calculate which sections to render
}, [project, currentSectionId]);
```

#### Step 4: SectionRenderer creates Konva Stage
```typescript
<Stage width={stageWidth} height={stageHeight}>
  <Layer>
    <Group scaleX={editScale} scaleY={editScale}>
      <Rect name="background" />  // Background
      {/* Objects */}
      {section.objects.map(object => (
        <Group id={object.id}>
          <CanvasObjectRenderer object={object} />
        </Group>
      ))}
      <Transformer />  // Selection handles
    </Group>
  </Layer>
</Stage>
```

#### Step 5: CanvasObjectRenderer dispatches to specific renderer
```typescript
switch (object.type) {
  case 'text': return <KonvaTextComponent />
  case 'rect': return <KonvaRectComponent />
  case 'circle': return <KonvaCircleComponent />
  // ...
}
```

## 🎨 Rendering System

### Coordinate System

**Design Space (900×1600px):**
- All objects stored in design coordinates
- Fixed size: 900px wide × 1600px tall
- Objects positioned using design units

**Screen Space:**
- Design coordinates scaled for display
- `editScale = 0.4` (40% size for editing)
- `workspaceScale` (global zoom, 0.2x to 4x)
- Final scale: `displayScale = editScale * workspaceScale`

**Example:**
```
Object at (100, 200) in design space
→ Rendered at (100 * 0.4 * 1.0, 200 * 0.4 * 1.0) = (40, 80) in screen
```

### Virtualization

**Problem:** Rendering 10+ sections with many objects = slow

**Solution:** Only render 3 sections at a time
```typescript
// Visible sections: [previous, current, next]
// Non-visible sections: Show cached PNG snapshot
```

**Benefits:**
- Reduces DOM nodes from N stages to max 3
- Prevents mounting/unmounting during scroll
- Non-active sections show static images

### Snapshot System

When switching sections:
1. Generate PNG snapshot of previous section
2. Cache it in memory
3. Show snapshot for non-active sections
4. Only active section uses live Konva

## 🖱️ Event Handling Flow

### Object Selection
```
User clicks object
  → handleObjectClick()
  → setSelectedIds([objectId])
  → Transformer updates
  → Shows selection handles
```

### Object Dragging
```
User drags object
  → onDragMove (real-time)
  → snap() calculates snap positions
  → Updates node position visually
  → onDragEnd
  → updateObject() saves to store
```

### Object Transformation
```
User resizes/rotates
  → onTransform (real-time)
  → snap() calculates snap positions
  → Updates node visually
  → onTransformEnd
  → updateObject() saves dimensions
```

### Text Editing
```
User double-clicks text
  → onDblClick
  → setEditingTextId(objectId)
  → TextEditOverlay renders
  → Finds Konva Text node
  → Creates textarea overlay
  → Matches styles from text node
  → User edits text
  → updateObject() saves text
```

## 🔧 Key Components

### 1. EditorCanvas
**Purpose:** Main canvas container, orchestrates sections

**Responsibilities:**
- Manages virtualization (which sections to render)
- Handles object creation (from UI buttons only)
- Manages selection state
- Coordinates drag/transform handlers
- Handles snapping logic

**Key Features:**
- Virtualization (max 3 sections rendered)
- Real-time snapping during drag/transform
- Auto-select tool when mouse enters canvas

### 2. SectionRenderer
**Purpose:** Renders a single section as Konva Stage

**Responsibilities:**
- Creates Konva Stage for section
- Renders background and guides
- Renders all objects in section
- Handles stage-level events (click, drag)
- Manages Transformer for selection

**Key Features:**
- Shows live Konva for active section
- Shows static snapshot for non-active sections
- Handles click detection (stage vs object vs transformer)

### 3. CanvasObjectRenderer
**Purpose:** Routes to specific object renderer

**Pattern:** Factory pattern - dispatches based on object type

### 4. Konva Components (KonvaText, KonvaRect, etc.)
**Purpose:** Render specific object types using Konva primitives

**Pattern:** Direct mapping to Konva shapes
- TextObject → Konva.Text
- RectObject → Konva.Rect
- CircleObject → Konva.Circle
- etc.

## 🎯 Interaction Patterns

### Object Creation (Canva/Polotno Pattern)
```
1. User clicks button in left panel (e.g., "Add Rectangle")
2. Button handler calls addObject()
3. Object created at center: x=(DESIGN_W-width)/2, y=(DESIGN_H-height)/2
4. Object appears on canvas
5. Object is automatically selected
```

**Important:** Objects are NEVER created from canvas clicks - only from UI buttons.

### Object Selection
```
1. Mouse enters canvas → Auto-switch to select tool
2. User clicks object → Selects it
3. Shift+Click → Multi-select
4. Click empty space → Deselect
```

### Object Manipulation
```
1. Select object → Transformer appears
2. Drag → Move object (with snapping)
3. Resize handles → Resize object
4. Rotate handle → Rotate object
5. Arrow keys → Nudge object
```

### Text Editing
```
1. Double-click text object
2. Konva text hidden (opacity: 0)
3. TextEditOverlay appears
4. Textarea matches Konva text styles
5. User edits text
6. On blur/Enter → Save and hide overlay
7. Konva text shows updated text
```

## ⚡ Performance Optimizations

### 1. Virtualization
- Only 3 sections rendered at once
- Reduces DOM nodes significantly
- Prevents performance degradation with many sections

### 2. Snapshot Caching
- Non-active sections show PNG images
- No Konva rendering for hidden sections
- Fast section switching

### 3. rAF Throttling
- Scroll events use requestAnimationFrame
- Prevents React state updates on every scroll tick
- Smooth scrolling performance

### 4. Event Batching
- State updates batched with requestAnimationFrame
- Prevents multiple re-renders during interactions
- Smooth drag/transform operations

### 5. Snapping Optimization
- Snapping calculated in real-time during drag
- Visual guides shown immediately
- No lag during object manipulation

## 🔄 Data Persistence

### Storage Flow
```
User action (add/update/delete object)
  → projectStore action
  → updateProject() with immer
  → project.updatedAt = Date.now()
  → saveProject() to localStorage
  → historyStore.push() for undo/redo
```

### Loading Flow
```
Page loads
  → loadProject() from localStorage
  → If no project, createDefaultProject()
  → Set currentSectionId to first section
  → Render canvas
```

## 🎨 Styling & Scaling

### Design Dimensions
- Fixed: 900px × 1600px (9:16 aspect ratio)
- All objects use these coordinates

### Display Scaling
```
Design Space: 900×1600
  ↓ editScale (0.4)
Display Space: 360×640
  ↓ workspaceScale (user zoom)
Final Display: varies
```

### Bleed & Safe Zones
- Bleed: 3mm default (red dashed line)
- Safe Zone: 20px default (green dashed line)
- Only shown on active section

## 🛠️ Tools System

### Tool Types
1. **Select** - Automatic (when mouse enters canvas)
2. **Text** - Creates text objects
3. **Elements** - Creates shapes (rect, circle, line)
4. **Uploads** - Image upload
5. **Sections** - Page management
6. **Layers** - Layer management
7. **Settings** - Project settings

### Tool Flow
```
User clicks tool in ToolsBar
  → toggleTool('text')
  → editorUIStore updates
  → ToolsDetailsPanel opens
  → User clicks "Add Heading"
  → addObject() called
  → Object appears at center
```

## 📝 Key Patterns

### 1. **Single Source of Truth**
- All data in `projectStore`
- Components read from store
- Updates go through store actions

### 2. **Immutable Updates**
- Uses Immer for immutable updates
- Prevents accidental mutations
- Enables undo/redo

### 3. **Event Delegation**
- Stage handles click detection
- Routes to appropriate handler
- Prevents event conflicts

### 4. **Coordinate Transformation**
- Objects stored in design space
- Converted to screen space for rendering
- Handled by Konva transforms

### 5. **Separation of Concerns**
- Canvas = Rendering
- Store = State
- Components = UI
- Hooks = Logic

## 🔍 Debugging Tips

### Check State
```typescript
const { project, selectedIds, tool } = useProjectStore.getState();
console.log('Project:', project);
console.log('Selected:', selectedIds);
console.log('Tool:', tool);
```

### Check Konva Nodes
```typescript
const stage = stageRef.current;
const group = stage.findOne('#objectId');
const textNode = group.findOne('Text');
console.log('Text node:', textNode);
console.log('Position:', textNode.position());
console.log('Scale:', textNode.getAbsoluteScale());
```

### Performance Monitoring
- Check React DevTools for re-renders
- Use Konva DevTools for canvas debugging
- Monitor localStorage size for project data

## 🚀 Future Improvements

1. **Server-side persistence** (replace localStorage)
2. **Collaborative editing** (WebSockets)
3. **Advanced grouping** (nested groups)
4. **Animation support** (keyframes)
5. **Export optimization** (worker threads)
