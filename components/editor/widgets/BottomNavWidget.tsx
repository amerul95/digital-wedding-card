"use client";

import { useEditorStore } from "@/components/editor/store";
import { cn } from "@/lib/utils";
import { Home, Calendar, Image as ImageIcon, MessageSquare, Phone, MapPin, Video, Gift, Mail } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Modal } from "@/components/card/Modal";
import { CalendarModal, ContactModal, LocationModal, RSVPModal } from "@/components/card/ModalContent";
import { VideoModal } from "@/components/card/VideoModal";
import { GiftModal } from "@/components/card/GiftModal";
import { usePreview } from "@/components/editor/context/PreviewContext";
import { useVideoPlayer } from "@/components/editor/context/VideoPlayerContext";

interface BottomNavWidgetProps {
    id: string;
    data: any;
    style: any;
}

// Inline Modal Component - Renders inside PreviewRoot (not as fixed overlay)
function InlineModal({ 
    isOpen, 
    onClose, 
    children, 
    isPreview,
    isVisible = true
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    children: React.ReactNode;
    isPreview: boolean;
    isVisible?: boolean; // Controls if modal is visible (slid up) or hidden (below screen)
}) {
    if (!isOpen) return null;
    
    if (isPreview) {
        // In preview mode, use fixed positioning to stay in viewport (not relative to scrolling container)
        // If not visible, position it below screen (bottom: -100%)
        // When visible, position it 20px above bottom navbar (navbar is typically 64px + 16px bottom = 80px, so bottom: 100px)
        const pointerEvents = isVisible ? 'auto' : 'none';
        // Navbar height is typically 64px, plus bottom spacing (16px for float, 0 for full), plus 20px gap = ~100px
        const bottomPosition = isVisible ? '100px' : '-100%';
        
        return (
            <div 
                className="fixed inset-0"
                style={{
                    zIndex: 50,
                    pointerEvents: pointerEvents,
                    backgroundColor: 'transparent', // No blurry background
                }}
                onClick={onClose}
            >
                <div 
                    className="fixed left-1/2 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-rose-100 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        bottom: bottomPosition,
                        transform: 'translateX(-50%)',
                        transition: 'bottom 0.3s ease-out',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        padding: '1.5rem'
                    }}
                >
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </div>
        );
    }
    
    // In editor mode, use regular fixed modal
    return (
        <Modal onClose={onClose}>
            {children}
        </Modal>
    );
}

// Hidden Video Player - Initializes player for autoplay
// The container will be rendered in VideoModal, this just prepares the player
function HiddenVideoPlayer({
    videoUrl,
    startTime,
    duration,
    playerRef,
    containerRef,
    shouldInitialize = false
}: {
    videoUrl: string;
    startTime: number;
    duration: number;
    playerRef?: React.MutableRefObject<any>;
    containerRef?: React.MutableRefObject<HTMLDivElement | null>;
    shouldInitialize?: boolean;
}) {
    const localContainerRef = useRef<HTMLDivElement>(null);
    const localPlayerRef = useRef<any>(null);
    
    const videoContainerRef = containerRef || localContainerRef;
    const videoPlayerRef = playerRef || localPlayerRef;
    
    const isYoutube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
    let videoId = "";
    
    if (isYoutube) {
        if (videoUrl.includes("watch?v=")) {
            videoId = videoUrl.split("watch?v=")[1].split("&")[0];
        } else if (videoUrl.includes("youtu.be/")) {
            videoId = videoUrl.split("youtu.be/")[1].split("?")[0];
        } else if (videoUrl.includes("embed/")) {
            videoId = videoUrl.split("embed/")[1].split("?")[0];
        }
    }
    
    useEffect(() => {
        if (!isYoutube || !videoId || !shouldInitialize) return;
        
        // If player already exists, don't create a new one
        if (videoPlayerRef.current) {
            return;
        }
        
        // Wait for container to be available (it will be created in VideoModal)
        // We'll initialize the player when the modal opens
        // For now, just prepare the video ID
        return;
        
        const loadYouTubeAPI = () => {
            if ((window as any).YT && (window as any).YT.Player) {
                return Promise.resolve();
            }
            
            return new Promise<void>((resolve) => {
                if ((window as any).onYouTubeIframeAPIReady) {
                    const originalCallback = (window as any).onYouTubeIframeAPIReady;
                    (window as any).onYouTubeIframeAPIReady = () => {
                        originalCallback();
                        resolve();
                    };
                    return;
                }
                
                const tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
                
                (window as any).onYouTubeIframeAPIReady = () => {
                    resolve();
                };
            });
        };
        
        let timeoutId: NodeJS.Timeout | null = null;
        
        const setupPlayer = async () => {
            try {
                await loadYouTubeAPI();
                
                if (!videoContainerRef.current) return;
                
                const player = new (window as any).YT.Player(videoContainerRef.current, {
                    videoId: videoId,
                    playerVars: {
                        autoplay: 1,
                        controls: 1, // Show controls when modal opens
                        loop: duration === 0 ? 1 : 0,
                        playlist: duration === 0 ? videoId : undefined,
                        playsinline: 1,
                        start: startTime,
                        mute: 0,
                    },
                    events: {
                        onReady: (event: any) => {
                            videoPlayerRef.current = event.target;
                            try {
                                event.target.playVideo();
                                console.log("Video autoplaying in background");
                            } catch (error) {
                                console.log("Autoplay may be blocked");
                            }
                            
                            if (duration && duration > 0) {
                                timeoutId = setTimeout(() => {
                                    if (videoPlayerRef.current && videoPlayerRef.current.pauseVideo) {
                                        videoPlayerRef.current.pauseVideo();
                                    }
                                }, duration * 1000);
                            }
                        },
                    },
                });
            } catch (error) {
                console.error("Error creating video player:", error);
            }
        };
        
        setupPlayer();
        
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (!playerRef && videoPlayerRef.current && videoPlayerRef.current.destroy) {
                try {
                    videoPlayerRef.current.destroy();
                } catch (error) {
                    // Ignore
                }
            }
        };
    }, [isYoutube, videoId, startTime, duration, videoContainerRef, videoPlayerRef, playerRef, shouldInitialize]);
    
    // Don't render anything - container will be in VideoModal
    return null;
}

export function BottomNavWidget({ id, data, style }: BottomNavWidgetProps) {
    const selectNode = useEditorStore((state) => state.selectNode);
    const selectedId = useEditorStore((state) => state.selectedId);
    const globalSettings = useEditorStore((state) => state.globalSettings);
    const { isPreview } = usePreview();
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(true); // Track if modal should be visible (brought to front)
    
    // Get shared video player if available (only in preview mode)
    // Hook is safe to call even without provider (returns defaults)
    const videoPlayerContext = isPreview ? useVideoPlayer() : null;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectNode(id);
    };

    const isSelected = selectedId === id;

    // Default items if none exist
    const defaultItems = [
        { id: '1', type: 'home', label: 'Home', icon: 'home', iconType: 'default', visible: true },
        { id: '2', type: 'calendar', label: 'Date', icon: 'calendar', iconType: 'default', visible: true },
        { id: '3', type: 'contact', label: 'Contact', icon: 'phone', iconType: 'default', visible: true },
        { id: '4', type: 'gift', label: 'Gift', icon: 'gift', iconType: 'default', visible: true },
    ];

    const items = data.items || defaultItems;

    // Inject video item if enabled in global settings
    const activeItems = [...items];
    const videoItemId = 'video-global';
    if (globalSettings?.backgroundMusic?.showVideo && !activeItems.find((i: any) => i.type === 'video')) {
        // Insert before the last item (assuming last item is usually less important or we want it near end)
        // Or just push to end
        activeItems.push({
            id: videoItemId,
            type: 'video',
            label: 'Video',
            icon: 'video',
            iconType: 'default',
            visible: true
        });
    }

    // Auto-open video modal when preview page loads (if video is enabled)
    // Modal will be hidden below screen (bottom: -300px) so video can autoplay without disturbing the UI
    useEffect(() => {
        if (!isPreview) return;
        if (!globalSettings?.backgroundMusic?.showVideo) return;
        if (!globalSettings?.backgroundMusic?.url) return;

        // Wait for doors to open if there are doors
        const checkDoorsAndOpenVideo = () => {
            const doorButton = document.querySelector('button[aria-label*="Buka"]');
            const hasDoor = doorButton !== null;
            
            if (hasDoor) {
                // Wait for door-opened event
                const handleDoorOpen = () => {
                    setTimeout(() => {
                        setActiveModal(videoItemId);
                        setModalVisible(false); // Hide modal below screen initially
                    }, 800);
                    window.removeEventListener('door-opened', handleDoorOpen);
                };
                
                window.addEventListener('door-opened', handleDoorOpen);
                
                // Also check if doors are already open
                const checkInterval = setInterval(() => {
                    const buttonStillVisible = document.querySelector('button[aria-label*="Buka"]');
                    const buttonStyle = buttonStillVisible ? window.getComputedStyle(buttonStillVisible) : null;
                    const isVisible = buttonStyle && buttonStyle.display !== 'none' && buttonStyle.opacity !== '0';
                    
                    if (!isVisible && buttonStillVisible === null) {
                        clearInterval(checkInterval);
                        setTimeout(() => {
                            setActiveModal(videoItemId);
                            setModalVisible(false); // Hide modal below screen initially
                        }, 500);
                    }
                }, 200);
                
                return () => {
                    window.removeEventListener('door-opened', handleDoorOpen);
                    clearInterval(checkInterval);
                };
            } else {
                // No doors, open video after a short delay
                setTimeout(() => {
                    setActiveModal(videoItemId);
                    setModalVisible(false); // Hide modal below screen initially
                }, 500);
            }
        };

        const timer = setTimeout(checkDoorsAndOpenVideo, 200);
        return () => clearTimeout(timer);
    }, [isPreview, globalSettings?.backgroundMusic?.showVideo, globalSettings?.backgroundMusic?.url]);

    const navStyle = data.style || {};
    const layoutType = data.layoutType || 'float'; // 'float' | 'full'

    const getIcon = (item: any, size: number) => {
        // Handle custom icon type
        if (item.iconType === 'custom' && item.customIcon) {
            // eslint-disable-next-line @next/next/no-img-element
            return (
                <img
                    src={item.customIcon}
                    alt={item.label}
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        objectFit: 'contain'
                    }}
                />
            );
        }

        // Handle text icon type
        if (item.iconType === 'text') {
            return (
                <span style={{
                    fontSize: `${size}px`,
                    fontFamily: item.textIconFontFamily || 'inherit',
                    fontWeight: item.textIconFontWeight || 'bold',
                    color: item.textIconColor || 'inherit'
                }}>
                    {item.textIconContent || item.label.charAt(0)}
                </span>
            );
        }

        // Default icon type (or when iconType is 'default' or undefined)
        // Use the icon name from item.icon to render the appropriate icon
        const iconName = item.icon || 'home';
        switch (iconName) {
            case 'home': return <Home size={size} />;
            case 'calendar': return <Calendar size={size} />;
            case 'image': return <ImageIcon size={size} />;
            case 'message': return <MessageSquare size={size} />;
            case 'phone': return <Phone size={size} />;
            case 'map': return <MapPin size={size} />;
            case 'video': return <Video size={size} />;
            case 'gift': return <Gift size={size} />;
            case 'rsvp': return <Mail size={size} />;
            default: return <Home size={size} />;
        }
    };

    const handleItemClick = (e: React.MouseEvent, item: any) => {
        e.stopPropagation();
        // Always select the widget when clicking inside it
        selectNode(id);

        // Open modal if functionality is enabled
        if (['contact', 'video', 'map', 'gift', 'calendar', 'rsvp'].includes(item.type)) {
            // If modal is already open and visible, close it (toggle behavior)
            if (activeModal === item.id && modalVisible) {
                closeModal();
            } else if (activeModal === item.id && !modalVisible) {
                // Modal is open but hidden, slide it up
                setModalVisible(true);
            } else if (activeModal !== item.id) {
                // Different modal, close current and open new one
                if (activeModal) {
                    setModalVisible(false);
                    setTimeout(() => {
                        setActiveModal(item.id);
                        setModalVisible(false); // Start hidden at bottom
                        // Small delay to ensure DOM update, then animate up
                        setTimeout(() => {
                            setModalVisible(true);
                        }, 50);
                    }, 300);
                } else {
                    // No modal open, open new one from bottom
                    setActiveModal(item.id);
                    setModalVisible(false); // Start hidden at bottom
                    // Small delay to ensure DOM update, then animate up
                    setTimeout(() => {
                        setModalVisible(true);
                    }, 50);
                }
            }
        }
    };

    const closeModal = () => {
        // Slide modal down before closing
        setModalVisible(false);
        // Wait for animation to complete before actually closing
        setTimeout(() => {
            setActiveModal(null);
            setModalVisible(true); // Reset visibility state for next open
        }, 350); // Slightly longer than transition to ensure smooth close
    };

    const iconSize = parseInt(navStyle.iconSize) || 20;
    const iconGap = navStyle.iconGap || '4px';
    
    // Helper to get item-specific icon size or fallback to global
    const getItemIconSize = (item: any) => {
        return item.iconSize ? parseInt(item.iconSize) : iconSize;
    };

    // Base Styles
    // z-20 to ensure it's behind door overlay (z-30) - door should always be on top
    // In preview mode, remove selection/focus borders
    const containerClasses = [
        "flex items-center justify-around px-2 z-20 transition-all duration-300 pointer-events-auto",
        "bg-white/90 backdrop-blur border border-white/20",
        navStyle.boxShadow || "shadow-lg",
        // Only show selection ring in editor mode, not preview
        !isPreview && isSelected ? "ring-2 ring-blue-500" : "",
        !isPreview ? "hover:ring-1 hover:ring-blue-300" : ""
    ].filter(Boolean); // Remove empty strings

    // Layout Specific Styles
    // In preview mode, use fixed positioning relative to viewport (not section)
    // In editor mode, use fixed positioning relative to viewport
    let layoutStyles: React.CSSProperties = {
        position: 'fixed', // Always use fixed positioning to stay at bottom of viewport
        bottom: navStyle.bottomPosition ? `${navStyle.bottomPosition}px` : (layoutType === 'float' ? '16px' : '0px'),
        height: navStyle.height ? `${navStyle.height}px` : '64px',
        ...style
    };

    // Set left/right/width based on layout type and preview mode
    if (layoutType === 'float') {
        if (isPreview) {
            // In preview, center the navbar to match the card container (max-w-md = 448px)
            // Use left: 50% and transform to center it, then constrain width to match card
            layoutStyles.left = '50%';
            layoutStyles.transform = 'translateX(-50%)';
            // Card is max-w-md (448px), so navbar should be max 416px (448 - 32px padding)
            // But also respect viewport width on smaller screens
            layoutStyles.width = 'min(416px, calc(100vw - 32px))';
        } else {
            // In editor, use left/right for fixed positioning
            layoutStyles.left = '16px';
            layoutStyles.right = '16px';
        }
    } else {
        // Full width layout
        layoutStyles.left = '0px';
        layoutStyles.right = '0px';
        if (isPreview) {
            layoutStyles.width = '100%';
        }
    }

    // Border Radius Logic
    if (layoutType === 'float') {
        const defaultRadius = '16px';
        layoutStyles.borderTopLeftRadius = navStyle.borderRadiusTopLeft || defaultRadius;
        layoutStyles.borderTopRightRadius = navStyle.borderRadiusTopRight || defaultRadius;
        layoutStyles.borderBottomLeftRadius = navStyle.borderRadiusBottomLeft || defaultRadius;
        layoutStyles.borderBottomRightRadius = navStyle.borderRadiusBottomRight || defaultRadius;
    } else {
        layoutStyles.borderTopLeftRadius = navStyle.borderRadiusTopLeft || '0px';
        layoutStyles.borderTopRightRadius = navStyle.borderRadiusTopRight || '0px';
        layoutStyles.borderBottomLeftRadius = navStyle.borderRadiusBottomLeft || '0px';
        layoutStyles.borderBottomRightRadius = navStyle.borderRadiusBottomRight || '0px';
    }

    const mainStyle: React.CSSProperties = {
        backgroundColor: navStyle.backgroundColor || 'rgba(255, 255, 255, 0.9)',
        borderColor: navStyle.borderColor || 'rgba(255, 255, 255, 0.2)',
        ...layoutStyles
    };

    const renderModalContent = (item: any) => {
        switch (item.type) {
            case 'calendar':
                // Creating dummy event data if not present, in real app this should come from item config or global event data
                return <CalendarModal
                    event={item.eventData || { dateFull: 'Date not set', timeRange: '' }}
                    onDownloadICS={() => console.log("Download ICS")}
                />;
            case 'contact':
                return <ContactModal contacts={item.contactList || []} />;
            case 'map':
                return <LocationModal
                    locationFull={item.locationAddress || 'No Address'}
                    mapQuery={item.locationMapQuery || item.locationAddress || ''}
                />;
            case 'video':
                // Use global background music URL if available, otherwise fallback to item config
                // Video will be created and played when modal opens
                return <VideoModal
                    videoUrl={globalSettings?.backgroundMusic?.url || item.videoUrl}
                    startTime={globalSettings?.backgroundMusic?.startTime || 0}
                    duration={globalSettings?.backgroundMusic?.duration || 0}
                    isVisible={modalVisible}
                />;
            case 'gift':
                return <GiftModal
                    bankName={item.giftBankName}
                    accountName={item.giftAccountName}
                    accountNumber={item.giftAccountNumber}
                    qrImage={item.giftQrImage}
                />;
            case 'rsvp':
                return <RSVPModal
                    onSelectHadir={() => alert("Hadir selected")}
                    onSelectTidak={() => alert("Tidak Hadir selected")}
                />;
            default:
                return null;
        }
    };

    const activeItem = activeItems.find((i: any) => i.id === activeModal);

    return (
        <>
            <div
                className={cn(...containerClasses, data.className)}
                style={mainStyle}
                onClick={handleClick}
            >
                {activeItems.map((item: any, idx: number) => {
                    if (!item.visible) return null;
                    
                    // Regular button rendering for all items (including video)
                    return (
                        <button
                            key={idx}
                            className="flex flex-col items-center justify-center rounded-lg hover:bg-gray-100/50 transition-colors"
                            style={{
                                gap: iconGap,
                                minWidth: '48px',
                                flex: 1
                            }}
                            onClick={(e) => handleItemClick(e, item)}
                        >
                            <div style={{ color: navStyle.iconColor || '#1f2937' }}>
                                {getIcon(item, getItemIconSize(item))}
                            </div>
                            <span
                                style={{
                                    color: item.labelFontColor || navStyle.textColor || '#4b5563',
                                    fontSize: item.labelFontSize || navStyle.fontSize || '10px',
                                    fontWeight: item.labelFontWeight || navStyle.fontWeight || 'normal',
                                    fontFamily: item.labelFontFamily === 'serif' ? 'serif' 
                                        : item.labelFontFamily === 'mono' ? 'monospace'
                                        : item.labelFontFamily === 'cursive' ? 'cursive'
                                        : item.labelFontFamily === 'fantasy' ? 'fantasy'
                                        : navStyle.fontFamily === 'serif' ? 'serif' 
                                        : navStyle.fontFamily === 'mono' ? 'monospace' 
                                        : 'sans-serif'
                                }}
                            >
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Video will only play when modal is opened - no hidden autoplay */}

            {/* Render Modal if active */}
            {activeModal && activeItem && (
                <InlineModal 
                    isOpen={!!activeModal} 
                    onClose={closeModal}
                    isPreview={isPreview}
                    isVisible={modalVisible}
                >
                    {renderModalContent(activeItem)}
                </InlineModal>
            )}
        </>
    );
}
