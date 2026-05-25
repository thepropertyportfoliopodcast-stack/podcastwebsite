import React from "react";
import Image from "next/image";
import { MdOutlineHeadphones } from "react-icons/md";
import Link from "next/link";

function HeroSection() {
  return (
    <section className="relative min-h-[600px] xl:h-[500px] xl:h-[860px] flex items-center justify-center pt-[20px] mt-[70px] md:mt-[80px]">
      <div className="mx-auto container py-[20px] py-[0] xl:max-w-[1310px] px-4 text-white flex flex-col lg:flex-row items-center justify-between gap-[20px]">
        {/* Left Content */}
        <div className="max-w-[100%] lg:max-w-[60%] text-center lg:text-left">
          {/* <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
             VOICE THAT
            <span className="text-theme block lg:inline"> Matters </span>
          </h1> */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-[40px] xl:text-[30px] uppercase font-[700] font-work leading-[1.15] tracking-[-1px]">
          Bringing Expert Property Conversations for Your Stronger Property 
            <span className="text-theme inline"> Portfolios</span>
          </h1>

          <p className="mt-4 text-[18px] md:text-[20px] font-outfit text-white text-justify">
            Step behind the scenes with the sharpest minds of the Australian property market revealing proven strategies, timing secrets, and calculated risks that turn good portfolios into great ones.
          </p>
           <Link
              href={"/episode"} className="mt-[20px] lg:mt-[30px] xl:mt-[30px] flex items-center gap-2 px-6 py-3 rounded-full text-[20px] font-semibold bg-theme mx-auto lg:mx-0 cursor-pointer w-fit">
            <MdOutlineHeadphones size={30} />
            Listen Now
          </Link>
        </div>
        {/* Right Image */}
        <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-[40%]">
          <div className="relative overflow-hidden rounded-xl shadow-lg">
            <Image
              src="/heroimg01.jpg"
              alt="Podcast Host"
              width={600}
              height={350}
              className="object-cover w-full h-auto"
            />
          </div>
        </div>
      </div>
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/herobanner.jpg')] bg-no-repeat bg-center bg-cover z-[-1]" />
    </section>
  );
}

export default HeroSection;
