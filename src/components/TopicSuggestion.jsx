import { useState } from "react";
import toast from "react-hot-toast";
import { FaArrowRight, FaLightbulb, FaMicrophoneAlt, FaRegPaperPlane, FaStar } from "react-icons/fa";
import Listing from "@/pages/api/Listing";

const initialForm = { name: "", email: "", topic: "" };

export default function TopicSuggestion({ episodeTitle = "" }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const change = event => setForm(value => ({ ...value, [event.target.name]: event.target.value }));
  const submit = async event => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const response = await new Listing().AddContact({
        name: form.name.trim(), email: form.email.trim(), subject: "Suggest a Topic",
        message: `${form.topic.trim()}${episodeTitle ? `\n\nSuggested from episode: ${episodeTitle}` : ""}`,
      });
      if (!response?.data?.status) throw new Error(response?.data?.message || "Submission failed");
      setForm(initialForm); setComplete(true); toast.success("Your podcast idea has been sent!");
    } catch (error) {
      toast.error(error?.response?.data?.errors || error?.response?.data?.message || error.message || "Unable to send your idea. Please try again.");
    } finally { setLoading(false); }
  };

  return <section className="topic-suggestion relative isolate overflow-hidden rounded-[28px] border border-[#C347FF]/35 bg-[#120d1c] p-5 sm:p-8 lg:p-10">
    <div className="topic-orbit topic-orbit-one" aria-hidden="true"/><div className="topic-orbit topic-orbit-two" aria-hidden="true"/>
    <FaMicrophoneAlt className="topic-mic" aria-hidden="true"/>
    <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[.78fr_1.22fr] lg:gap-12">
      <div><span className="inline-flex items-center gap-2 rounded-full border border-[#C347FF]/35 bg-[#C347FF]/10 px-3 py-2 text-xs font-black uppercase tracking-[.15em] text-[#DDBBFF]"><FaStar aria-hidden="true"/>Your idea, our next conversation</span><h2 className="mt-5 text-[clamp(1.9rem,4vw,3.25rem)] font-black uppercase leading-[.98] tracking-[-.035em]">What should we talk about <span className="text-[#C347FF]">next?</span></h2><p className="mt-4 max-w-lg leading-7 text-white/65">Have a property question, market concern or investment idea? Send it directly to the team—it could inspire an upcoming episode.</p><div className="mt-6 flex items-center gap-3 text-sm font-bold text-[#DDBBFF]"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C347FF]/15"><FaLightbulb aria-hidden="true"/></span><span>Real listener ideas. Real expert conversations.</span></div></div>
      {complete ? <div className="topic-success flex min-h-[290px] flex-col items-center justify-center rounded-2xl border border-[#C347FF]/30 bg-black/25 p-8 text-center"><span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C347FF] text-2xl shadow-[0_0_40px_rgba(195,71,255,.45)]"><FaRegPaperPlane aria-hidden="true"/></span><h3 className="mt-5 text-2xl font-black">Idea received!</h3><p className="mt-2 text-white/65">Thanks for helping shape a future episode.</p><button type="button" onClick={()=>setComplete(false)} className="mt-6 font-bold text-[#DDBBFF] hover:text-white">Suggest another topic</button></div> : <form onSubmit={submit} className="topic-form rounded-2xl border border-white/10 bg-black/25 p-4 sm:p-6"><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-white/80">Your name<input required name="name" autoComplete="name" value={form.name} onChange={change} placeholder="Enter your name" className="mt-2 min-h-12 w-full rounded-xl border border-white/15 bg-[#0c0911]/85 px-4 text-white outline-none transition focus:border-[#C347FF] focus:ring-2 focus:ring-[#C347FF]/20"/></label><label className="text-sm font-bold text-white/80">Email address<input required type="email" name="email" autoComplete="email" value={form.email} onChange={change} placeholder="you@example.com" className="mt-2 min-h-12 w-full rounded-xl border border-white/15 bg-[#0c0911]/85 px-4 text-white outline-none transition focus:border-[#C347FF] focus:ring-2 focus:ring-[#C347FF]/20"/></label></div><label className="mt-4 block text-sm font-bold text-white/80">Your podcast topic<textarea required name="topic" maxLength={1000} value={form.topic} onChange={change} placeholder="What property topic would you like our hosts to unpack?" rows={4} className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-[#0c0911]/85 p-4 text-white outline-none transition focus:border-[#C347FF] focus:ring-2 focus:ring-[#C347FF]/20"/></label><div className="mt-3 flex items-center justify-between gap-4 text-xs text-white/40"><span>We’ll only use your details to respond to this suggestion.</span><span>{form.topic.length}/1000</span></div><button disabled={loading} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#8c2ed3] to-[#C347FF] px-6 font-black transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-wait disabled:opacity-60">{loading?"Sending your idea…":"Send my topic idea"}<FaArrowRight aria-hidden="true"/></button></form>}
    </div>
  </section>;
}
