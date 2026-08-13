import EpisodeCard from "@/common/EpisodeCard";
import Link from "next/link";

export default function Podcast({ initialEpisodes = [] }) {
  return (
    <div className="relative z-[2] mx-auto w-full max-w-[1310px] px-4 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-center text-[25px] font-[800] uppercase leading-[1.15] md:mb-12 md:text-[35px] xl:text-[44px]"><span className="text-theme">LATEST</span>{" "}<span className="text-white">EPISODES</span></h2>
      <div className="space-y-5 rounded-[28px] border border-white/10 bg-black/25 p-3 backdrop-blur sm:p-5 lg:p-6">{(Array.isArray(initialEpisodes) ? initialEpisodes : []).map((episode) => <EpisodeCard episode={episode} key={episode.id || episode.slug || episode.title} setIsEpisodePopupOpen={false} setSelectedEpisode={null} isAdmin={false} />)}</div>
      <div className="mb-4 mt-6 text-center"><Link href="/episode" className="inline-block min-w-[160px] rounded-md border border-white px-3 py-[9px] text-center text-[20px] font-[600] transition hover:border-[#FC18D8] hover:bg-gradient-to-r hover:from-[#9747FF] hover:to-[#FC18D8]">View All</Link></div>
    </div>
  );
}
