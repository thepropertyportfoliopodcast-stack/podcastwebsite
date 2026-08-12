import React from "react";
import { FaCalculator } from "react-icons/fa";
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
      <div className="relative z-[2] mx-auto container px-4 xl:max-w-[1310px]">
        <section className="text-white py-8 pt-[30px]">
          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-[25px] md:text-[35px] xl:text-[40px] font-work font-[800] leading-[1.15] uppercase">What You'll <span className="text-theme">Learn</span></h2>
            <p className="mt-4 text-white text-[18px] md:text-[20px] max-w-3xl mx-auto">
             Every episode is packed with actionable insights to help you build wealth through smart property investment decisions
            </p>
          </div>
          {/* Cards Grid */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 z-3 ">
            {learnItems.map((item, idx) => (
              <div
                key={idx}
                className="group relative h-auto rounded-2xl border border-white/15 bg-white/[.035] p-6 text-center shadow-lg backdrop-blur transition duration-300 hover:-translate-y-2 hover:border-[#9747FF] hover:shadow-[#9747FF]/20 sm:min-h-[245px] sm:text-left">
                {/* Icon inside a circle */}
                <div className="bg-[#FFFFFF1A] w-14 h-14 flex items-center justify-center rounded-full mb-4 text-gray-300 group-hover:text-white transition group-hover:bg-gradient-to-r from-[#9747FF] to-[#FC18D8] transition-transform duration-800 group-hover:scale-125">
                  {item.icon}
                </div>

              <div className=" pt-[15px] group-hover:pt-[25px] transition-all duration-800  ease-in-out">
                <h3 className="text-[22px] font-semibold text-white transition group-hover:bg-gradient-to-r group-hover:from-[#9747FF] group-hover:to-[#FC18D8] group-hover:bg-clip-text group-hover:text-transparent">
                  {item.title}
                </h3>

                <p className="text-white text-[16px] md:text-[18px] leading-relaxed">
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
