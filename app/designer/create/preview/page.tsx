/**
 * Preview page - shows all sections in scrollable view
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '@/lib/store/projectStore';
import { useArtboardViewport } from '@/components/designer/editor/hooks/useArtboardViewport';
import { Stage, Layer, Group, Rect } from 'react-konva';
import { CanvasObjectRenderer } from '@/components/designer/editor/canvas/CanvasObjectRenderer';
import { DESIGN_W, DESIGN_H } from '@/lib/store/types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Volume2, Upload, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

export default function PreviewPage() {
  const router = useRouter();
  const { project, updateProject } = useProjectStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTapToStart, setShowTapToStart] = useState(false);
  const autoScrollRef = useRef<number | null>(null);
  const lastScrollTimeRef = useRef<number>(Date.now());

  const viewport = useArtboardViewport('preview');
  const playerSettings = project?.player || {
    autoScrollEnabled: false,
    autoScrollSpeed: 50,
    snapEnabled: false,
    music: { volume: 0.5, loop: true },
  };

  // Auto-scroll
  useEffect(() => {
    if (!playerSettings.autoScrollEnabled || !scrollContainerRef.current) {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
        autoScrollRef.current = null;
      }
      return;
    }

    const scroll = () => {
      if (!scrollContainerRef.current) return;
      const now = Date.now();
      const deltaTime = (now - lastScrollTimeRef.current) / 1000; // seconds
      lastScrollTimeRef.current = now;

      const pixelsToScroll = playerSettings.autoScrollSpeed * deltaTime;
      scrollContainerRef.current.scrollTop += pixelsToScroll;

      autoScrollRef.current = requestAnimationFrame(scroll);
    };

    autoScrollRef.current = requestAnimationFrame(scroll);
    return () => {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
      }
    };
  }, [playerSettings.autoScrollEnabled, playerSettings.autoScrollSpeed]);

  // Snap to section boundaries
  useEffect(() => {
    if (!playerSettings.snapEnabled || !scrollContainerRef.current) return;

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const sectionHeight = viewport.viewportH;
        const currentScroll = container.scrollTop;
        const sectionIndex = Math.round(currentScroll / sectionHeight);
        const targetScroll = sectionIndex * sectionHeight;

        container.scrollTo({
          top: targetScroll,
          behavior: 'smooth',
        });
      }, 150);
    };

    scrollContainerRef.current.addEventListener('scroll', handleScroll);
    return () => {
      scrollContainerRef.current?.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [playerSettings.snapEnabled, viewport.viewportH]);

  // Set audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playerSettings.music.volume;
    }
  }, [playerSettings.music.volume]);

  // Audio controls
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // Autoplay blocked - show tap to start
        setShowTapToStart(true);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleTapToStart = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
    setShowTapToStart(false);
  };

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !project) return;

    const objectUrl = URL.createObjectURL(file);
    updateProject((p) => {
      p.player.music.src = objectUrl;
    });
  };

  const handleReset = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  if (!project) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-gray-500">No project loaded</div>
      </div>
    );
  }

  const totalHeight = project.sections.length * viewport.viewportH;

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900 relative">
      {/* Controls overlay */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.back()}
          className="bg-white/90 backdrop-blur-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Editor
        </Button>

        <div className="flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
          {/* Auto-scroll controls */}
          <div className="flex items-center gap-2">
            <Label className="text-xs">Auto-scroll</Label>
            <Switch
              checked={playerSettings.autoScrollEnabled}
              onCheckedChange={(checked) => {
                updateProject((p) => {
                  p.player.autoScrollEnabled = checked;
                });
              }}
            />
          </div>

          {playerSettings.autoScrollEnabled && (
            <div className="flex items-center gap-2 w-32">
              <Label className="text-xs">Speed</Label>
              <Slider
                value={[playerSettings.autoScrollSpeed]}
                onValueChange={([value]) => {
                  updateProject((p) => {
                    p.player.autoScrollSpeed = value;
                  });
                }}
                min={10}
                max={200}
                step={10}
                className="flex-1"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Label className="text-xs">Snap</Label>
            <Switch
              checked={playerSettings.snapEnabled}
              onCheckedChange={(checked) => {
                updateProject((p) => {
                  p.player.snapEnabled = checked;
                });
              }}
            />
          </div>

          <Button variant="ghost" size="icon-sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Music controls */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
          <input
            type="file"
            accept="audio/*"
            onChange={handleMusicUpload}
            className="hidden"
            id="music-upload"
          />
          <label htmlFor="music-upload">
            <Button variant="ghost" size="icon-sm" asChild>
              <span>
                <Upload className="h-4 w-4" />
              </span>
            </Button>
          </label>

          {playerSettings.music.src && (
            <>
              <Button variant="ghost" size="icon-sm" onClick={handlePlayPause}>
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>

              <div className="flex items-center gap-2 flex-1">
                <Volume2 className="h-4 w-4 text-gray-500" />
                <Slider
                  value={[playerSettings.music.volume * 100]}
                  onValueChange={([value]) => {
                    if (audioRef.current) {
                      audioRef.current.volume = value / 100;
                    }
                    updateProject((p) => {
                      p.player.music.volume = value / 100;
                    });
                  }}
                  min={0}
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-xs">Loop</Label>
                <Switch
                  checked={playerSettings.music.loop}
                  onCheckedChange={(checked) => {
                    if (audioRef.current) {
                      audioRef.current.loop = checked;
                    }
                    updateProject((p) => {
                      p.player.music.loop = checked;
                    });
                  }}
                />
              </div>
            </>
          )}

          <audio
            ref={audioRef}
            src={playerSettings.music.src}
            loop={playerSettings.music.loop}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </div>
      </div>

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
          {project.sections.map((section, index) => (
            <div
              key={section.id}
              className="absolute w-full"
              style={{
                top: `${index * viewport.viewportH}px`,
                height: `${viewport.viewportH}px`,
              }}
            >
              <Stage
                width={viewport.viewportW}
                height={viewport.viewportH}
              >
                <Layer>
                  <Group
                    x={viewport.offsetX}
                    y={viewport.offsetY}
                    scaleX={viewport.scale}
                    scaleY={viewport.scale}
                  >
                    {/* Background */}
                    <Rect
                      x={0}
                      y={0}
                      width={DESIGN_W}
                      height={DESIGN_H}
                      fill={section.background.fill}
                    />

                    {/* Objects */}
                    {section.objects.map((object) => (
                      <CanvasObjectRenderer key={object.id} object={object} />
                    ))}
                  </Group>
                </Layer>
              </Stage>
            </div>
          ))}
        </div>
      </div>

      {/* Tap to Start overlay (mobile) */}
      {showTapToStart && (
        <div
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={handleTapToStart}
        >
          <div className="bg-white rounded-lg p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Tap to Start</h3>
            <p className="text-sm text-gray-600 mb-4">
              Audio playback requires user interaction
            </p>
            <Button onClick={handleTapToStart}>Start</Button>
          </div>
        </div>
      )}
    </div>
  );
}
