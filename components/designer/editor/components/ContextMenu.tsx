/**
 * Context menu for canvas objects
 */

'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useProjectStore } from '@/lib/store/projectStore';
import { ArrowUp, ArrowDown, Copy, Trash2, Lock, Unlock, Group, Ungroup } from 'lucide-react';

interface ContextMenuProps {
  objectId: string;
  children: React.ReactNode;
}

export function ContextMenu({ objectId, children }: ContextMenuProps) {
  const {
    project,
    currentSectionId,
    selectedIds,
    updateObject,
    deleteObject,
    duplicateObject,
    reorderObject,
    groupObjects,
    ungroupObject,
    setSelectedIds,
  } = useProjectStore();

  if (!currentSectionId) return <>{children}</>;

  const currentSection = project?.sections.find((s) => s.id === currentSectionId);
  const object = currentSection?.objects.find((o) => o.id === objectId);
  if (!object) return <>{children}</>;

  const isGroup = object.type === 'group';
  const objectIndex = currentSection.objects.findIndex((o) => o.id === objectId);
  const isFirst = objectIndex === 0;
  const isLast = objectIndex === currentSection.objects.length - 1;

  return (
    <DropdownMenu>
      {children}
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            if (!isFirst) {
              reorderObject(currentSectionId, objectId, 'up');
            }
          }}
          disabled={isFirst}
        >
          <ArrowUp className="h-4 w-4 mr-2" />
          Bring Forward
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            if (!isLast) {
              reorderObject(currentSectionId, objectId, 'down');
            }
          }}
          disabled={isLast}
        >
          <ArrowDown className="h-4 w-4 mr-2" />
          Send Backward
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            reorderObject(currentSectionId, objectId, 'top');
          }}
          disabled={isLast}
        >
          Bring to Front
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            reorderObject(currentSectionId, objectId, 'bottom');
          }}
          disabled={isFirst}
        >
          Send to Back
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            const newId = duplicateObject(currentSectionId, objectId);
            setSelectedIds([newId]);
          }}
        >
          <Copy className="h-4 w-4 mr-2" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isGroup ? (
          <DropdownMenuItem
            onClick={() => {
              ungroupObject(currentSectionId, objectId);
              setSelectedIds([]);
            }}
          >
            <Ungroup className="h-4 w-4 mr-2" />
            Ungroup
          </DropdownMenuItem>
        ) : selectedIds.length >= 2 ? (
          <DropdownMenuItem
            onClick={() => {
              const groupId = groupObjects(currentSectionId, selectedIds);
              if (groupId) {
                setSelectedIds([groupId]);
              }
            }}
          >
            <Group className="h-4 w-4 mr-2" />
            Group
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            updateObject(currentSectionId, objectId, { locked: !object.locked });
          }}
        >
          {object.locked ? (
            <>
              <Unlock className="h-4 w-4 mr-2" />
              Unlock
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Lock
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            deleteObject(currentSectionId, objectId);
            setSelectedIds(selectedIds.filter((id) => id !== objectId));
          }}
          className="text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
