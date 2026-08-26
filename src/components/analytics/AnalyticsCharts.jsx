import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

const colours = ["#7e22ce", "#c026d3", "#2563eb", "#059669", "#ea580c", "#dc2626", "#475569"];
const common = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: { legend: { labels: { color: "#334155", boxWidth: 12 } } },
  scales: { x: { ticks: { color: "#64748b" }, grid: { display: false } }, y: { beginAtZero: true, ticks: { color: "#64748b", precision: 0 }, grid: { color: "#ede9fe" } } },
};

function ChartPanel({ title, subtitle, children }) {
  return <article className="analytics-panel rounded-xl border border-violet-200 bg-white p-4 shadow-sm"><h3 className="font-bold text-slate-950">{title}</h3><p className="mt-1 text-xs text-slate-600">{subtitle}</p><div className="analytics-chart-body mt-4 h-64">{children}</div></article>;
}

export default function AnalyticsCharts({ analytics }) {
  const trend = analytics?.trend || [];
  const pages = (analytics?.pages || []).slice(0, 10);
  const devices = analytics?.devices || [];
  const sources = (analytics?.sources || []).slice(0, 7);

  return <section className="grid gap-5 xl:grid-cols-2">
    <ChartPanel title="Traffic over time" subtitle="Daily page views, visitors and sessions">
      <Line id="analytics-traffic-chart" data={{ labels: trend.map((row) => row.date), datasets: [
        { label: "Page views", data: trend.map((row) => row.views), borderColor: colours[0], backgroundColor: "rgba(126,34,206,.16)", fill: true, tension: .28 },
        { label: "Visitors", data: trend.map((row) => row.visitors), borderColor: colours[2], backgroundColor: "transparent", tension: .28 },
        { label: "Sessions", data: trend.map((row) => row.sessions), borderColor: colours[3], backgroundColor: "transparent", tension: .28 },
      ] }} options={common} />
    </ChartPanel>
    <ChartPanel title="Top page performance" subtitle="Ten most-viewed URLs in this exact date range">
      <Bar id="analytics-pages-chart" data={{ labels: pages.map((row) => row.title || row.path), datasets: [
        { label: "Views", data: pages.map((row) => row.views), backgroundColor: colours[0], borderRadius: 5 },
        { label: "Visitors", data: pages.map((row) => row.visitors), backgroundColor: colours[1], borderRadius: 5 },
      ] }} options={{ ...common, indexAxis: "y", scales: { x: common.scales.y, y: { ticks: { color: "#64748b", callback(value) { const label = this.getLabelForValue(value); return label.length > 32 ? `${label.slice(0, 30)}...` : label; } }, grid: { display: false } } } }} />
    </ChartPanel>
    <ChartPanel title="Device mix" subtitle="Sessions grouped by device type">
      <Doughnut id="analytics-devices-chart" data={{ labels: devices.map((row) => row.label), datasets: [{ data: devices.map((row) => row.value), backgroundColor: colours, borderColor: "#ffffff", borderWidth: 2 }] }} options={{ responsive: true, maintainAspectRatio: false, animation: false, plugins: common.plugins }} />
    </ChartPanel>
    <ChartPanel title="Traffic sources" subtitle="Leading acquisition sources">
      <Bar id="analytics-sources-chart" data={{ labels: sources.map((row) => row.label), datasets: [{ label: "Sessions", data: sources.map((row) => row.value), backgroundColor: colours, borderRadius: 5 }] }} options={common} />
    </ChartPanel>
  </section>;
}
