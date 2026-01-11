export type BackgroundType = 'none' | 'color' | 'image' | 'gradient';

export interface BackgroundStyle {
  type: BackgroundType;
  value: string; // hex color, image url, or gradient CSS string (e.g., "linear-gradient(to bottom, #ff0000, #0000ff)")
}

export interface FooterIconConfig {
  url?: string; // URL or data URL for custom icon
  visible?: boolean; // Whether the icon is visible
  order?: number; // Position order (1 = top/left, higher = bottom/right)
  customLabel?: string; // Custom text label for the icon
}

export interface FooterIcons {
  calendar?: string | FooterIconConfig; // Support both old format (string) and new format (object)
  phone?: string | FooterIconConfig;
  pin?: string | FooterIconConfig;
  rsvp?: string | FooterIconConfig;
  gifts?: string | FooterIconConfig;
}

export interface FooterContainerConfig {
  width: 'full' | 'custom'; // Full width or custom width
  customWidth?: number; // Custom width in pixels or percentage
  widthUnit?: 'px' | '%'; // Unit for custom width
  bottomPosition?: number; // Distance from bottom in pixels (min 0)
  borderRadius?: {
    topLeft?: number; // Border radius top left in pixels
    topRight?: number; // Border radius top right in pixels
    bottomLeft?: number; // Border radius bottom left in pixels
    bottomRight?: number; // Border radius bottom right in pixels
  };
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
  footerContainerConfig?: FooterContainerConfig; // Container width and position settings
  footerTextFontFamily?: string; // Font family for all icon text labels
  footerTextFontSize?: number; // Font size in pixels for all icon text labels
  footerTextFontWeight?: string | number; // Font weight for all icon text labels (e.g., "400", "bold", "normal")
  themeName?: string; // Theme type: baby, party, ramadan, raya, floral, islamic, minimalist, modern, rustic, traditional, vintage, watercolor
  color?: string; // Designer's color description (in uppercase)
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
  footerContainerConfig: {
    width: 'custom',
    customWidth: 320,
    widthUnit: 'px',
    bottomPosition: 12, // 12px from bottom (p-3 = 12px)
  },
  footerTextFontFamily: 'Helvetica, Arial, sans-serif',
  footerTextFontSize: 10,
  footerTextFontWeight: 'normal',
};
