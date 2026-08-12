import React from "react";
import Image from "next/image";
import { MdOutlineHeadphones } from "react-icons/md";
import Link from "next/link";

function HeroSection() {
  return (
    <section className="relative isolate mt-[70px] flex min-h-[620px] items-center overflow-hidden md:mt-[80px] xl:min-h-[700px]">
      <div className="absolute inset-0 -z-[1] bg-gradient-to-r from-black/85 via-black/55 to-black/25" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-48 top-1/2 -z-[1] h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(252,24,216,.24),transparent_68%)] blur-3xl" aria-hidden="true" />
      <div className="mx-auto container flex flex-col items-center justify-between gap-10 px-4 py-16 text-white xl:max-w-[1310px] lg:flex-row">
        {/* Left Content */}
        <div className="max-w-[760px] text-center lg:w-[58%] lg:text-left">
          {/* <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
             VOICE THAT
            <span className="text-theme block lg:inline"> Matters </span>
          </h1> */}
          <h1 className="text-3xl font-black uppercase leading-[1.08] tracking-[-1px] sm:text-4xl md:text-5xl xl:text-[58px]">
          Bringing Expert Property Conversations for Your Stronger Property 
            <span className="text-theme inline"> Portfolios</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/75 md:text-lg lg:mx-0 lg:text-left">
            Step behind the scenes with the sharpest minds of the Australian property market revealing proven strategies, timing secrets, and calculated risks that turn good portfolios into great ones.
          </p>
           <Link
              href={"/episode"} className="mt-8 flex w-fit items-center gap-2 rounded-xl bg-theme px-7 py-3.5 text-lg font-bold shadow-[0_14px_40px_rgba(151,71,255,.28)] transition hover:-translate-y-1 hover:brightness-110 mx-auto lg:mx-0">
            <MdOutlineHeadphones size={30} />
            Listen Now
          </Link>
        </div>
        {/* Right Image */}
        <div className="relative w-full max-w-xl lg:w-[42%]">
          <div className="absolute -inset-3 rounded-[30px] bg-gradient-to-br from-[#9747FF]/50 to-[#FC18D8]/25 blur-xl" aria-hidden="true" />
          <div className="relative aspect-[12/8] overflow-hidden rounded-[26px] border border-white/20 bg-[#111] p-2 shadow-2xl">
            <Image
              src="/heroimg01.jpg"
              alt="The Property Portfolio Podcast hosts discussing Australian property investing"
              fill
              sizes="(max-width: 1024px) 100vw, 520px"
              quality={85}
              className="rounded-[20px] object-cover"
            />
          </div>
        </div>
      </div>
      {/* Background */}
      <Image
        src="/herobanner.webp"
        alt=""
        fill
        priority
        fetchPriority="high"
        loading="eager"
        sizes="100vw"
        quality={88}
        className="-z-10 object-cover object-center"
      />
    </section>
  );
}

export default HeroSection;
