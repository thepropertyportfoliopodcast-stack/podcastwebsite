import { useEffect, useMemo, useRef, useState } from "react";
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
    speakerSegments.push({ time, seconds, speaker: speakerMatch[1].trim(), text: speakerMatch[3].trim().replace(/\n+/g, " ") });
  }
  if (speakerSegments.length) return speakerSegments;
  const lines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const directlyTimed = parseChapters(text);
  if (directlyTimed.length && directlyTimed.length === lines.length) return directlyTimed.map((item) => ({ ...item, text: item.label }));
  const chapters = parseChapters(timestamps);
  if (chapters.length && chapters.length === lines.length) return lines.map((line, index) => ({ ...chapters[index], text: line }));
  return [];
}

function normaliseWords(value) {
  if (!Array.isArray(value)) return [];
  return value.map((word, originalIndex) => ({
    text: String(word?.text || word?.word || "").trim(),
    startMs: Number(word?.startMs ?? (Number(word?.start) * 1000)),
    endMs: Number(word?.endMs ?? (Number(word?.end) * 1000)),
    segment: Number.isInteger(Number(word?.segment)) ? Number(word.segment) : 0,
    speaker: word?.speaker ? String(word.speaker) : "",
    originalIndex,
  })).filter((word) => word.text && Number.isFinite(word.startMs) && Number.isFinite(word.endMs));
}

function normaliseSegments(value, words) {
  if (Array.isArray(value) && value.length) {
    const segments = value.map((segment, index) => ({
      text: String(segment?.text || "").trim(),
      speaker: segment?.speaker ? String(segment.speaker) : "",
      firstWord: Math.max(0, Number(segment?.firstWord) || 0),
      lastWord: Math.min(words.length, Number(segment?.lastWord) || 0),
      key: `segment-${index}`,
    })).filter((segment) => segment.lastWord > segment.firstWord);
    if (segments.length) return segments;
  }
  const groups = [];
  words.forEach((word, index) => {
    const last = groups[groups.length - 1];
    if (!last || last.segment !== word.segment) {
      groups.push({ segment: word.segment, speaker: word.speaker, firstWord: index, lastWord: index + 1, key: `word-segment-${word.segment}-${index}` });
    } else {
      last.lastWord = index + 1;
      if (!last.speaker && word.speaker) last.speaker = word.speaker;
    }
  });
  return groups;
}

function playbackPosition(playback, syncOffsetMs) {
  const base = Math.max(0, Number(playback?.position) || 0);
  const observedAt = Number(playback?.observedAt) || 0;
  const canAdvance = !playback?.isPaused && !playback?.isBuffering && observedAt > 0 && typeof performance !== "undefined";
  const elapsed = canAdvance ? Math.max(0, performance.now() - observedAt) : 0;
  const duration = Number(playback?.duration) || 0;
  const current = duration > 0 ? Math.min(duration, base + elapsed) : base + elapsed;
  return Math.max(0, current + (Number(syncOffsetMs) || 0));
}

function activeWordAt(words, positionMs) {
  if (!words.length || positionMs < words[0].startMs) return -1;
  let low = 0;
  let high = words.length - 1;
  let match = -1;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    if (words[middle].startMs <= positionMs) {
      match = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }
  if (match === words.length - 1 && positionMs > words[match].endMs + 1500) return -1;
  return match;
}

function wordPrefix(text, isFirst) {
  if (isFirst || /^[,.;:!?%)\]}’”]/.test(text)) return "";
  return " ";
}

function GeneratedTranscript({ words, segments, playback, expanded, syncOffsetMs }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const activeRef = useRef(null);

  useEffect(() => {
    let timeout;
    let cancelled = false;
    const update = () => {
      if (cancelled) return;
      const position = playbackPosition(playback, syncOffsetMs);
      const nextActive = activeWordAt(words, position);
      setActiveIndex((current) => current === nextActive ? current : nextActive);
      if (!playback?.isPaused && !playback?.isBuffering) {
        const nextStart = words[nextActive + 1]?.startMs;
        const untilNextWord = Number.isFinite(nextStart) ? Math.max(16, nextStart - position) : 250;
        timeout = window.setTimeout(update, Math.min(250, untilNextWord));
      }
    };
    update();
    return () => { cancelled = true; window.clearTimeout(timeout); };
  }, [playback?.position, playback?.duration, playback?.isPaused, playback?.isBuffering, playback?.observedAt, syncOffsetMs, words]);

  useEffect(() => {
    if (!expanded || activeIndex < 0 || !activeRef.current) return;
    const scroller = activeRef.current.closest("[data-transcript-scroll]");
    if (!scroller) return;
    const wordRect = activeRef.current.getBoundingClientRect();
    const scrollRect = scroller.getBoundingClientRect();
    const safeTop = scrollRect.top + (scrollRect.height * 0.25);
    const safeBottom = scrollRect.bottom - (scrollRect.height * 0.25);
    if (wordRect.top < safeTop || wordRect.bottom > safeBottom) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }
  }, [activeIndex, expanded]);

  return (
    <div className="space-y-5" aria-label="Word-synchronised episode transcript">
      {segments.map((segment) => {
        const segmentWords = words.slice(segment.firstWord, segment.lastWord);
        return (
          <div key={segment.key} className="rounded-xl border border-white/5 bg-white/[.025] px-4 py-3 sm:px-5">
            {segment.speaker && <p className="mb-1 text-xs font-black uppercase tracking-[.12em] text-[#c99cff]">{segment.speaker.replace(/^SPEAKER_?/i, "Speaker ")}</p>}
            <p className="leading-8 text-white/75 md:leading-9">
              {segmentWords.map((word, localIndex) => {
                const index = segment.firstWord + localIndex;
                const active = index === activeIndex;
                return (
                  <span
                    ref={active ? activeRef : null}
                    key={`${word.startMs}-${word.originalIndex}`}
                    aria-current={active ? "true" : undefined}
                    className={active ? "rounded-md bg-gradient-to-r from-[#7b249d] to-[#d72db8] px-1 py-0.5 font-bold !text-white shadow-[0_0_16px_rgba(215,45,184,.35)]" : "transition-colors duration-150"}
                  >
                    {wordPrefix(word.text, localIndex === 0)}{word.text}
                  </span>
                );
              })}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default function SyncedTranscript({ transcript, timestamps, wordTimings, transcriptSegments, transcriptStatus, playback, positionMs = 0, expanded, syncOffsetMs = 0 }) {
  const words = useMemo(() => (!transcriptStatus || transcriptStatus === "READY") ? normaliseWords(wordTimings) : [], [transcriptStatus, wordTimings]);
  const generatedSegments = useMemo(() => normaliseSegments(transcriptSegments, words), [transcriptSegments, words]);
  const legacySegments = useMemo(() => timedSegments(transcript, timestamps), [transcript, timestamps]);
  const legacySeconds = positionMs / 1000;
  const legacyActiveIndex = legacySegments.reduce((active, segment, index) => legacySeconds >= segment.seconds ? index : active, 0);

  if (words.length) {
    return <GeneratedTranscript words={words} segments={generatedSegments} playback={playback || { position: positionMs, isPaused: true }} expanded={expanded} syncOffsetMs={syncOffsetMs} />;
  }
  if (!stripHtml(transcript)) {
    const pending = ["PENDING", "QUEUED", "PROCESSING"].includes(transcriptStatus);
    return <div className="rounded-xl border border-white/10 bg-white/[.035] p-5 text-white/70">{pending ? "The English transcript is being generated. It will appear here automatically." : "A transcript is not available for this episode yet."}</div>;
  }
  if (!legacySegments.length) return <div className="whitespace-pre-wrap text-white/75">{stripHtml(transcript)}</div>;
  return (
    <div className="space-y-3">
      {legacySegments.map((segment, index) => (
        <div key={`${segment.time}-${index}`} className={`rounded-xl border px-4 py-3 text-white/75 transition-colors duration-500 ${index === legacyActiveIndex ? "border-[#8d2dcc]/70 bg-[#8d2dcc]/20" : "border-transparent"}`}>
          <p className="font-black text-[#c99cff]">{segment.speaker && <span className="mr-2 text-white">{segment.speaker}</span>}<span>{segment.time}</span></p>
          <p className="mt-1">{segment.text}</p>
        </div>
      ))}
    </div>
  );
}
