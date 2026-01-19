# Create Theme 2 Page Architecture

## Overview

The `/designer/dashboard/create-theme` page is a Next.js route that serves as an entry point to the Wedding Card Editor v2.0. This page provides a visual, drag-and-drop interface for designers to create and customize wedding invitation cards with a modern, component-based architecture.

## Page Structure

### Route File
- **Location**: `app/designer/dashboard/create-theme/page.tsx`
- **Type**: Client Component (Next.js App Router)
- **Complexity**: Minimal wrapper component

```tsx
export default function CreateTheme2Page() {
    return <EditorLayout />
}
```

The page is intentionally simple, delegating all functionality to the `EditorLayout` component.

## Core Component: EditorLayout

### Location
`components/editor/EditorLayout.tsx`

### Purpose
The `EditorLayout` component orchestrates the entire editor interface, providing:
- Drag-and-drop functionality for adding widgets
- State management integration
- Layout structure for all editor panels
- Visual feedback during drag operations

### Architecture Components

#### 1. **State Management**
- **Store**: `components/editor/store.ts`
- **Technology**: Zustand with Immer middleware
- **Purpose**: Centralized state management for:
  - Editor nodes (hierarchical widget tree)
  - Selected node tracking
  - Global settings (autoscroll, background music)
  - View options (door overlay, animations)

#### 2. **Drag and Drop System**
- **Library**: `@dnd-kit/core`
- **Implementation**: 
  - `DndContext` wraps the entire editor
  - `PointerSensor` with 8px activation distance
  - Drag overlay for visual feedback
  - Handles widget creation from sidebar to canvas

#### 3. **Layout Structure**

```
┌─────────────────────────────────────────────────┐
│ TopBar (Save, Preview, Title)                  │
├──────────┬──────────────────┬───────────────────┤
│          │                  │                   │
│ Sidebar  │    Canvas        │ PropertyPanel     │
│ (Widgets)│  (CardStage)     │ (Node Settings)   │
│          │                  │                   │
│          │  ┌────────────┐  │                   │
│          │  │ RightSidebar│ │                   │
│          │  │ (Preview)   │ │                   │
│          │  └────────────┘  │                   │
└──────────┴──────────────────┴───────────────────┘
```

### Component Hierarchy

#### **TopBar** (`components/editor/TopBar.tsx`)
- **Purpose**: Editor header with actions
- **Features**:
  - Preview button (opens preview in new tab)
  - Save button (placeholder)
  - Version badge (v2.0)

#### **Sidebar** (`components/editor/Sidebar.tsx`)
- **Purpose**: Widget palette for drag-and-drop
- **Widget Categories**:
  - **Layout**: Section, Container
  - **Basic**: Text, Image, Button, Divider, Spacer, Icon
  - **Wedding**: Couple Header, Event Details, Countdown, Image Slider, Congratulation Speech, Bottom Nav
  - **Media**: Video, Google Maps
- **Implementation**: Uses `@dnd-kit` draggable items

#### **Canvas** (`components/editor/Canvas.tsx`)
- **Purpose**: Main editing area
- **Features**:
  - View toggles (Show Door, Show Animation)
  - Mobile/Desktop preview toggle
  - Contains `CardStage` component
  - Integrates `RightSidebar` for preview

#### **CardStage** (`components/editor/canvas/CardStage.tsx`)
- **Purpose**: Renders the actual card content
- **Features**:
  - Drop zone for widgets
  - Mobile frame provider context
  - Renders node tree recursively
  - Handles door overlay rendering

#### **PropertyPanel** (`components/editor/PropertyPanel.tsx`)
- **Purpose**: Edit selected node properties
- **Features**:
  - Style controls (padding, margin, borders, colors)
  - Content editing (text, images, etc.)
  - Layout controls (alignment, flexbox)
  - Widget-specific settings
  - Door and animation settings
- **Behavior**: Auto-opens when node is selected

#### **RightSidebar** (`components/editor/RightSidebar.tsx`)
- **Purpose**: Preview and global settings
- **Features**:
  - Mobile/Desktop view toggle
  - Global settings (autoscroll, background music)
  - Preview controls
  - Collapsible panel

## Data Flow

### 1. Widget Creation Flow
```
User drags widget from Sidebar
    ↓
DndContext detects drag start
    ↓
handleDragStart sets activeDragItem
    ↓
User drops on Canvas drop zone
    ↓
handleDragEnd creates new EditorNode
    ↓
addNode() updates Zustand store
    ↓
Canvas re-renders with new node
```

### 2. Node Selection Flow
```
User clicks on widget in Canvas
    ↓
NodeRenderer handles click event
    ↓
selectNode() updates store
    ↓
PropertyPanel auto-opens
    ↓
PropertyPanel displays node properties
```

### 3. Property Update Flow
```
User edits property in PropertyPanel
    ↓
updateNodeData() or updateNodeStyle() called
    ↓
Zustand store updates
    ↓
NodeRenderer re-renders with new props
    ↓
Visual update in Canvas
```

## Widget System

### Widget Types
All widgets are defined in `components/editor/widgets/`:
- `TextWidget.tsx` - Rich text content
- `ImageWidget.tsx` - Image display
- `ButtonWidget.tsx` - Interactive buttons
- `ContainerWidget.tsx` - Layout container
- `SectionWidget.tsx` - Page sections
- `CoupleHeaderWidget.tsx` - Wedding-specific header
- `CountdownWidget.tsx` - Event countdown timer
- `ImageSliderWidget.tsx` - Image carousel
- `CongratulationSpeechWidget.tsx` - Guest messages
- `BottomNavWidget.tsx` - Navigation bar
- `DoorWidget.tsx` - Animated door overlay
- And more...

### Widget Structure
Each widget follows this pattern:
```tsx
interface WidgetProps {
    id: string;
    data: Record<string, any>;
    style: Record<string, any>;
}

export function Widget({ id, data, style }: WidgetProps) {
    // Widget implementation
}
```

## Node Rendering System

### NodeRenderer (`components/editor/NodeRenderer.tsx`)
- **Purpose**: Recursively renders the node tree
- **Features**:
  - Handles all widget types
  - Manages drop zones for nested widgets
  - Provides selection highlighting
  - Handles click events for selection

### Node Tree Structure
```
root (EditorNode)
  ├── section-1
  │   ├── container-1
  │   │   ├── text-1
  │   │   └── image-1
  │   └── couple-header-1
  ├── section-2
  │   └── countdown-1
  └── bottom-nav-1
```

## State Management

### EditorStore Structure
```typescript
interface EditorState {
    nodes: Record<string, EditorNode>;  // All nodes by ID
    rootId: string;                      // Root node ID
    selectedId: string | null;           // Currently selected node
    globalSettings: GlobalSettings;      // Global card settings
    viewOptions: {                       // UI view toggles
        showDoorOverlay: boolean;
        showAnimation: boolean;
    };
}
```

### Key Actions
- `addNode()` - Add new widget to tree
- `removeNode()` - Delete widget
- `updateNodeData()` - Update widget content
- `updateNodeStyle()` - Update widget styling
- `moveNode()` - Reorder widgets
- `selectNode()` - Select widget for editing
- `updateGlobalSettings()` - Update card-level settings

## Context Providers

### MobileFrameContext
- **Location**: `components/editor/context/MobileFrameContext.tsx`
- **Purpose**: Provides mobile frame dimensions and styling
- **Usage**: Used by widgets to adapt to mobile view

### PreviewContext
- **Location**: `components/editor/context/PreviewContext.tsx`
- **Purpose**: Manages preview state and data
- **Usage**: Used when opening preview mode

## Key Features

### 1. Drag-and-Drop
- Intuitive widget placement
- Visual feedback during drag
- Drop zone highlighting
- Nested widget support

### 2. Real-time Preview
- Mobile/Desktop view toggle
- Live updates as you edit
- Preview in new tab functionality

### 3. Property Editing
- Comprehensive style controls
- Widget-specific settings
- Rich text editing
- Image upload support

### 4. Wedding-Specific Widgets
- Couple header with names
- Event details display
- Countdown timer
- Guest book/congratulation messages
- Bottom navigation

### 5. Advanced Features
- Door animation overlay
- Background music support
- Auto-scroll functionality
- Section navigation

## File Organization

```
components/editor/
├── EditorLayout.tsx          # Main layout orchestrator
├── Canvas.tsx                # Canvas container
├── Sidebar.tsx               # Widget palette
├── TopBar.tsx                # Editor header
├── PropertyPanel.tsx         # Property editor
├── RightSidebar.tsx          # Preview panel
├── NodeRenderer.tsx          # Recursive node renderer
├── store.ts                  # Zustand state store
├── canvas/
│   ├── CardStage.tsx         # Main card renderer
│   ├── BottomNavBar.tsx      # Navigation component
│   └── SectionNavigator.tsx  # Section navigation
├── widgets/                  # All widget components
│   ├── TextWidget.tsx
│   ├── ImageWidget.tsx
│   └── ...
├── settings/                 # Settings panels
│   ├── DoorSettings.tsx
│   └── AnimationSettings.tsx
├── context/                  # React contexts
│   ├── MobileFrameContext.tsx
│   └── PreviewContext.tsx
└── utils/
    └── animationUtils.tsx
```

## Technical Stack

- **Framework**: Next.js 14+ (App Router)
- **State Management**: Zustand with Immer
- **Drag & Drop**: @dnd-kit/core
- **Styling**: Tailwind CSS
- **UI Components**: Custom components + shadcn/ui
- **Type Safety**: TypeScript

## Integration Points

### Preview System
- Preview data stored in `localStorage` as `wedding-card-preview-data`
- Preview page: `/designer/preview`
- Data format: `{ nodes, rootId }`

### Persistence
- Current implementation uses localStorage for preview
- Save functionality is placeholder (needs backend integration)

## Future Enhancements

1. **Backend Integration**
   - Save themes to database
   - Load existing themes
   - Version control

2. **Advanced Features**
   - Undo/Redo system
   - Template library
   - Collaboration features
   - Export functionality

3. **Performance**
   - Virtual scrolling for large cards
   - Optimized re-renders
   - Lazy loading widgets

## Usage

1. Navigate to `/designer/dashboard/create-theme`
2. Drag widgets from sidebar to canvas
3. Click widgets to edit properties
4. Use preview to see mobile/desktop views
5. Save or preview the final card

## Dependencies

Key npm packages:
- `zustand` - State management
- `@dnd-kit/core` - Drag and drop
- `immer` - Immutable state updates
- `next` - Framework
- `react` - UI library
- `tailwindcss` - Styling
