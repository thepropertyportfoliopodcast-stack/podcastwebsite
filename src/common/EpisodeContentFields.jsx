export default function EpisodeContentFields({ formData, onChange, onTranscriptChange }) {
  const fieldClass = "w-full p-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#9747FF]";

  return (
    <section className="rounded-xl border border-gray-800 bg-[#111111] p-4 md:p-6 space-y-5">
      <div>
        <h4 className="text-lg font-semibold">Video and episode content</h4>
        <p className="mt-1 text-sm text-gray-400">Add a YouTube URL, then enter one timestamp per line. Clicking a timestamp on the episode page will jump to that point and play the video.</p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium">YouTube video URL</span>
        <input className={fieldClass} type="url" name="youtubeUrl" value={formData.youtubeUrl || ""} onChange={onChange} placeholder="https://www.youtube.com/watch?v=..." />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Clickable YouTube timestamps</span>
        <textarea className={fieldClass} rows="7" name="timestamps" value={formData.timestamps || ""} onChange={onChange} placeholder={"00:00 | Introduction\n03:25 | Market overview\n12:40 | Investment strategy"} />
        <span className="block text-xs text-gray-400">Accepted formats: MM:SS | Title or HH:MM:SS | Title. Enter each chapter on a new line.</span>
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Full transcript</span>
        <textarea className={fieldClass} rows="12" name="transcript" value={formData.transcript || ""} onChange={(event) => onTranscriptChange(event.target.value)} placeholder="Paste the complete podcast transcript here..." />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Topics covered</span>
        <textarea className={fieldClass} rows="6" name="topicsCovered" value={formData.topicsCovered || ""} onChange={onChange} placeholder={"Australian property market\nFirst-home buyers\nInterest rates"} />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Instagram Reel links</span>
        <textarea className={fieldClass} rows="6" name="reelLinks" value={formData.reelLinks || ""} onChange={onChange} placeholder={"https://www.instagram.com/reel/.../\nhttps://www.instagram.com/reel/.../"} />
      </label>
    </section>
  );
}
