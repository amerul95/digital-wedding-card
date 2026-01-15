/**
 * Layers tool details panel
 */

'use client';

import React from 'react';
import { useProjectStore } from '@/lib/store/projectStore';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Unlock, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { CanvasObject } from '@/lib/store/types';

export function LayersPanel() {
  const {
    project,
    currentSectionId,
    selectedIds,
    setSelectedIds,
    updateObject,
    deleteObject,
    reorderObject,
  } = useProjectStore();

  if (!project || !currentSectionId) {
    return (
      <div className="p-4 text-center text-zinc-400 text-sm">
        No section selected
      </div>
    );
  }

  const currentSection = project.sections.find((s) => s.id === currentSectionId);
  if (!currentSection) return null;

  const objects = [...currentSection.objects].reverse(); // Show top layer first

  const toggleLock = (objectId: string) => {
    const obj = currentSection.objects.find((o) => o.id === objectId);
    if (!obj) return;
    updateObject(currentSectionId, objectId, { locked: !obj.locked });
  };

  const toggleHidden = (objectId: string) => {
    const obj = currentSection.objects.find((o) => o.id === objectId);
    if (!obj) return;
    updateObject(currentSectionId, objectId, { hidden: !obj.hidden });
  };

  const moveLayer = (objectId: string, direction: 'up' | 'down') => {
    reorderObject(currentSectionId, objectId, direction);
  };

  const handleLayerClick = (objectId: string, e: React.MouseEvent) => {
    if (e.shiftKey || e.metaKey || e.ctrlKey) {
      // Multi-select
      if (selectedIds.includes(objectId)) {
        setSelectedIds(selectedIds.filter((id) => id !== objectId));
      } else {
        setSelectedIds([...selectedIds, objectId]);
      }
    } else {
      // Single select
      setSelectedIds([objectId]);
    }
  };

  const getObjectLabel = (obj: CanvasObject): string => {
    switch (obj.type) {
      case 'text':
        return (obj as any).text || 'Text';
      case 'rect':
        return 'Rectangle';
      case 'circle':
        return 'Circle';
      case 'line':
        return 'Line';
      case 'image':
        return 'Image';
      case 'group':
        return `Group (${(obj as any).objects?.length || 0})`;
      default:
        return 'Object';
    }
  };

  const getObjectIcon = (obj: CanvasObject) => {
    switch (obj.type) {
      case 'text':
        return 'T';
      case 'rect':
        return '□';
      case 'circle':
        return '○';
      case 'line':
        return '—';
      case 'image':
        return '🖼';
      default:
        return '•';
    }
  };

  return (
    <div className="p-4 space-y-2">
      <div className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">
        Layers ({objects.length})
      </div>

      {objects.length === 0 ? (
        <div className="text-center py-8 text-zinc-400 text-sm">
          No objects in this section
        </div>
      ) : (
        <div className="space-y-1">
          {objects.map((obj) => {
            const isSelected = selectedIds.includes(obj.id);
            return (
              <div
                key={obj.id}
                className={`p-2 rounded border transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
                onClick={(e) => handleLayerClick(obj.id, e)}
              >
                <div className="flex items-center gap-2">
                  {/* Icon */}
                  <div className="w-6 h-6 flex items-center justify-center text-xs font-medium text-zinc-600 shrink-0">
                    {getObjectIcon(obj)}
                  </div>

                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-zinc-900 truncate">
                      {getObjectLabel(obj)}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {obj.type}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleHidden(obj.id);
                      }}
                    >
                      {obj.hidden ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLock(obj.id);
                      }}
                    >
                      {obj.locked ? (
                        <Lock className="h-3 w-3" />
                      ) : (
                        <Unlock className="h-3 w-3" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLayer(obj.id, 'up');
                      }}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLayer(obj.id, 'down');
                      }}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-600 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteObject(currentSectionId, obj.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
