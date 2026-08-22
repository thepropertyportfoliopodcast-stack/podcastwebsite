import { useEffect, useMemo, useRef, useState } from "react";
import { FaClock } from "react-icons/fa";
import YouTubeFacade from "@/components/media/YouTubeFacade";

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
  const [playerReady, setPlayerReady] = useState(false);
  const [activated, setActivated] = useState(false);
  const id = youtubeId(url);
  const chapters = useMemo(() => parseChapters(timestamps), [timestamps]);
  const activeIndex = chapters.reduce((active, chapter, index) => currentTime >= chapter.seconds ? index : active, 0);

  useEffect(() => {
    if (!id || !activated) return undefined;
    const initialise = () => {
      if (!mountRef.current || playerRef.current) return;
      playerRef.current = new window.YT.Player(mountRef.current, {
        videoId: id,
        playerVars: { autoplay: 1, playsinline: 1, rel: 0 },
        events: { onReady: (event) => { setPlayerReady(true); event.target.playVideo(); } },
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
  }, [id, activated]);

  const seek = (seconds) => {
    if (!playerReady || !playerRef.current) return;
    playerRef.current.seekTo(seconds, true);
    playerRef.current.playVideo();
    setCurrentTime(seconds);
  };

  if (!id) return null;
  return (
    <section className="grid md:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] gap-5">
      <div className="aspect-video md:h-[440px] md:aspect-auto lg:h-[520px] overflow-hidden rounded-2xl border border-white/20 bg-black">
        {!activated ? <YouTubeFacade url={url} title="Play podcast video" onActivate={() => setActivated(true)} /> : <div ref={mountRef} className="h-full w-full" />}
      </div>
      <aside className="flex h-[300px] flex-col overflow-hidden rounded-2xl border border-[#8d2dcc]/20 bg-white/80 p-4 shadow-[0_18px_45px_rgba(69,36,82,.08)] md:h-[440px] md:p-5 lg:h-[520px]" aria-label="Episode timestamps">
        <h2 className="flex shrink-0 items-center gap-3 border-b border-[#8d2dcc]/15 pb-4 text-xl font-bold text-[#6f218f]"><FaClock aria-hidden="true" /><span>Timestamps</span></h2>
        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pt-3 pr-1">
          {chapters.map((chapter, index) => (
            <button key={`${chapter.time}-${chapter.label}`} type="button" onClick={() => seek(chapter.seconds)} disabled={!playerReady} aria-label={`Play ${chapter.label} at ${chapter.time}`} className={`w-full rounded-xl border px-4 py-3 text-left transition disabled:cursor-wait disabled:opacity-60 ${index === activeIndex ? "border-[#8d2dcc] bg-[#8d2dcc]/12 text-[#8d2dcc] font-bold" : "border-[#8d2dcc]/15 bg-white/55 text-[#000000] font-medium hover:border-[#8d2dcc]/45"}`}>
              <span className="mr-3 font-bold">{chapter.time}</span>{chapter.label}
            </button>
          ))}
        </div>
      </aside>
    </section>
  );
}
