export type BackgroundType = 'none' | 'color' | 'image';

export interface BackgroundStyle {
  type: BackgroundType;
  value: string; // hex color or image url
}

export interface ThemeConfig {
  cardBackground: BackgroundStyle;
  section1Background: BackgroundStyle;
  section2Background: BackgroundStyle;
  section3Background: BackgroundStyle;
  section4Background: BackgroundStyle;
  footerBackground: BackgroundStyle;
  footerIconColor: string;
}

export const defaultThemeConfig: ThemeConfig = {
  cardBackground: { type: 'color', value: '#fff1f2' }, // rose-50 approx
  section1Background: { type: 'none', value: '' },
  section2Background: { type: 'none', value: '' },
  section3Background: { type: 'none', value: '' },
  section4Background: { type: 'none', value: '' },
  footerBackground: { type: 'color', value: '#ffffff' }, // white default
  footerIconColor: '#be123c', // rose-700 default
};
