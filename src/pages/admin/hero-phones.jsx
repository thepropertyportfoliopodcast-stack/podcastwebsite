import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import AuthLayout from "@/layout/AuthLayout";
import Listing from "@/pages/api/Listing";

const emptyForm = { title: "", description: "", youtubeShortUrl: "", youtubeVideoUrl: "", displayOrder: 0, isActive: true, thumbnail: null, shortVideo: null, removeShortVideo: false };

export default function HeroPhonesAdmin() {
  const [phones, setPhones] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadPhones = useCallback(async () => {
    try {
      const response = await new Listing().AdminHeroPhoneGet();
      setPhones(Array.isArray(response?.data?.data) ? response.data.data : []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load hero phones");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadPhones(); }, [loadPhones]);

  const reset = () => { setEditing(null); setForm(emptyForm); };
  const edit = (phone) => {
    setEditing(phone);
    setForm({ title: phone.title || "", description: phone.description || "", youtubeShortUrl: phone.youtubeShortUrl || "", youtubeVideoUrl: phone.youtubeVideoUrl || "", displayOrder: phone.displayOrder || 0, isActive: phone.isActive !== false, thumbnail: null, shortVideo: null, removeShortVideo: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.youtubeVideoUrl.trim() || (!editing && !form.thumbnail)) return toast.error("Title, thumbnail and full YouTube link are required");
    const data = new FormData();
    ["title", "description", "youtubeShortUrl", "youtubeVideoUrl", "displayOrder", "isActive", "removeShortVideo"].forEach((field) => data.append(field, String(form[field] ?? "")));
    if (form.thumbnail) data.append("thumbnail", form.thumbnail);
    if (form.shortVideo) data.append("shortVideo", form.shortVideo);
    setSaving(true);
    try {
      if (editing) await new Listing().HeroPhoneUpdate(editing.uuid, data);
      else await new Listing().HeroPhoneAdd(data);
      toast.success(editing ? "Hero phone updated" : "Hero phone added");
      reset(); await loadPhones();
    } catch (error) { toast.error(error?.response?.data?.message || "Unable to save hero phone"); }
    finally { setSaving(false); }
  };

  const remove = async (phone) => {
    if (!window.confirm(`Delete “${phone.title}”?`)) return;
    try { await new Listing().HeroPhoneDelete(phone.uuid); toast.success("Hero phone deleted"); await loadPhones(); }
    catch (error) { toast.error(error?.response?.data?.message || "Unable to delete hero phone"); }
  };

  return <AuthLayout><div className="mx-auto max-w-6xl text-white">
    <div className="mb-8"><p className="text-sm font-bold uppercase tracking-[.18em] text-[#c347ff]">Homepage content</p><h1 className="mt-2 text-3xl font-black">Hero Phones</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">Create as many independent phones as you need. Lower display-order numbers appear first. An uploaded short video is used as the phone preview; otherwise its thumbnail is displayed.</p></div>
    <form onSubmit={submit} className="mb-10 rounded-2xl border border-gray-700 bg-[#121212] p-5 md:p-7">
      <div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-bold">{editing ? "Edit phone" : "Add a phone"}</h2>{editing && <button type="button" onClick={reset} className="rounded-lg border border-gray-600 px-4 py-2 text-sm">Cancel edit</button>}</div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">Phone title<input required value={form.title} onChange={(e)=>update("title",e.target.value)} className="rounded-xl border border-gray-700 bg-[#1c1c1c] px-4 py-3 outline-none focus:border-[#c347ff]" placeholder="Phone or video title"/></label>
        <label className="grid gap-2 text-sm font-semibold">Display order<input type="number" value={form.displayOrder} onChange={(e)=>update("displayOrder",e.target.value)} className="rounded-xl border border-gray-700 bg-[#1c1c1c] px-4 py-3 outline-none focus:border-[#c347ff]"/></label>
        <label className="grid gap-2 text-sm font-semibold md:col-span-2">Short description<textarea rows="3" value={form.description} onChange={(e)=>update("description",e.target.value)} className="rounded-xl border border-gray-700 bg-[#1c1c1c] px-4 py-3 outline-none focus:border-[#c347ff]" placeholder="Optional text displayed in the opened phone"/></label>
        <label className="grid gap-2 text-sm font-semibold">YouTube Short link<input value={form.youtubeShortUrl} onChange={(e)=>update("youtubeShortUrl",e.target.value)} className="rounded-xl border border-gray-700 bg-[#1c1c1c] px-4 py-3 outline-none focus:border-[#c347ff]" placeholder="https://youtube.com/shorts/..."/><small className="font-normal text-gray-500">Optional alternative to an uploaded preview video.</small></label>
        <label className="grid gap-2 text-sm font-semibold">Full YouTube video link<input required value={form.youtubeVideoUrl} onChange={(e)=>update("youtubeVideoUrl",e.target.value)} className="rounded-xl border border-gray-700 bg-[#1c1c1c] px-4 py-3 outline-none focus:border-[#c347ff]" placeholder="https://youtube.com/watch?v=..."/></label>
        <label className="grid gap-2 text-sm font-semibold">Thumbnail image {editing && <small className="font-normal text-gray-500">Leave empty to keep the existing image.</small>}<input type="file" accept="image/*" required={!editing} onChange={(e)=>update("thumbnail",e.target.files?.[0]||null)} className="rounded-xl border border-dashed border-gray-600 bg-[#1c1c1c] px-4 py-4"/></label>
        <label className="grid gap-2 text-sm font-semibold">Short preview video<input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(e)=>update("shortVideo",e.target.files?.[0]||null)} className="rounded-xl border border-dashed border-gray-600 bg-[#1c1c1c] px-4 py-4"/><small className="font-normal text-gray-500">Optional. Keep this compressed for fast homepage loading.</small></label>
      </div>
      <div className="mt-5 flex flex-wrap gap-5">
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e)=>update("isActive",e.target.checked)} className="accent-[#c347ff]"/> Active on homepage</label>
        {editing?.shortVideo && <label className="flex items-center gap-2"><input type="checkbox" checked={form.removeShortVideo} onChange={(e)=>update("removeShortVideo",e.target.checked)} className="accent-[#c347ff]"/> Remove current preview video</label>}
      </div>
      <button disabled={saving} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-[#8c2ed3] to-[#c347ff] px-7 font-bold disabled:opacity-60"><FaPlus/>{saving?"Saving…":editing?"Save changes":"Add phone"}</button>
    </form>
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{loading?<p className="text-gray-400">Loading phones…</p>:phones.length?phones.map((phone)=><article key={phone.uuid} className={`overflow-hidden rounded-2xl border bg-[#121212] ${phone.isActive?"border-[#c347ff]/50":"border-gray-700 opacity-65"}`}><div className="relative aspect-[9/13]"><Image src={phone.thumbnail} alt={phone.title} fill sizes="(max-width:640px) 100vw, 360px" className="object-cover"/><span className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-bold">Order {phone.displayOrder}</span></div><div className="p-5"><h2 className="line-clamp-2 text-lg font-bold">{phone.title}</h2><p className="mt-2 text-xs text-gray-400">{phone.shortVideo?"Uploaded video preview":phone.youtubeShortUrl?"YouTube Short preview":"Thumbnail preview"} · {phone.isActive?"Active":"Hidden"}</p><div className="mt-5 flex gap-3"><button type="button" onClick={()=>edit(phone)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-600 px-3 py-2"><FaEdit/> Edit</button><button type="button" onClick={()=>remove(phone)} className="inline-flex items-center justify-center rounded-lg border border-red-800 px-4 text-red-400" aria-label={`Delete ${phone.title}`}><FaTrash/></button></div></div></article>):<p className="text-gray-400">No hero phones yet. Add your first phone above.</p>}</div>
  </div></AuthLayout>;
}
