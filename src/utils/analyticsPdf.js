const text = (value) => value == null || value === "" ? "-" : String(value);
const fixed = (value, digits = 0) => new Intl.NumberFormat("en-AU", { maximumFractionDigits: digits }).format(Number(value) || 0);
const seconds = (value) => `${Math.floor((Number(value) || 0) / 60)}m ${Math.round((Number(value) || 0) % 60)}s`;

export async function downloadAnalyticsPdf({ analytics, audits = {}, pages = [], health = null }) {
  if (!analytics?.range?.startDate || !analytics?.range?.endDate) throw new Error("Choose a valid analytics date range first.");
  const chartIds = ["analytics-traffic-chart", "analytics-pages-chart", "analytics-devices-chart", "analytics-sources-chart"];
  if (chartIds.some((id) => !document.getElementById(id)?.toDataURL)) throw new Error("The report charts are still rendering. Please try the download again in a moment.");
  const [{ default: jsPDF }, tableModule] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const autoTable = tableModule.default || tableModule.autoTable;
  const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });
  const startDate = analytics.range.startDate;
  const endDate = analytics.range.endDate;
  const rangeText = `${startDate} to ${endDate}`;
  const margin = 38;
  const width = doc.internal.pageSize.getWidth();
  let lastTablePage = 1;
  let lastTableY = 105;

  const pageFooter = () => {
    const pageCount = doc.internal.getNumberOfPages();
    for (let page = 1; page <= pageCount; page += 1) {
      doc.setPage(page);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`Podcast Website Analytics | ${rangeText}`, margin, doc.internal.pageSize.getHeight() - 18);
      doc.text(`Page ${page} of ${pageCount}`, width - margin, doc.internal.pageSize.getHeight() - 18, { align: "right" });
    }
  };
  const section = (title, head, body) => {
    let currentPage = doc.internal.getCurrentPageInfo().pageNumber;
    let y = currentPage === lastTablePage ? lastTableY + 24 : 45;
    if (y > doc.internal.pageSize.getHeight() - 150) { doc.addPage(); currentPage += 1; y = 45; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(55, 24, 84); doc.text(title, margin, y);
    autoTable(doc, { startY: y + 8, head: [head], body, margin: { left: margin, right: margin, bottom: 34 }, styles: { fontSize: 7, cellPadding: 4, overflow: "linebreak" }, headStyles: { fillColor: [126, 34, 206], textColor: 255 }, alternateRowStyles: { fillColor: [248, 245, 252] } });
    lastTablePage = doc.internal.getCurrentPageInfo().pageNumber;
    lastTableY = doc.lastAutoTable?.finalY || 45;
  };

  doc.setFillColor(69, 20, 95); doc.rect(0, 0, width, 112, "F");
  doc.setTextColor(255); doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.text("Podcast Website Analytics", margin, 42);
  doc.setFontSize(13); doc.text(`Data period: ${rangeText}`, margin, 68);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.text(`Generated: ${new Date().toLocaleString("en-AU", { dateStyle: "full", timeStyle: "short" })}`, margin, 89);

  section("Executive summary", ["Metric", "Value"], [
    ["Visitors", fixed(analytics.summary?.visitors)], ["Page views", fixed(analytics.summary?.pageViews)], ["Sessions", fixed(analytics.summary?.sessions)],
    ["Average engagement", seconds(analytics.summary?.averageEngagement)], ["Pages per session", fixed(analytics.summary?.pagesPerSession, 2)], ["Bounce rate", `${fixed((analytics.summary?.bounceRate || 0) * 100, 1)}%`],
    ["Recorded events", fixed(analytics.summary?.events)], ["Live visitors (last 30 minutes)", fixed(analytics.realtime?.visitors)], ["Browser/resource errors", fixed(analytics.errors?.total)],
  ]);

  for (const chart of [
    ["analytics-traffic-chart", "Traffic over time"], ["analytics-pages-chart", "Top page performance"],
    ["analytics-devices-chart", "Device mix"], ["analytics-sources-chart", "Traffic sources"],
  ]) {
    const canvas = document.getElementById(chart[0]);
    if (!canvas?.toDataURL) continue;
    doc.addPage(); doc.setTextColor(55, 24, 84); doc.setFont("helvetica", "bold"); doc.setFontSize(15); doc.text(chart[1], margin, 42);
    doc.addImage(canvas.toDataURL("image/png", 1), "PNG", margin, 60, width - margin * 2, 300, undefined, "FAST");
  }

  doc.addPage();

  section("Daily traffic", ["Date", "Views", "Visitors", "Sessions"], (analytics.trend || []).map((row) => [row.date, fixed(row.views), fixed(row.visitors), fixed(row.sessions)]));
  section("All measured pages", ["Page", "Path", "Views", "Visitors", "Sessions", "Avg engagement"], (analytics.pages || []).map((row) => [text(row.title), row.path, fixed(row.views), fixed(row.visitors), fixed(row.sessions), seconds(row.averageEngagement)]));
  section("Traffic attribution by page", ["Source", "Medium", "Campaign", "Page SEO title", "Path", "Views", "Visitors", "Total engagement", "Average"], (analytics.sourcePages || []).map((row) => [row.source, row.medium, row.campaign, text(row.title), row.path, fixed(row.pageViews), fixed(row.visitors), seconds(row.totalEngagementSeconds), seconds(row.averageEngagementSeconds)]));
  section("Platform redirects", ["Platform", "Originating page SEO title", "Path", "Source", "Clicks", "Visitors", "Destination"], (analytics.platformConversions || []).map((row) => [row.platform, text(row.title), row.path, row.source, fixed(row.clicks), fixed(row.visitors), row.destination]));

  const breakdowns = [["Traffic sources", analytics.sources], ["Referrers", analytics.referrers], ["Devices", analytics.devices], ["Browsers", analytics.browsers], ["Operating systems", analytics.operatingSystems], ["Countries", analytics.countries], ["Campaigns", analytics.campaigns], ["Events", analytics.events], ["Live pages", analytics.realtime?.pages]];
  section("Audience and acquisition breakdowns", ["Group", "Label", "Count"], breakdowns.flatMap(([group, rows]) => (rows || []).map((row) => [group, row.label, fixed(row.value)])));
  section("Engagement and Web Vitals", ["Metric", "Value", "Samples"], [
    ...Object.entries(analytics.scrollDepth || {}).map(([label, value]) => [`Scroll depth ${label}%`, fixed(value), "-"]),
    ...Object.entries(analytics.webVitals || {}).map(([label, value]) => [label, fixed(value.p75, 2), fixed(value.samples)]),
  ]);
  section("Recent browser and resource errors", ["Time", "Type", "Page", "Message", "Source", "Line"], (analytics.errors?.recent || []).map((row) => [new Date(row.createdAt).toLocaleString("en-AU"), row.type, row.path, row.message, text(row.source), text(row.line)]));

  const auditRows = pages.flatMap((page) => ["mobile", "desktop"].map((mode) => ({ page, mode, result: audits[`${page.url}:${mode}`] })).filter((row) => row.result));
  section("Self-hosted Lighthouse audits", ["Page SEO title", "Path", "Mode", "Performance", "Accessibility", "Best practices", "SEO", "LCP", "INP", "CLS", "TTFB"], auditRows.map(({ page, mode, result }) => [page.seoTitle || page.label, page.path, mode === "mobile" ? "Mobile" : "Desktop", text(result.scores?.performance), text(result.scores?.accessibility), text(result.scores?.["best-practices"]), text(result.scores?.seo), text(result.metrics?.lcp), text(result.metrics?.inp), text(result.metrics?.cls), text(result.metrics?.ttfb)]));
  section("Website health", ["Page SEO title", "Path", "Status", "HTTP", "Response time", "Checked", "Error"], (health?.pages || []).map((row) => [row.seoTitle || row.label, row.path, row.online ? "Online" : "Failing", text(row.status), `${fixed(row.responseTime)} ms`, row.checkedAt ? new Date(row.checkedAt).toLocaleString("en-AU") : "-", text(row.error)]));

  pageFooter();
  doc.save(`Podcast_Website_Analytics_${startDate}_to_${endDate}.pdf`);
}
