import { useEffect, useMemo, useRef, useState } from "react";

function youtubeId(url = "") {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/i);
  return match?.[1] || "";
}

function secondsFromTime(value = "") {
  const parts = value.split(":").map(Number);
  if (parts.some(Number.isNaN)) return 0;
  return parts.reduce((total, part) => total * 60 + part, 0);
}

export function parseChapters(value = "") {
  const text = value.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n").replace(/<[^>]+>/g, "");
  return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const match = line.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s*(?:\||-|–|—)?\s*(.+)$/);
    return match ? { time: match[1], seconds: secondsFromTime(match[1]), label: match[2] } : null;
  }).filter(Boolean).sort((a, b) => a.seconds - b.seconds);
}

export default function YouTubeChapterPlayer({ url, timestamps }) {
  const mountRef = useRef(null);
  const playerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const id = youtubeId(url);
  const chapters = useMemo(() => parseChapters(timestamps), [timestamps]);
  const activeIndex = chapters.reduce((active, chapter, index) => currentTime >= chapter.seconds ? index : active, 0);

  useEffect(() => {
    if (!id) return undefined;
    const initialise = () => {
      if (!mountRef.current || playerRef.current) return;
      playerRef.current = new window.YT.Player(mountRef.current, {
        videoId: id,
        playerVars: { rel: 0 },
      });
    };
    if (window.YT?.Player) initialise();
    else {
      const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (!existing) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(script);
      }
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { previous?.(); initialise(); };
    }
    const timer = window.setInterval(() => {
      const time = playerRef.current?.getCurrentTime?.();
      if (Number.isFinite(time)) setCurrentTime(time);
    }, 750);
    return () => { window.clearInterval(timer); playerRef.current?.destroy?.(); playerRef.current = null; };
  }, [id]);

  const seek = (seconds) => { playerRef.current?.seekTo?.(seconds, true); playerRef.current?.playVideo?.(); };

  if (!id) return null;
  return (
    <section className="grid md:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-5">
      <div className="aspect-video md:h-[440px] md:aspect-auto lg:h-[520px] overflow-hidden rounded-2xl border border-white/20 bg-black">
        <div ref={mountRef} className="h-full w-full" />
      </div>
      <aside className="h-[300px] md:h-[440px] lg:h-[520px] overflow-y-auto rounded-2xl border border-white/20 bg-[#111] p-4 md:p-5" aria-label="Episode timestamps">
        <h2 className="sticky top-0 bg-[#111] pb-4 text-xl font-bold">Timestamps</h2>
        <div className="space-y-2">
          {chapters.map((chapter, index) => (
            <button key={`${chapter.time}-${chapter.label}`} type="button" onClick={() => seek(chapter.seconds)} className={`w-full rounded-xl border px-4 py-3 text-left transition ${index === activeIndex ? "border-[#9747FF] bg-[#9747FF]/20 text-[#cda7ff]" : "border-white/10 text-white hover:border-white/30"}`}>
              <span className="mr-3 font-bold">{chapter.time}</span>{chapter.label}
            </button>
          ))}
        </div>
      </aside>
    </section>
  );
}
