// Utility functions to store and retrieve designer-specific custom fonts

export type CustomFont = {
  name: string;
  url: string;
  fontFamily: string;
  format?: string;
};

const getStorageKey = (designerId: string): string => {
  return `designer-fonts-${designerId}`;
};

export const getDesignerFonts = (designerId: string | null): CustomFont[] => {
  if (!designerId || typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(getStorageKey(designerId));
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading designer fonts:', error);
  }
  
  return [];
};

export const saveDesignerFont = (designerId: string | null, font: CustomFont): void => {
  if (!designerId || typeof window === 'undefined') return;
  
  try {
    const existingFonts = getDesignerFonts(designerId);
    // Check if font with same fontFamily already exists
    const fontExists = existingFonts.some(f => f.fontFamily === font.fontFamily);
    if (!fontExists) {
      const updatedFonts = [...existingFonts, font];
      localStorage.setItem(getStorageKey(designerId), JSON.stringify(updatedFonts));
    }
  } catch (error) {
    console.error('Error saving designer font:', error);
  }
};

export const removeDesignerFont = (designerId: string | null, fontFamily: string): void => {
  if (!designerId || typeof window === 'undefined') return;
  
  try {
    const existingFonts = getDesignerFonts(designerId);
    const updatedFonts = existingFonts.filter(f => f.fontFamily !== fontFamily);
    localStorage.setItem(getStorageKey(designerId), JSON.stringify(updatedFonts));
  } catch (error) {
    console.error('Error removing designer font:', error);
  }
};
