import { useState, useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaMicrophoneAlt, FaRegLightbulb, FaCubes, FaChartBar, FaSyncAlt, FaMapSigns } from "react-icons/fa";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { PiMedal } from "react-icons/pi";
import StatCard from "@/components/home/StatCard";

const hosts = [
  { name: "Parag Dixit", role: "MORTGAGE & INVESTMENT STRATEGY EXPERT", image: "/paragimg.jpg", bio: "Parag brings a unique dual perspective as both a mortgage specialist and a successful property investor. With over 25 years in financial services, he's the founding director of Nfinity Financials and PropWealth and was recently recognised as one of Australia's Top 10 Elite Brokers of 2024. His firsthand experience makes him uniquely positioned to guide financing and property investment strategies.", badges: ["Wealth Strategist", "Mortgage Expert"] },
  { name: "Julius Dabre", role: "PROPERTY ACQUISITION SPECIALIST", image: "/juliusimg.jpg", bio: "As Founder of PropWealth, Julius has orchestrated over $67 million in property transactions. His specialty lies in identifying high-growth suburbs before they become mainstream, combining profound market trend analysis with practical, actionable advice that has empowered over 100,000 investors.", badges: ["Property Expert", "Market Trends Lead"] },
  { name: "Mudit Khandelwal", role: "STRATEGIC FINANCE DIRECTOR", image: "/muditimg.jpg", bio: "An alumnus of IIT Kanpur and IIM Ahmedabad, Mudit brings academic excellence and real-world mastery to every client interaction. As Director at Nfinity Financials, this 5-star-rated mortgage broker has earned over 200 five-star reviews and transforms complex financial scenarios into clear pathways to property wealth.", badges: ["Strategic Finance", "Mortgage Broker"] },
];

const approaches = [
  [<FaCubes size={22} />, "Personally stress-tested frameworks"],
  [<FaChartBar size={22} />, "Data-driven case studies"],
  [<FaSyncAlt size={22} />, "Strategies tested through market cycles"],
  [<FaMapSigns size={22} />, "A pathway for each investor stage"],
];

export default function About() {
  const [activeApproach, setActiveApproach] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setActiveApproach((current) => (current + 1) % approaches.length),
      3500,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <PublicLayout>
      <main className="about-modern overflow-hidden pt-[80px] sm:pt-[40px]">
        
        {/* Hero Section */}
        <section className="about-hero-shell relative grid items-center gap-10 py-6 md:py-16">
          <div className="about-hero-copy relative z-10 w-full text-center sm:text-left">
            <p className="mb-5 inline-flex items-center gap-3 text-xs font-black uppercase tracking-[.22em] text-[#76239e]">
              <span className="h-px w-8 bg-[#76239e]" /> Our story
            </p>
            <h1 className="text-4xl font-black leading-[.98] text-[#211628] sm:text-5xl lg:text-6xl">
              Real Property Conversations. <span className="text-theme">Clearer Decisions.</span>
            </h1>
            <p className="mt-7 text-base leading-7 text-[#6f6278] sm:text-lg w-full">
              We engage with investors who have experienced the pitfalls, rejoiced in the successes, and discovered what truly succeeds in Australian property. We translate complex investment thinking into practical frameworks smart investors can use.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center sm:justify-start">
              <Link href="/episode" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#9747FF] to-[#FC18D8] px-6 py-3 font-bold text-white shadow-lg shadow-[#9747FF]/20">
                Explore episodes <FaArrowRight aria-hidden="true" />
              </Link>
              <Link href="/contact" className="text-[#C347FF] inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#C347FF] bg-[#C347FF]/20 px-5 font-bold transition hover:border-[#C347FF]/60">
                Start a conversation
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 w-full">
              {[
                ['23+', 'Combined years'],
                ['$67m+', 'Transactions'],
                ['100k+', 'Investors reached'],
                ['200+', 'Five-star reviews']
              ].map(([value, label]) => (
                <StatCard key={label} statStr={value} label={label} />
              ))}
            </dl>
          </div>
          <div className="about-hero-media relative">
            <div className="absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(151,71,255,.2),transparent_68%)] blur-2xl" aria-hidden="true" />
            <div className="relative aspect-[6/5] overflow-hidden rounded-[32px] border border-[#dac8e4] bg-white p-2 shadow-[0_30px_80px_rgba(77,33,95,.18)]">
              <Image src="/aboutimg.jpg" alt="The Property Portfolio Podcast team" fill priority sizes="(max-width:1023px) calc(100vw - 32px), 650px" className="rounded-[25px] object-cover" />
            </div>
          </div>
        </section>

        {/* Meet Hosts Section */}
        <section className="about-hosts-shell mx-auto max-w-[1310px] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 w-full text-center sm:text-left">
            <p className="text-xs font-black text-center tracking-[.22em] text-[#76239e]">MEET YOUR HOSTS</p>
            <h2 className="mt-3 text-3xl font-black text-center text-[#211628] sm:text-4xl">Three Perspectives. One Complete Property Conversation.</h2>
            <p className="mt-4 leading-7 text-center text-[#6f6278] w-full">Together, Parag, Julius and Mudit bring mortgage mastery, strategic financing and acquisition expertise together under one educational platform.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {hosts.map(host => (
              <article key={host.name} className="group overflow-hidden rounded-[26px] border border-[#ded2e7] bg-white shadow-[0_18px_50px_rgba(60,32,72,.09)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(118,35,158,.14)]">
                <div className="relative aspect-[6/5] overflow-hidden bg-[#f1eaf4]">
                  <Image src={host.image} alt={host.name} fill sizes="(max-width:1023px) 100vw, 420px" className="object-cover object-top transition duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="p-6">
                  <p className="text-xs font-black tracking-[.16em] text-[#76239e]">{host.role}</p>
                  <h3 className="mt-2 line-clamp-2 text-2xl font-black text-[#211628]">{host.name}</h3>
                  <p className="mt-4 line-clamp-4 text-sm leading-6 text-[#6f6278]">{host.bio}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {host.badges.map((badge,index) => (
                      <span key={badge} className="inline-flex items-center gap-1.5 rounded-full bg-[#f3e9f8] px-3 py-1.5 text-xs font-bold text-[#6e218f]">
                        {index ? <MdOutlinePeopleAlt aria-hidden="true" /> : <PiMedal aria-hidden="true" />}{badge}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Unified Vision, Mission & Approach - Perfectly Balanced Split Layout */}
        <section className="relative isolate overflow-hidden py-16 sm:py-10">
          
          {/* Ambient Light Theme Background */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#f3e8ff] opacity-70 blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#fce7f3] opacity-70 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute inset-0 bg-[radial-gradient(#e0d4e7_1px,transparent_1px)] [background-size:24px_24px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"></div>
          </div>

          <div className="about-framework-shell mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            {/* items-stretch ensures both columns are exactly the same height */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-stretch">
              
              {/* Left Column: Our Approach */}
              <div className="relative flex flex-col justify-center">
                <div className="mb-8 w-full text-left">
                  <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#e0d4e7] bg-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#76239e] shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FC18D8] animate-pulse"></span>
                    OUR APPROACH
                  </span>
                  <h2 className="text-3xl font-black text-[#211628] sm:text-4xl">Advice Grounded in Evidence, Experience and Context.</h2>
                  <p className="mt-4 text-sm leading-7 text-[#6f6278] max-w-md">We do not believe in one-size-fits-all advice. Every investor has a different risk tolerance, financial position and life stage.</p>
                </div>

                {/* flex-1 makes the list stretch to fill available height */}
                <div className="flex flex-col gap-4 flex-1 justify-center">
                  {approaches.map(([icon, title], i) => (
                    <div
                      key={title}
                      className={`relative flex items-center gap-5 p-4 rounded-2xl transition-all duration-500 overflow-hidden border ${
                        activeApproach === i 
                          ? "bg-white border-transparent shadow-[0_15px_40px_-15px_rgba(118,35,158,0.25)] scale-[1.02]" 
                          : "bg-transparent border-transparent hover:bg-white/50"
                      }`}
                    >
                      {/* Left Accent Bar for active item */}
                      {activeApproach === i && (
                        <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-gradient-to-b from-[#9747FF] to-[#FC18D8]"></div>
                      )}

                      {/* Auto-filling Progress Bar */}
                      {activeApproach === i && (
                        <div className="about-approach-progress absolute bottom-0 left-0 h-1 rounded-tr-full bg-gradient-to-r from-[#9747FF] to-[#FC18D8]"></div>
                      )}
                      
                      {/* Icon Container */}
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-500 ${
                        activeApproach === i 
                          ? "bg-gradient-to-br from-[#9747FF] to-[#FC18D8] text-white shadow-lg shadow-[#FC18D8]/30" 
                          : "bg-[#f3e9f8] text-[#a882bf]"
                      }`}>
                        {icon}
                      </div>
                      
                      {/* Text Content */}
                      <div className={`flex flex-col transition-all duration-500 ${activeApproach === i ? "opacity-100 translate-x-1" : "opacity-60 translate-x-0"}`}>
                        <span className={`text-[10px] font-black transition-colors duration-500 ${activeApproach === i ? "text-[#9747FF]" : "text-transparent"}`}>0{i + 1}</span>
                        <span className={`text-base font-extrabold transition-colors duration-500 ${activeApproach === i ? "text-[#211628]" : "text-[#6f6278]"}`}>{title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Vision & Mission (Stretched & Centered) */}
              <div className="flex flex-col gap-6 justify-center h-full">
                
                {/* Vision Card (flex-1 makes it stretch to match left column) */}
                <article className="group relative flex flex-col flex-1 justify-center gap-4 overflow-hidden rounded-[28px] border border-[#e0d4e7] bg-white p-6 shadow-[0_20px_60px_-15px_rgba(118,35,158,0.15)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_70px_-15px_rgba(118,35,158,0.25)] sm:p-8">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#9747FF]/10 blur-3xl transition-transform duration-700 group-hover:scale-125"></div>
                  
                  {/* Header Row */}
                  <div className="relative z-10 flex flex-row items-center gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#9747FF] to-[#FC18D8] text-white shadow-lg shadow-[#9747FF]/30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <FaRegLightbulb size={26} aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] font-black tracking-[0.25em] text-[#76239e]">OUR VISION</p>
                      <h2 className="mt-1 text-xl font-black leading-tight text-[#211628] sm:text-2xl">Helping Australians Build Lasting Wealth through Property.</h2>
                    </div>
                  </div>

                  {/* Full Width Description */}
                  <p className="relative z-10 text-sm leading-7 text-[#6f6278]">We see a future where background, postcode, or starting point no longer decides who can build a strong property portfolio. Property investing should be a path open to anyone willing to learn, plan, and take action.</p>
                </article>

                {/* Mission Card (flex-1 makes it stretch to match left column) */}
                <article className="group relative flex flex-col flex-1 justify-center gap-4 overflow-hidden rounded-[28px] border border-[#e0d4e7] bg-gradient-to-br from-white to-[#fdf2ff] p-6 shadow-[0_20px_60px_-15px_rgba(252,24,216,0.15)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_70px_-15px_rgba(252,24,216,0.25)] sm:p-8">
                  <div className="pointer-events-none absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-[#FC18D8]/10 blur-3xl transition-transform duration-700 group-hover:scale-125"></div>
                  
                  {/* Header Row */}
                  <div className="relative z-10 flex flex-row items-center gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-[#76239e] shadow-lg shadow-[#FC18D8]/20 transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-[#9747FF] group-hover:to-[#FC18D8] group-hover:text-white group-hover:scale-110 group-hover:-rotate-3">
                      <FaMicrophoneAlt size={24} aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] font-black tracking-[0.25em] text-[#76239e]">OUR MISSION</p>
                      <h2 className="mt-1 text-xl font-black leading-tight text-[#211628] sm:text-2xl">Making Property Education Practical and Accessible.</h2>
                    </div>
                  </div>

                  {/* Full Width Description */}
                  <p className="relative z-10 text-sm leading-7 text-[#6f6278]">We close the knowledge gap that keeps capable Australians on the sidelines by sharing conversations that simplify the process and give people confidence to take the next step.</p>
                </article>

              </div>
            </div>
          </div>
        </section>

      </main>
    </PublicLayout>
  );
}