import React from "react";

export default function Vision() {
  return (
    <section className="">
      <div className="bg-[#0F0F0F] md:min-h-[380px] xl:min-h-[400px] border-2  border-[#fff] rounded-[10px] p-[20px] md:p-[20px] relative z-[2]">
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
