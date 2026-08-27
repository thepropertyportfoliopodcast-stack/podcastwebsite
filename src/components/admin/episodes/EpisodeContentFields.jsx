const STATUS_STYLE = {
  READY: "border-emerald-300 bg-emerald-50 text-emerald-800",
  PROCESSING: "border-violet-300 bg-violet-50 text-violet-800",
  QUEUED: "border-amber-300 bg-amber-50 text-amber-800",
  FAILED: "border-red-300 bg-red-50 text-red-800",
};

export default function EpisodeContentFields({ formData, onChange, onTranscriptChange, transcription, onRegenerate, regenerating = false }) {
  const fieldClass = "w-full p-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#9747FF]";
  const transcriptProgress = transcription?.status === "READY" ? 100 : Math.max(0, Math.min(99, Number(transcription?.progress) || 0));

  return (
    <section className="rounded-xl border border-gray-800 bg-[#111111] p-4 md:p-6 space-y-5">
      <div>
        <h4 className="text-lg font-semibold">Video and episode content</h4>
        <p className="mt-1 text-sm text-gray-400">WhisperX generates the timing. Your speaker transcript below controls the exact words, spelling and speaker grouping visitors see.</p>
      </div>

      {transcription?.status && <div className="rounded-xl border border-gray-700 bg-white p-4 text-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold">Automatic transcript</p>
            <p className="mt-1 text-xs text-slate-500">{transcription.generatedAt ? `Generated ${new Date(transcription.generatedAt).toLocaleString()}` : "The worker will process this episode audio in the background."}</p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${STATUS_STYLE[transcription.status] || "border-slate-300 bg-slate-50 text-slate-700"}`}>{transcription.status}</span>
        </div>
        {["QUEUED", "PROCESSING"].includes(transcription.status) && <div className="mt-4">
          <div className="mb-1 flex justify-between gap-3 text-xs font-bold text-slate-600"><span>{transcription.note || (transcription.status === "QUEUED" ? "Waiting in queue" : "Processing audio")}</span><span>{transcriptProgress}%</span></div>
          <div className="h-2.5 overflow-hidden rounded-full bg-violet-100"><div className="h-full rounded-full bg-gradient-to-r from-[#7b249d] to-[#d72db8] transition-[width] duration-700" style={{ width: `${transcriptProgress}%` }} /></div>
        </div>}
        {transcription.error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-700">{transcription.error}</p>}
        {onRegenerate && <button type="button" onClick={onRegenerate} disabled={regenerating} className="mt-3 rounded-lg bg-gradient-to-r from-[#7b249d] to-[#d72db8] px-4 py-2 text-sm font-bold !text-white disabled:cursor-wait disabled:opacity-60">{regenerating ? "Queueing…" : "Regenerate word transcript"}</button>}
      </div>}

      <label className="block space-y-2">
        <span className="text-sm font-medium">YouTube video URL</span>
        <input className={fieldClass} type="url" name="youtubeUrl" value={formData.youtubeUrl || ""} onChange={onChange} placeholder="https://www.youtube.com/watch?v=..." />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Clickable YouTube chapter timestamps (optional)</span>
        <textarea className={fieldClass} rows="7" name="timestamps" value={formData.timestamps || ""} onChange={onChange} placeholder={"00:00 | Introduction\n03:25 | Market overview\n12:40 | Investment strategy"} />
        <span className="block text-xs text-gray-400">Accepted formats: MM:SS | Title or HH:MM:SS | Title. Enter each chapter on a new line.</span>
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Speaker transcript (recommended for exact wording)</span>
        <textarea className={fieldClass} rows="12" name="transcript" value={formData.transcript || ""} onChange={(event) => onTranscriptChange(event.target.value)} placeholder={"Parag Dixit\nFull text spoken by Parag...\n\nJulius\nFull text spoken by Julius..."} />
        <span className="block text-xs leading-5 text-gray-400">Put a host or guest name on its own line, followed by everything they said. The website shows that full speaker turn as one block and uses your spelling. Existing times such as <strong className="text-gray-300">Parag Dixit 0:00</strong> are supported and hidden automatically—you do not need to remove them. WhisperX still provides word-by-word timing.</span>
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Spotify transcript sync offset (milliseconds)</span>
        <input className={fieldClass} type="number" min="-300000" max="300000" step="50" name="transcriptSyncOffsetMs" value={formData.transcriptSyncOffsetMs || 0} onChange={onChange} />
        <span className="block text-xs text-gray-400">Keep this at 0 normally. Use a positive number if highlighting is behind Spotify, or a negative number if it is ahead.</span>
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Topics covered</span>
        <textarea className={fieldClass} rows="6" name="topicsCovered" value={formData.topicsCovered || ""} onChange={onChange} placeholder={"Australian property market\nFirst-home buyers\nInterest rates"} />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium">YouTube Shorts links</span>
        <textarea className={fieldClass} rows="6" name="reelLinks" value={formData.reelLinks || ""} onChange={onChange} placeholder={"https://www.youtube.com/shorts/...\nhttps://www.youtube.com/shorts/..."} />
        <span className="block text-xs text-gray-400">Add up to four YouTube Shorts, one URL per line.</span>
      </label>
    </section>
  );
}
