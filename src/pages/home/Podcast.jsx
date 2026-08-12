import React from "react";
import EpisodeCard from "@/common/EpisodeCard";
import Link from "next/link";
export default function Podcast({ initialEpisodes = [] }) {
  return (
      <div className="relative z-[2] mx-auto container px-4 xl:max-w-[1310px]">
        {/* Heading */}
        <div className="relative z-[2]">
          <h2 className="mb-8 text-center text-[25px] font-[800] uppercase leading-[1.15] md:mb-12 md:text-[35px] xl:text-[44px]">
            <span className="text-theme">LATEST</span>{" "}
            <span className="text-white">EPISODES</span>
          </h2>


          {/* Episode */}
            <>
            <div className="space-y-6 rounded-[28px] border border-white/10 bg-black/25 p-3 backdrop-blur md:p-6">
              {(Array.isArray(initialEpisodes) ? initialEpisodes : []).map((ep) => (
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
