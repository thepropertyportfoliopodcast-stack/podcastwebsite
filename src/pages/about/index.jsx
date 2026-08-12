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
        <div className="pointer-events-none absolute -left-[28rem] top-20 h-[900px] w-[900px] rounded-full bg-[radial-gradient(circle,rgba(252,24,216,.28)_0%,rgba(151,71,255,.16)_38%,transparent_70%)] blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-[30rem] top-[65rem] h-[980px] w-[980px] rounded-full bg-[radial-gradient(circle,rgba(151,71,255,.3)_0%,rgba(252,24,216,.14)_42%,transparent_72%)] blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-[30rem] bottom-[10rem] h-[900px] w-[900px] rounded-full bg-[radial-gradient(circle,rgba(252,24,216,.18),transparent_68%)] blur-3xl" aria-hidden="true" />
        <div className="relative space-y-16 px-4 sm:px-6 md:space-y-24 lg:px-8">
          <section className="mx-auto max-w-[1310px]">
            <div className="overflow-hidden rounded-[34px] border border-white/10 bg-white/[.035] shadow-2xl backdrop-blur">
              <NewVoice />
            </div>
          </section>
          <section className="relative mx-auto max-w-[1380px] py-4 md:py-8">
            <MeetYourHost />
          </section>
          <div className="relative mx-auto max-w-[1310px]">
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
