import { useEffect, useMemo, useRef } from "react";
import { parseChapters } from "@/components/YouTubeChapterPlayer";

function stripHtml(value = "") {
  return value.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&amp;/gi, "&").replace(/&nbsp;/gi, " ").trim();
}

function timedSegments(transcript = "", timestamps = "") {
  const text = stripHtml(transcript);
  const lines = text.split(/\n+/).map(line => line.trim()).filter(Boolean);
  const directlyTimed = parseChapters(text);
  if (directlyTimed.length && directlyTimed.length === lines.length) return directlyTimed.map(item => ({ ...item, text: item.label }));
  const chapters = parseChapters(timestamps);
  if (chapters.length && chapters.length === lines.length) return lines.map((line, index) => ({ ...chapters[index], text: line }));
  return [];
}

export default function SyncedTranscript({ transcript, timestamps, positionMs = 0, expanded }) {
  const containerRef = useRef(null);
  const activeRef = useRef(null);
  const segments = useMemo(() => timedSegments(transcript, timestamps), [transcript, timestamps]);
  const seconds = positionMs / 1000;
  const activeIndex = segments.reduce((active, segment, index) => seconds >= segment.seconds ? index : active, 0);
  useEffect(() => {
    if (!expanded || !segments.length || !activeRef.current || !containerRef.current) return;
    activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeIndex, expanded, segments.length]);

  if (!segments.length) return <div className="whitespace-pre-wrap">{stripHtml(transcript)}</div>;
  return <div ref={containerRef} className="space-y-3">{segments.map((segment,index)=><p ref={index===activeIndex?activeRef:null} key={`${segment.time}-${index}`} className={`rounded-xl border px-4 py-3 transition-colors duration-500 ${index===activeIndex?"border-[#C347FF]/70 bg-[#9747FF]/25 text-[#ead7ff] shadow-[0_0_22px_rgba(151,71,255,.16)]":"border-transparent text-white/65"}`}><span className="mr-3 font-black text-[#c99cff]">{segment.time}</span>{segment.text}</p>)}</div>;
}
