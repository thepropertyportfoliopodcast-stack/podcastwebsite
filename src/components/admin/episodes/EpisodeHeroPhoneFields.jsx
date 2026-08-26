import { FaPlus, FaTrash } from "react-icons/fa";

const emptyPhone = (episode = {}) => ({
  uuid: null,
  title: episode.title || "",
  description: episode.description || "",
  youtubeShortUrl: "",
  youtubeVideoUrl: episode.youtubeUrl || "",
  isActive: true,
  thumbnail: null,
  shortVideo: null,
  removeShortVideo: false,
});

export default function EpisodeHeroPhoneFields({ formData, onChange }) {
  const phones = Array.isArray(formData.heroPhones) ? formData.heroPhones : [];
  const setPhones = (next) => onChange((current) => ({ ...current, heroPhones: next }));
  const toggle = (checked) => onChange((current) => ({ ...current, homePageHeroPhone: checked, heroPhones: checked && !current.heroPhones?.length ? [emptyPhone(current)] : current.heroPhones || [] }));
  const update = (index, field, value) => setPhones(phones.map((phone, phoneIndex) => phoneIndex === index ? { ...phone, [field]: value } : phone));
  const add = () => setPhones([...phones, emptyPhone(formData)]);
  const remove = (index) => setPhones(phones.filter((_, phoneIndex) => phoneIndex !== index));

  const fieldClass = "rounded-lg border border-violet-200 bg-white p-3 text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200";
  const fileClass = "rounded-lg border border-dashed border-violet-300 bg-white p-3 text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-violet-100 file:px-3 file:py-2 file:font-semibold file:text-violet-800";

  return <section className="rounded-xl border border-violet-200 bg-white p-4 text-slate-900 shadow-sm md:p-6">
    <label className="flex cursor-pointer items-start gap-3">
      <input type="checkbox" checked={Boolean(formData.homePageHeroPhone)} onChange={(event) => toggle(event.target.checked)} className="mt-1 h-5 w-5 accent-[#c347ff]" />
      <span><strong className="block text-base text-slate-950">Home_Page_Hero_Phone</strong><small className="mt-1 block leading-5 text-slate-600">Show phone-video cards for this episode on the homepage. Only the newest three active phone records across all episodes are returned to the homepage; older records are not downloaded in the background.</small></span>
    </label>
    {formData.homePageHeroPhone && <div className="mt-6 space-y-5">
      {phones.map((phone, index) => <article key={phone.uuid || `new-${index}`} className="rounded-xl border border-violet-200 bg-[#fbf8fd] p-4 shadow-none">
        <div className="mb-4 flex items-center justify-between gap-3"><h4 className="font-bold text-slate-950">Phone data {index + 1}</h4><button type="button" onClick={() => remove(index)} className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-3 py-2 text-xs font-bold text-red-700"><FaTrash />Remove</button></div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium text-slate-800">Phone title<input value={phone.title} onChange={(event) => update(index, "title", event.target.value)} placeholder={formData.title || "Episode title"} className={fieldClass} /></label>
          <label className="grid gap-1 text-sm font-medium text-slate-800">Full YouTube video URL<input type="url" value={phone.youtubeVideoUrl} onChange={(event) => update(index, "youtubeVideoUrl", event.target.value)} placeholder={formData.youtubeUrl || "https://youtube.com/watch?v=..."} className={fieldClass} /></label>
          <label className="grid gap-1 text-sm font-medium text-slate-800 md:col-span-2">Description<textarea rows="2" value={phone.description} onChange={(event) => update(index, "description", event.target.value)} placeholder={formData.description || "Short phone description"} className={fieldClass} /></label>
          <label className="grid gap-1 text-sm font-medium text-slate-800">YouTube Short URL <span className="text-xs font-normal text-slate-500">optional preview</span><input type="url" value={phone.youtubeShortUrl} onChange={(event) => update(index, "youtubeShortUrl", event.target.value)} placeholder="https://youtube.com/shorts/..." className={fieldClass} /></label>
          <label className="grid gap-1 text-sm font-medium text-slate-800">Phone thumbnail <span className="text-xs font-normal text-slate-500">optional; episode artwork is the fallback</span><input type="file" accept="image/*" onChange={(event) => update(index, "thumbnail", event.target.files?.[0] || null)} className={fileClass} /></label>
          <label className="grid gap-1 text-sm font-medium text-slate-800">Short preview video <span className="text-xs font-normal text-slate-500">optional MP4/WebM</span><input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(event) => update(index, "shortVideo", event.target.files?.[0] || null)} className={fileClass} /></label>
          <div className="flex flex-wrap items-center gap-5 pt-5"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={phone.isActive !== false} onChange={(event) => update(index, "isActive", event.target.checked)} className="accent-[#c347ff]" />Active</label>{phone.shortVideoUrl && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(phone.removeShortVideo)} onChange={(event) => update(index, "removeShortVideo", event.target.checked)} className="accent-[#c347ff]" />Remove saved preview</label>}</div>
        </div>
      </article>)}
      <button type="button" onClick={add} className="inline-flex items-center gap-2 rounded-lg border border-violet-400 bg-white px-4 py-2 font-bold text-violet-800"><FaPlus />Add another phone data</button>
    </div>}
  </section>;
}
