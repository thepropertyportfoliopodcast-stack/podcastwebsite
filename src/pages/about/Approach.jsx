import React from "react";
import Image from "next/image";

export default function Approach() {
  return (
    <section className="py-[20px] md:py-[40px] mb-1 md:mb-3">
      <div className=" mt-[20px] mb-[20px] md:mt-[60px] md:mb-[60px]">
         
                  <div className="absolute z-0 xl:max-w-[378px] w-full md:w-[578px] h-full md:h-[800px]  aspect-square right-[0] top-[0px]  1111blurcircle rounded-r-full z-1">
                   <Image
                         src={"/lightpinkright.png"}
                         layout="fill"
                         objectFit="cover"
                         className="object-cover w-full" />
                 </div>
        <div className="text-center flex flex-col items-center relative z-[2]">
          <h2 className="mb-[20px] text-[25px] md:text-[35px] xl:text-[40px] font-work font-[800] leading-[1.15] uppercase">
            <span className="text-white">Our</span>
            <span className="text-theme"> Approach</span>
          </h2>

          <p className="mb-[20px] text-white text-base  font-outfit font-[600] text-[16px] md:text-[18px] md:text-[20px]">
            We don’t believe in “one-size-fits-all” advice. Every investor is
            different and comes with a varied risk <br /> tolerance, financial status,
            and life stage. So, we focus on:
          </p>
           <div className="flex items-center justify-center flex-wrap lg:flex-nowrap lg:justify-start gap-[10px] md:gap-[20px] mt-[25px] mb-[25px] md:mb-[0]">
            <div className="relative w-[135px] sm:w-[210px] h-[150px] edubg ">
              <div className=" absolute top-0 bottom-0 left-0 right-0 w-[98%] h-[98%] m-auto bg-[#0F0F0F] rounded-[10px]"></div>
              <div className="flex flex-col relative w-full h-full text-[14px] font-[600] text-center z-1 flex items-center justify-center ">
                
                 <Image src="/approachicon01.png?FSDFSF"
                            alt="Podcast Recording"
                            width={40}
                            height={40}
                            className="rounded-xl object-cover w-[40px] h-auto mb-[10px]"
                          />Personally Stress-Tested Frameworks
              </div>
            </div>

             <div className="relative  w-[135px] sm:w-[210px] h-[150px] edubg ">
              <div className=" absolute top-0 bottom-0 left-0 right-0 w-[98%] h-[98%] m-auto bg-[#0F0F0F] rounded-[10px]"></div>
              <div className="flex flex-col relative w-full h-full text-[14px] font-[600] text-center z-1 flex items-center justify-center ">
                 <Image src="/approachicon02.png?FSDFS"
                            alt="Podcast Recording"
                            width={40}
                            height={40}
                            className="rounded-xl object-cover  w-[40px] h-auto mb-[10px]"
                          />
                         Data-Driven <br/> Case Studies

              </div>
            </div>

             <div className="relative  w-[135px] sm:w-[210px] h-[150px] edubg ">
              <div className=" absolute top-0 bottom-0 left-0 right-0 w-[98%] h-[98%] m-auto bg-[#0F0F0F] rounded-[10px]"></div>
              <div className="flex flex-col relative w-full h-full text-[14px] font-[600] text-center z-1 flex items-center justify-center ">
                 <Image src="/approachicon03.png?fsdfsf"
                            alt="Podcast Recording"
                            width={40}
                            height={40}
                            className="rounded-xl object-cover  w-[40px] h-auto mb-[10px]"
                          />
               Strategies Tested Through Market Cycles


              </div>
            </div>

             <div className="relative  w-[135px] sm:w-[210px] h-[150px] edubg ">
              <div className=" absolute top-0 bottom-0 left-0 right-0 w-[98%] h-[98%] m-auto bg-[#0F0F0F] rounded-[10px]"></div>
              <div className="flex flex-col relative w-full h-full text-[14px] font-[600] text-center z-1 flex items-center justify-center ">
                 <Image src="/approachicon04.png?fsdfsfdsf"
                            alt="Podcast Recording"
                            width={40}
                            height={40}
                            className="rounded-xl object-cover  w-[40px] h-[40px] mb-[10px]"
                          />
              Each Investor <br /> Stage-Specific Pathway

              </div>
            </div>
          </div>

         
        </div>
      </div>
    </section>
  );
}
