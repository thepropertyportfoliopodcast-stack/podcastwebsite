import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  MdCancel,
  MdDeleteOutline,
  MdEdit,
  MdLaunch,
  MdOutlineAccessTime,
  MdOutlineSubtitles,
  MdRefresh,
  MdReplay,
  MdSearch,
} from "react-icons/md";
import toast from "react-hot-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import PodcastApi from "@/services/podcastApi";

const PAGE_SIZE = 15;
const STATUS_ORDER = ["PROCESSING", "QUEUED", "READY", "FAILED", "PENDING", "CANCELLED", "DELETED", "UNAVAILABLE"];
const STATUS_STYLE = {
  PROCESSING: "border-violet-300 bg-violet-100 text-violet-900",
  QUEUED: "border-amber-300 bg-amber-100 text-amber-900",
  READY: "border-emerald-300 bg-emerald-100 text-emerald-900",
  FAILED: "border-red-300 bg-red-100 text-red-900",
  PENDING: "border-sky-300 bg-sky-100 text-sky-900",
  CANCELLED: "border-slate-300 bg-slate-100 text-slate-800",
  DELETED: "border-slate-300 bg-slate-100 text-slate-700",
  UNAVAILABLE: "border-orange-300 bg-orange-100 text-orange-900",
};

const formatNumber = (value) => new Intl.NumberFormat("en-AU").format(Number(value) || 0);
const formatDate = (value) => value ? new Date(value).toLocaleString("en-AU") : "Not generated";
const formatDuration = (milliseconds) => {
  const seconds = Math.round((Number(milliseconds) || 0) / 1000);
  if (!seconds) return "—";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return [hours ? `${hours}h` : "", `${minutes}m`].filter(Boolean).join(" ");
};
const formatRemaining = (value) => {
  const seconds = Math.max(0, Math.ceil(Number(value) || 0));
  if (seconds < 60) return `${seconds}s`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.ceil((seconds % 3600) / 60);
  return [hours ? `${hours}h` : "", minutes ? `${minutes}m` : ""].filter(Boolean).join(" ");
};
const formatClock = (value) => value ? new Date(value).toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" }) : "";

function StatusBadge({ status }) {
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${STATUS_STYLE[status] || "border-slate-300 bg-slate-100 text-slate-800"}`}>{status || "PENDING"}</span>;
}

export default function TranscriptManagementPage() {
  const api = useMemo(() => new PodcastApi(), []);
  const [data, setData] = useState({ episodes: [], summary: {}, worker: {}, pagination: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loadedAt, setLoadedAt] = useState(Date.now());
  const [now, setNow] = useState(Date.now());

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const response = await api.EpisodeTranscriptsList({ page, limit: PAGE_SIZE, status, search });
      setData(response?.data?.data || { episodes: [], summary: {}, worker: {}, pagination: {} });
      setLoadedAt(Date.now());
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to load transcript jobs");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [api, page, search, status]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!autoRefresh) return undefined;
    const interval = window.setInterval(() => load({ silent: true }), 10000);
    return () => window.clearInterval(interval);
  }, [autoRefresh, load]);
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const act = async (key, action, successMessage) => {
    if (busy) return;
    setBusy(key);
    try {
      const response = await action();
      toast.success(response?.data?.message || successMessage);
      await load({ silent: true });
    } catch (requestError) {
      toast.error(requestError?.response?.data?.message || "Transcript action failed");
    } finally {
      setBusy("");
    }
  };

  const retry = (episode) => act(`retry-${episode.uuid}`, () => api.EpisodeTranscriptRetry(episode.uuid), "Transcript queued");
  const cancel = (episode) => act(`cancel-${episode.uuid}`, () => api.EpisodeTranscriptCancel(episode.uuid), "Transcript cancelled");
  const remove = (episode) => {
    if (!window.confirm(`Delete the generated transcript for “${episode.title}”?\n\nThe episode and uploaded audio will be kept.`)) return;
    act(`delete-${episode.uuid}`, () => api.EpisodeTranscriptDelete(episode.uuid), "Transcript deleted");
  };
  const retryFailed = () => act("retry-failed", () => api.EpisodeTranscriptsRetryFailed(), "Failed transcripts queued");
  const queuePending = () => act("queue-pending", () => api.EpisodeTranscriptsBackfill(false), "Pending transcripts queued");
  const submitSearch = (event) => { event.preventDefault(); setPage(1); setSearch(searchInput.trim()); };
  const changeStatus = (nextStatus) => { setPage(1); setStatus(nextStatus); };

  const episodes = Array.isArray(data.episodes) ? data.episodes : [];
  const summary = data.summary || {};
  const pagination = data.pagination || {};
  const totalPages = Math.max(1, pagination.totalPages || 1);

  return <AdminLayout><div className="mx-auto max-w-[1480px] space-y-5 text-slate-900">
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-violet-200 pb-5">
      <div>
        <p className="text-xs font-black uppercase tracking-[.18em] text-violet-700">WhisperX operations</p>
        <h1 className="mt-1 flex items-center gap-3 text-2xl font-black text-slate-950 md:text-3xl"><MdOutlineSubtitles className="text-violet-700" />Transcript management</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">Monitor every episode, retry failures, cancel jobs or remove generated transcript data without deleting episode audio.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={busy === "retry-failed" || !summary.FAILED} onClick={retryFailed} className="inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2 text-sm font-bold !text-white disabled:cursor-not-allowed disabled:opacity-40"><MdReplay />{busy === "retry-failed" ? "Queueing…" : `Retry failed (${summary.FAILED || 0})`}</button>
        <button type="button" disabled={busy === "queue-pending"} onClick={queuePending} className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2 text-sm font-bold !text-white disabled:cursor-not-allowed disabled:opacity-50"><MdOutlineAccessTime />{busy === "queue-pending" ? "Queueing…" : "Queue pending"}</button>
        <button type="button" disabled={loading} onClick={() => load()} className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold !text-white disabled:opacity-50"><MdRefresh />Refresh</button>
      </div>
    </header>

    {!data.worker?.enabled && <div className="rounded-xl border border-red-300 bg-red-50 p-4 font-semibold text-red-800">The WhisperX worker is disabled. Add <code>WHISPERX_ENABLED=true</code> to the backend environment and restart PM2.</div>}
    {error && <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-800">{error}</div>}

    <section className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
      {STATUS_ORDER.map((item) => <button type="button" key={item} onClick={() => changeStatus(status === item ? "ALL" : item)} className={`rounded-xl border p-4 text-left transition ${status === item ? "border-violet-600 bg-violet-700 shadow-lg" : "border-violet-200 bg-white hover:border-violet-400"}`}>
        <span className={`block text-[11px] font-black uppercase tracking-wide ${status === item ? "!text-white/80" : "text-slate-500"}`}>{item}</span>
        <strong className={`mt-1 block text-2xl ${status === item ? "!text-white" : "text-slate-950"}`}>{formatNumber(summary[item])}</strong>
      </button>)}
    </section>

    <section className="rounded-xl border border-violet-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={submitSearch} className="flex min-w-0 flex-1 gap-2 sm:max-w-xl">
          <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search episode title or slug" className="min-w-0 flex-1 rounded-xl border border-violet-300 bg-white px-4 py-2.5 text-slate-900 outline-none focus:ring-2 focus:ring-violet-500" />
          <button className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2 font-bold !text-white"><MdSearch />Search</button>
        </form>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={autoRefresh} onChange={(event) => setAutoRefresh(event.target.checked)} className="h-4 w-4 accent-violet-700" />Refresh every 10 seconds</label>
      </div>
      <p className="mt-3 text-xs text-slate-500">Showing {status === "ALL" ? "all statuses" : status}. Worker: {data.worker?.processing ? "processing an episode" : "idle or waiting"}.</p>
    </section>

    {loading ? <div className="grid min-h-72 place-items-center rounded-xl border border-violet-200 bg-white text-slate-600">Loading transcript jobs…</div> : episodes.length ? <section className="grid gap-4 xl:grid-cols-2">
      {episodes.map((episode) => {
        const canCancel = ["QUEUED", "PROCESSING"].includes(episode.transcriptStatus);
        const canRetry = !canCancel && Boolean(episode.audio);
        const canDelete = episode.transcriptStatus !== "DELETED" && (episode.wordCount > 0 || episode.transcriptGeneratedAt || ["FAILED", "CANCELLED", "QUEUED", "PROCESSING"].includes(episode.transcriptStatus));
        const isActive = ["QUEUED", "PROCESSING"].includes(episode.transcriptStatus);
        const progress = episode.transcriptStatus === "READY" ? 100 : Math.max(0, Math.min(99, Number(episode.transcriptProgress) || 0));
        const elapsedSinceLoad = Math.max(0, (now - loadedAt) / 1000);
        const remaining = Math.max(0, (Number(episode.estimatedRemainingSeconds) || 0) - elapsedSinceLoad);
        return <article key={episode.uuid} className="rounded-2xl border border-violet-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2"><StatusBadge status={episode.transcriptStatus} />{episode.episodeNumber && <span className="text-xs font-bold text-slate-500">EP {episode.episodeNumber}</span>}</div>
              <h2 className="mt-3 text-lg font-black leading-snug text-slate-950">{episode.title}</h2>
              <p className="mt-1 break-all text-xs text-slate-500">/{episode.slug}</p>
            </div>
            <div className="text-right text-xs text-slate-500"><strong className="block text-xl text-slate-950">{formatNumber(episode.wordCount)}</strong>words</div>
          </div>

          {isActive && <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
              <span className="text-violet-950">{episode.transcriptStatus === "QUEUED" ? `Queue position ${episode.queuePosition ? `#${episode.queuePosition}` : "pending"}` : (episode.transcriptProgressNote || "Processing audio")}</span>
              <span className="text-violet-800">{episode.transcriptStatus === "PROCESSING" ? `${progress}%` : "Waiting"}</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-white shadow-inner" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
              <div className={`h-full rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-500 transition-[width] duration-700 ${episode.transcriptStatus === "QUEUED" ? "animate-pulse" : ""}`} style={{ width: `${episode.transcriptStatus === "QUEUED" ? 3 : Math.max(2, progress)}%` }} />
            </div>
            {remaining > 0 && <p className="mt-2 text-xs text-slate-600"><strong>Approx. {formatRemaining(remaining)}</strong> until complete{episode.estimatedCompletionAt ? ` · expected around ${formatClock(episode.estimatedCompletionAt)}` : ""}. Processing speed can vary with server load.</p>}
          </div>}

          <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-violet-50 p-4 text-xs sm:grid-cols-4">
            <div><dt className="text-slate-500">Language</dt><dd className="mt-1 font-bold text-slate-900">{episode.transcriptLanguage || "en"}</dd></div>
            <div><dt className="text-slate-500">Model</dt><dd className="mt-1 font-bold text-slate-900">{episode.transcriptModel || "—"}</dd></div>
            <div><dt className="text-slate-500">Audio length</dt><dd className="mt-1 font-bold text-slate-900">{formatDuration(episode.transcriptDurationMs)}</dd></div>
            <div><dt className="text-slate-500">Sync offset</dt><dd className="mt-1 font-bold text-slate-900">{episode.transcriptSyncOffsetMs || 0} ms</dd></div>
          </dl>
          <p className="mt-3 text-xs text-slate-500">Generated: {formatDate(episode.transcriptGeneratedAt)}</p>
          {episode.transcriptError && <p title={episode.transcriptError} className="mt-3 max-h-24 overflow-auto rounded-xl border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-800">{episode.transcriptError}</p>}

          <div className="mt-5 flex flex-wrap gap-2">
            {canRetry && <button type="button" disabled={Boolean(busy)} onClick={() => retry(episode)} className="inline-flex items-center gap-1.5 rounded-lg bg-violet-700 px-3 py-2 text-xs font-bold !text-white disabled:opacity-40"><MdReplay />{busy === `retry-${episode.uuid}` ? "Queueing…" : episode.transcriptStatus === "READY" ? "Regenerate" : "Retry / generate"}</button>}
            {canCancel && <button type="button" disabled={Boolean(busy)} onClick={() => cancel(episode)} className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-2 text-xs font-bold !text-white disabled:opacity-40"><MdCancel />{busy === `cancel-${episode.uuid}` ? "Cancelling…" : "Cancel job"}</button>}
            {canDelete && <button type="button" disabled={Boolean(busy)} onClick={() => remove(episode)} className="inline-flex items-center gap-1.5 rounded-lg bg-red-700 px-3 py-2 text-xs font-bold !text-white disabled:opacity-40"><MdDeleteOutline />{busy === `delete-${episode.uuid}` ? "Deleting…" : "Delete transcript"}</button>}
            <Link href={`/admin/episode/edit?id=${episode.uuid}`} className="inline-flex items-center gap-1.5 rounded-lg border border-violet-300 bg-white px-3 py-2 text-xs font-bold text-violet-800"><MdEdit />Edit episode</Link>
            <Link href={`/episode/${episode.slug}`} target="_blank" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700"><MdLaunch />View page</Link>
          </div>
        </article>;
      })}
    </section> : <div className="grid min-h-64 place-items-center rounded-xl border border-violet-200 bg-white text-slate-500">No episodes match these filters.</div>}

    <nav className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-violet-200 bg-white p-4 text-sm">
      <span className="text-slate-600">Page {pagination.page || page} of {totalPages} · {formatNumber(pagination.total)} episodes</span>
      <div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="rounded-lg bg-slate-700 px-4 py-2 font-bold !text-white disabled:opacity-35">Previous</button><button type="button" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)} className="rounded-lg bg-violet-700 px-4 py-2 font-bold !text-white disabled:opacity-35">Next</button></div>
    </nav>
  </div></AdminLayout>;
}
