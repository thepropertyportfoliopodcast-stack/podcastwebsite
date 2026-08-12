import React from "react";

export default function Vision() {
  return (
    <section className="">
      <div className="relative z-[2] h-full rounded-[28px] border border-white/15 bg-white/[.035] p-6 shadow-xl backdrop-blur transition hover:-translate-y-1 hover:border-[#9747FF]/70 md:min-h-[400px] md:p-9">
        <div className="text-center flex flex-col items-center relative z-[2]">
          <h2 className="text-[25px] md:text-[35px] xl:text-[40px] font-work font-[800] leading-[1.15] uppercase mb-[4px]">
            <span className="text-white">Our</span>
            <span className="text-theme"> Vision</span>
          </h2>
          <h3 className="text-white text-[16px] md:text-[18px] lg:text-[20px] font-[700]  uppercase mb-4  ">
            Helping Australians build lasting wealth through property.
          </h3>
          <p className="text-white text-[15px] md:text-[16px] xl:text-[18px] font-[600]">
            We see a future where background, postcode, or starting point no
            longer decides who can build a strong property portfolio. Our vision
            is for more Australians to feel informed, confident, and capable of
            creating financial security for themselves and their families.
            Property investing should not be a closed door for the few, it
            should be a path open to anyone willing to learn, plan, and take
            action.
          </p>
        </div>
      </div>
    </section>
  );
}
