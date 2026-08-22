import { useEffect, useMemo, useRef } from "react";
import { parseChapters } from "@/components/media/YouTubeChapterPlayer";

function stripHtml(value = "") {
  return value.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&amp;/gi, "&").replace(/&nbsp;/gi, " ").trim();
}

function timedSegments(transcript = "", timestamps = "") {
  const text = stripHtml(transcript);
  const speakerPattern = /(?:^|\n)\s*([^\n]+?)\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*\n+([\s\S]*?)(?=\n\s*[^\n]+?\s+\d{1,2}:\d{2}(?::\d{2})?\s*\n|$)/g;
  const speakerSegments = [];
  let speakerMatch;
  while ((speakerMatch = speakerPattern.exec(text)) !== null) {
    const time = speakerMatch[2];
    const parts = time.split(":").map(Number);
    const seconds = parts.reduce((total, part) => total * 60 + part, 0);
    speakerSegments.push({
      time,
      seconds,
      speaker: speakerMatch[1].trim(),
      text: speakerMatch[3].trim().replace(/\n+/g, " "),
    });
  }
  if (speakerSegments.length) return speakerSegments;
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

  if (!segments.length) return <div className="whitespace-pre-wrap text-[#24192b]">{stripHtml(transcript)}</div>;

  return (
    <div ref={containerRef} className="space-y-3">
      {segments.map((segment, index) => (
        <div
          ref={index === activeIndex ? activeRef : null}
          key={`${segment.time}-${index}`}
          className={`rounded-xl border px-4 py-3 text-[#24192b] transition-colors duration-500 ${
            index === activeIndex ? "border-[#8d2dcc]/70 bg-[#8d2dcc]/12 shadow-[0_8px_24px_rgba(141,45,204,.10)]" : "border-transparent"
          }`}
        >
          <p className="font-black text-[#7b249d]">
            {segment.speaker && <span className="mr-2 text-[#201527]">{segment.speaker}</span>}
            <span>{segment.time}</span>
          </p>
          <p className="mt-1 text-[#302437]">{segment.text}</p>
        </div>
      ))}
    </div>
  );
}