"use client";

import { useEvent } from "@/context/EventContext";
import { Label } from "@/components/card/UI";

export function Section6Form() {
  const { event, updateEvent } = useEvent();

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = event.songUrl ? getYouTubeId(event.songUrl) : null;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-rose-200 p-6">
      <h3 className="text-xl font-semibold text-rose-700 mb-4">Section 6: Song and Autoscroll</h3>
      <div className="space-y-4">
        {/* YouTube Song URL */}
        <div>
          <Label htmlFor="songUrl">Background Song (YouTube URL)</Label>
          <div className="flex gap-2">
            <input
              type="url"
              id="songUrl"
              value={event.songUrl}
              onChange={(e) => updateEvent({ songUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 px-4 py-2 rounded-xl border border-rose-200 text-sm text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
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
          <p className="text-xs text-rose-600 mt-2">
            Paste a YouTube video URL. The song will play in the background on preview.
          </p>
        </div>

        {/* Auto Scroll Delay */}
        <div>
          <Label htmlFor="autoScrollDelay">
            Auto Scroll Delay (after door opens)
          </Label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              id="autoScrollDelay"
              min="0"
              max="100"
              step="1"
              value={event.autoScrollDelay}
              onChange={(e) => updateEvent({ autoScrollDelay: Number(e.target.value) })}
              className="flex-1 h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
            <div className="flex items-center gap-2 min-w-[80px]">
              <input
                type="number"
                min="0"
                max="100"
                value={event.autoScrollDelay}
                onChange={(e) => updateEvent({ autoScrollDelay: Number(e.target.value) })}
                className="w-16 px-2 py-1 rounded-lg border border-rose-200 text-sm text-rose-700 text-center focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              <span className="text-sm text-rose-600 font-medium">s</span>
            </div>
          </div>
          <p className="text-xs text-rose-600 mt-2">
            {event.autoScrollDelay === 0 
              ? "Auto scroll starts immediately after door opens" 
              : `Auto scroll starts ${event.autoScrollDelay} second${event.autoScrollDelay === 1 ? '' : 's'} after door opens`}
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-4 p-4 bg-rose-50 rounded-xl border border-rose-200">
          <p className="text-sm text-rose-700 mb-2">
            <strong>How it works:</strong>
          </p>
          <ul className="text-xs text-rose-700 space-y-1 ml-4 list-disc">
            <li>Add a YouTube URL to play background music during the invitation</li>
            <li>The song will only play in preview mode (not in editor)</li>
            <li>Guests can control the music with play/pause buttons</li>
            <li>Auto scroll will smoothly move through all sections after the delay</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

