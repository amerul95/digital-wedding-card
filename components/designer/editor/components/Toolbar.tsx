/**
 * Top toolbar with tools and actions
 */

'use client';

import React, { useState } from 'react';
import { useProjectStore } from '@/lib/store/projectStore';
import { useHistoryStore } from '@/lib/store/historyStore';
import { Button } from '@/components/ui/button';
import {
  Undo2,
  Redo2,
  Download,
  Eye,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyStart,
  AlignCenterVertical,
  AlignVerticalJustifyEnd,
  MoveHorizontal,
  MoveVertical,
  Group,
  Ungroup,
  Save,
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';
import { ExportModal } from './ExportModal';

export function Toolbar() {
  const router = useRouter();
  const { project, selectedIds, updateObject, currentSectionId } =
    useProjectStore();
  const { undo, redo, canUndo, canRedo } = useHistoryStore();
  const [showExport, setShowExport] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [themeName, setThemeName] = useState('');
  const [mainColor, setMainColor] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAlign = (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (!currentSectionId || selectedIds.length === 0) return;
    const currentSection = project?.sections.find((s) => s.id === currentSectionId);
    if (!currentSection) return;

    const selectedObjects = currentSection.objects.filter((o) => selectedIds.includes(o.id));
    if (selectedObjects.length === 0) return;

    if (type === 'left') {
      const minX = Math.min(...selectedObjects.map((o) => o.x));
      selectedObjects.forEach((obj) => {
        updateObject(currentSectionId, obj.id, { x: minX });
      });
    } else if (type === 'center') {
      const minX = Math.min(...selectedObjects.map((o) => o.x));
      const maxX = Math.max(...selectedObjects.map((o) => o.x + o.width));
      const centerX = (minX + maxX) / 2;
      selectedObjects.forEach((obj) => {
        updateObject(currentSectionId, obj.id, { x: centerX - obj.width / 2 });
      });
    } else if (type === 'right') {
      const maxX = Math.max(...selectedObjects.map((o) => o.x + o.width));
      selectedObjects.forEach((obj) => {
        updateObject(currentSectionId, obj.id, { x: maxX - obj.width });
      });
    } else if (type === 'top') {
      const minY = Math.min(...selectedObjects.map((o) => o.y));
      selectedObjects.forEach((obj) => {
        updateObject(currentSectionId, obj.id, { y: minY });
      });
    } else if (type === 'middle') {
      const minY = Math.min(...selectedObjects.map((o) => o.y));
      const maxY = Math.max(...selectedObjects.map((o) => o.y + o.height));
      const centerY = (minY + maxY) / 2;
      selectedObjects.forEach((obj) => {
        updateObject(currentSectionId, obj.id, { y: centerY - obj.height / 2 });
      });
    } else if (type === 'bottom') {
      const maxY = Math.max(...selectedObjects.map((o) => o.y + o.height));
      selectedObjects.forEach((obj) => {
        updateObject(currentSectionId, obj.id, { y: maxY - obj.height });
      });
    }
  };

  const handleDistribute = (type: 'horizontal' | 'vertical') => {
    if (!currentSectionId || selectedIds.length < 3) return;
    const currentSection = project?.sections.find((s) => s.id === currentSectionId);
    if (!currentSection) return;

    const selectedObjects = currentSection.objects.filter((o) => selectedIds.includes(o.id));
    if (selectedObjects.length < 3) return;

    if (type === 'horizontal') {
      const sorted = [...selectedObjects].sort((a, b) => a.x - b.x);
      const totalWidth = sorted[sorted.length - 1].x + sorted[sorted.length - 1].width - sorted[0].x;
      const gap = totalWidth / (sorted.length - 1);
      let currentX = sorted[0].x;
      sorted.forEach((obj, index) => {
        if (index > 0) {
          currentX += gap;
          updateObject(currentSectionId, obj.id, { x: currentX - obj.width / 2 });
        }
      });
    } else {
      const sorted = [...selectedObjects].sort((a, b) => a.y - b.y);
      const totalHeight = sorted[sorted.length - 1].y + sorted[sorted.length - 1].height - sorted[0].y;
      const gap = totalHeight / (sorted.length - 1);
      let currentY = sorted[0].y;
      sorted.forEach((obj, index) => {
        if (index > 0) {
          currentY += gap;
          updateObject(currentSectionId, obj.id, { y: currentY - obj.height / 2 });
        }
      });
    }
  };

  const handleGroup = () => {
    if (!currentSectionId || selectedIds.length < 2) return;
    const { groupObjects, setSelectedIds } = useProjectStore.getState();
    const groupId = groupObjects(currentSectionId, selectedIds);
    if (groupId) {
      setSelectedIds([groupId]);
    }
  };

  const handleUngroup = () => {
    if (!currentSectionId || selectedIds.length !== 1) return;
    const currentSection = project?.sections.find((s) => s.id === currentSectionId);
    if (!currentSection) return;
    const obj = currentSection.objects.find((o) => o.id === selectedIds[0]);
    if (obj && obj.type === 'group') {
      const { ungroupObject, setSelectedIds } = useProjectStore.getState();
      ungroupObject(currentSectionId, obj.id);
      setSelectedIds([]);
    }
  };

  const handleSave = async () => {
    if (!themeName) {
      toast.error('Please select a theme');
      return;
    }
    if (!mainColor) {
      toast.error('Please enter a main color');
      return;
    }

    setIsSaving(true);
    try {
      // TODO: Implement save API call similar to create-theme
      // For now, just show success message
      toast.success('Card saved successfully!');
      setShowSaveDialog(false);
      setThemeName('');
      setMainColor('');
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="h-14 bg-white border-b border-gray-200 flex items-center gap-1 px-4">
        {/* Title */}
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900">
            {project?.name || 'Untitled Card'}
          </h1>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowSaveDialog(true)}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save Card</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    const restoredProject = undo();
                    if (restoredProject) {
                      const store = useProjectStore.getState();
                      // Use updateProject to restore
                      store.updateProject((p) => {
                        // Replace all properties
                        p.id = restoredProject.id;
                        p.name = restoredProject.name;
                        p.createdAt = restoredProject.createdAt;
                        p.updatedAt = restoredProject.updatedAt;
                        p.settings = restoredProject.settings;
                        p.sections = restoredProject.sections;
                        p.player = restoredProject.player;
                      });
                    }
                  }}
                  disabled={!canUndo()}
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    const restoredProject = redo();
                    if (restoredProject) {
                      const store = useProjectStore.getState();
                      // Use updateProject to restore
                      store.updateProject((p) => {
                        // Replace all properties
                        p.id = restoredProject.id;
                        p.name = restoredProject.name;
                        p.createdAt = restoredProject.createdAt;
                        p.updatedAt = restoredProject.updatedAt;
                        p.settings = restoredProject.settings;
                        p.sections = restoredProject.sections;
                        p.player = restoredProject.player;
                      });
                    }
                  }}
                  disabled={!canRedo()}
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Alignment (Phase 2) */}
        {selectedIds.length >= 2 && (
          <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleAlign('left')}>
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Align Left</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleAlign('center')}>
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Align Center</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleAlign('right')}>
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Align Right</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleAlign('top')}>
                    <AlignVerticalJustifyStart className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Align Top</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleAlign('middle')}>
                    <AlignCenterVertical className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Align Middle</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm" onClick={() => handleAlign('bottom')}>
                    <AlignVerticalJustifyEnd className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Align Bottom</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Distribution (Phase 2) */}
        {selectedIds.length >= 3 && (
          <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDistribute('horizontal')}
                  >
                    <MoveHorizontal className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Distribute Horizontal</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDistribute('vertical')}
                  >
                    <MoveVertical className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Distribute Vertical</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Group/Ungroup (Phase 2) */}
        {selectedIds.length >= 2 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={handleGroup}>
                  <Group className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Group</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {selectedIds.length === 1 && project?.sections.find((s) => s.id === currentSectionId)?.objects.find((o) => o.id === selectedIds[0])?.type === 'group' && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={handleUngroup}>
                  <Ungroup className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ungroup</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 ml-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    const currentPath = window.location.pathname;
                    const previewPath = currentPath.includes('/dashboard/') 
                      ? '/designer/dashboard/create/preview'
                      : '/designer/create/preview';
                    router.push(previewPath);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Preview</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={() => setShowExport(true)}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {showExport && <ExportModal onClose={() => setShowExport(false)} />}

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Card</DialogTitle>
            <DialogDescription>
              Enter theme type and main color to save your card.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="themeSelect" className="text-sm font-medium mb-1 block">Theme</Label>
              <Select value={themeName} onValueChange={setThemeName}>
                <SelectTrigger id="themeSelect" className="w-full">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baby">Baby</SelectItem>
                  <SelectItem value="party">Party</SelectItem>
                  <SelectItem value="ramadan">Ramadan</SelectItem>
                  <SelectItem value="raya">Raya</SelectItem>
                  <SelectItem value="floral">Floral</SelectItem>
                  <SelectItem value="islamic">Islamic</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="rustic">Rustic</SelectItem>
                  <SelectItem value="traditional">Traditional</SelectItem>
                  <SelectItem value="vintage">Vintage</SelectItem>
                  <SelectItem value="watercolor">Watercolor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="colorInput" className="text-sm font-medium mb-1 block">Main Color</Label>
              <Input
                id="colorInput"
                type="text"
                value={mainColor}
                onChange={(e) => setMainColor(e.target.value.toUpperCase())}
                placeholder="e.g. ROSE, BLUE, GOLD"
                className="w-full uppercase"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!themeName || !mainColor || isSaving}
              className="bg-[#36463A] hover:bg-[#2d3a2f]"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
