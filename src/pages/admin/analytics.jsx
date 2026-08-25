import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import AdminLayout from "@/components/layout/AdminLayout";
import PodcastApi from "@/services/podcastApi";
import { downloadAnalyticsPdf } from "@/utils/analyticsPdf";
import { MdAdsClick, MdDateRange, MdDeleteOutline, MdDevices, MdDownload, MdErrorOutline, MdOutlineRemoveRedEye, MdPeopleAlt, MdRefresh, MdSpeed, MdTimer } from "react-icons/md";
import { FaApple, FaSpotify, FaYoutube } from "react-icons/fa";
import toast from "react-hot-toast";

const PAGE_SIZE = 10;
const AnalyticsCharts = dynamic(() => import("@/components/analytics/AnalyticsCharts"), { ssr: false });
const number = (value, digits = 0) => new Intl.NumberFormat("en-AU", { maximumFractionDigits: digits }).format(value || 0);
const duration = (seconds) => `${Math.floor((seconds || 0) / 60)}m ${Math.round((seconds || 0) % 60)}s`;
const percent = (value) => `${number((value || 0) * 100, 1)}%`;
const metric = (value) => value || "—";
const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const shiftDate = (date, days) => { const next = new Date(date); next.setDate(next.getDate() + days); return next; };
const presetDates = (preset) => {
  const now = new Date();
  if (preset === "yesterday") { const yesterday = dateKey(shiftDate(now, -1)); return { startDate: yesterday, endDate: yesterday }; }
  if (preset === "thisMonth") return { startDate: `${dateKey(now).slice(0, 8)}01`, endDate: dateKey(now) };
  if (preset === "today") return { startDate: dateKey(now), endDate: dateKey(now) };
  return { startDate: dateKey(shiftDate(now, -6)), endDate: dateKey(now) };
};

function Panel({ title, subtitle, children, className = "" }) {
  return <article className={`analytics-panel rounded-xl border border-violet-200 bg-white p-4 text-slate-900 shadow-sm ${className}`}><h3 className="font-bold text-slate-950">{title}</h3>{subtitle && <p className="mt-1 text-xs text-slate-600">{subtitle}</p>}<div className="mt-3">{children}</div></article>;
}
function Breakdown({ rows = [] }) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  return <div className="space-y-3">{rows.length ? rows.map((row) => <div key={row.label}><div className="mb-1 flex justify-between gap-3 text-sm"><span className="truncate text-slate-700">{row.label}</span><b className="text-slate-950">{number(row.value)}</b></div><div className="h-1.5 overflow-hidden rounded-full bg-violet-100"><div className="h-full rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-500" style={{ width: `${row.value / max * 100}%` }} /></div></div>) : <p className="text-sm text-slate-500">No data yet.</p>}</div>;
}
function Pager({ page, total, onChange }) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  return <div className="mt-5 flex items-center justify-between border-t border-violet-100 pt-4 text-sm"><span className="text-slate-600">Page {page} of {pages} · {total} pages</span><div className="flex gap-2"><button disabled={page <= 1} onClick={() => onChange(page - 1)} className="rounded-lg border border-violet-300 px-3 py-2 font-semibold text-slate-800 disabled:opacity-40">Previous</button><button disabled={page >= pages} onClick={() => onChange(page + 1)} className="rounded-lg bg-violet-700 px-3 py-2 font-semibold text-white disabled:opacity-40">Next</button></div></div>;
}
function DataPager({ page, total, onChange, label = "rows" }) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  return <div className="mt-5 flex items-center justify-between border-t border-violet-100 pt-4 text-sm"><span className="text-slate-600">Page {page} of {pages} · {total} {label}</span><div className="flex gap-2"><button disabled={page <= 1} onClick={() => onChange(page - 1)} className="rounded-lg border border-violet-300 px-3 py-2 font-semibold text-slate-800 disabled:opacity-40">Previous</button><button disabled={page >= pages} onClick={() => onChange(page + 1)} className="rounded-lg bg-violet-700 px-3 py-2 font-semibold text-white disabled:opacity-40">Next</button></div></div>;
}
function StatusBadge({ online, status }) { return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${online ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>{online ? `Online · ${status}` : status ? `Error · ${status}` : "Offline"}</span>; }

export default function AnalyticsPage() {
  const initialDates = useMemo(() => presetDates("lastSevenDays"), []);
  const [analytics, setAnalytics] = useState(null); const [preset, setPreset] = useState("lastSevenDays"); const [dates, setDates] = useState(initialDates); const [customDates, setCustomDates] = useState(initialDates); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [exporting, setExporting] = useState(false);
  const [pages, setPages] = useState([]); const [strategy, setStrategy] = useState("mobile"); const [audits, setAudits] = useState({}); const [auditLoading, setAuditLoading] = useState(false); const [lighthouseRuntime, setLighthouseRuntime] = useState(null);
  const [speedPage, setSpeedPage] = useState(1); const [topPage, setTopPage] = useState(1); const [healthPage, setHealthPage] = useState(1); const [health, setHealth] = useState(null); const [healthLoading, setHealthLoading] = useState(false);
  const [sourcePage, setSourcePage] = useState(1); const [conversionPage, setConversionPage] = useState(1); const [sourceFilter, setSourceFilter] = useState("all");
  const [deletingErrorId, setDeletingErrorId] = useState(null); const [clearingErrors, setClearingErrors] = useState(false);
  const api = useMemo(() => new PodcastApi(), []);
  const loadAnalytics = useCallback(async () => { setLoading(true); setError(""); try { const response = await api.analyticsGet(dates); setAnalytics(response?.data?.data?.analytics || null); } catch (err) { setError(err?.response?.data?.message || err.message); } finally { setLoading(false); } }, [api, dates]);
  const loadHealth = useCallback(async () => { setHealthLoading(true); try { const response = await api.analyticsHealth(); setHealth(response?.data?.data || null); } catch (err) { setError(err?.response?.data?.message || err.message); } finally { setHealthLoading(false); } }, [api]);
  useEffect(() => { loadAnalytics(); }, [loadAnalytics]);
  useEffect(() => { api.analyticsLighthousePages().then((response) => { setPages(response?.data?.data?.pages || []); setLighthouseRuntime(response?.data?.data?.runtime || null); }).catch((err) => setError(err?.response?.data?.message || err.message)); loadHealth(); }, [api, loadHealth]);

  const choosePreset = (value) => {
    setPreset(value);
    if (value === "custom") { setCustomDates(analytics?.range || dates); return; }
    const next = presetDates(value); setDates(next); setCustomDates(next);
  };
  const applyCustomDates = () => {
    const min = analytics?.availableRange?.minDate || customDates.startDate;
    const max = analytics?.availableRange?.maxDate || dateKey(new Date());
    if (!customDates.startDate || !customDates.endDate || customDates.startDate < min || customDates.endDate > max || customDates.startDate > customDates.endDate) {
      setError(`Choose a start and end date between ${min} and ${max}.`); return;
    }
    setError(""); setDates(customDates);
  };
  const exportPdf = async () => {
    setExporting(true); setError("");
    try { await downloadAnalyticsPdf({ analytics, audits, pages, health }); }
    catch (err) { setError(err.message || "Unable to create the PDF report"); }
    finally { setExporting(false); }
  };
  const deleteAnalyticsError = async (item) => {
    const occurrenceText = item.count > 1 ? ` and its ${item.count} matching occurrences` : "";
    if (!window.confirm(`Delete this analytics error${occurrenceText}? This cannot be undone.`)) return;
    setDeletingErrorId(item.id); setError("");
    try {
      await api.analyticsErrorDelete(item.id);
      setAnalytics((current) => {
        if (!current?.errors) return current;
        const recent = current.errors.recent.filter((issue) => issue.id !== item.id);
        return { ...current, errors: { ...current.errors, recent, total: Math.max(0, (current.errors.total || 0) - 1), occurrences: Math.max(0, (current.errors.occurrences || 0) - (item.count || 1)) } };
      });
      toast.success("Analytics error deleted.");
    } catch (err) { setError(err?.response?.data?.message || err.message || "Unable to delete the analytics error"); }
    finally { setDeletingErrorId(null); }
  };
  const clearAnalyticsErrors = async () => {
    if (!window.confirm("Delete all browser and resource errors? This cannot be undone.")) return;
    setClearingErrors(true); setError("");
    try {
      await api.analyticsErrorsClear();
      setAnalytics((current) => current ? { ...current, errors: { ...current.errors, total: 0, occurrences: 0, pages: [], recent: [] } } : current);
      toast.success("All analytics errors cleared.");
    } catch (err) { setError(err?.response?.data?.message || err.message || "Unable to clear analytics errors"); }
    finally { setClearingErrors(false); }
  };

  const speedRows = useMemo(() => pages.slice((speedPage - 1) * PAGE_SIZE, speedPage * PAGE_SIZE), [pages, speedPage]);
  const auditVisible = useCallback(async (force = false) => {
    if (!speedRows.length) return;
    const pending = speedRows.filter((page) => force || !audits[`${page.url}:${strategy}`]);
    if (!pending.length) return;
    setAuditLoading(true);
    for (const page of pending) {
      const key = `${page.url}:${strategy}`;
      try { const response = await api.analyticsLighthouse({ url: page.url, strategy }); setAudits((current) => ({ ...current, [key]: response?.data?.data?.lighthouse })); }
      catch (err) { setAudits((current) => ({ ...current, [key]: { error: err?.response?.data?.message || err.message } })); }
    }
    setAuditLoading(false);
  }, [api, audits, speedRows, strategy]);

  const allTopPages = useMemo(() => {
    const measured = new Map((analytics?.pages || []).map((row) => [row.path, row]));
    return pages.map((page) => ({ ...page, ...(measured.get(page.path) || { views: 0, visitors: 0, sessions: 0, averageEngagement: 0 }) })).sort((a, b) => b.views - a.views);
  }, [analytics, pages]);
  const topRows = allTopPages.slice((topPage - 1) * PAGE_SIZE, topPage * PAGE_SIZE);
  const sourceOptions = useMemo(() => [...new Set((analytics?.sourcePages || []).map((row) => row.source))].sort(), [analytics]);
  const sourcePageRows = useMemo(() => (analytics?.sourcePages || []).filter((row) => sourceFilter === "all" || row.source === sourceFilter), [analytics, sourceFilter]);
  const visibleSourceRows = sourcePageRows.slice((sourcePage - 1) * PAGE_SIZE, sourcePage * PAGE_SIZE);
  const conversionRows = analytics?.platformConversions || [];
  const visibleConversionRows = conversionRows.slice((conversionPage - 1) * PAGE_SIZE, conversionPage * PAGE_SIZE);
  const healthRows = (health?.pages || []).slice((healthPage - 1) * PAGE_SIZE, healthPage * PAGE_SIZE);
  const cards = [["Visitors", number(analytics?.summary?.visitors), MdPeopleAlt], ["Page views", number(analytics?.summary?.pageViews), MdOutlineRemoveRedEye], ["Sessions", number(analytics?.summary?.sessions), MdSpeed], ["Avg. engagement", duration(analytics?.summary?.averageEngagement), MdTimer], ["Pages / session", number(analytics?.summary?.pagesPerSession, 2), MdDevices], ["Bounce rate", percent(analytics?.summary?.bounceRate), MdAdsClick]];

  return <AdminLayout><div className="admin-analytics-page mx-auto max-w-[1480px] space-y-4 text-slate-900">
    <header className="flex flex-wrap items-end justify-between gap-3 border-b border-violet-200 pb-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-violet-700">Website intelligence</p><h1 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">Analytics & health centre</h1><p className="mt-1 text-sm text-slate-600">First-party traffic, real-user errors, uptime and self-hosted Lighthouse audits.</p>{analytics?.range && <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-900"><MdDateRange />{analytics.range.startDate} to {analytics.range.endDate}</p>}</div><div className="flex flex-wrap gap-2"><select value={preset} onChange={(event) => choosePreset(event.target.value)} className="rounded-lg border border-violet-300 bg-white px-3 py-2 text-sm text-slate-900"><option value="today">Today</option><option value="yesterday">Yesterday</option><option value="lastSevenDays">Last 7 days</option><option value="thisMonth">This month</option><option value="custom">Custom dates</option></select><button disabled={!analytics || exporting || loading} onClick={exportPdf} className="inline-flex items-center gap-2 rounded-lg border border-violet-400 bg-white px-4 py-2 text-sm font-bold text-violet-800 disabled:opacity-50"><MdDownload />{exporting ? "Preparing PDF…" : "Download PDF"}</button><button onClick={loadAnalytics} className="inline-flex items-center gap-2 rounded-lg bg-violet-700 px-4 py-2 text-sm font-bold text-white"><MdRefresh />Refresh traffic</button></div></header>
    {preset === "custom" && <section className="flex flex-wrap items-end gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4"><label className="grid gap-1 text-sm font-semibold text-slate-800">From<input type="date" value={customDates.startDate} min={analytics?.availableRange?.minDate} max={customDates.endDate || analytics?.availableRange?.maxDate} onChange={(event) => setCustomDates((current) => ({ ...current, startDate: event.target.value }))} className="rounded-lg border border-violet-300 bg-white px-3 py-2" /></label><label className="grid gap-1 text-sm font-semibold text-slate-800">To<input type="date" value={customDates.endDate} min={customDates.startDate || analytics?.availableRange?.minDate} max={analytics?.availableRange?.maxDate || dateKey(new Date())} onChange={(event) => setCustomDates((current) => ({ ...current, endDate: event.target.value }))} className="rounded-lg border border-violet-300 bg-white px-3 py-2" /></label><button onClick={applyCustomDates} className="rounded-lg bg-violet-700 px-5 py-2 font-bold text-white">Apply dates</button><p className="w-full text-xs text-slate-600">Available analytics history: {analytics?.availableRange?.minDate || "loading"} to {analytics?.availableRange?.maxDate || dateKey(new Date())}. Earlier dates are disabled.</p></section>}
    {error && <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-800">{error}</div>}
    {loading ? <div className="grid min-h-80 place-items-center text-slate-600">Loading first-party analytics…</div> : <>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">{cards.map(([label, value, Icon]) => <article key={label} className="rounded-xl border border-violet-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm text-slate-600">{label}</span><Icon className="text-violet-700" size={20} /></div><strong className="mt-2 block text-2xl text-slate-950">{value}</strong></article>)}</section>
      <AnalyticsCharts analytics={analytics} />
      <Panel title="Live now" subtitle="Active sessions in the last 30 minutes"><strong className="mb-5 block text-5xl text-emerald-700">{number(analytics?.realtime?.visitors)}</strong><Breakdown rows={analytics?.realtime?.pages} /></Panel>
      <Panel title="All pages" subtitle="Views, visitors and engagement by URL"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead className="text-left uppercase text-slate-500"><tr><th className="pb-3">SEO title</th><th>Views</th><th>Visitors</th><th>Sessions</th><th>Avg. engagement</th></tr></thead><tbody>{topRows.map((row) => <tr key={row.path} className="border-t border-violet-100"><td className="max-w-md py-3 pr-4"><b className="block text-slate-950">{row.seoTitle || row.title || row.label}</b><small className="text-slate-500">{row.path}</small></td><td>{number(row.views)}</td><td>{number(row.visitors)}</td><td>{number(row.sessions)}</td><td>{duration(row.averageEngagement)}</td></tr>)}</tbody></table></div><Pager page={topPage} total={allTopPages.length} onChange={setTopPage} /></Panel>
      <Panel title="Traffic attribution by page" subtitle="UTM sources such as email, LinkedIn and Instagram, broken down by the page people visited.">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-600">Use <b>utm_source</b>, <b>utm_medium</b> and <b>utm_campaign</b> on shared links for reliable attribution.</p><select value={sourceFilter} onChange={(event) => { setSourceFilter(event.target.value); setSourcePage(1); }} className="rounded-xl border border-violet-300 bg-white px-4 py-2 text-slate-900"><option value="all">All sources</option>{sourceOptions.map((source) => <option key={source} value={source}>{source}</option>)}</select></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[1040px] text-sm"><thead className="text-left uppercase text-slate-500"><tr><th className="pb-3">Source</th><th>Medium</th><th>Campaign</th><th>Page SEO title</th><th>Page views</th><th>Visitors</th><th>Total engaged time</th><th>Avg. engagement</th></tr></thead><tbody>{visibleSourceRows.map((row, index) => <tr key={`${row.source}-${row.path}-${index}`} className="border-t border-violet-100"><td className="py-3 pr-3"><span className="inline-flex rounded-full bg-violet-100 px-3 py-1 font-bold text-violet-800">{row.source}</span></td><td>{row.medium}</td><td>{row.campaign}</td><td className="max-w-sm pr-4"><b className="block text-slate-950">{row.title || row.path}</b><small className="text-slate-500">{row.path}</small></td><td>{number(row.pageViews)}</td><td>{number(row.visitors)}</td><td>{duration(row.totalEngagementSeconds)}</td><td>{duration(row.averageEngagementSeconds)}</td></tr>)}</tbody></table>{!visibleSourceRows.length && <p className="py-8 text-center text-slate-500">Attributed traffic will appear after someone opens a UTM-tagged link.</p>}</div><DataPager page={sourcePage} total={sourcePageRows.length} onChange={setSourcePage} label="source/page rows" />
      </Panel>
      <section className="grid gap-5 xl:grid-cols-[1.3fr_.7fr]"><Panel title="Platform conversions" subtitle="Outbound visits from your website"><div className="grid gap-3 sm:grid-cols-3">{[["YouTube", analytics?.platforms?.youtube, FaYoutube, "#e11d48"], ["Spotify", analytics?.platforms?.spotify, FaSpotify, "#15803d"], ["Apple Podcasts", analytics?.platforms?.apple, FaApple, "#7e22ce"]].map(([label, value, Icon, colour]) => <div key={label} className="flex items-center gap-4 rounded-xl border border-violet-200 bg-violet-50 p-4"><Icon size={25} style={{ color: colour }} /><span className="flex-1 text-slate-800">{label}</span><b className="text-xl text-slate-950">{number(value)}</b></div>)}</div></Panel><Panel title="Active visitor errors" subtitle="Duplicate occurrences are grouped into a single issue"><strong className={`text-4xl ${analytics?.errors?.total ? "text-red-700" : "text-emerald-700"}`}>{number(analytics?.errors?.total)}</strong><p className="mt-2 text-sm text-slate-600">{analytics?.errors?.total ? `${number(analytics.errors.occurrences)} occurrence${analytics.errors.occurrences === 1 ? "" : "s"} in this date range.` : "No active browser or resource errors."}</p></Panel></section>
      <Panel title="Platform redirects by originating page" subtitle="Every click to YouTube, Spotify or Apple Podcasts, including the website page and attributed traffic source."><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-sm"><thead className="text-left uppercase text-slate-500"><tr><th className="pb-3">Platform</th><th>Originating page SEO title</th><th>Traffic source</th><th>Clicks</th><th>Unique visitors</th></tr></thead><tbody>{visibleConversionRows.map((row, index) => <tr key={`${row.platform}-${row.path}-${row.source}-${index}`} className="border-t border-violet-100"><td className="py-3 font-bold text-slate-950">{row.platform}</td><td className="max-w-md pr-4"><b className="block text-slate-950">{row.title || row.path}</b><small className="text-slate-500">{row.path}</small></td><td><span className="rounded-full bg-violet-100 px-3 py-1 font-semibold text-violet-800">{row.source}</span></td><td>{number(row.clicks)}</td><td>{number(row.visitors)}</td></tr>)}</tbody></table>{!visibleConversionRows.length && <p className="py-8 text-center text-slate-500">Platform click details will appear after visitors use an external podcast link.</p>}</div><DataPager page={conversionPage} total={conversionRows.length} onChange={setConversionPage} label="conversion rows" /></Panel>
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"><Panel title="Traffic sources"><Breakdown rows={analytics?.sources} /></Panel><Panel title="Referring websites"><Breakdown rows={analytics?.referrers} /></Panel><Panel title="Devices"><Breakdown rows={analytics?.devices} /></Panel><Panel title="Browsers"><Breakdown rows={analytics?.browsers} /></Panel><Panel title="Operating systems"><Breakdown rows={analytics?.operatingSystems} /></Panel><Panel title="Countries"><Breakdown rows={analytics?.countries} /></Panel><Panel title="Campaigns"><Breakdown rows={analytics?.campaigns} /></Panel><Panel title="Recorded events"><Breakdown rows={analytics?.events} /></Panel></section>
      <section className="grid gap-5 xl:grid-cols-2"><Panel title="Scroll depth"><Breakdown rows={Object.entries(analytics?.scrollDepth || {}).map(([label, value]) => ({ label: `${label}%`, value }))} /></Panel><Panel title="Real-user Web Vitals" subtitle="75th percentile from actual visitors"><div className="grid grid-cols-2 gap-3 sm:grid-cols-5">{["LCP", "INP", "CLS", "FCP", "TTFB"].map((name) => <div key={name} className="rounded-xl border border-violet-200 bg-violet-50 p-4"><span className="text-slate-600">{name}</span><b className="mt-2 block text-xl text-slate-950">{analytics?.webVitals?.[name]?.p75 == null ? "—" : number(analytics.webVitals[name].p75, 2)}</b><small className="text-slate-500">{number(analytics?.webVitals?.[name]?.samples)} samples</small></div>)}</div></Panel></section>
    </>}

    <Panel title="Self-hosted Lighthouse — all public pages" subtitle="Free open-source audits run on your own API server, with no PageSpeed API key, charge or vendor request quota. Results cache for 30 minutes.">{lighthouseRuntime?.ready === false && <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-semibold text-red-800">Lighthouse is not ready on the API server: {lighthouseRuntime.error}</div>}<div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex rounded-xl border border-violet-300 bg-violet-50 p-1">{["mobile", "desktop"].map((item) => <button key={item} onClick={() => setStrategy(item)} className={`rounded-lg px-4 py-2 font-semibold capitalize ${strategy === item ? "bg-violet-700 text-white" : "text-slate-700"}`}>{item}</button>)}</div><button disabled={auditLoading || lighthouseRuntime?.ready === false} onClick={() => auditVisible(true)} className="inline-flex items-center gap-2 rounded-xl border border-violet-400 px-4 py-2 font-bold text-violet-800 disabled:opacity-50"><MdRefresh />{auditLoading ? "Auditing pages…" : "Run Lighthouse on these 10 pages"}</button></div><div className="overflow-x-auto"><table className="w-full min-w-[1180px] text-sm"><thead className="text-left uppercase text-slate-500"><tr><th className="pb-3">SEO title</th><th>Performance</th><th>Accessibility</th><th>Best practices</th><th>SEO</th><th>LCP</th><th>INP</th><th>FCP</th><th>CLS</th><th>TTFB</th></tr></thead><tbody>{speedRows.map((page) => { const result = audits[`${page.url}:${strategy}`]; return <tr key={page.url} className="border-t border-violet-100"><td className="max-w-xs py-4 pr-4"><b className="block text-slate-950">{page.seoTitle || page.label}</b><small className="text-slate-500">{page.path}</small>{result?.error && <small className="mt-1 block text-red-700">{result.error}</small>}</td><td>{result?.scores?.performance ?? "Not run"}</td><td>{result?.scores?.accessibility ?? "Not run"}</td><td>{result?.scores?.["best-practices"] ?? "Not run"}</td><td>{result?.scores?.seo ?? "Not run"}</td><td>{metric(result?.metrics?.lcp)}</td><td>{metric(result?.metrics?.inp)}</td><td>{metric(result?.metrics?.fcp)}</td><td>{metric(result?.metrics?.cls)}</td><td>{metric(result?.metrics?.ttfb)}</td></tr>; })}</tbody></table></div><Pager page={speedPage} total={pages.length} onChange={setSpeedPage} /></Panel>

    <Panel title="Website health & errors" subtitle="Every public URL is checked server-side. Results cache for five minutes; browser errors come from real visitors."><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex gap-3"><span className="rounded-lg bg-emerald-100 px-3 py-2 font-bold text-emerald-800">Online {health?.summary?.online || 0}</span><span className="rounded-lg bg-red-100 px-3 py-2 font-bold text-red-800">Failing {health?.summary?.failing || 0}</span></div><button disabled={healthLoading} onClick={loadHealth} className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-2 font-bold text-white disabled:opacity-50"><MdRefresh />{healthLoading ? "Checking…" : "Check all pages"}</button></div><div className="overflow-x-auto"><table className="w-full min-w-[820px] text-sm"><thead className="text-left uppercase text-slate-500"><tr><th className="pb-3">SEO title</th><th>Status</th><th>Response time</th><th>Last checked</th><th>Error</th></tr></thead><tbody>{healthRows.map((row) => <tr key={row.url} className="border-t border-violet-100"><td className="max-w-md py-3 pr-4"><b className="block text-slate-950">{row.seoTitle || row.label}</b><small className="text-slate-500">{row.path}</small></td><td><StatusBadge online={row.online} status={row.status} /></td><td>{number(row.responseTime)} ms</td><td>{row.checkedAt ? new Date(row.checkedAt).toLocaleString("en-AU") : "—"}</td><td className="text-red-700">{row.error || "—"}</td></tr>)}</tbody></table></div><Pager page={healthPage} total={health?.pages?.length || 0} onChange={setHealthPage} />
      {(analytics?.errors?.recent || []).length > 0 ? <div className="mt-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><h4 className="flex items-center gap-2 font-bold text-slate-950"><MdErrorOutline className="text-red-700" />Active visitor errors</h4><p className="mt-1 text-xs text-slate-600">Matching occurrences are grouped. Issues disappear automatically after {analytics.errors.autoResolveHours || 12} hours without another occurrence.</p></div>
          <button type="button" disabled={clearingErrors || deletingErrorId !== null} onClick={clearAnalyticsErrors} className="inline-flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"><MdDeleteOutline />{clearingErrors ? "Clearing…" : "Clear all errors"}</button>
        </div>
        <div className="mt-3 max-h-96 space-y-2 overflow-auto">{analytics.errors.recent.map((item) => <article key={item.id} className="rounded-xl border border-red-200 bg-red-50 p-3">
          <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0 flex-1"><b className="block break-words text-red-900">{item.message}</b><p className="mt-1 text-sm font-semibold text-slate-800">{item.title || item.path}</p></div><button type="button" disabled={deletingErrorId === item.id || clearingErrors} onClick={() => deleteAnalyticsError(item)} className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-red-700 px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"><MdDeleteOutline />{deletingErrorId === item.id ? "Deleting…" : "Delete"}</button></div>
          <p className="mt-2 text-xs text-slate-600">{item.type?.replace("_", " ")} · {number(item.count)} occurrence{item.count === 1 ? "" : "s"} · Last seen {new Date(item.lastSeenAt || item.createdAt).toLocaleString("en-AU")}</p>
          <p className="mt-1 break-all text-xs text-slate-600">{item.path}{item.source ? ` · ${item.source}` : ""}</p>
        </article>)}</div>
      </div> : <div className="mt-7 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">No active visitor errors. Resolved issues are removed automatically.</div>}
    </Panel>
  </div></AdminLayout>;
}
