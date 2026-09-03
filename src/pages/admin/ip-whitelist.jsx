import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MdAdd,
  MdCheckCircle,
  MdContentCopy,
  MdDeleteOutline,
  MdEdit,
  MdOutlineSecurity,
  MdPauseCircleOutline,
  MdRefresh,
} from "react-icons/md";
import toast from "react-hot-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import PodcastApi from "@/services/podcastApi";

const emptyForm = { value: "", label: "" };
const messageFor = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

export default function IpWhitelistPage() {
  const api = useMemo(() => new PodcastApi(), []);
  const [items, setItems] = useState([]);
  const [currentIp, setCurrentIp] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.analyticsIpExclusionsGet();
      setItems(response?.data?.data?.exclusions || []);
      setCurrentIp(response?.data?.data?.currentIp || "");
    } catch (error) {
      toast.error(messageFor(error, "Unable to load the analytics IP whitelist"));
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.analyticsIpExclusionUpdate(editingId, form);
        toast.success("IP whitelist entry updated");
      } else {
        await api.analyticsIpExclusionCreate(form);
        toast.success("IP address excluded from analytics");
      }
      resetForm();
      await load();
    } catch (error) {
      toast.error(messageFor(error, "Unable to save this IP address"));
    } finally {
      setSaving(false);
    }
  };

  const edit = (item) => {
    setEditingId(item.id);
    setForm({ value: item.value, label: item.label || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggle = async (item) => {
    setActionId(item.id);
    try {
      await api.analyticsIpExclusionUpdate(item.id, { isActive: !item.isActive });
      toast.success(item.isActive ? "Analytics exclusion paused" : "Analytics exclusion activated");
      await load();
    } catch (error) {
      toast.error(messageFor(error, "Unable to update this IP address"));
    } finally {
      setActionId(null);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Remove ${item.value} from the analytics whitelist? New activity from this address will be counted again.`)) return;
    setActionId(item.id);
    try {
      await api.analyticsIpExclusionDelete(item.id);
      if (editingId === item.id) resetForm();
      toast.success("IP address removed from the whitelist");
      await load();
    } catch (error) {
      toast.error(messageFor(error, "Unable to remove this IP address"));
    } finally {
      setActionId(null);
    }
  };

  const useCurrentIp = () => {
    if (!currentIp) return;
    setEditingId(null);
    setForm({ value: currentIp, label: "My current IP" });
  };

  const copyCurrentIp = async () => {
    try {
      await navigator.clipboard.writeText(currentIp);
      toast.success("Current IP copied");
    } catch {
      toast.error("Unable to copy the IP address");
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-[1180px] space-y-5 text-slate-900">
        <header className="admin-page-header flex flex-wrap items-end justify-between gap-3 border-b border-violet-200 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-violet-700">Analytics controls</p>
            <h1 className="mt-1 flex items-center gap-2 text-2xl font-black text-slate-950 md:text-3xl">
              <MdOutlineSecurity className="text-violet-700" /> Analytics IP whitelist
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Activity from active entries is ignored before it reaches the analytics database, including page views, sessions, engagement, clicks, form events, media plays, Web Vitals and visitor errors.
            </p>
          </div>
          <button type="button" onClick={load} disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-violet-700 px-4 py-2 text-sm font-bold !text-white disabled:opacity-50">
            <MdRefresh /> Refresh
          </button>
        </header>

        <section className="rounded-2xl border border-violet-200 bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-violet-700">Your current public IP</p>
              <p className="mt-1 break-all font-mono text-lg font-bold text-slate-950">{currentIp || "Unable to detect"}</p>
            </div>
            {currentIp && <div className="flex flex-wrap gap-2">
              <button type="button" onClick={copyCurrentIp} className="inline-flex items-center gap-2 rounded-lg border border-violet-300 bg-white px-3 py-2 text-sm font-bold text-violet-800"><MdContentCopy />Copy</button>
              <button type="button" onClick={useCurrentIp} className="inline-flex items-center gap-2 rounded-lg bg-violet-700 px-3 py-2 text-sm font-bold !text-white"><MdAdd />Use this IP</button>
            </div>}
          </div>

          <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <label className="grid gap-1.5 text-sm font-bold text-slate-800">
              IP address or CIDR range
              <input
                required
                value={form.value}
                onChange={(event) => setForm((current) => ({ ...current, value: event.target.value }))}
                placeholder="203.0.113.42 or 203.0.113.0/24"
                className="min-w-0 rounded-xl border border-violet-300 bg-white px-4 py-3 font-mono font-normal text-slate-950 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-bold text-slate-800">
              Label (optional)
              <input
                value={form.label}
                maxLength={100}
                onChange={(event) => setForm((current) => ({ ...current, label: event.target.value }))}
                placeholder="Office, home, developer team"
                className="min-w-0 rounded-xl border border-violet-300 bg-white px-4 py-3 font-normal text-slate-950 outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button type="submit" disabled={saving} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 font-bold !text-white disabled:opacity-50">
                {editingId ? <MdEdit /> : <MdAdd />}{saving ? "Saving…" : editingId ? "Save changes" : "Add IP"}
              </button>
              {editingId && <button type="button" onClick={resetForm} className="min-h-12 rounded-xl border border-violet-300 bg-white px-4 py-3 font-bold text-slate-800">Cancel</button>}
            </div>
          </form>
          <p className="mt-3 text-xs text-slate-500">Use one exact IPv4/IPv6 address or a CIDR network range. Changes apply to new analytics events; existing reports are not rewritten.</p>
        </section>

        <section className="overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-sm">
          <div className="border-b border-violet-100 p-4 md:p-6">
            <h2 className="text-xl font-black text-slate-950">Whitelisted addresses</h2>
            <p className="mt-1 text-sm text-slate-600">Pause an entry temporarily, edit it, or remove it to count future activity again.</p>
          </div>
          {loading ? <div className="grid min-h-48 place-items-center text-slate-500">Loading IP whitelist…</div> : items.length ? (
            <div className="divide-y divide-violet-100">
              {items.map((item) => <article key={item.id} className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between md:p-6">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="break-all font-mono text-base text-slate-950">{item.value}</strong>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${item.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>
                      {item.isActive ? <MdCheckCircle /> : <MdPauseCircleOutline />}{item.isActive ? "Active" : "Paused"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{item.label || "No label"} · Added {new Date(item.createdAt).toLocaleString("en-AU")}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" disabled={actionId === item.id} onClick={() => edit(item)} className="inline-flex items-center gap-1.5 rounded-lg border border-violet-300 bg-white px-3 py-2 text-sm font-bold text-violet-800 disabled:opacity-50"><MdEdit />Edit</button>
                  <button type="button" disabled={actionId === item.id} onClick={() => toggle(item)} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-700 px-3 py-2 text-sm font-bold !text-white disabled:opacity-50">{item.isActive ? <MdPauseCircleOutline /> : <MdCheckCircle />}{item.isActive ? "Pause" : "Activate"}</button>
                  <button type="button" disabled={actionId === item.id} onClick={() => remove(item)} className="inline-flex items-center gap-1.5 rounded-lg bg-red-700 px-3 py-2 text-sm font-bold !text-white disabled:opacity-50"><MdDeleteOutline />Delete</button>
                </div>
              </article>)}
            </div>
          ) : <div className="grid min-h-48 place-items-center px-5 text-center text-slate-500">No IP addresses are excluded yet.</div>}
        </section>
      </div>
    </AdminLayout>
  );
}
