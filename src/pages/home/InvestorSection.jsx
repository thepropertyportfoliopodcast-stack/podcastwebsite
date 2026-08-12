import Image from "next/image";
import Link from "next/link";
import { MdOutlineHeadphones } from "react-icons/md";

export default function InvestorSection() {
  return (
    <section className="relative isolate py-14 sm:py-24">
      <div className="pointer-events-none absolute -right-64 top-1/2 h-[620px] w-[620px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(151,71,255,.22),transparent_68%)] blur-3xl" aria-hidden="true" />
      <div className="mx-auto container flex flex-col items-center justify-between gap-10 px-4 xl:max-w-[1310px] lg:flex-row lg:gap-16">
        {/* Left Content */}
        <div className="max-w-[100%] rounded-[28px] border border-white/10 bg-white/[.035] p-6 text-center text-white backdrop-blur md:p-10 lg:max-w-[52%] lg:text-left">
          <h2 className="text-[25px] md:text-[35px] xl:text-[40px] font-work font-[800] leading-[1.15] uppercase">
           Level Up Your Portfolio With <span className="text-theme">Every Episode</span>
          </h2>
          <p className="mt-6 text-white text-base  font-outfit font-[600] text-[18px] md:text-[20px] text-justify">
           Property isn’t just about bricks and numbers. It’s about the choices that shape how you live, grow, and plan for the future.
          </p>
          <p className="mt-4 text-white text-base   font-outfit font-[600] text-[18px] md:text-[20px] text-justify">
           Our podcast brings real stories, fresh perspectives, and straight talk from voices that matter in finance and property, giving you a different way to think about building your future.
          </p>

          <div className="mt-7 flex items-start justify-center gap-3 rounded-2xl border border-[#9747FF]/35 bg-[#9747FF]/10 p-5 text-left text-gray-200 lg:justify-start">
            <MdOutlineHeadphones size={22} className="mt-1 flex-shrink-0" />
            <p className="font-semibold text-white   font-outfit font-[700] text-[18px] md:text-[20px] text-justify">
              {/* Because the right conversation in today's shifting market is what makes your vision a reality tomorrow with a great property portfolio. */}
              Your future portfolio depends on the decisions you make now. We provide the insights you need to turn today's vision into tomorrow's reality.
            </p>
          </div>

          <Link href={"/about"} className="mt-8 inline-block min-w-[180px] rounded-xl border border-white/25 px-6 py-3 text-center text-lg font-bold transition hover:border-[#FC18D8] hover:bg-gradient-to-r hover:from-[#9747FF] hover:to-[#FC18D8]">Learn more about the podcast</Link>
        </div>

        {/* Right Image */}
        <div className="relative w-full max-w-xl flex-shrink-0 lg:max-w-[48%]">
          <div className="absolute -inset-3 rounded-[32px] bg-gradient-to-br from-[#FC18D8]/25 to-[#9747FF]/40 blur-xl" aria-hidden="true" />
          <Image
            src="/conversation.png"
            alt="Podcast Recording"
            width={573}
            height={500}
            className="relative h-auto w-full rounded-[28px] border border-white/15 object-cover p-2"
          />
        </div>
      </div>
    </section>
  );
}
