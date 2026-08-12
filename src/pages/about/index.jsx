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
      <main className="relative isolate overflow-hidden bg-[#070707] pb-20 pt-[118px] lg:pt-[128px]">
        <div className="pointer-events-none absolute -left-[26rem] top-20 h-[780px] w-[780px] rounded-full bg-[radial-gradient(circle,#fc18d8_0%,#9747ff_38%,transparent_70%)] opacity-35 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-[28rem] top-[70rem] h-[820px] w-[820px] rounded-full bg-[radial-gradient(circle,#9747ff_0%,#fc18d8_42%,transparent_72%)] opacity-30 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <NewVoice />
          <MeetYourHost />
          <div className="relative mx-auto mt-12 max-w-[1310px] px-4 md:mt-20">
            <div className="grid gap-5 md:grid-cols-2">
              <Vision />
              <Mission />
            </div>
            <Approach />
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Index;
