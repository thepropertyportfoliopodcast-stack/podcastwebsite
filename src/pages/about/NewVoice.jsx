import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function NewVoice() {
  return (
    <section className="relative pt-[10px] md:pt-[20px] lg:pt-[50px]">
      <div className="mx-auto container xl:max-w-[1310px] px-4 flex flex-col lg:flex-row items-center justify-between gap-[10px] md:gap-[25px]">
        {/* Left Content */}
        <div className="text-white w-full max-w-[100%] lg:max-w-[50%] text-center lg:text-left relative z-[2]">
          <h1 className="text-[25px] md:text-[35px] xl:text-[40px] font-work font-[800] leading-[1.15] uppercase">
           Build Your <span className="text-theme"> Financial  Freedom </span> Alongside Australia’s Leading Voices.
              
            
          </h1>
          <p className="mt-6 text-white text-base  font-outfit text-justify font-[600] text-[15px] md:text-[16px] xl:text-[18px] text-justify">
          We engage with investors who have experienced the pitfalls, rejoiced in the successes, and discovered what truly succeeds in Australian property. We engage in real conversations about firsthand deals, real numbers, and meaningful decisions. We analyse the strategies that distinguish portfolio builders from those who merely dream of property ownership. Built for investors who value practical insights over noise, we translate complex investment thinking into real frameworks that smart investors like you can actually use.

          </p>
          <div className="flex items-center justify-center flex-wrap md:flex-nowrap lg:justify-start gap-[10px] mt-[25px] mb-[25px] md:mb-[0]">
            <div className="relative w-[135px] sm:w-[150px] h-[115px] edubg ">
              <div className=" absolute top-0 bottom-0 left-0 right-0 w-[98%] h-[98%] m-auto bg-[#0F0F0F] rounded-[10px]"></div>
              <div className="relative w-full h-full text-[14px] font-[600] text-center z-1 flex items-center justify-center ">
                23+ <br /> Years Combined Experience
              </div>
            </div>

             <div className="relative  w-[135px] sm:w-[150px] h-[115px] edubg ">
              <div className=" absolute top-0 bottom-0 left-0 right-0 w-[98%] h-[98%] m-auto bg-[#0F0F0F] rounded-[10px]"></div>
              <div className="relative w-full h-full text-[14px] font-[600] text-center z-1 flex items-center justify-center ">
                Every Real Estate Basics Explained
              </div>
            </div>

             <div className="relative  w-[135px] sm:w-[150px] h-[115px] edubg ">
              <div className=" absolute top-0 bottom-0 left-0 right-0 w-[98%] h-[98%] m-auto bg-[#0F0F0F] rounded-[10px]"></div>
              <div className="relative w-full h-full text-[14px] font-[600] text-center z-1 flex items-center justify-center ">
               Real-Time Market Intelligence for Smart Decisions
              </div>
            </div>

             <div className="relative  w-[135px] sm:w-[150px] h-[115px] edubg ">
              <div className=" absolute top-0 bottom-0 left-0 right-0 w-[98%] h-[98%] m-auto bg-[#0F0F0F] rounded-[10px]"></div>
              <div className="relative w-full h-full text-[14px] font-[600] text-center z-1 flex items-center justify-center ">
               Sharing Unfiltered Conversations of Industry Leaders
              </div>
            </div>
          </div>
         

          {/* <div className="mt-6 border-l-4 border-white pl-4 text-gray-200 flex items-start justify-center lg:justify-start gap-2 text-left">
                <MdOutlineHeadphones size={22} className="mt-1 flex-shrink-0" />
                <p className="font-semibold">
                  We’re not just talking theory — we’re sharing what actually works
                  in today’s market.
                </p>
              </div> */}

          {/* <Link
                  href={"/about"} className="mt-8 px-6 py-3 inline-block rounded-md font-semibold bg-theme hover:opacity-90 transition mx-auto lg:mx-0">
                Learn More
              </Link> */}
        </div>

        {/* Right Image */}
        <div className=" w-full max-w-[100%] lg:max-w-[50%]  relative z-[2]">
          <Image
            src="/aboutimg.jpg"
            alt="Podcast Recording"
            width={700}
            height={800}
            className="rounded-xl object-cover w-full"
          />
        </div>
      </div>
    </section>
  );
}