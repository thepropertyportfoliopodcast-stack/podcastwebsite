import React from "react";
import dynamic from "next/dynamic";
import Layout from "../../layout/Layout";
import HeroSection from "./HeroSection";
import InvestorSection from "./InvestorSection";
const Learn = dynamic(() => import("./Learn"));
const Podcast = dynamic(() => import("./Podcast"));
const NewsletterBanner = dynamic(() => import("@/common/NewsletterBanner"));
export default function Main({ initialEpisodes = [] }) {
  return (
    <Layout>
      <div className="mx-auto max-w-[1440px]">
        <HeroSection />
      </div>

      <div className="mx-auto max-w-[1440px]">
        <InvestorSection />
      </div>
      
      <section className="relative isolate overflow-hidden border-y border-white/10 py-12 md:py-20">
        <div className="pointer-events-none absolute -left-[24rem] bottom-[-20rem] h-[760px] w-[760px] rounded-full bg-[radial-gradient(circle,rgba(252,24,216,.42)_0%,rgba(151,71,255,.24)_38%,transparent_70%)] blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-[25rem] top-[-18rem] h-[780px] w-[780px] rounded-full bg-[radial-gradient(circle,rgba(151,71,255,.42)_0%,rgba(252,24,216,.2)_40%,transparent_72%)] blur-3xl" aria-hidden="true" />
        <Podcast initialEpisodes={initialEpisodes} />
      </section>

      {/* <MeetYourHost /> */}
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#070707] py-8 md:py-14">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(151,71,255,.16),transparent_68%)] blur-3xl" aria-hidden="true" />
        <Learn />
      </section>
      {/* <Testimonials /> */}  
      <NewsletterBanner />
      {/* <TopicsGrid /> */}
      {/* <WhyChooseUs /> */}
    
    </Layout>
  );
}
