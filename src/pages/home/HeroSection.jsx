import Link from "next/link";
import { MdArrowOutward, MdOutlineHeadphones, MdPlayArrow } from "react-icons/md";

const highlights = [
  ["Real voices", "Property, finance and investment experts"],
  ["Practical ideas", "Insights you can apply to your portfolio"],
  ["Australian focus", "Conversations grounded in our market"],
];

export default function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-72px)] items-center overflow-hidden pt-[72px] text-white sm:pt-[84px] lg:min-h-[min(900px,100svh)]">
      <div className="absolute inset-0 -z-20 bg-[#050505]" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_76%_28%,rgba(151,71,255,.32),transparent_30%),radial-gradient(circle_at_14%_76%,rgba(252,24,216,.2),transparent_28%),linear-gradient(135deg,rgba(151,71,255,.08),transparent_42%)]" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" aria-hidden="true" />
      <div className="mx-auto grid w-full max-w-[1310px] items-center gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(330px,.85fr)] lg:gap-12 lg:px-8 lg:py-12">
        <div className="max-w-[780px] text-center lg:text-left">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#c99cff]/30 bg-[#9747FF]/10 px-4 py-2 text-xs font-bold uppercase tracking-[.17em] text-[#dabdff] lg:mx-0"><span className="h-2 w-2 rounded-full bg-[#FC18D8] shadow-[0_0_16px_#FC18D8]" />The Australian property conversation</div>
          <h1 className="text-[clamp(2.35rem,6.3vw,5.35rem)] font-black uppercase leading-[.98] tracking-[-.045em]">Property insight for a<span className="block bg-gradient-to-r from-[#b780ff] via-[#e461ee] to-[#FC18D8] bg-clip-text pb-1 text-transparent">stronger portfolio.</span></h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8 lg:mx-0">Step behind the scenes with the sharpest minds of the Australian property market revealing proven strategies, timing secrets, and calculated risks that turn good portfolios into great ones.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"><Link href="/episode" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7d32df] to-[#d719bd] px-6 py-3 font-bold shadow-[0_16px_45px_rgba(151,71,255,.3)] transition hover:-translate-y-0.5 hover:brightness-110"><MdPlayArrow size={24} aria-hidden="true" /> Explore episodes</Link><Link href="/about" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[.04] px-6 py-3 font-bold transition hover:border-[#c99cff]/70 hover:bg-white/[.08]">Meet the podcast <MdArrowOutward size={20} aria-hidden="true" /></Link></div>
        </div>
        <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
          <div className="absolute -inset-10 -z-10 rounded-full bg-[#9747FF]/20 blur-3xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-gradient-to-br from-white/[.09] to-white/[.025] p-4 shadow-[0_30px_100px_rgba(0,0,0,.45)] backdrop-blur-xl sm:p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#9747FF] to-[#FC18D8]"><MdOutlineHeadphones size={25} aria-hidden="true" /></span><div><p className="text-xs uppercase tracking-[.18em] text-white/45">Listen. Learn. Grow.</p><p className="font-bold">The Property Portfolio Podcast</p></div></div><span className="hidden rounded-full border border-[#FC18D8]/30 bg-[#FC18D8]/10 px-3 py-1 text-xs font-bold text-[#ff83ec] sm:block">New episodes</span></div>
            <div className="mt-4 grid gap-3">{highlights.map(([title, description], index) => <div key={title} className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:border-[#b780ff]/40 hover:bg-[#9747FF]/10"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-sm font-black text-[#d6afff]">0{index + 1}</span><div><h2 className="font-bold text-white">{title}</h2><p className="mt-0.5 text-sm leading-5 text-white/55">{description}</p></div></div>)}</div>
            <div className="mt-4 flex items-end justify-between rounded-2xl bg-gradient-to-r from-[#9747FF]/20 to-[#FC18D8]/10 p-4"><div><p className="text-xs uppercase tracking-wider text-white/50">Built for</p><p className="mt-1 text-lg font-extrabold">Smarter property decisions</p></div><div className="flex h-10 items-end gap-1" aria-hidden="true">{[45,75,55,95,68,86,50].map((height,index)=><span key={index} className="w-1.5 rounded-full bg-gradient-to-t from-[#9747FF] to-[#FC18D8]" style={{height:`${height}%`}} />)}</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
