/**
 * LocalStorage utilities for project persistence
 */

const STORAGE_KEY = 'canva-editor-project';

export function saveProject(project: any): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  } catch (error) {
    console.error('Failed to save project:', error);
  }
}

export function loadProject(): any | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load project:', error);
    return null;
  }
}

export function clearProject(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear project:', error);
  }
}
