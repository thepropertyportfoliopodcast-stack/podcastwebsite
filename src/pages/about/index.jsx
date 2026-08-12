import Layout from "@/layout/Layout";
import React from "react";
import MeetYourHost from "./MeetYourHost";
import Mission from "./mission";
import NewVoice from "./NewVoice";
import Vision from "./Vision";
import Approach from "./Approach";

const Index = () => {
  return (
    <Layout>
      <main className="relative isolate overflow-hidden bg-[#070707] pb-24 pt-[118px] lg:pt-[128px]">
        <div className="pointer-events-none absolute -left-[26rem] top-20 h-[780px] w-[780px] rounded-full bg-[radial-gradient(circle,#fc18d8_0%,#9747ff_38%,transparent_70%)] opacity-35 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-[28rem] top-[70rem] h-[820px] w-[820px] rounded-full bg-[radial-gradient(circle,#9747ff_0%,#fc18d8_42%,transparent_72%)] opacity-30 blur-3xl" aria-hidden="true" />
        <div className="relative space-y-16 md:space-y-24">
          <section className="mx-auto max-w-[1310px] px-4">
            <div className="overflow-hidden rounded-[34px] border border-white/10 bg-white/[.035] shadow-2xl backdrop-blur">
              <NewVoice />
            </div>
          </section>
          <section className="relative border-y border-white/10 bg-black/20 py-14 md:py-20">
            <MeetYourHost />
          </section>
          <div className="relative mx-auto max-w-[1310px] px-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Vision />
              <Mission />
            </div>
            <div className="mt-8 overflow-hidden rounded-[30px] border border-white/10 bg-white/[.035] px-4 backdrop-blur md:px-8">
              <Approach />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Index;
