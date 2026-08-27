import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaApple, FaBinoculars, FaBuilding, FaComments, FaPiggyBank, FaPlay, FaShieldAlt, FaSpotify, FaYoutube, FaMicrophoneAlt, FaMicrophone } from "react-icons/fa";
import { HiOutlineCalculator, HiOutlineSearch } from "react-icons/hi";
import { MdArrowOutward, MdMic } from "react-icons/md";
import { addSubscriber, publicApiError } from "@/services/publicApi";
import { contentPath } from "@/utils/seo";
import HeroPhones from "@/components/home/HeroPhones";
import PublicEpisodeCard from "@/components/episodes/PublicEpisodeCard";

const platforms = {
  youtube: "https://www.youtube.com/@ThePropertyPortfolioPodcast",
  spotify: "https://open.spotify.com/show/7BWrKVuUSeX1Qat3VEjUaU",
  apple: "https://podcasts.apple.com/us/podcast/the-property-portfolio-podcast/id1876516932",
};

function episodeNumber(episode) { return episode?.episodeNumber ? `EP. ${episode.episodeNumber}` : "LATEST EPISODE"; }
function duration(episode) { const minutes=Number(episode?.duration)||(Number(episode?.durationInSec)?Math.ceil(Number(episode.durationInSec)/60):0); return minutes ? `${minutes} mins` : ""; }
function Waveform({ compact = false }) {
  const bars = [30,55,82,42,68,94,52,78,38,88,60,96,46,72,34,84,55,91,44,70,36,76,48,86,58,92,40,74];
  return <div className={`home-wave flex items-center gap-1 ${compact ? "h-8" : "h-14"}`} aria-hidden="true">{bars.map((height,index)=><span key={index} className="w-1 flex-1 rounded-full bg-gradient-to-t from-[#7d2dc2] to-[#d45aff]" style={{height:`${height}%`,animationDelay:`${index * 45}ms`}} />)}</div>;
}
function PlatformLinks({ compact = false }) {
  const items = [
    [platforms.youtube, "YouTube", "Watch episodes", FaYoutube, "platform-youtube"],
    [platforms.spotify, "Spotify", "Follow the show", FaSpotify, "platform-spotify"],
    [platforms.apple, "Apple Podcasts", "Listen on Apple", FaApple, "platform-apple"],
  ];

  if (compact) {
    return <div className="flex flex-wrap gap-4">{items.map(([href,label,,Icon])=><a key={label} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8d2dcc]"><Icon aria-hidden="true" />{label}</a>)}</div>;
  }

  return <div className="home-platform-link-grid">{items.map(([href,label,action,Icon,brandClass])=><a key={label} href={href} target="_blank" rel="noopener noreferrer" className={`home-platform-link ${brandClass}`}><span className="home-platform-icon"><Icon aria-hidden="true" /></span><span className="home-platform-link-copy"><strong>{label}</strong><small>{action}</small></span><MdArrowOutward className="home-platform-arrow" aria-hidden="true" /></a>)}</div>;
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
  return <>
  <section className="home-hero relative isolate overflow-hidden pb-[clamp(3rem,7vh,6rem)] pt-[clamp(10rem,15vh,8.75rem)] lg:min-h-[min(820px,100svh)]">
    <div className="absolute inset-0 -z-20 bg-[#07070B]"/>
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_36%,rgba(168,55,244,.24),transparent_34%),radial-gradient(circle_at_12%_55%,rgba(100,38,145,.22),transparent_35%),linear-gradient(180deg,#0e0917_0%,#07070b_82%)]"/>
    <div className="absolute inset-x-0 bottom-0 -z-10 h-64 opacity-25 [background-image:linear-gradient(90deg,transparent_49%,rgba(195,71,255,.22)_50%,transparent_51%),linear-gradient(rgba(195,71,255,.15)_1px,transparent_1px)] [background-size:54px_54px] [mask-image:linear-gradient(to_top,black,transparent)]"/>
    <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:px-10 xl:px-12">
      <div>
        <h1 className="mt-4 text-[clamp(2.65rem,4.4vw,4.35rem)] font-black leading-[.96] tracking-[-.045em]">Better Property Decisions<br></br> 
          <span className="mt-4 text-[clamp(2.65rem,4.4vw,4.35rem)] font-black leading-[.96] tracking-[-.045em]"> Start With </span> 
          <span className="block text-[#C347FF] font-black text-[clamp(2.65rem,4.4vw,4.35rem)] leading-[.96] tracking-[-.045em]">Intelligence</span>
        </h1>
        <p className="mt-6 max-w-xl text-content-justify-all text-base leading-7 text-[#A837F4]">Australian property conversations covering market trends, suburb research, finance and the strategies investors use when deciding what, where and when to buy.</p>
        <div className="mt-7 grid gap-3 sm:flex">
          <Link href={latest ? contentPath("episode",latest) : "/episode"} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8c2ed3] to-[#C347FF] px-5 font-bold transition hover:-translate-y-0.5 hover:brightness-110">
          <FaPlay size={13}/>Watch latest episode
          </Link>
          <Link href="/episode" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-[#64237f] bg-white/85 px-5 font-bold text-[#64237f] transition hover:bg-white"><FaMicrophoneAlt size={18} />Browse episodes
          </Link>
          </div></div><HeroPhones phones={heroPhones} episodes={[latest, ...episodes].filter(Boolean)}/></div>
  </section></>;
}
const features=[[MdMic,"Expert Perspectives","Real conversations with experienced investors and industry leaders."],[FaPiggyBank,"Practical Strategies","Actionable insights you can apply to property and lending decisions."],[HiOutlineSearch,"Clear & Honest","Straight conversations about the market, risks and opportunities ahead."]];

function AboutPodcast(){
         return <section id="home-about-podcast" className="home-section home-about">
          <div className="home-container grid items-center gap-10 lg:grid-cols-[.48fr_.52fr]">
            <div className="home-about-image relative aspect-[6/5] overflow-hidden rounded-[22px] border border-[#C347FF]/35 shadow-[0_20px_70px_rgba(99,23,140,.35)]">
            <Image src="/conversation.png" alt="Parag Dixit, Mudit Khandelwal and Julius Dabre" fill priority fetchPriority="high" quality={70} sizes="(max-width:1023px) calc(100vw - 40px), 560px" className="object-cover"/>
            </div>
            <div className="home-about-copy">
              <p className="home-eyebrow">ABOUT THE PODCAST</p>
              <h2 className="home-title">Property Discussions Built Around Real Questions</h2>
              <p className="home-copy mt-5">Our podcast brings real stories, fresh perspectives and direct conversations from voices that matter in Australian finance and property.</p>
              <div className="home-about-features mt-8 grid gap-5 bg-transparent sm:grid-cols-3 ">{features.map(([Icon,title,text])=>
                <div key={title} className={"premium-featureCard"}>
                  <span className={`premium-featureIcon mx-auto flex h-11 w-11 items-center justify-center rounded-xl`}>
                    <Icon size={21}/>
                  </span>
                  <h3 className={`premium-featureTitle mt-3 font-bold text-center`}>{title}</h3>
                  <p className={`premium-featureText mt-2 line-clamp-3 text-center text-sm leading-6`}>{text}</p>
                </div>)}
              </div>
              <Link href="/about" className={`premium-aboutLink home-about-link mt-8 inline-flex items-center gap-2 border-b pb-1 font-bold`}>Meet the hosts <MdArrowOutward/></Link>
            </div>
          </div></section>}


function Episodes({episodes}){
  const source=Array.isArray(episodes)?episodes:[];
  const items=source.slice(0,3);
  return <section className="home-section home-episodes pt-0">
    <div className="home-container">
      <div className="flex items-end justify-between gap-5">
        <div className={"premium-sectionHeading"}>
          <p className="home-eyebrow">FEATURED CONVERSATIONS</p>
          <h2 className="home-title">Latest Episodes</h2>
        </div>
        <Link href="/episode" className="premium-desktopViewAll mb-1 inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[#64237f] px-5 text-sm font-bold text-[#64237f]">View all episodes <MdArrowOutward aria-hidden="true" /></Link>
      </div>{items.length?<div className="home-episode-grid mt-8 grid items-stretch gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{items.map(episode=><PublicEpisodeCard key={episode.uuid||episode.id} episode={episode} />)}</div>:<p className="mt-8 text-center text-[#8F879B]">Featured episodes will appear here when selected in the dashboard.</p>}
      <div className={"premium-mobileViewAllWrap"}><Link href="/episode" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#64237f] px-5 text-sm font-bold text-[#64237f]">View all episodes <MdArrowOutward aria-hidden="true" /></Link></div>
    </div></section>}


const lessons=[["Market Movements","Short takes on how the Australian property market is shifting.",FaBuilding],["Investment Strategy","Different ways people are building and managing property portfolios.",FaPiggyBank],["Risk and Due Diligence","Honest talk about challenges, mistakes and lessons learned.",FaShieldAlt],["Finance and Borrowing","Financing considerations and the numbers that matter.",HiOutlineCalculator],["Property Stories","Real experiences from investors and experts shaping the market.",FaComments],["Future Outlook","Where the property market might be heading and what to watch next.",FaBinoculars]];

function Learning() {
  return (
    <section className="home-section home-learning">
      <div className="home-container">
        <div className="home-learning-head">
          <div>
            <p className="home-eyebrow">ON THIS FREQUENCY</p>
            <h2 className="home-title">What You'll Learn</h2>
          </div>
          <p className="home-copy home-learning-intro">
            Every episode is packed with actionable insights to help you make smarter property decisions.
          </p>
        </div>

        <div className="home-learning-grid">
          {lessons.map(([title, text, Icon], i) => (
            <article key={title} className="home-learning-card" style={{ '--i': i }}>
              <span className="home-learning-icon-ghost" aria-hidden="true">
                <Icon size={150} />
              </span>
              <div className="home-learning-card-top">
                <span className="home-learning-track">
                  <span className="home-learning-dot" />
                  TRACK {String(i + 1).padStart(2, '0')}
                </span>
                <span className="home-learning-bars" aria-hidden="true">
                  <span /><span /><span /><span /><span />
                </span>
              </div>
              <div className="home-learning-body">
                <span className="learning-icon inline-flex items-center justify-center rounded-2xl border border-[#C347FF]/35 bg-[#C347FF]/10 text-[#DDBBFF]">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


function Hosts({ hosts: suppliedHosts = [] }) {
  const sourceHosts = Array.isArray(suppliedHosts) ? suppliedHosts : [];
  const hosts = [...sourceHosts]
    .filter((host) => !host.isGuestOnly && host.isActive !== false)
    .sort((a, b) => {
      const aOrder = Number(a.displayOrder);
      const bOrder = Number(b.displayOrder);
      const normalizedA = aOrder > 0 ? aOrder : Number.MAX_SAFE_INTEGER;
      const normalizedB = bOrder > 0 ? bOrder : Number.MAX_SAFE_INTEGER;
      return normalizedA - normalizedB || String(a.name).localeCompare(String(b.name));
    })
    .slice(0, 3);

  if (!hosts.length) return null;

  return (
    <section className="home-section home-hosts pt-0">
      <div className="home-container">
        <div className="home-hosts-head mx-auto max-w-2xl text-center">
          <p className="home-eyebrow">LIVE ON MIC</p>
          <h2 className="home-title">Meet The Minds Behind The Mic</h2>
        </div>
        <div className="home-host-grid mt-8 grid gap-5 md:grid-cols-3">
          {hosts.map((host, i) => (
            <Link
              href={`/host/${host.slug}`}
              key={host.slug}
              className="home-host-card group grid grid-cols-[110px_1fr] overflow-hidden rounded-[20px] border border-white/10 transition hover:border-[#C347FF]/55 sm:grid-cols-[140px_1fr] md:grid-cols-1"
              style={{ '--i': i }}
            >
              <div className="home-host-image relative md:aspect-[5/4]">
                <Image
                  src={host.image}
                  alt={host.name}
                  fill
                  sizes="(max-width:767px) 140px, 33vw"
                  className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                />
                <span className="home-host-onair">
                  <span className="home-host-onair-dot" /> ON AIR
                </span>
                {/* <span className="home-host-index">HOST {String(i + 1).padStart(2, '0')}</span> */}
                <span className="home-host-scan" aria-hidden="true" />
              </div>
              <div className="home-host-body p-5">
                <span className="home-host-icon-ghost" aria-hidden="true">
                  <FaMicrophone />
                </span>
                <h3 className="text-lg font-black">{host.name}</h3>
                <p className="mt-1 text-sm">{host.designation}</p>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#8F879B]">{host.shortBio}</p>
                {/* {host.linkedinUrl && (
                  <button
                    type="button"
                    className="home-host-social"
                    aria-label={`${host.name} on LinkedIn`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(host.linkedinUrl, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    <FaLinkedin />
                  </button>
                )} */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


  function Newsletter(){const[email,setEmail]=useState("");
    const[loading,setLoading]=useState(false);
    const[message,setMessage]=useState("");
    const submit=async(e)=>{e.preventDefault();setMessage("");
      if(!/^\S+@\S+\.\S+$/.test(email)){setMessage("Please enter a valid email address.");
        return;}setLoading(true);
        try{await addSubscriber({email});
        setEmail("");
        setMessage("You’re subscribed. Thank you!");
        toast.success("Thank you for subscribing!");
      }catch(error) {setMessage(publicApiError(error,"Subscription failed. Please try again."));
      }finally{setLoading(false);}};
      return <section className="home-newsletter">
        <div className="home-container">
          <div className="relative overflow-hidden rounded-[22px] border border-[#C347FF]/35 p-6 sm:p-9">
            <div className="home-newsletter-content relative max-w-2xl">
              <h2 className="text-2xl font-black sm:text-3xl">Property Conversations, New Episodes and Market Updates</h2>
              <p className="mt-2 text-[#B8B0C3]">Receive new Episodes and selected Australian Property-market discussions in your inbox.</p>
              <form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row">
                <label htmlFor="home-newsletter" className="sr-only">Email address</label>
                <input id="home-newsletter" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your email" className="min-h-12 min-w-0 flex-1 rounded-xl border border-white/20 bg-black/25 px-4 text-white outline-none focus:border-[#C347FF]"/>
                <button disabled={loading} className="min-h-12 rounded-xl bg-[#76239e] px-8 font-bold !text-white disabled:opacity-60">{loading?"Subscribing…":"Subscribe"}</button>
              </form>
              <p className="mt-3 min-h-5 text-sm text-[#DDBBFF]" role="status" aria-live="polite">{message}</p>
              <p className="text-xs text-[#8F879B]">By subscribing, you agree to receive podcast updates. You can unsubscribe at any time.</p>
            </div>
            <div className="home-newsletter-art" aria-hidden="true">
              <Image src="/newsletter-3d.webp" alt="" fill sizes="(min-width: 1280px) 360px, (min-width: 768px) 30vw, 0px" className="object-contain"/>
            </div>
          </div>
        </div>
      </section>}


  export default function PremiumHomepage({episodes=[],latestEpisode=null,heroPhones=[],hosts=[]}){const suppliedItems=Array.isArray(episodes)?episodes:[];const items=suppliedItems;
  const configuredPhones=Array.isArray(heroPhones)?heroPhones:[];
  return <div className={`premium-page home-premium overflow-hidden bg-[#07070B] text-[#F8F5FA]`}>
    <Hero latest={latestEpisode || items[0] || null} episodes={items} heroPhones={configuredPhones}/>
    {/* <section className="home-platforms home-container">
      <div className="home-platform-card">
        <span className="home-platform-glow home-platform-glow-left" aria-hidden="true" />
        <span className="home-platform-glow home-platform-glow-right" aria-hidden="true" />
        <div className="home-platform-copy">
          <div className="home-platform-kicker"><FaMicrophoneAlt aria-hidden="true" /><span>Choose your platform</span></div>
          <h2>Continue the conversation</h2>
          <p>New property conversations, wherever you listen.</p>
        </div>
        <PlatformLinks/>
      </div>
    </section> */}
    <AboutPodcast/>
    <Episodes episodes={items}/>
     <section className="home-platforms home-container">
      <div className="home-platform-card">
        <span className="home-platform-glow home-platform-glow-left" aria-hidden="true" />
        <span className="home-platform-glow home-platform-glow-right" aria-hidden="true" />
        <div className="home-platform-copy">
          <div className="home-platform-kicker"><FaMicrophoneAlt aria-hidden="true" /><span>Choose your platform</span></div>
          <h2>Continue the conversation</h2>
          {/* <p>New property conversations, wherever you listen.</p> */}
        </div>
        <PlatformLinks/>
      </div>
    </section>
    <Learning/><Hosts hosts={hosts}/><Newsletter/></div>}
