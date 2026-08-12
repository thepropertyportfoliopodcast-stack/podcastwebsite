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
      <div className="relative isolate overflow-hidden bg-[#070707]">
        <div className="pointer-events-none absolute -left-[28rem] top-[48rem] h-[920px] w-[920px] rounded-full bg-[radial-gradient(circle,rgba(252,24,216,.28)_0%,rgba(151,71,255,.16)_38%,transparent_70%)] blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-[30rem] top-[92rem] h-[980px] w-[980px] rounded-full bg-[radial-gradient(circle,rgba(151,71,255,.3)_0%,rgba(252,24,216,.14)_40%,transparent_72%)] blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-[26rem] bottom-[12rem] h-[840px] w-[840px] rounded-full bg-[radial-gradient(circle,rgba(151,71,255,.2),transparent_68%)] blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto max-w-[1440px]">
          <HeroSection />
        </div>

        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <InvestorSection />
        </div>

        <section className="relative py-14 md:py-24">
          <Podcast initialEpisodes={initialEpisodes} />
        </section>

        <section className="relative py-12 md:py-20">
          <Learn />
        </section>
        <div className="relative pb-8 md:pb-12">
          <NewsletterBanner />
        </div>
      </div>
      {/* <TopicsGrid /> */}
      {/* <WhyChooseUs /> */}
    
    </Layout>
  );
}
