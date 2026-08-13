import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaApple, FaFacebook, FaInstagram, FaLinkedin, FaSpotify, FaYoutube } from "react-icons/fa";
import Listing from "@/pages/api/Listing";

const social = [
  ["https://www.facebook.com/thepropertyportfoliopodcast", "Facebook", FaFacebook],
  ["https://www.instagram.com/propertyportfoliopodcast/", "Instagram", FaInstagram],
  ["https://www.linkedin.com/company/the-property-portfolio-podcast/", "LinkedIn", FaLinkedin],
  ["https://www.youtube.com/@ThePropertyPortfolioPodcast", "YouTube", FaYoutube],
  ["https://open.spotify.com/show/7BWrKVuUSeX1Qat3VEjUaU", "Spotify", FaSpotify],
  ["https://podcasts.apple.com/us/podcast/the-property-portfolio-podcast/id1876516932", "Apple Podcasts", FaApple],
];
export default function Footer() {
  const [email,setEmail]=useState(""); const[loading,setLoading]=useState(false);
  const submit=async(event)=>{event.preventDefault();if(!/^\S+@\S+\.\S+$/.test(email)){toast.error("Please enter a valid email.");return;}setLoading(true);try{await new Listing().AddSubscriber({email});setEmail("");toast.success("Thank you for subscribing!");}catch(error){toast.error(error?.response?.data?.message||"Subscription failed. Please try again.");}finally{setLoading(false);}};
  return <footer className="relative border-t border-[#C347FF]/20 bg-[linear-gradient(180deg,#0b0810_0%,#07070b_100%)] py-12 text-white before:absolute before:inset-x-0 before:top-0 before:h-20 before:bg-[radial-gradient(ellipse_at_top,rgba(168,55,244,.11),transparent_70%)]">
    <div className="relative mx-auto w-[calc(100%-40px)] max-w-[1280px] sm:w-[calc(100%-64px)]">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_.65fr_.65fr_1fr]">
        <div><Image src="/logo.webp" alt="The Property Portfolio Podcast" width={211} height={52} sizes="211px" className="h-auto w-[190px]"/><p className="mt-5 max-w-sm text-sm leading-6 text-white/55">Australian property conversations featuring investors, finance professionals and industry voices.</p><div className="mt-5 flex flex-wrap gap-3">{social.map(([href,label,Icon])=><a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} — The Property Portfolio Podcast`} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[.035] transition hover:border-[#C347FF]/60 hover:text-[#DDBBFF]"><Icon aria-hidden="true"/></a>)}</div></div>
        <div><h2 className="text-sm font-black uppercase tracking-wider">Navigation</h2><ul className="mt-5 space-y-3 text-sm text-white/60">{[["/","Home"],["/episode","Episodes"],["/about","About"],["/contact","Contact"]].map(([href,label])=><li key={href}><Link href={href} className="hover:text-white">{label}</Link></li>)}</ul></div>
        <div><h2 className="text-sm font-black uppercase tracking-wider">Legal</h2><ul className="mt-5 space-y-3 text-sm text-white/60"><li><Link href="/access" className="hover:text-white">Terms of Access</Link></li><li><Link href="/use" className="hover:text-white">Terms of Use</Link></li><li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li></ul></div>
        <div><h2 className="text-sm font-black uppercase tracking-wider">Newsletter</h2><p className="mt-5 text-sm leading-6 text-white/55">Get the latest episodes and market discussions in your inbox.</p><form onSubmit={submit} className="mt-4 flex gap-2"><label htmlFor="footer-email" className="sr-only">Email address</label><input id="footer-email" value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email address" className="min-h-11 min-w-0 flex-1 rounded-lg border border-white/15 bg-white/[.035] px-3 text-sm outline-none focus:border-[#C347FF]"/><button disabled={loading} className="min-h-11 rounded-lg bg-[#A837F4] px-4 text-xs font-bold disabled:opacity-60">{loading?"…":"Subscribe"}</button></form></div>
      </div><p className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">© {new Date().getFullYear()} The Property Portfolio Podcast. All rights reserved.</p>
    </div>
  </footer>;
}
