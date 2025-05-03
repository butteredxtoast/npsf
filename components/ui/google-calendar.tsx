"use client";

import { useState } from "react";
import React from "react";

export function GoogleCalendar() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // The provided Google Calendar embed URL
  const calendarUrl =
    "https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FLos_Angeles&showPrint=0&src=c2FuZnJhbmNpc2NvQG5vdmVtYmVyLXByb2plY3QuY29t&src=NnNkMjZvaWFiNTlyYzYzbGRnZW52bmwzdW9AZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23039BE5&color=%23795548&color=%230B8043";

  // Fallback: If iframe fails to load after 10 seconds, show error
  React.useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => {
      if (loading) setError(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <div className="w-full h-[60vh] min-h-[400px] max-h-[700px] flex flex-col items-center justify-center relative bg-background rounded shadow">
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <span className="text-muted-foreground">Loading calendar…</span>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 z-20">
          <span className="text-destructive font-semibold mb-2">Failed to load calendar.</span>
          <span className="text-muted-foreground text-sm">Please check your internet connection or try again later.</span>
        </div>
      )}
      <iframe
        src={calendarUrl}
        title="Group Google Calendar"
        className="w-full h-full border rounded"
        style={{ minHeight: 400, border: 'solid 1px #777' }}
        frameBorder={0}
        scrolling="no"
        onLoad={() => setLoading(false)}
        allowFullScreen
      />
    </div>
  );
} 