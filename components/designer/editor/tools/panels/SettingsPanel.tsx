/**
 * Settings tool details panel
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Grid, Ruler } from 'lucide-react';

export function SettingsPanel() {
  const [snapEnabled, setSnapEnabled] = React.useState(true);
  const [showGuides, setShowGuides] = React.useState(true);

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <div className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
          Canvas
        </div>

        {/* Snap to Grid */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Grid className="h-4 w-4 text-zinc-600" />
            <Label htmlFor="snap" className="text-sm font-medium text-zinc-900">
              Snap to Grid
            </Label>
          </div>
          <Switch
            id="snap"
            checked={snapEnabled}
            onCheckedChange={setSnapEnabled}
          />
        </div>

        {/* Show Guides */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Ruler className="h-4 w-4 text-zinc-600" />
            <Label htmlFor="guides" className="text-sm font-medium text-zinc-900">
              Show Guides
            </Label>
          </div>
          <Switch
            id="guides"
            checked={showGuides}
            onCheckedChange={setShowGuides}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-200">
        <div className="text-xs text-zinc-500">
          These settings control canvas behavior. Changes are saved automatically.
        </div>
      </div>
    </div>
  );
}
