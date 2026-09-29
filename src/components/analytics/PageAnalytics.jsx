import { useEffect, useMemo, useState } from "react";

const number = (value) => new Intl.NumberFormat("en-AU", { maximumFractionDigits: 2 }).format(value || 0);
const duration = (value) => `${Math.floor((value || 0) / 60)}m ${Math.floor((value || 0) % 60)}s`;
function Breakdown({ title, rows = [] }) {
  return <article className="min-w-0 rounded-lg border border-violet-200 p-3"><h4 className="font-bold">{title}</h4><div className="mt-3 max-h-64 space-y-2 overflow-auto">{rows.length ? rows.map((row, index) => <div key={index} className="flex items-start justify-between gap-3 text-sm"><span className="min-w-0 break-words">{row.label}</span><b className="shrink-0">{number(row.value)}</b></div>) : <p className="text-sm text-slate-500">No data in this range.</p>}</div></article>;
}
export default function PageAnalytics({ api, dates, pages, refreshKey }) {
  const [search, setSearch] = useState("");
  const [path, setPath] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const matches = useMemo(() => {
    let query = search.trim().toLowerCase();
    try { query = new URL(query).pathname; } catch { /* Titles and relative paths are also searchable. */ }
    return pages.filter((page) => `${page.seoTitle || page.title || page.label || ""} ${page.path}`.toLowerCase().includes(query));
  }, [pages, search]);
  useEffect(() => {
    let active = true;
    setReport(null); setError("");
    if (!path) { setLoading(false); return; }
    setLoading(true);
    api.analyticsGet({ ...dates, path }).then((response) => { if (active) setReport(response?.data?.data?.analytics || null); }).catch((err) => { if (active) setError(err?.response?.data?.message || err.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [api, dates, path, refreshKey]);
  const summary = report?.summary;
  return <section className="min-w-0 rounded-xl border border-violet-200 bg-white p-4 text-slate-900 shadow-sm" aria-label="Page analytics">
    <h2 className="text-lg font-bold">Page analytics</h2>
    <p className="mt-1 text-sm text-slate-600">Search by page title or URL, then select a page to see its activity for the date range above (UTC).</p>
    <label className="mt-4 grid gap-2 text-sm font-semibold">Search pages<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search an episode, title or /page-path" className="min-w-0 w-full rounded-lg border border-violet-300 p-3" /></label>
    <div className="mt-3 max-h-48 overflow-auto rounded-lg border border-violet-100" aria-label="Matching pages">{matches.length ? matches.map((page) => <button type="button" key={page.path} onClick={() => setPath(page.path)} aria-pressed={path === page.path} className={`block w-full border-b border-violet-100 p-3 text-left text-sm ${path === page.path ? "bg-violet-100 text-violet-900" : "hover:bg-violet-50"}`}><b className="block break-words">{page.seoTitle || page.title || page.label || page.path}</b><span className="block break-all text-xs">{page.path}</span></button>) : <p className="p-3 text-sm text-slate-500">No matching pages.</p>}</div>
    {path && <p className="mt-4 break-all text-sm font-bold">Selected page: {path}</p>}
    {loading && <p role="status" className="mt-4">Loading page analytics…</p>}
    {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
    {!path && <p className="mt-4 text-sm text-slate-500">Select a page to view its report.</p>}
    {report && <div className="mt-4 space-y-4">
      <p className="text-xs text-slate-600">{report.range.startDate} to {report.range.endDate} · {summary.pageViews ? "Activity recorded on this page only." : "No page views recorded for this page in this date range."}</p>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[["Views", number(summary.pageViews)], ["Visitors", number(summary.visitors)], ["Sessions", number(summary.sessions)], ["Average engagement / session", duration(summary.averageEngagement)], ["Single-view sessions under 10s on this page", `${number(summary.bounceRate * 100)}%`], ["Recorded events", number(summary.events)], ["Active sessions (last 30 minutes)", number(report.realtime?.visitors)], ["Active error occurrences", number(report.errors?.occurrences)]].map(([label, value]) => <div key={label} className="min-w-0 rounded-lg bg-violet-50 p-3"><p className="text-xs text-slate-600">{label}</p><b className="mt-1 block text-xl">{value}</b></div>)}</div>
      <div className="overflow-x-auto"><table className="w-full min-w-[400px] text-left text-sm"><caption className="mb-2 text-left font-bold">Daily traffic (UTC)</caption><thead><tr><th>Date</th><th>Views</th><th>Visitors</th><th>Sessions</th></tr></thead><tbody>{report.trend.map((row) => <tr key={row.date} className="border-t border-violet-100"><td className="py-2">{row.date}</td><td>{number(row.views)}</td><td>{number(row.visitors)}</td><td>{number(row.sessions)}</td></tr>)}</tbody></table></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{[["Traffic sources", report.sources], ["Referrers", report.referrers], ["Campaigns", report.campaigns], ["Devices", report.devices], ["Browsers", report.browsers], ["Operating systems", report.operatingSystems], ["Countries", report.countries], ["Events", report.events], ["Scroll threshold events", Object.entries(report.scrollDepth || {}).map(([label, value]) => ({ label: `${label}%`, value }))], ["Platform clicks", Object.entries(report.platforms || {}).map(([label, value]) => ({ label, value }))]].map(([title, rows]) => <Breakdown key={title} title={title} rows={rows} />)}</div>
      <h3 className="font-bold">Real-user Web Vitals (75th percentile)</h3><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{["LCP", "INP", "CLS", "FCP", "TTFB"].map((name) => <div key={name} className="rounded-lg border border-violet-200 p-3"><b>{name}</b><p>{report.webVitals?.[name]?.p75 == null ? "No samples" : `${number(report.webVitals[name].p75)}${name === "CLS" ? "" : " ms"}`}</p><small>{number(report.webVitals?.[name]?.samples)} samples</small></div>)}</div>
      <h3 className="font-bold">Traffic attribution</h3><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead><tr><th>Source</th><th>Medium</th><th>Campaign</th><th>Views</th><th>Visitors</th><th>Engaged time</th></tr></thead><tbody>{report.sourcePages.map((row, index) => <tr key={index} className="border-t border-violet-100"><td className="py-2">{row.source}</td><td>{row.medium}</td><td>{row.campaign}</td><td>{number(row.pageViews)}</td><td>{number(row.visitors)}</td><td>{duration(row.totalEngagementSeconds)}</td></tr>)}</tbody></table>{!report.sourcePages.length && <p className="py-3 text-sm text-slate-500">No attributed traffic.</p>}</div>
      <h3 className="font-bold">Platform redirects</h3><div className="grid gap-3 sm:grid-cols-2">{report.platformConversions.map((row, index) => <p key={index} className="rounded-lg border border-violet-200 p-3 text-sm">{row.platform} · {row.source}: <b>{number(row.clicks)} clicks</b> · {number(row.visitors)} visitors</p>)}</div>
      <h3 className="font-bold">Active visitor errors</h3>{report.errors.recent.length ? report.errors.recent.map((issue) => <p key={issue.id} className="break-words rounded-lg bg-red-50 p-3 text-sm text-red-800">{issue.message} · {number(issue.count)} occurrences · {issue.type}</p>) : <p className="text-sm text-slate-500">No active errors for this page.</p>}
    </div>}
  </section>;
}
