import React from "react";
import { IoMdTrendingUp } from "react-icons/io";
import { GrMoney } from "react-icons/gr";
import { MdReportProblem } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import { MdAutoStories } from "react-icons/md";
import { RiTimeLine } from "react-icons/ri";

const learnItems = [
  {
    title: "Market Trends",
    desc: "Short takes on how the property market is shifting across Australia",
    icon: <IoMdTrendingUp className="text-2xl" />,
  },
  {
    title: "Investment Strategies",
    desc: "Different ways people are building and managing their property portfolios.",
    icon: <GrMoney className="text-2xl" />,
  },
  {
    title: "Risks & Realities",
    desc: "Honest talk about challenges, mistakes, and lessons learned.",
    icon: <MdReportProblem className="text-2xl" />, 
  },
  {
    title: "Money Matters",
    desc: "From financing to tax considerations — the numbers that matter.",
    icon: <FaMoneyBillWave className="text-2xl" />, 
  },
  {
    title: "Property Stories",
    desc: "Real experiences from investors and experts shaping the market.",
    icon: <MdAutoStories className="text-2xl" />, 
  },
  {
    title: "Future Outlook",
    desc: "Where the property market might be heading and what to watch next.",
    icon: <RiTimeLine className="text-2xl" />,
  },
];

export default function Learn() {
  return (
      <div className="relative z-[2] mx-auto w-full max-w-[1310px] px-4 sm:px-6">
        <section className="py-8 pt-[30px] text-white">
          {/* Heading */}
          <div className="mx-auto mb-9 max-w-3xl text-center md:mb-12">
            <h2 className="text-[25px] md:text-[35px] xl:text-[40px] font-work font-[800] leading-[1.15] uppercase">What You'll <span className="text-theme">Learn</span></h2>
            <p className="mx-auto mt-4 max-w-3xl px-1 text-base leading-7 text-white/75 md:text-[20px]">
             Every episode is packed with actionable insights to help you build wealth through smart property investment decisions
            </p>
          </div>
          {/* Cards Grid */}
          <div className="relative z-[3] grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {learnItems.map((item, idx) => (
              <div
                key={idx}
                className="group relative flex min-h-[190px] flex-col rounded-2xl border border-white/15 bg-white/[.035] p-5 text-left shadow-lg backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#9747FF] hover:shadow-[#9747FF]/20 sm:min-h-[230px] sm:p-6">
                {/* Icon inside a circle */}
                <div className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFFFFF1A] text-gray-300 transition group-hover:bg-gradient-to-r group-hover:from-[#9747FF] group-hover:to-[#FC18D8] group-hover:text-white sm:h-14 sm:w-14">
                  {item.icon}
                </div>

              <div className="mt-auto">
                <h3 className="text-xl font-semibold text-white transition group-hover:bg-gradient-to-r group-hover:from-[#9747FF] group-hover:to-[#FC18D8] group-hover:bg-clip-text group-hover:text-transparent sm:text-[22px]">
                  {item.title}
                </h3>

                <p className="mt-2 text-[15px] leading-6 text-white/75 md:text-[17px]">
                  {item.desc}
                </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
  );
}
