/**
 * Export modal for digital and print exports
 */

'use client';

import React, { useState, useRef } from 'react';
import { useProjectStore } from '@/lib/store/projectStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mmToPx } from '@/lib/designer/mmToPx';
import { DESIGN_W, DESIGN_H } from '@/lib/store/types';
import { exportSectionPNG, exportPrintPNG, downloadBlob } from '../export/exportUtils';

interface ExportModalProps {
  onClose: () => void;
}

export function ExportModal({ onClose }: ExportModalProps) {
  const { project, currentSectionId } = useProjectStore();
  const [exportType, setExportType] = useState<'digital' | 'print'>('digital');
  const [printPreset, setPrintPreset] = useState<'5x7' | '4x6' | 'A6'>('5x7');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentSection = project?.sections.find((s) => s.id === currentSectionId);
  if (!currentSection || !project) return null;

  const handleDigitalExport = async () => {
    if (!currentSection) return;
    try {
      const blob = await exportSectionPNG(currentSection, 2);
      downloadBlob(blob, `section-${currentSection.name}-digital.png`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const handlePrintExport = async () => {
    if (!currentSection) return;
    try {
      // Calculate dimensions based on preset
      let targetWidth: number;
      let targetHeight: number;

      if (printPreset === '5x7') {
        // 5x7 inch @ 300 DPI
        targetWidth = 5 * 300;
        targetHeight = 7 * 300;
      } else if (printPreset === '4x6') {
        // 4x6 inch @ 300 DPI
        targetWidth = 4 * 300;
        targetHeight = 6 * 300;
      } else {
        // A6: 105x148mm @ 300 DPI
        targetWidth = mmToPx(105, 300);
        targetHeight = mmToPx(148, 300);
      }

      // Add bleed
      const bleedPx = mmToPx(project.settings.bleedMm, 300);
      const blob = await exportPrintPNG(
        currentSection,
        targetWidth,
        targetHeight,
        bleedPx,
        300
      );
      downloadBlob(blob, `section-${currentSection.name}-print-${printPreset}.png`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export</DialogTitle>
        </DialogHeader>

        <Tabs value={exportType} onValueChange={(v) => setExportType(v as 'digital' | 'print')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="digital">Digital</TabsTrigger>
            <TabsTrigger value="print">Print</TabsTrigger>
          </TabsList>

          <TabsContent value="digital" className="space-y-4 mt-4">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Export current section as PNG for digital use.
              </p>
              <Button onClick={handleDigitalExport} className="w-full">
                Export PNG
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="print" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Print Preset</Label>
              <Select value={printPreset} onValueChange={(v) => setPrintPreset(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5x7">5x7 inch</SelectItem>
                  <SelectItem value="4x6">4x6 inch</SelectItem>
                  <SelectItem value="A6">A6 (105x148mm)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-gray-50 rounded text-sm space-y-1">
              <p className="font-medium">Export Settings:</p>
              <p>Resolution: 300 DPI</p>
              <p>Bleed: {project.settings.bleedMm}mm</p>
            </div>

            <Button onClick={handlePrintExport} className="w-full">
              Export Print PNG
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
