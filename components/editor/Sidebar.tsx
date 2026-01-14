import { WidgetType } from "@/components/editor/store";
import { useDraggable } from "@dnd-kit/core";

interface DraggableItemProps {
    type: WidgetType;
    label: string;
}

function DraggableItem({ type, label }: DraggableItemProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `sidebar-${type}`,
        data: {
            type,
            isSidebarItem: true,
        },
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="p-3 border rounded cursor-grab bg-white shadow-sm hover:shadow-md transition-shadow active:cursor-grabbing text-sm flex items-center gap-2"
        >
            {/* Icon could go here */}
            {label}
        </div>
    );
}

// Add 'couple-header' to WidgetType in store.ts if not exists (it doesn't yet, assume flexible or need update)
// For now, I'll pass 'couple-header' casted or update store types.

export function Sidebar() {
    return (
        <div className="w-64 border-r bg-white p-4 overflow-y-auto flex-shrink-0 z-10 h-full">
            <h2 className="font-semibold mb-3 text-xs uppercase text-gray-400 tracking-wider">Layout</h2>
            <div className="grid grid-cols-2 gap-2 mb-6">
                <DraggableItem type="section" label="Section" />
                <DraggableItem type="container" label="Container" />
            </div>

            <h2 className="font-semibold mb-3 text-xs uppercase text-gray-400 tracking-wider">Basic</h2>
            <div className="grid grid-cols-2 gap-2 mb-6">
                <DraggableItem type="text" label="Text" />
                <DraggableItem type="image" label="Image" />
                <DraggableItem type="button" label="Button" />
                <DraggableItem type="divider" label="Divider" />
                <DraggableItem type="spacer" label="Spacer" />
                <DraggableItem type="icon" label="Icon" />
            </div>

            <h2 className="font-semibold mb-3 text-xs uppercase text-gray-400 tracking-wider">Wedding</h2>
            <div className="space-y-2 mb-6">
                <DraggableItem type="couple-header" label="Couple Header" />
                <DraggableItem type="event-details" label="Event Details" />
                <DraggableItem type="countdown" label="Countdown" />
                <DraggableItem type="slider" label="Image Slider" />
                <DraggableItem type="bottom-nav" label="Bottom Nav" />
            </div>

            <h2 className="font-semibold mb-3 text-xs uppercase text-gray-400 tracking-wider">Media</h2>
            <div className="space-y-2 mb-6">
                <DraggableItem type="video" label="Video" />
                <DraggableItem type="map" label="Google Maps" />
            </div>
        </div>
    );
}
