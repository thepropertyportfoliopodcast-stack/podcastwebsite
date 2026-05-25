import React from "react";
import Image from "next/image";
import arrow from "../../assets/arrow.png";

export default function Mission() {
  const missionFeatures = [
    {
      title: "Clear Strategy",
      description:
        "We exist to democratize property investment education in Australia.",
      icon: arrow, // Placeholder for the unique icon
    },
    {
      title: "Real Story",
      description:
        "Learn from actual investors sharing their successes and mistakes.",
      icon: arrow,
    },
    {
      title: "Proven Result",
      description:
        "We exist to democratize property investment education in Australia.",
      icon: arrow,
    },
  ];
  return (
    <section className="">
      <div className="bg-[#0F0F0F] md:min-h-[380px] xl:min-h-[400px] border-2  border-[#fff] rounded-[10px] p-[20px] md:p-[20px] relative z-[2]">
        <div className="text-center flex flex-col items-center relative z-[2]">
          <h2 className="text-[25px] md:text-[35px] xl:text-[40px] font-work font-[800] leading-[1.15] uppercase mb-[4px]">
            <span className="text-white">Our</span>
            <span className="text-theme"> Mission</span>
          </h2>
          <h3 className="text-white text-[16px] md:text-[18px] lg:text-[20px] font-[700] mb-4 uppercase">
            Making property education practical and accessible for Australians.
          </h3>
          <p className="text-white text-[14px] md:text-[16px] xl:text-[18px] font-[600]">
            We exist to close the knowledge gap that often keeps capable people
            from creating wealth through property. Too many Australians sit on
            the sidelines while others grow strong portfolios, not because of
            ability, but because they never had access to clear strategies and
            timely guidance. Our mission is to change that by sharing
            conversations that simplify the process and give people the
            confidence to take the next step in their property journey.
          </p>
        </div>

        {/* Feature Cards Grid */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">
              {missionFeatures &&
                missionFeatures?.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-[#141414] border border-[#FFFFFF33] p-2 md:p-4 rounded-xl flex flex-wrap items-center xl:items-start gap-4 w-full"
                  >
                    <div className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[80px] md:h-[80px] lg:w-[85px] lg:h-[85px] bg-[#141414] border border-[#FFFFFF33] rounded-full flex md:items-center md:justify-center mx-auto mb-4">
                      <Image
                        src={feature?.icon}
                        alt={feature?.title}
                        className="w-[45px] sm:w-[55px] md:w-[60px] lg:w-[65px] object-contain"
                      />
                    </div>
                    <div className="flex-1 pt-4 ">
                      <h3 className=" text-[14px] md:text-[20px] font-[400] mb-2 text-white  leading-[14px] md:leading-[20px]">
                        {feature?.title}
                      </h3>
                      <p className="text-[10px] md:text-[14px] text-gray-400 font-semibold leading-relaxed">
                        {feature?.description}
                      </p>
                    </div>
                  </div>
                ))}
            </div> */}
      </div>
    </section>
  );
}
