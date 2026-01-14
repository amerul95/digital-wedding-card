"use client";

import { Scroll, Grid, ChevronDown } from "lucide-react";

export function SectionNavigator() {
    return (
        <div className="absolute right-2 top-20 z-40 flex flex-col gap-2">
            {/* Placeholder for Section Navigator */}
            <div className="w-8 h-8 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-black/70">
                <Scroll size={14} />
            </div>
            <div className="w-8 h-8 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-black/70">
                <Grid size={14} />
            </div>
        </div>
    );
}
