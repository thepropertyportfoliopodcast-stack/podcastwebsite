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

function clockMilliseconds(value = "") {
  const parts = value.split(":").map(Number);
  if (!parts.length || parts.some((part) => !Number.isFinite(part))) return null;
  return parts.reduce((total, part) => total * 60 + part, 0) * 1000;
}

function speakerAliases(speakerNames = []) {
  const aliases = new Map();
  const firstNameCounts = new Map();
  speakerNames.filter(Boolean).forEach((name) => {
    const first = String(name).trim().split(/\s+/)[0]?.toLowerCase();
    if (first) firstNameCounts.set(first, (firstNameCounts.get(first) || 0) + 1);
  });
  speakerNames.filter(Boolean).forEach((name) => {
    const clean = String(name).trim();
    aliases.set(clean.toLowerCase(), clean);
    const first = clean.split(/\s+/)[0];
    if (first && firstNameCounts.get(first.toLowerCase()) === 1) aliases.set(first.toLowerCase(), first);
  });
  return aliases;
}

function parseManualSpeakerBlocks(transcript = "", speakerNames = []) {
  const aliases = speakerAliases(speakerNames);
  const lines = stripHtml(transcript).split(/\r?\n/).map((line) => line.trim());
  const blocks = [];
  let current = null;
  const flush = () => {
    if (!current) return;
    const text = current.lines.join(" ").replace(/\s+/g, " ").trim();
    if (text) blocks.push({ speaker: current.speaker, timeMs: current.timeMs, text });
    current = null;
  };
  lines.forEach((line) => {
    if (!line) return;
    const timed = line.match(/^(.+?)\s+(\d{1,2}:\d{2}(?::\d{2})?)$/);
    const knownSpeaker = aliases.get(line.toLowerCase());
    const looksLikeSpeakerName = line.length <= 70 && /^(?:[A-Z][\p{L}'’.-]*)(?:\s+[A-Z][\p{L}'’.-]*){0,5}$/u.test(line);
    if (timed || knownSpeaker || looksLikeSpeakerName) {
      flush();
      current = {
        speaker: timed ? timed[1].trim() : (knownSpeaker || line),
        timeMs: timed ? clockMilliseconds(timed[2]) : null,
        lines: [],
      };
      return;
    }
    if (current) current.lines.push(line);
  });
  flush();
  return blocks;
}

function comparableToken(value = "") {
  return value.normalize("NFKD").toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "");
}

function closestSourceWord(words, timeMs) {
  if (!words.length) return 0;
  let low = 0;
  let high = words.length - 1;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (words[middle].startMs < timeMs) low = middle + 1;
    else high = middle;
  }
  if (low > 0 && Math.abs(words[low - 1].startMs - timeMs) < Math.abs(words[low].startMs - timeMs)) return low - 1;
  return low;
}

function alignedManualTranscript(transcript, speakerNames, sourceWords) {
  const blocks = parseManualSpeakerBlocks(transcript, speakerNames);
  if (!blocks.length || !sourceWords.length) return null;
  const manualWords = [];
  const segments = [];
  blocks.forEach((block, blockIndex) => {
    const firstWord = manualWords.length;
    const tokens = block.text.match(/\S+/g) || [];
    tokens.forEach((text) => manualWords.push({ text, speaker: block.speaker, segment: blockIndex }));
    if (manualWords.length > firstWord) segments.push({ speaker: block.speaker, timeMs: block.timeMs, firstWord, lastWord: manualWords.length, key: `manual-speaker-${blockIndex}` });
  });
  if (!manualWords.length) return null;

  const manualPositions = new Map();
  const sourcePositions = new Map();
  manualWords.forEach((word, index) => {
    const token = comparableToken(word.text);
    if (token) manualPositions.set(token, [...(manualPositions.get(token) || []), index]);
  });
  sourceWords.forEach((word, index) => {
    const token = comparableToken(word.text);
    if (token) sourcePositions.set(token, [...(sourcePositions.get(token) || []), index]);
  });

  const strongAnchors = [{ manual: -1, source: -1 }];
  segments.forEach((segment) => {
    if (segment.timeMs == null) return;
    const source = closestSourceWord(sourceWords, segment.timeMs);
    const previous = strongAnchors[strongAnchors.length - 1];
    if (segment.firstWord > previous.manual && source > previous.source) strongAnchors.push({ manual: segment.firstWord, source });
  });
  strongAnchors.push({ manual: manualWords.length, source: sourceWords.length });

  const anchors = [];
  for (let interval = 0; interval < strongAnchors.length - 1; interval += 1) {
    const left = strongAnchors[interval];
    const right = strongAnchors[interval + 1];
    if (!anchors.length || anchors[anchors.length - 1].manual !== left.manual) anchors.push(left);
    let lastSource = left.source;
    const candidates = [];
    manualPositions.forEach((manualIndexes, token) => {
      const sourceIndexes = sourcePositions.get(token);
      if (manualIndexes.length !== 1 || sourceIndexes?.length !== 1) return;
      const manual = manualIndexes[0];
      const source = sourceIndexes[0];
      if (manual > left.manual && manual < right.manual && source > left.source && source < right.source) candidates.push({ manual, source });
    });
    candidates.sort((a, b) => a.manual - b.manual);
    candidates.forEach((candidate) => {
      if (candidate.source > lastSource && candidate.source < right.source) {
        anchors.push(candidate);
        lastSource = candidate.source;
      }
    });
  }
  anchors.push(strongAnchors[strongAnchors.length - 1]);

  const sourceIndexForManual = new Array(manualWords.length).fill(0);
  for (let index = 0; index < anchors.length - 1; index += 1) {
    const left = anchors[index];
    const right = anchors[index + 1];
    for (let manual = Math.max(0, left.manual); manual < Math.min(manualWords.length, right.manual + 1); manual += 1) {
      const fraction = (manual - left.manual) / Math.max(1, right.manual - left.manual);
      sourceIndexForManual[manual] = Math.max(0, Math.min(sourceWords.length - 1, Math.round(left.source + ((right.source - left.source) * fraction))));
    }
  }

  let runStart = 0;
  while (runStart < manualWords.length) {
    let runEnd = runStart + 1;
    while (runEnd < manualWords.length && sourceIndexForManual[runEnd] === sourceIndexForManual[runStart]) runEnd += 1;
    const source = sourceWords[sourceIndexForManual[runStart]];
    const step = Math.max(1, (source.endMs - source.startMs) / (runEnd - runStart));
    for (let index = runStart; index < runEnd; index += 1) {
      manualWords[index] = {
        ...manualWords[index],
        startMs: Math.round(source.startMs + (step * (index - runStart))),
        endMs: Math.round(source.startMs + (step * (index - runStart + 1))),
        originalIndex: index,
      };
    }
    runStart = runEnd;
  }
  return { words: manualWords, segments };
}

function ManualTranscript({ blocks }) {
  return <div className="space-y-5" aria-label="Episode transcript">
    {blocks.map((block, index) => <div key={`${block.speaker}-${index}`} className="rounded-xl border border-white/5 bg-white/[.025] px-4 py-3 sm:px-5">
      <p className="mb-1 text-xs font-black uppercase tracking-[.12em] text-[#c99cff]">{block.speaker}</p>
      <p className="leading-8 text-white/75 md:leading-9">{block.text}</p>
    </div>)}
  </div>;
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

export default function SyncedTranscript({ transcript, transcriptIsManual = true, timestamps, wordTimings, transcriptSegments, transcriptStatus, speakerNames = [], playback, positionMs = 0, expanded, syncOffsetMs = 0 }) {
  const words = useMemo(() => (!transcriptStatus || transcriptStatus === "READY") ? normaliseWords(wordTimings) : [], [transcriptStatus, wordTimings]);
  const generatedSegments = useMemo(() => normaliseSegments(transcriptSegments, words), [transcriptSegments, words]);
  const manualAligned = useMemo(() => transcriptIsManual ? alignedManualTranscript(transcript, speakerNames, words) : null, [speakerNames, transcript, transcriptIsManual, words]);
  const manualBlocks = useMemo(() => transcriptIsManual ? parseManualSpeakerBlocks(transcript, speakerNames) : [], [speakerNames, transcript, transcriptIsManual]);
  const legacySegments = useMemo(() => timedSegments(transcript, timestamps), [transcript, timestamps]);
  const legacySeconds = positionMs / 1000;
  const legacyActiveIndex = legacySegments.reduce((active, segment, index) => legacySeconds >= segment.seconds ? index : active, 0);

  if (words.length) {
    return <GeneratedTranscript words={manualAligned?.words || words} segments={manualAligned?.segments || generatedSegments} playback={playback || { position: positionMs, isPaused: true }} expanded={expanded} syncOffsetMs={syncOffsetMs} />;
  }
  if (manualBlocks.length) return <ManualTranscript blocks={manualBlocks} />;
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
