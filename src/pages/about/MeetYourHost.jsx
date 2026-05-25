import Image from "next/image";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { PiMedal } from "react-icons/pi";
export default function MeetYourHost() {
 

  return (
    <section className="relative overflow-hidden bg-black text-white pb-5 sm:pt-10 mt-10">
      
      <div className=" ">
        {/* Left Side - Host Image */}

        <div className="text-center mb-12 mx-auto container xl:max-w-[1310px] px-4">
          <h2 className="mb-[15px] text-[25px] md:text-[35px] xl:text-[40px] font-work font-[800] leading-[1.15] uppercase">
            MEET YOUR <span className="text-theme">HOST</span>
          </h2>
          <p className="text-white text-base  font-outfit font-[600] text-[15px] md:text-[16px] xl:text-[18px]">
            Together, Parag, Julius & Mudit represent the complete property
            investment ecosystem of mortgage mastery, strategic financing, and
            acquisition expertise unified under one educational platform. Their
            combined decades of experience and proven track records create an
            unparalleled resource for discerning investors. Each brings distinct
            strengths that complement the others, ensuring you receive
            comprehensive guidance whether you're securing your first investment
            property or expanding an established portfolio.
          </p>
        </div>

        <div className="mt-6 mb-4">
          {/* {host &&
            host.map((content, index) => ( */}
            {/* Host 1 */}
              <div className="relative">
                
                 <div className="absolute z-0 max-w-[180px] md:max-w-[278px] xl:max-w-[378px] w-full md:w-[578px] h-full md:h-[800px]  aspect-square left-[0] top-[-300px]  1111blurcircle rounded-r-full z-1">
                          <Image
                                src={"/lightpinkleft.png"}
                                layout="fill"
                                objectFit="cover"
                                className="object-cover w-full" />
                        </div>

                         <div className="absolute z-0 max-w-[180px] md:max-w-[278px] xl:max-w-[378px] w-full md:w-[578px] h-full md:h-[800px]  aspect-square right-[0] bottom-[-300px]  1111blurcircle rounded-r-full z-1">
                          <Image
                                src={"/lightpinkright.png"}
                                layout="fill"
                                objectFit="cover"
                                className="object-cover w-full" />
                        </div>
              
              <div
                className={`mx-auto container xl:max-w-[1310px] px-4 flex flex-col mb-[40px] lg:flex-row items-center gap-[10px] md:gap-5 xl:gap-10 mb-[20px] lg:mb-[30px] xl:mb-[50px] relative z-[2]`}
              >
                <div className="flex justify-center w-full lg:w-1/2">
                  <div className="w-full max-w-[700px] aspect-[7/5] overflow-hidden rounded-lg">
                    <Image
                      src={"/paragimg.jpg?dsf"}
                      alt="Podcast Host"
                      width={700}
                      height={500}
                      className=" rounded-lg 1object-contain w-full 11h-full transform transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                </div>
                {/* Right Side - Text */}
                <div className="flex flex-col w-full lg:w-1/2 text-center lg:text-left">
                  <h2 className=" text-[22px] md:text-[25px] xl:text-[30px] md:leading-[24px] md:leading-[28px] xl:md:leading-[32px] font-[700] mb-[2px] lg:mb-[10px]">Parag Dixit - <span className="text-theme md:leading-[24px] md:leading-[28px] xl:md:leading-[32px]">Mortgage & Investment Strategy Expert</span>
                  </h2>

                  <p className="text-[15px] md:text-[16px] xl:text-[18px] font-[600] mb-[15px] text-justify">
                  Parag brings a unique dual perspective as both a mortgage specialist and a successful property investor. With over 25 years in financial services, he's the founding director of Nfinity Financials and PropWealth and was recently recognised as one of Australia's Top 10 Elite Brokers of 2024. His personal property investment journey began in 2016, giving him firsthand experience in building wealth through strategic property decisions, using complex mix of individual, trust and company assets. This combination of Strategic mindset and expertise, deep financial understanding and real estate investment experience makes him uniquely positioned to guide clients through both financing and property investment strategies.
                  </p>

                  {/* Bottom badges */}
                  <div className="flex flex-wrap justify-center md:justify-center items-center lg:justify-start gap-2 md:gap-6">
                    {/* Property Expert */}
                    <div className="flex items-center gap-[5px] md:gap-[10px] text-[14px] md:text-[17px] xl:text-[20px] font-[700]">
                      <div className="bg-[linear-gradient(180deg,rgba(252,24,216,0.7)_0%,rgba(151,71,255,0.7)_100%)] p-2 rounded-full flex items-center justify-center w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12">
                        <PiMedal className="text-white" size={26} />
                      </div>
                     Wealth Strategist
                    </div>

                    {/* Community Builder */}
                    <div className="flex items-center gap-[5px] md:gap-[10px] text-[14px] md:text-[18px] lg:text-[20px] font-[700]">
                      <div className="bg-[linear-gradient(180deg,rgba(252,24,216,0.7)_0%,rgba(151,71,255,0.7)_100%)] p-2 rounded-full flex items-center justify-center w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12">
                        <MdOutlinePeopleAlt className="text-white" size={26} />
                      </div>
                      Mortgage Expert

                    </div>
                  </div>
                </div>
              </div>
              </div>
            {/* Host 2 */}
            <div className="relative">
                
                 <div className="absolute z-0 max-w-[180px] md:max-w-[278px] xl:max-w-[378px] w-full md:w-[578px] h-full md:h-[800px]  aspect-square left-[0] top-[10px]  1111blurcircle rounded-r-full z-1">
                          <Image
                                src={"/lightpinkleft.png"}
                                layout="fill"
                                objectFit="cover"
                                className="object-cover w-full" />
                        </div>

                        
              
              <div
                className={`mx-auto container xl:max-w-[1310px] px-4 flex flex-col    mb-[40px] lg:flex-row lg:flex-row-reverse items-center gap-[10px] md:gap-5 xl:gap-10 mb-[20px] lg:mb-[30px] xl:mb-[50px] relative z-[2]`}
              >
                <div className="flex justify-center  w-full lg:w-1/2">
                  <div className="w-full max-w-[700px] aspect-[7/5] overflow-hidden rounded-lg">
                    <Image
                      src={"/juliusimg.jpg?dfsff"}
                      alt="Podcast Host"
                      width={700}
                      height={550}
                      className="rounded-lg 1object-contain w-full 11h-full transform transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                </div>
                {/* Right Side - Text */}
                <div className="flex flex-col  w-full lg:w-1/2 text-center lg:text-left">
                  <h2 className=" text-[22px] md:text-[25px] xl:text-[30px] md:leading-[24px] md:leading-[28px] xl:md:leading-[32px] font-[700] mb-[2px] lg:mb-[10px]">
                    Julius Dabre - <span className="text-theme md:leading-[24px] md:leading-[28px] xl:md:leading-[32px]">Your Property Acquisition Specialist</span>
                  </h2>

                  <p className="text-[15px] md:text-[16px] xl:text-[18px] font-[600] mb-[15px] text-justify">
                   As Founder of PropWealth, Julius has orchestrated over $67 million in property transactions, establishing himself as a formidable force in Australia's property landscape. His specialty lies in identifying high-growth suburbs before they become mainstream, combining profound market trend analysis with practical, actionable advice. Julius's insights have empowered over 100,000 investors to make informed decisions, turning market knowledge into tangible portfolio growth.
                  </p>

                  {/* Bottom badges */}
                  <div className="flex flex-wrap justify-center md:justify-center items-center lg:justify-start gap-2 md:gap-6">
                    {/* Property Expert */}
                    <div className="flex items-center gap-[5px] md:gap-[10px] text-[14px] md:text-[17px] xl:text-[20px] font-[700]">
                      <div className="bg-[linear-gradient(180deg,rgba(252,24,216,0.7)_0%,rgba(151,71,255,0.7)_100%)] p-2 rounded-full flex items-center justify-center w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12">
                        <PiMedal className="text-white" size={26} />
                      </div>
                     Property Expert
                    </div>

                    {/* Community Builder */}
                    <div className="flex items-center gap-[5px] md:gap-[10px] text-[14px] md:text-[18px] lg:text-[20px] font-[700]">
                      <div className="bg-[linear-gradient(180deg,rgba(252,24,216,0.7)_0%,rgba(151,71,255,0.7)_100%)] p-2 rounded-full flex items-center justify-center w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12">
                        <MdOutlinePeopleAlt className="text-white" size={26} />
                      </div>
                      Market Trends Lead
                    </div>
                  </div>
                </div>
              </div>
              </div>
            {/* Host 3 */}
            <div className="relative">
                
               

                         <div className="absolute z-0 max-w-[180px] md:max-w-[278px] xl:max-w-[378px] w-full md:w-[578px] h-full md:h-[800px]  aspect-square right-[0] bottom-[-150px]  1111blurcircle rounded-r-full z-1">
                          <Image
                                src={"/lightpinkright.png"}
                                layout="fill"
                                objectFit="cover"
                                className="object-cover w-full" />
                        </div>
              
              <div
                className={`mx-auto container xl:max-w-[1310px] px-4 flex flex-col mb-[40px] lg:flex-row items-center gap-[10px] md:gap-5 xl:gap-10 mb-[20px] lg:mb-[30px] xl:mb-[50px] relative z-[2]`}
              >
                <div className="flex justify-center w-full lg:w-1/2">
                  <div className="w-full max-w-[700px] aspect-[7/5] overflow-hidden rounded-lg">
                    <Image
                      src={"/muditimg.jpg?fsfsf"}
                      alt="Podcast Host"
                      width={700}
                      height={550}
                      className="rounded-lg 1object-contain w-full 11h-full transform transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                </div>
                {/* Right Side - Text */}
                <div className="flex flex-col w-full lg:w-1/2 text-center lg:text-left">
                  <h2 className=" text-[22px] md:text-[25px] xl:text-[30px] md:leading-[24px] md:leading-[28px] xl:md:leading-[32px] font-[700] mb-[2px] lg:mb-[10px] ">
                    Mudit Khandelwal - <span className="text-theme md:leading-[24px] md:leading-[28px] xl:md:leading-[32px]">Your Strategic Finance Director</span>
                  </h2>

                  <p className="text-[15px] md:text-[16px] xl:text-[18px] font-[600] mb-[15px] text-justify">
                  An alumnus of IIT Kanpur and IIM Ahmedabad, Mudit brings academic excellence and real-world mastery to every client interaction. As Director at Nfinity Financials, this 5-star-rated mortgage broker has earned over 200 five-star reviews, reflecting his exceptional service standards with over 20 years of entrepreneurial experience. Mudit is motivated by a deep commitment to help Australians achieve their dreams of homeownership in a quicker, easier, and more cost-effective way. He achieves it by applying a strategic approach that transforms complex financial scenarios into clear pathways to property wealth.


                  </p>

                  {/* Bottom badges */}
                  <div className="flex flex-wrap justify-center md:justify-center items-center lg:justify-start gap-2 md:gap-6">
                    {/* Property Expert */}
                    <div className="flex items-center gap-[5px] md:gap-[10px] text-[14px] md:text-[17px] xl:text-[20px] font-[700]">
                      <div className="bg-[linear-gradient(180deg,rgba(252,24,216,0.7)_0%,rgba(151,71,255,0.7)_100%)] p-2 rounded-full flex items-center justify-center w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12">
                        <PiMedal className="text-white" size={26} />
                      </div>
                     Strategic Finance
                    </div>

                    {/* Community Builder */}
                    <div className="flex items-center gap-[5px] md:gap-[10px] text-[14px] md:text-[18px] lg:text-[20px] font-[700]">
                      <div className="bg-[linear-gradient(180deg,rgba(252,24,216,0.7)_0%,rgba(151,71,255,0.7)_100%)] p-2 rounded-full flex items-center justify-center w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12">
                        <MdOutlinePeopleAlt className="text-white" size={26} />
                      </div>
                      Mortgage Broker
                    </div>
                  </div>
                </div>
              </div>
              </div>
            {/* // ))} */}
        </div>
      </div>
    </section>
  );
}
