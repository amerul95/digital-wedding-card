import { EventData } from "./types";

export function toICSDate(dt: string): string {
  // convert ISO to UTC basic format YYYYMMDDTHHMMSSZ
  const d = new Date(dt);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

export function getGoogleCalUrl(event: EventData): string {
  const text = encodeURIComponent(event.title);
  const dates = `${toICSDate(event.startISO)}/${toICSDate(event.endISO)}`;
  const details = encodeURIComponent("Set peringatan majlis.");
  const location = encodeURIComponent(event.locationFull);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
}

export function downloadICS(event: EventData): void {
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\nBEGIN:VEVENT\nSUMMARY:${event.title}\nDTSTART:${toICSDate(event.startISO)}\nDTEND:${toICSDate(event.endISO)}\nLOCATION:${event.locationFull}\nDESCRIPTION:Set peringatan majlis.\nEND:VEVENT\nEND:VCALENDAR`;
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.title.replace(/\s+/g, "_")}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function getGoogleMapsUrl(mapQuery: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
}

export function getWazeUrl(mapQuery: string): string {
  return `https://waze.com/ul?q=${encodeURIComponent(mapQuery)}&navigate=yes`;
}





