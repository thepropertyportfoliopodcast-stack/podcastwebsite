import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaApple, FaBinoculars, FaBuilding, FaComments, FaLinkedin, FaPiggyBank, FaPlay, FaShieldAlt, FaSpotify, FaYoutube } from "react-icons/fa";
import { HiOutlineCalculator, HiOutlineSearch } from "react-icons/hi";
import { MdArrowOutward, MdMic } from "react-icons/md";
import Listing from "@/pages/api/Listing";
import { fallbackHosts } from "@/data/hosts";
import { contentPath } from "@/utils/seo";
import HeroPhones from "@/components/home/HeroPhones";

const platforms = {
  youtube: "https://www.youtube.com/@ThePropertyPortfolioPodcast",
  spotify: "https://open.spotify.com/show/7BWrKVuUSeX1Qat3VEjUaU",
  apple: "https://podcasts.apple.com/us/podcast/the-property-portfolio-podcast/id1876516932",
};

const developmentHeroPhones = [
  {
    uuid: "preview-phone-property-strategy",
    title: "Smarter Property Strategy",
    description: "Practical conversations for confident property decisions.",
    thumbnail: "/paragimg.jpg",
    youtubeShortUrl: "https://www.youtube.com/shorts/jNQXAC9IVRw",
    youtubeVideoUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    displayOrder: 1,
    isActive: true,
  },
  {
    uuid: "preview-phone-market-insights",
    title: "Australian Market Insights",
    description: "Clear market analysis without the noise.",
    thumbnail: "/muditimg.jpg",
    youtubeShortUrl: "https://www.youtube.com/shorts/jNQXAC9IVRw",
    youtubeVideoUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    displayOrder: 2,
    isActive: true,
  },
  {
    uuid: "preview-phone-buyer-conversations",
    title: "Better Buyer Conversations",
    description: "Real property questions answered by experienced professionals.",
    thumbnail: "/juliusimg.jpg",
    youtubeShortUrl: "https://www.youtube.com/shorts/jNQXAC9IVRw",
    youtubeVideoUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    displayOrder: 3,
    isActive: true,
  },
];

function episodeNumber(episode) { return episode?.episodeNumber ? `EP. ${episode.episodeNumber}` : "LATEST EPISODE"; }
function duration(episode) { const minutes=Number(episode?.duration)||(Number(episode?.durationInSec)?Math.ceil(Number(episode.durationInSec)/60):0); return minutes ? `${minutes} mins` : ""; }
function Waveform({ compact = false }) {
  const bars = [30,55,82,42,68,94,52,78,38,88,60,96,46,72,34,84,55,91,44,70,36,76,48,86,58,92,40,74];
  return <div className={`home-wave flex items-center gap-1 ${compact ? "h-8" : "h-14"}`} aria-hidden="true">{bars.map((height,index)=><span key={index} className="w-1 flex-1 rounded-full bg-gradient-to-t from-[#7d2dc2] to-[#d45aff]" style={{height:`${height}%`,animationDelay:`${index * 45}ms`}} />)}</div>;
}
function PlatformLinks({ compact = false }) {
  const items = [[platforms.youtube,"YouTube",FaYoutube,"text-red-500"],[platforms.spotify,"Spotify",FaSpotify,"text-[#1ed760]"],[platforms.apple,"Apple Podcasts",FaApple,"text-[#d8a9ff]"]];
  return <div className={`flex ${compact ? "flex-wrap gap-4" : "grid grid-cols-1 gap-3 sm:grid-cols-3"}`}>{items.map(([href,label,Icon,color])=><a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Listen to The Property Portfolio Podcast on ${label}`} className={`${compact ? "text-sm" : "home-platform-link min-h-14 rounded-xl px-5"} inline-flex items-center justify-center gap-2 font-bold text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DDBBFF]`}><span className={compact ? "" : "home-platform-icon"}><Icon className={color} aria-hidden="true" /></span>{label}</a>)}</div>;
}
function NowPlaying({ episode }) {
  const href = episode ? contentPath("episode", episode) : "/episode";
  return <div className="hero-player hero-player-card group relative rounded-[28px] p-[1px]">
    <span className="hero-player-frame hero-player-frame-one" aria-hidden="true" />
    <span className="hero-player-frame hero-player-frame-two" aria-hidden="true" />
    <span className="hero-player-orb hero-player-orb-one" aria-hidden="true" />
    <span className="hero-player-orb hero-player-orb-two" aria-hidden="true" />
    <div className="hero-player-shell relative z-10 overflow-hidden rounded-[27px] border border-white/10 bg-[#0d0914]/95 p-3 sm:p-4">
      <div className="hero-player-topline mb-3 flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.2em] text-[#E7C9FF] sm:text-xs"><span className="hero-live-dot h-2 w-2 rounded-full bg-[#D34DFF]" />Now streaming</div>
        <div className="flex items-center gap-2 rounded-full border border-[#C347FF]/30 bg-[#C347FF]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.14em] text-white sm:text-xs"><MdMic aria-hidden="true" />{episodeNumber(episode)}</div>
      </div>
      <Link href={href} aria-label={`Play ${episode?.title || "the latest episode"}`} className="hero-player-visual relative block aspect-video overflow-hidden rounded-[20px] border border-white/15 bg-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#DDBBFF]">
        <Image src={episode?.homepageThumbnail || episode?.thumbnail || "/heroimg01.jpg"} alt={episode?.title ? `${episode.title} episode artwork` : "The Property Portfolio Podcast hosts recording an episode"} fill priority fetchPriority="high" sizes="(max-width:1023px) calc(100vw - 44px), 720px" quality={90} className="hero-player-image object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09050f]/95 via-transparent to-black/15" />
        <div className="hero-scanline" aria-hidden="true" />
        <div className="hero-spectrum-tower" aria-hidden="true">{[34,62,88,49,96,71,42,82].map((height,index)=><span key={index} style={{height:`${height}%`,animationDelay:`${index * 90}ms`}} />)}</div>
        <span className="hero-signal-label" aria-hidden="true">LIVE SIGNAL</span>
        <span className="hero-corner hero-corner-tl" aria-hidden="true" /><span className="hero-corner hero-corner-tr" aria-hidden="true" />
        <span className="hero-corner hero-corner-bl" aria-hidden="true" /><span className="hero-corner hero-corner-br" aria-hidden="true" />
        <span className="hero-play-orbit hero-play-orbit-one absolute left-1/2 top-[42%]" aria-hidden="true" />
        <span className="hero-play-orbit hero-play-orbit-two absolute left-1/2 top-[42%]" aria-hidden="true" />
        <span className="hero-play-ripple absolute left-1/2 top-[44%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full" aria-hidden="true" />
        <span className="hero-latest-play absolute left-1/2 top-[44%] flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition group-hover:scale-110 sm:h-24 sm:w-24"><FaPlay className="ml-1" size={28} aria-hidden="true" /></span>
        <div className="hero-glass-copy absolute inset-x-3 bottom-3 rounded-2xl border border-white/15 bg-[#0b0712]/70 p-3 backdrop-blur-xl sm:inset-x-4 sm:bottom-4 sm:p-4">
          <div className="flex items-end justify-between gap-4"><div className="min-w-0"><p className="mb-1 text-[9px] font-black uppercase tracking-[.2em] text-[#D34DFF] sm:text-[10px]">Featured conversation</p><p className="line-clamp-2 text-sm font-black leading-tight text-white sm:text-lg">{episode?.title || "Explore the latest property conversation"}</p></div><span className="hero-duration-chip shrink-0 px-2.5 py-1 text-[10px] font-bold text-white/75 sm:text-xs">{duration(episode)}</span></div>
        </div>
      </Link>
      <div className="hero-audio-rail relative mt-3 overflow-hidden rounded-2xl border border-white/[.08] bg-white/[.025] px-3 py-2.5 sm:px-4">
        <Waveform compact />
        <div className="mt-1.5 flex items-center gap-3"><span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"><span className="hero-progress block h-full w-[42%] rounded-full bg-gradient-to-r from-[#A837F4] via-[#D34DFF] to-[#C347FF]" /></span><span className="hero-listen-cue text-[9px] font-black uppercase tracking-[.16em] text-[#E7C9FF] sm:text-[10px]">Tap to listen <MdArrowOutward className="inline" aria-hidden="true" /></span></div>
      </div>
      <div className="hero-console-feet" aria-hidden="true"><span /><span /><span /><span /><span /></div>
    </div>
  </div>;
}
function Hero({ latest, episodes = [], heroPhones = [] }) {
  return <><section className="home-hero relative isolate overflow-hidden pb-[clamp(3rem,7vh,6rem)] pt-[clamp(7rem,15vh,8.75rem)] lg:min-h-[min(820px,100svh)]"><div className="absolute inset-0 -z-20 bg-[#07070B]"/><div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_36%,rgba(168,55,244,.24),transparent_34%),radial-gradient(circle_at_12%_55%,rgba(100,38,145,.22),transparent_35%),linear-gradient(180deg,#0e0917_0%,#07070b_82%)]"/><div className="absolute inset-x-0 bottom-0 -z-10 h-64 opacity-25 [background-image:linear-gradient(90deg,transparent_49%,rgba(195,71,255,.22)_50%,transparent_51%),linear-gradient(rgba(195,71,255,.15)_1px,transparent_1px)] [background-size:54px_54px] [mask-image:linear-gradient(to_top,black,transparent)]"/>
    <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:px-10 xl:px-12"><div><h1 className="mt-4 text-[clamp(2.65rem,4.4vw,4.35rem)] font-black uppercase leading-[.96] tracking-[-.045em] text-[#F8F5FA]">BETTER PROPERTY DECISIONS START WITH <span className="block text-[#C347FF]">BETTER INFORMATION</span></h1><p className="mt-6 max-w-xl text-base leading-7 text-[#B8B0C3]">Australian property conversations covering market trends, suburb research, finance and the strategies investors use when deciding what, where and when to buy.</p><div className="mt-7 grid gap-3 sm:flex"><Link href={latest ? contentPath("episode",latest) : "/episode"} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8c2ed3] to-[#C347FF] px-5 font-bold transition hover:-translate-y-0.5 hover:brightness-110"><FaPlay size={13}/>Watch latest episode</Link><Link href="/episode" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/25 bg-white/[.025] px-5 font-bold transition hover:border-[#C347FF]/60">Browse episodes</Link></div></div><HeroPhones phones={heroPhones} episodes={[latest, ...episodes].filter(Boolean)}/></div>
  </section></>;
}
const features=[[MdMic,"Expert Perspectives","Real conversations with experienced investors and industry leaders."],[FaPiggyBank,"Practical Strategies","Actionable insights you can apply to property and lending decisions."],[HiOutlineSearch,"Clear & Honest","Straight talk about the market, risks and opportunities ahead."]];
function AboutPodcast(){return <section className="home-section home-about"><div className="home-container grid items-center gap-10 lg:grid-cols-[.48fr_.52fr]"><div className="home-about-image relative aspect-[6/5] overflow-hidden rounded-[22px] border border-[#C347FF]/35 shadow-[0_20px_70px_rgba(99,23,140,.35)]"><Image src="/conversation.png" alt="Parag Dixit, Mudit Khandelwal and Julius Dabre" fill sizes="(max-width:1023px) calc(100vw - 40px), 560px" className="object-cover"/></div><div className="home-about-copy"><p className="home-eyebrow">About the podcast</p><h2 className="home-title">Property discussions built around real questions</h2><p className="home-copy mt-5">Our podcast brings real stories, fresh perspectives and direct conversations from voices that matter in Australian finance and property.</p><div className="home-about-features mt-8 grid gap-5 sm:grid-cols-3">{features.map(([Icon,title,text])=><div key={title}><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#A837F4]/15 text-[#DDBBFF]"><Icon size={21}/></span><h3 className="mt-3 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#8F879B]">{text}</p></div>)}</div><Link href="/about" className="home-about-link mt-8 inline-flex items-center gap-2 border-b border-[#C347FF] pb-1 font-bold text-[#DDBBFF]">Meet the hosts <MdArrowOutward/></Link></div></div></section>}
function Episodes({episodes}){const source=Array.isArray(episodes)?episodes:[];const items=source.slice(0,5);const[active,setActive]=useState(0);useEffect(()=>{if(items.length<2)return;const timer=setInterval(()=>setActive((value)=>(value+1)%items.length),4200);return()=>clearInterval(timer)},[items.length]);const move=(step)=>setActive((value)=>(value+step+items.length)%items.length);return <section className="home-section home-episodes pt-0"><div className="home-container"><div className="flex items-end justify-between gap-5"><div><p className="home-eyebrow">Featured conversations</p><h2 className="home-title">Latest episodes</h2></div><Link href="/episode" className="mb-1 inline-flex min-h-11 shrink-0 items-center rounded-xl border border-[#C347FF]/45 px-5 text-sm font-bold hover:bg-[#A837F4]/10">View all episodes</Link></div>{items.length?<div className="featured-carousel mt-8" aria-roledescription="carousel"><div className="featured-carousel-stage">{items.map((episode,index)=>{let offset=index-active;if(offset>items.length/2)offset-=items.length;if(offset<-items.length/2)offset+=items.length;return <Link key={episode.uuid||episode.id} href={contentPath("episode",episode)} className={`featured-carousel-card ${offset===0?"is-active":""}`} style={{"--offset":offset,"--distance":Math.abs(offset),opacity:offset===0?1:.58,zIndex:10-Math.abs(offset)}} aria-label={`Open ${episode.title}`}><div className="featured-carousel-image relative"><Image src={episode.thumbnail} alt={episode.title} fill sizes="(max-width: 640px) 62vw, 360px" className="object-cover"/><div className="featured-carousel-shade"/></div><div className="featured-carousel-copy"><p>{episode.topic||"Property insights"}</p><h3>{episode.title}</h3></div></Link>})}</div><div className="featured-carousel-nav"><button type="button" onClick={()=>move(-1)} aria-label="Previous featured episode">‹</button><div>{items.map((episode,index)=><button key={episode.uuid||episode.id} type="button" onClick={()=>setActive(index)} aria-label={`Show featured episode ${index+1}`} className={active===index?"is-active":""}/>)}</div><button type="button" onClick={()=>move(1)} aria-label="Next featured episode">›</button></div></div>:<p className="mt-8 text-center text-[#8F879B]">Featured episodes will appear here when selected in the dashboard.</p>}</div></section>}
const lessons=[["Market Movements","Short takes on how the Australian property market is shifting.",FaBuilding],["Investment Strategy","Different ways people are building and managing property portfolios.",FaPiggyBank],["Risk and Due Diligence","Honest talk about challenges, mistakes and lessons learned.",FaShieldAlt],["Finance and Borrowing","Financing considerations and the numbers that matter.",HiOutlineCalculator],["Property Stories","Real experiences from investors and experts shaping the market.",FaComments],["Future Outlook","Where the property market might be heading and what to watch next.",FaBinoculars]];
function Learning(){return <section className="home-section home-learning"><div className="home-container"><div className="text-center"><h2 className="home-title">What you’ll learn</h2><p className="home-copy mx-auto mt-3 max-w-3xl">Every episode is packed with actionable insights to help you make smarter property decisions.</p></div><div className="home-learning-grid mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{lessons.map(([title,text,Icon])=><article key={title} className="group relative min-h-[clamp(150px,20vh,210px)] overflow-hidden rounded-[20px] border border-white/10 bg-[#15111F] p-[clamp(1rem,2.2vw,1.5rem)]"><span className="learning-icon mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C347FF]/35 bg-[#C347FF]/10 text-[#DDBBFF]"><Icon size={25} aria-hidden="true"/></span><h3 className="text-[clamp(1rem,1.5vw,1.2rem)] font-extrabold">{title}</h3><p className="mt-2 max-w-sm text-sm leading-6 text-[#8F879B]">{text}</p></article>)}</div></div></section>}
function Hosts(){const hostOrder=["mudit-khandelwal","parag-dixit","julius-dabre"];const hosts=[...fallbackHosts].sort((a,b)=>hostOrder.indexOf(a.slug)-hostOrder.indexOf(b.slug));return <section className="home-section home-hosts pt-0"><div className="home-container"><div className="mx-auto max-w-2xl text-center"><h2 className="home-title">Meet the minds behind the mic</h2></div><div className="mt-8 grid gap-5 md:grid-cols-3">{hosts.map(host=><Link href={`/host/${host.slug}`} key={host.slug} className="group grid grid-cols-[110px_1fr] overflow-hidden rounded-[20px] border border-white/10 bg-[#15111F] transition hover:border-[#C347FF]/55 sm:grid-cols-[140px_1fr] md:grid-cols-1"><div className="home-host-image relative md:aspect-[5/4]"><Image src={host.image} alt={host.name} fill sizes="(max-width:767px) 140px, 33vw" className="object-cover object-top transition duration-500 group-hover:scale-[1.025]"/></div><div className="p-5"><h3 className="text-lg font-black uppercase text-[#C347FF]">{host.name}</h3><p className="mt-1 text-sm text-[#DDBBFF]">{host.designation}</p><p className="mt-3 line-clamp-3 text-sm leading-6 text-[#8F879B]">{host.shortBio}</p>{host.linkedinUrl&&<FaLinkedin className="mt-3 text-[#0a66c2]"/>}</div></Link>)}</div></div></section>}
function Newsletter(){const[email,setEmail]=useState("");const[loading,setLoading]=useState(false);const[message,setMessage]=useState("");const submit=async(e)=>{e.preventDefault();setMessage("");if(!/^\S+@\S+\.\S+$/.test(email)){setMessage("Please enter a valid email address.");return;}setLoading(true);try{await new Listing().AddSubscriber({email});setEmail("");setMessage("You’re subscribed. Thank you!");toast.success("Thank you for subscribing!");}catch(error){setMessage(error?.response?.data?.message||"Subscription failed. Please try again.");}finally{setLoading(false);}};return <section className="home-newsletter"><div className="home-container"><div className="relative overflow-hidden rounded-[22px] border border-[#C347FF]/35 bg-gradient-to-r from-[#1B1527] to-[#100b18] p-6 sm:p-9"><div className="home-newsletter-content relative max-w-2xl"><h2 className="text-2xl font-black uppercase sm:text-3xl">Property conversations, new episodes and market updates</h2><p className="mt-2 text-[#B8B0C3]">Receive new episode releases and selected Australian property-market discussions in your inbox.</p><form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row"><label htmlFor="home-newsletter" className="sr-only">Email address</label><input id="home-newsletter" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your email" className="min-h-12 min-w-0 flex-1 rounded-xl border border-white/20 bg-black/25 px-4 text-white outline-none focus:border-[#C347FF]"/><button disabled={loading} className="min-h-12 rounded-xl bg-[#A837F4] px-8 font-bold disabled:opacity-60">{loading?"Subscribing…":"Subscribe"}</button></form><p className="mt-3 min-h-5 text-sm text-[#DDBBFF]" role="status" aria-live="polite">{message}</p><p className="text-xs text-[#8F879B]">By subscribing, you agree to receive podcast updates. You can unsubscribe at any time.</p></div><div className="home-newsletter-art" aria-hidden="true"><Image src="/newsletter-3d.webp" alt="" fill sizes="(min-width: 1280px) 360px, (min-width: 768px) 30vw, 0px" className="object-contain"/></div></div></div></section>}
export default function PremiumHomepage({episodes=[],latestEpisode=null,heroPhones=[]}){const items=Array.isArray(episodes)?episodes:[];
  const configuredPhones=Array.isArray(heroPhones)?heroPhones:[];
  const previewPhones=process.env.NODE_ENV === "development" && configuredPhones.length === 0 ? developmentHeroPhones : configuredPhones;
  return <div className="home-premium overflow-hidden bg-[#07070B] text-[#F8F5FA]">
    <Hero latest={latestEpisode || items[0] || null} episodes={items} heroPhones={previewPhones}/>
    <section className="home-platforms home-container">
      <div className="home-platform-card relative overflow-hidden rounded-[24px] p-5 sm:flex sm:items-center sm:justify-between sm:p-6">
      <div className="relative z-[1]"><p className="home-platform-eyebrow">Watch or listen on your preferred platform</p><h2 className="mt-1 max-w-sm text-xl font-black uppercase leading-tight">Continue the conversation</h2></div>
      <div className="mt-5 sm:mt-0">
        <PlatformLinks/>
      </div></div></section>
    <AboutPodcast/>
    <Episodes episodes={items}/>
    <Learning/><Hosts/><Newsletter/></div>}
