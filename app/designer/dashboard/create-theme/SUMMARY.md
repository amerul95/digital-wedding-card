# Create Theme 2 Page - Summary

## What is This Page?

The `/designer/dashboard/create-theme` page is a **visual wedding card editor** that allows designers to create and customize wedding invitation cards using a modern drag-and-drop interface. This is version 2.0 of the editor, providing a more intuitive and powerful editing experience compared to the original theme creation page.

## Purpose

This page serves as the primary tool for designers to:
- Create custom wedding invitation card layouts
- Add and arrange widgets (text, images, buttons, wedding-specific components)
- Customize styling and properties of each element
- Preview cards in both mobile and desktop views
- Build interactive wedding cards with animations and special effects

## Key Features

### 1. **Drag-and-Drop Editor**
   - Intuitive widget palette on the left sidebar
   - Drag widgets directly onto the canvas
   - Visual feedback during drag operations
   - Support for nested widget structures

### 2. **Widget Library**
   - **Layout Elements**: Sections, Containers
   - **Basic Elements**: Text, Images, Buttons, Dividers, Spacers, Icons
   - **Wedding-Specific**: Couple Headers, Event Details, Countdown Timers, Image Sliders, Congratulation Messages, Bottom Navigation
   - **Media**: Videos, Google Maps integration

### 3. **Property Panel**
   - Edit selected widget properties in real-time
   - Comprehensive style controls (padding, margins, borders, colors)
   - Content editing (text, images, etc.)
   - Widget-specific settings

### 4. **Preview System**
   - Toggle between mobile and desktop views
   - Real-time preview updates
   - Open full preview in new tab
   - View toggles for door overlay and animations

### 5. **Advanced Features**
   - Animated door overlay effect
   - Background music support
   - Auto-scroll functionality
   - Section navigation

## User Workflow

1. **Start Creating**: Navigate to the page and see an empty canvas
2. **Add Widgets**: Drag widgets from the sidebar onto the canvas
3. **Customize**: Click any widget to open the property panel and edit its properties
4. **Preview**: Toggle between mobile/desktop views or open full preview
5. **Save**: Save the completed card design (save functionality in development)

## Technical Highlights

- **Modern Architecture**: Built with Next.js 14+ App Router
- **State Management**: Zustand store for efficient state handling
- **Drag & Drop**: @dnd-kit library for smooth interactions
- **Type Safety**: Full TypeScript implementation
- **Component-Based**: Modular widget system for easy extensibility

## Comparison to Other Pages

- **vs. `/designer/dashboard/create-theme`**: This is a simpler, more focused editor with a cleaner interface
- **vs. `/designer/dashboard/create-theme-1`**: Version 2.0 with improved architecture and features
- **vs. `/designer/create`**: Different editor implementation (this one uses a more modern approach)

## Target Users

- **Designers**: Primary users who create wedding card templates
- **Wedding Planners**: May use this to create custom invitations
- **End Users**: May eventually use templates created here

## Current Status

- ✅ Core editor functionality working
- ✅ Drag-and-drop system implemented
- ✅ Widget library functional
- ✅ Property panel operational
- ✅ Preview system working
- 🚧 Save functionality (placeholder - needs backend integration)
- 🚧 Template loading (future enhancement)

## Quick Access

- **Route**: `/designer/dashboard/create-theme`
- **Component**: `app/designer/dashboard/create-theme/page.tsx`
- **Main Layout**: `components/editor/EditorLayout.tsx`
- **State Store**: `components/editor/store.ts`
