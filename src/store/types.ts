/**
 * Type definitions for the editor
 */

export const DESIGN_W = 900;
export const DESIGN_H = 1600;

export type Tool = 'select' | 'text' | 'rect' | 'circle' | 'line' | 'image';

export type ImageFit = 'cover' | 'contain';

export interface BaseObject {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked: boolean;
  hidden: boolean;
}

export interface TextObject extends BaseObject {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fill: string;
  align: 'left' | 'center' | 'right';
  lineHeight: number;
  letterSpacing: number;
  fontStyle: 'normal' | 'bold' | 'italic' | 'bold italic';
}

export interface RectObject extends BaseObject {
  type: 'rect';
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius: number;
}

export interface CircleObject extends BaseObject {
  type: 'circle';
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface LineObject extends BaseObject {
  type: 'line';
  points: number[];
  stroke: string;
  strokeWidth: number;
}

export interface ImageObject extends BaseObject {
  type: 'image';
  src: string;
  fit: ImageFit;
  crop?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface GroupObject extends BaseObject {
  type: 'group';
  children: CanvasObject[];
  clip?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export type CanvasObject =
  | TextObject
  | RectObject
  | CircleObject
  | LineObject
  | ImageObject
  | GroupObject;

export interface Section {
  id: string;
  name: string;
  size: { w: number; h: number };
  background: { fill: string };
  objects: CanvasObject[];
}

export interface ProjectSettings {
  themeFonts: string[];
  themeColors: string[];
  bleedMm: number;
  safePaddingPx: number;
}

export interface PlayerSettings {
  autoScrollEnabled: boolean;
  autoScrollSpeed: number;
  snapEnabled: boolean;
  music: {
    src?: string;
    volume: number;
    loop: boolean;
  };
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  settings: ProjectSettings;
  sections: Section[];
  player: PlayerSettings;
}

export interface HistoryState {
  past: Project[];
  present: Project;
  future: Project[];
}
