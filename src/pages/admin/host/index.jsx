import { useEffect, useState } from "react";
import Image from "next/image";
import AdminLayout from "@/components/layout/AdminLayout";
import PodcastApi from "@/services/podcastApi";
import SeoFields from "@/components/admin/forms/SeoFields";
import toast from "react-hot-toast";

const empty = { name: "", designation: "", shortBio: "", bio: "", email: "", linkedinUrl: "", instagramUrl: "", guestTag: "", displayOrder: 0, isGuestOnly: false, seoTitle: "", seoDescription: "", primaryKeyword: "", secondaryKeywords: "", image: null };

export default function HostAdmin() {
  const [hosts, setHosts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const load = async () => { try { const response = await new PodcastApi().AdminHostGet(); setHosts(Array.isArray(response?.data?.data) ? response.data.data : []); } catch { setHosts([]); } };
  useEffect(() => { load(); }, []);
  const change = (event) => { const { name, value, files, type, checked } = event.target; setForm((current) => ({ ...current, [name]: files?.[0] || (type === "checkbox" ? checked : value) })); };
  const edit = (host) => { setEditing(host); setForm({ ...empty, ...host, image: null }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const submit = async (event) => {
    event.preventDefault(); setLoading(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => { if (value !== null && value !== "") payload.append(key, value); });
      const api = new PodcastApi();
      const response = editing ? await api.HostUpdate(editing.uuid, payload) : await api.HostAdd(payload);
      toast.success(response?.data?.message || "Host saved"); setForm(empty); setEditing(null); await load();
    } catch (error) { toast.error(error?.response?.data?.message || "Host could not be saved until the database migration is applied"); }
    finally { setLoading(false); }
  };
  const fieldClass = "rounded-lg border border-white/15 bg-black p-3";

  return <AdminLayout><div className="space-y-10 text-white">
    <div><h1 className="text-4xl font-extrabold">Host profiles</h1><p className="mt-2 text-white/60">Create regular host and guest-only profiles for episode publishing.</p></div>
    <form onSubmit={submit} className="grid gap-5 rounded-2xl border border-white/10 bg-[#111] p-6 md:grid-cols-2">
      <input name="name" value={form.name} onChange={change} placeholder="Host name" required className={fieldClass}/>
      <input name="designation" value={form.designation} onChange={change} placeholder="Designation" required className={fieldClass}/>
      <textarea name="shortBio" value={form.shortBio} onChange={change} placeholder="Short bio" required className={`${fieldClass} md:col-span-2`}/>
      <textarea name="bio" value={form.bio} onChange={change} placeholder="Full profile content" rows="6" required className={`${fieldClass} md:col-span-2`}/>
      <input name="linkedinUrl" value={form.linkedinUrl} onChange={change} placeholder="LinkedIn URL" className={fieldClass}/>
      <input name="instagramUrl" value={form.instagramUrl} onChange={change} placeholder="Instagram URL" className={fieldClass}/>
      <label className="space-y-2">
        <span className="block text-sm font-bold">Homepage position</span>
        <select name="displayOrder" value={form.displayOrder} onChange={change} className={`${fieldClass} w-full`}>
          <option value="0">Not positioned</option>
          <option value="1">1 — Left</option>
          <option value="2">2 — Centre</option>
          <option value="3">3 — Right</option>
        </select>
        <small className="block text-white/60">Position 2 is always the middle host on the homepage. Give each regular host a different position.</small>
      </label>
      <input type="file" name="image" accept="image/*" onChange={change} required={!editing} className={fieldClass}/>
      <label className="flex items-center gap-3 rounded-lg border border-[#9747FF]/35 bg-[#9747FF]/10 p-4 md:col-span-2"><input type="checkbox" name="isGuestOnly" checked={Boolean(form.isGuestOnly)} onChange={change}/><span><strong className="block">Guest-only profile</strong><small className="text-white/60">Available in episode guest selections, but hidden from regular host listings and homepage sections.</small></span></label>
      {form.isGuestOnly && <div className="md:col-span-2"><label className="mb-2 block text-sm font-bold">Guest tags</label><div className="flex flex-col gap-3 sm:flex-row"><span className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#8d2dcc] px-5 text-sm font-extrabold text-white">Guest <small className="ml-2 text-white/65">(fixed)</small></span><input name="guestTag" value={form.guestTag} onChange={change} placeholder="Specialty tag, e.g. Wealth Strategist" maxLength={40} className={`${fieldClass} min-w-0 flex-1`}/></div><p className="mt-2 text-xs text-white/55">“Guest” is always displayed. Add one specialty tag that best describes this guest.</p></div>}
      <div className="md:col-span-2"><SeoFields formData={form} onChange={change}/></div>
      <button disabled={loading} className="button-bg rounded-lg p-3 font-bold md:col-span-2">{loading ? "Saving..." : editing ? "Update host" : "Create host"}</button>
    </form>
    <div className="grid gap-5 md:grid-cols-3">{hosts.map((host) => <article key={host.slug} className="overflow-hidden rounded-2xl border border-white/10 bg-[#111]"><div className="relative aspect-square"><Image src={host.image} alt={host.name} fill sizes="33vw" className="object-cover"/></div><div className="p-5"><div className="flex items-start justify-between gap-3"><h2 className="text-2xl font-bold">{host.name}</h2>{host.isGuestOnly ? <span className="rounded-full bg-[#9747FF]/20 px-2 py-1 text-xs text-[#d8b7ff]">Guest only</span> : <span className="rounded-full bg-[#9747FF]/20 px-2 py-1 text-xs font-bold text-[#d8b7ff]">Homepage {Number(host.displayOrder) > 0 ? `#${host.displayOrder}` : "—"}</span>}</div><p className="mt-1 text-[#c99cff]">{host.designation}</p>{host.isGuestOnly && <div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-[#8d2dcc] px-3 py-1 text-xs font-bold text-white">Guest</span>{host.guestTag && <span className="rounded-full bg-[#9747FF]/15 px-3 py-1 text-xs font-bold text-[#d8b7ff]">{host.guestTag}</span>}</div>}<button onClick={() => edit(host)} className="mt-5 rounded-lg border border-white/20 px-4 py-2">Edit profile</button></div></article>)}</div>
  </div></AdminLayout>;
}
