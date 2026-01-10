export type BackgroundType = 'none' | 'color' | 'image' | 'gradient';

export interface BackgroundStyle {
  type: BackgroundType;
  value: string; // hex color, image url, or gradient CSS string (e.g., "linear-gradient(to bottom, #ff0000, #0000ff)")
}

export interface FooterIcons {
  calendar?: string; // URL or data URL for custom icon
  phone?: string;
  pin?: string;
  rsvp?: string;
}

export interface ThemeConfig {
  cardBackground: BackgroundStyle;
  section1Background: BackgroundStyle;
  section2Background: BackgroundStyle;
  section3Background: BackgroundStyle;
  section4Background: BackgroundStyle;
  footerBackground: BackgroundStyle;
  footerIconColor: string;
  footerTextColor?: string; // Color for text under icons
  footerIcons?: FooterIcons; // Custom icons for footer
  footerBoxShadow?: string; // Box shadow CSS value for footer container (e.g., "0 4px 6px rgba(0, 0, 0, 0.1)")
}

export const defaultThemeConfig: ThemeConfig = {
  cardBackground: { type: 'color', value: '#fff1f2' }, // rose-50 approx
  section1Background: { type: 'none', value: '' },
  section2Background: { type: 'none', value: '' },
  section3Background: { type: 'none', value: '' },
  section4Background: { type: 'none', value: '' },
  footerBackground: { type: 'color', value: '#ffffff' }, // white default
  footerIconColor: '#be123c', // rose-700 default
  footerTextColor: '#be123c', // rose-700 default for text
  footerIcons: {}, // No custom icons by default
  footerBoxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)', // Default shadow
};
