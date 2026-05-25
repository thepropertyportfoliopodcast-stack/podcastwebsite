import Image from "next/image";
import Link from "next/link";
import { MdOutlineHeadphones } from "react-icons/md";

export default function InvestorSection() {
  return (
    <section className="bg-[#000] py-8 sm:py-20">
      <div className="mx-auto container xl:max-w-[1310px] px-4 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-12">
        {/* Left Content */}
        <div className="text-white max-w-[100%] lg:max-w-[50%] text-center lg:text-left">
          <h2 className="text-[25px] md:text-[35px] xl:text-[40px] font-work font-[800] leading-[1.15] uppercase">
           Level Up Your Portfolio With <span className="text-theme">Every Episode</span>
          </h2>
          <p className="mt-6 text-white text-base  font-outfit font-[600] text-[18px] md:text-[20px] text-justify">
           Property isn’t just about bricks and numbers. It’s about the choices that shape how you live, grow, and plan for the future.
          </p>
          <p className="mt-4 text-white text-base   font-outfit font-[600] text-[18px] md:text-[20px] text-justify">
           Our podcast brings real stories, fresh perspectives, and straight talk from voices that matter in finance and property, giving you a different way to think about building your future.
          </p>

          <div className="mt-6 border-l-4 border-white pl-4 text-gray-200 flex items-start justify-center lg:justify-start gap-2 text-left">
            <MdOutlineHeadphones size={22} className="mt-1 flex-shrink-0" />
            <p className="font-semibold text-white   font-outfit font-[700] text-[18px] md:text-[20px] text-justify">
              {/* Because the right conversation in today's shifting market is what makes your vision a reality tomorrow with a great property portfolio. */}
              Your future portfolio depends on the decisions you make now. We provide the insights you need to turn today's vision into tomorrow's reality.
            </p>
          </div>

          <Link href={"/about"} className="mt-8 px-6 py-[10px] min-w-[180px] inline-block rounded-md border-[1px] border-[#fff]  font-[600] text-[20px] text-center transition   hover:bg-gradient-to-r hover:from-[#9747FF] hover:to-[#FC18D8] hover:border-[#FC18D8]">Learn More</Link>
        </div>

        {/* Right Image */}
        <div className="flex-shrink-0 w-full max-w-sm sm:max-w-md lg:max-w-[50%]">
          <Image
            src="/conversation.png"
            alt="Podcast Recording"
            width={573}
            height={500}
            className="rounded-xl object-cover w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}