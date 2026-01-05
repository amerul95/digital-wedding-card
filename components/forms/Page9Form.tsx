"use client";

import { useEvent } from "@/context/EventContext";
import { Label } from "@/components/card/UI";

export function Page9Form() {
  const { event, updateEvent } = useEvent();

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = event.songUrl ? getYouTubeId(event.songUrl) : null;

  return (
    <div className="bg-white p-6">
      <div className="space-y-4">
        {/* YouTube Song URL */}
        <div>
          <Label>Background Song (YouTube URL)</Label>
          <div className="flex gap-2 mt-2">
            <input
              type="url"
              value={event.songUrl}
              onChange={(e) => updateEvent({ songUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white"
            />
            {!event.songUrl && (
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 shadow transition-colors whitespace-nowrap"
              >
                🎵 YouTube
              </a>
            )}
          </div>
          {videoId && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-700">✅ Valid YouTube URL detected (ID: {videoId})</p>
            </div>
          )}
          {event.songUrl && !videoId && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-700">❌ Invalid YouTube URL. Please check the link.</p>
            </div>
          )}
        </div>

        {/* Music Play Seconds */}
        <div>
          <Label>1. Seconds of Music Will Play</Label>
          <input
            type="number"
            value={event.musicPlaySeconds}
            onChange={(e) => updateEvent({ musicPlaySeconds: Number(e.target.value) })}
            className="w-full px-4 py-2 rounded-xl border border-[#36463A] text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#36463A] bg-white mt-2"
            min="0"
            max="600"
          />
          <p className="text-xs text-gray-600 mt-2">
            Set how many seconds the music will play (0-600 seconds)
          </p>
        </div>

        {/* Auto Scroll Delay */}
        <div>
          <Label>Auto Scroll Delay (after door opens)</Label>
          <div className="flex items-center gap-4 mt-2">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={event.autoScrollDelay}
              onChange={(e) => updateEvent({ autoScrollDelay: Number(e.target.value) })}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#36463A]"
            />
            <div className="flex items-center gap-2 min-w-[80px]">
              <input
                type="number"
                min="0"
                max="100"
                value={event.autoScrollDelay}
                onChange={(e) => updateEvent({ autoScrollDelay: Number(e.target.value) })}
                className="w-16 px-2 py-1 rounded-lg border border-[#36463A] text-sm text-gray-700 text-center focus:outline-none focus:ring-2 focus:ring-[#36463A]"
              />
              <span className="text-sm text-[#36463A] font-medium">s</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {event.autoScrollDelay === 0 
              ? "Auto scroll starts immediately after door opens" 
              : `Auto scroll starts ${event.autoScrollDelay} second${event.autoScrollDelay === 1 ? '' : 's'} after door opens`}
          </p>
        </div>

        {/* Show Video */}
        <div>
          <Label>2. Show Video</Label>
          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={event.showVideo}
              onChange={(e) => updateEvent({ showVideo: e.target.checked })}
              className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
            />
            <span className="text-sm text-gray-700">Show Video</span>
          </label>
        </div>

        {/* Autoplay */}
        <div>
          <Label>3. Autoplay</Label>
          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={event.autoplay}
              onChange={(e) => updateEvent({ autoplay: e.target.checked })}
              className="w-4 h-4 text-[#36463A] border-[#36463A] rounded focus:ring-[#36463A]"
            />
            <span className="text-sm text-gray-700">Autoplay</span>
          </label>
        </div>
      </div>
    </div>
  );
}


