import { FooterButton } from "./UI";
import { IconCalendar, IconPhone, IconPin, IconRSVP, IconGifts, IconVideo } from "./Icons";
import { FooterIconConfig, FooterContainerConfig } from "../creator/ThemeTypes";

interface FooterProps {
  onCalendarClick: () => void;
  onContactClick: () => void;
  onLocationClick: () => void;
  onRSVPClick: () => void;
  onGiftsClick?: () => void;
  onVideoClick?: () => void;
  rsvpMode?: "rsvp-speech" | "speech-only" | "thirdparty" | "none";
}

interface FooterStyle {
  background?: string; // hex or CSS background value
  color?: string;     // hex color for icons
  textColor?: string; // hex color for text under icons
  boxShadow?: string; // CSS box-shadow value
  fontFamily?: string; // Font family for icon text
  fontSize?: number; // Font size in pixels for icon text
  fontWeight?: string | number; // Font weight for icon text
}

interface FooterIcons {
  calendar?: string | FooterIconConfig; // Support both old format (string) and new format (object)
  phone?: string | FooterIconConfig;
  pin?: string | FooterIconConfig;
  rsvp?: string | FooterIconConfig;
  gifts?: string | FooterIconConfig;
  video?: string | FooterIconConfig;
}

export function Footer({
  onCalendarClick,
  onContactClick,
  onLocationClick,
  onRSVPClick,
  rsvpMode,
  customStyle,
  customIcons,
  containerConfig,
  onGiftsClick,
  onVideoClick,
}: FooterProps & {
  customStyle?: FooterStyle;
  customIcons?: FooterIcons;
  containerConfig?: FooterContainerConfig;
  onGiftsClick?: () => void;
  onVideoClick?: () => void;
}) {
  // Helper to normalize icon config
  const getIconConfig = (icon: string | FooterIconConfig | undefined): FooterIconConfig | null => {
    if (!icon) return null;
    if (typeof icon === 'string') return { url: icon, visible: true };
    return icon;
  };

  // Get all icons with their configs and filter by visibility
  const iconDefinitions = [
    { key: 'calendar' as const, label: 'Calendar', icon: <IconCalendar />, onClick: onCalendarClick, defaultOrder: 1 },
    { key: 'phone' as const, label: 'Contact', icon: <IconPhone />, onClick: onContactClick, defaultOrder: 2 },
    { key: 'pin' as const, label: 'Location', icon: <IconPin />, onClick: onLocationClick, defaultOrder: 3 },
    { key: 'rsvp' as const, label: 'RSVP', icon: <IconRSVP />, onClick: onRSVPClick, defaultOrder: 4, shouldShow: rsvpMode !== "none" && rsvpMode !== "speech-only" },
    { key: 'gifts' as const, label: 'Gifts', icon: <IconGifts />, onClick: onGiftsClick || (() => { }), defaultOrder: 5 },
    { key: 'video' as const, label: 'Music', icon: <IconVideo />, onClick: onVideoClick || (() => { }), defaultOrder: 6 },
  ].map(def => {
    const config = getIconConfig(customIcons?.[def.key]);
    // If customLabel is explicitly set:
    //   - Empty string '' means hide the label (show empty)
    //   - Non-empty string means use that custom label
    // If undefined, use default label
    let displayLabel: string;
    if (config?.customLabel !== undefined) {
      displayLabel = config.customLabel; // Can be empty string to hide label
    } else {
      displayLabel = def.label; // Use default
    }
    return {
      ...def,
      label: displayLabel,
    };
  });

  // Filter and sort icons
  const visibleIcons = iconDefinitions
    .filter(def => {
      const config = getIconConfig(customIcons?.[def.key]);
      const shouldShow = def.shouldShow !== false; // Default to true unless explicitly false
      return shouldShow && (config?.visible !== false); // Show if visible is not explicitly false
    })
    .map(def => {
      const config = getIconConfig(customIcons?.[def.key]);
      return {
        ...def,
        order: config?.order ?? def.defaultOrder,
        config,
      };
    })
    .sort((a, b) => a.order - b.order);

  const renderIcon = (type: 'calendar' | 'phone' | 'pin' | 'rsvp' | 'gifts' | 'video', defaultIcon: React.ReactNode) => {
    const iconValue = customIcons?.[type];
    const iconConfig = getIconConfig(iconValue);
    const customIconUrl = iconConfig?.url;

    if (customIconUrl) {
      // Check if it's an SVG (data URL with svg+xml or starts with <svg)
      const isSVG = customIconUrl.includes('svg+xml') || (typeof customIconUrl === 'string' && customIconUrl.trim().startsWith('<svg'));

      if (isSVG && customStyle?.color) {
        // For SVG, try to inject color into the SVG string
        try {
          let svgContent = customIconUrl;
          if (svgContent.includes('data:image/svg+xml')) {
            // Decode base64 or URL-encoded SVG
            if (svgContent.includes('base64,')) {
              svgContent = atob(svgContent.split('base64,')[1]);
            } else if (svgContent.includes('svg+xml,')) {
              svgContent = decodeURIComponent(svgContent.split('svg+xml,')[1]);
            }
          }

          // Replace fill and stroke attributes with the theme color
          const coloredSVG = svgContent
            .replace(/fill="[^"]*"/g, `fill="${customStyle.color}"`)
            .replace(/fill='[^']*'/g, `fill='${customStyle.color}'`)
            .replace(/stroke="[^"]*"/g, `stroke="${customStyle.color}"`)
            .replace(/stroke='[^']*'/g, `stroke='${customStyle.color}'`)
            .replace(/<svg/, `<svg fill="${customStyle.color}"`);

          const svgDataUrl = `data:image/svg+xml;base64,${btoa(coloredSVG)}`;
          return (
            <img
              src={svgDataUrl}
              alt={type}
              className="w-6 h-6 object-contain"
            />
          );
        } catch (error) {
          // Fallback to regular image if SVG processing fails
          console.error('Error processing SVG:', error);
        }
      }

      // For regular images or if SVG processing failed
      return (
        <img
          src={customIconUrl}
          alt={type}
          className="w-6 h-6 object-contain"
          style={{
            filter: customStyle?.color && !isSVG ? `drop-shadow(0 0 0 ${customStyle.color})` : undefined,
          }}
        />
      );
    }
    return <div style={{ color: customStyle?.color }}>{defaultIcon}</div>;
  };

  // Get footer background style
  const getFooterBackgroundStyle = (): React.CSSProperties => {
    if (!customStyle?.background) return {};

    // If it's a gradient or color string, use directly
    if (customStyle.background.includes('gradient') || customStyle.background.startsWith('#')) {
      return { background: customStyle.background, border: 'none' };
    }

    // If it's an image URL
    if (customStyle.background.startsWith('url(')) {
      return {
        backgroundImage: customStyle.background,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        border: 'none'
      };
    }

    return { background: customStyle.background, border: 'none' };
  };

  // Get container styles
  const getContainerStyles = (): React.CSSProperties => {
    const containerStyle: React.CSSProperties = {
      boxShadow: customStyle?.boxShadow || '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    };

    if (containerConfig) {
      // Set width
      if (containerConfig.width === 'full') {
        containerStyle.width = '100%';
        containerStyle.maxWidth = 'none';
      } else if (containerConfig.width === 'custom' && containerConfig.customWidth) {
        const widthValue = containerConfig.customWidth;
        const unit = containerConfig.widthUnit || 'px';
        containerStyle.width = `${widthValue}${unit}`;
        containerStyle.maxWidth = 'none';
      }

      // Set bottom position
      if (containerConfig.bottomPosition !== undefined) {
        containerStyle.bottom = `${containerConfig.bottomPosition}px`;
      }

      // Set border radius
      if (containerConfig.borderRadius) {
        const { topLeft, topRight, bottomLeft, bottomRight } = containerConfig.borderRadius;
        if (topLeft !== undefined || topRight !== undefined || bottomLeft !== undefined || bottomRight !== undefined) {
          containerStyle.borderRadius = `${topLeft ?? 16}px ${topRight ?? 16}px ${bottomRight ?? 16}px ${bottomLeft ?? 16}px`;
        }
      } else {
        // Default border radius if not specified
        containerStyle.borderRadius = '16px';
      }
    } else {
      // Default border radius if no container config
      containerStyle.borderRadius = '16px';
    }

    return containerStyle;
  };

  const containerWidth = containerConfig?.width === 'full' ? 'w-full' : containerConfig?.width === 'custom' ? '' : 'max-w-xs';
  const iconCount = Math.min(visibleIcons.length, 5);
  const gridColsClass = iconCount === 1 ? 'grid-cols-1' :
    iconCount === 2 ? 'grid-cols-2' :
      iconCount === 3 ? 'grid-cols-3' :
        iconCount === 4 ? 'grid-cols-4' :
          iconCount === 5 ? 'grid-cols-5' : 'grid-cols-3';

  return (
    <div
      className="absolute left-0 right-0 z-20"
      style={{
        bottom: containerConfig?.bottomPosition !== undefined ? `${containerConfig.bottomPosition}px` : '12px',
      }}
    >
      <div
        className={`mx-auto ${containerWidth} bg-white/90 backdrop-blur border border-rose-200 px-3 py-2`}
        style={{
          ...(customStyle?.background ? getFooterBackgroundStyle() : {}),
          ...getContainerStyles(),
        }}
      >
        <div className={`grid ${gridColsClass} gap-2 ${!customStyle?.color ? "text-rose-700" : ""}`}>
          {visibleIcons.map((iconDef) => (
            <FooterButton
              key={iconDef.key}
              label={iconDef.label}
              onClick={iconDef.onClick}
              color={customStyle?.color}
              textColor={customStyle?.textColor}
              fontFamily={customStyle?.fontFamily}
              fontSize={customStyle?.fontSize}
              fontWeight={customStyle?.fontWeight}
            >
              {renderIcon(iconDef.key, iconDef.icon)}
            </FooterButton>
          ))}
        </div>
      </div>
    </div>
  );
}





