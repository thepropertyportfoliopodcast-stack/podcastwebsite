import React from "react";
import EpisodeCard from "@/common/EpisodeCard";
import Link from "next/link";
export default function Podcast({ initialEpisodes = [] }) {
  return (
      <div className="mx-auto container xl:max-w-[1310px] px-4 relative">
        {/* Heading */}
        <div className="relative z-[2]">
          <h2 className="text-center text-[25px] md:text-[35px] xl:text-[40px] font-work font-[800] leading-[1.15] uppercase mb-4 md:mb-10">
            <span className="text-theme">LATEST</span>{" "}
            <span className="text-white">EPISODES</span>
          </h2>


          {/* Episode */}
            <>
            <div className="space-y-8">
              {initialEpisodes.map((ep) => (
                  <EpisodeCard
                    episode={ep}
                    key={ep.id || ep.slug || ep.title}
                    setIsEpisodePopupOpen={false}
                    setSelectedEpisode={null}
                    isAdmin={false}
                  />
                ))}
            </div>
            {/* View All Button */}
          <div className="text-center mt-6 mb-4">
            <Link href={"/episode"} className=" px-3 py-[9px] min-w-[160px] inline-block rounded-md border-[1px] border-[#fff]  font-[600] text-[20px] text-center transition   hover:bg-gradient-to-r hover:from-[#9747FF] hover:to-[#FC18D8] hover:border-[#FC18D8]">View All</Link>
          </div>
          </>
        </div>
      </div>
  );
}
