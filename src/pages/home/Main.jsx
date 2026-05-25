import React from "react";
import Image from "next/image";
import Layout from "../../layout/Layout";
import Podcast from "./Podcast";
import HeroSection from "./HeroSection";
import InvestorSection from "./InvestorSection";
import MeetYourHost from "./MeetYourHost";
import Learn from "./Learn";
import Guide from "./Guide";
import Testimonials from "./Testimonials";

import NewsletterBanner from "@/common/NewsletterBanner";
export default function Main() {
  return (
    <Layout>
      <div className="max-w-[1440px] m-auto">
        <HeroSection />
      </div>

      <div className="max-w-[1440px] m-auto">
        <InvestorSection />
      </div>
      
      <section className="relative py-4 md:py-12 1overflow-hidden">
        <div className="absolute z-0 xl:max-w-[578px] w-full md:w-[578px] h-full md:h-[943px]  aspect-square left-[0] bottom-[-250px]  1111blurcircle rounded-r-full z-1">
          <Image
                src={"/lightpinkleft.png"}
                layout="fill"
                objectFit="cover"
                className="object-cover w-full" />
        </div>

         <div className="absolute z-0 xl:max-w-[578px] w-full md:w-[578px] h-full md:h-[943px]  aspect-square right-[0] top-[0px]  1111blurcircle rounded-r-full z-1">
          <Image
                src={"/lightpinkright.png"}
                layout="fill"
                objectFit="cover"
                className="object-cover w-full" />
        </div>
        <Podcast />
      </section>

      {/* <MeetYourHost /> */}
      <section className="bg-[#000000] relative mb-[20px] md:mb-12 overflow-hidden">
        <Learn />
      </section>
      {/* <Guide /> */}
      {/* <Testimonials /> */}  
      <NewsletterBanner />
      {/* <TopicsGrid /> */}
      {/* <WhyChooseUs /> */}
    
    </Layout>
  );
}
