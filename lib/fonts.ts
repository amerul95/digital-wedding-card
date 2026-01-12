// Curated list of Google Fonts available in the font family dropdowns
export const CURATED_GOOGLE_FONTS = [
  "Great Vibes",
  "Allura",
  "Dancing Script",
  "Alex Brush",
  "Parisienne",
  "Satisfy",
  "Tangerine",
  "Italianno",
  "Mr Bedfort",
  "Yellowtail",
  "Playfair Display",
  "Cormorant Garamond",
  "Cormorant Upright",
  "Libre Baskerville",
  "Merriweather",
  "EB Garamond",
  "Gentium Book Basic",
  "Cardo",
  "Vollkorn",
  "Crimson Text",
  "Lora",
  "PT Serif",
  "Baskervville",
  "Spectral",
  "Quattrocento",
  "Rosarivo",
  "Alice",
  "Bree Serif",
  "Montserrat",
  "Raleway",
] as const;

// Type for font options (Google Fonts or Custom)
export type FontOption = {
  name: string;
  fontFamily: string;
  type: 'google' | 'custom';
  url?: string; // Only for custom fonts
};

// Load Google Fonts dynamically
export const loadGoogleFont = (fontFamily: string): void => {
  if (typeof window === 'undefined') return;
  
  // Check if font is already loaded
  const linkId = `google-font-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(linkId)) return;

  // Create link element to load Google Font
  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400&display=swap`;
  document.head.appendChild(link);
};

// Load all curated Google Fonts
export const loadAllCuratedFonts = (): void => {
  if (typeof window === 'undefined') return;
  
  // Load all fonts in one request for better performance
  const fontsParam = CURATED_GOOGLE_FONTS.map(font => 
    encodeURIComponent(font) + ':wght@400'
  ).join('&family=');
  
  const linkId = 'curated-google-fonts';
  if (document.getElementById(linkId)) return;

  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontsParam}&display=swap`;
  document.head.appendChild(link);
};
