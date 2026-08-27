import { useAudioPlayer } from "@/context/AudioPlayerContext";
import Image from "next/image";
import { BsFullscreenExit } from "react-icons/bs";
import { episodeWebsiteArtwork, hasWebsiteEpisodeArtwork } from "@/utils/episodeArtwork";

export default function FullPlayer() {
  const { selectedEpisode, setIsMinimized } = useAudioPlayer();

  return (
    <div
      className="flex flex-col text-white bg-gradient-to-b from-[#1e2f3f] to-[#304d60]"
      style={{ height: "calc(100vh - 80px)" }}
    >
      <div className="flex justify-between items-center px-5">
        <div />
        <div className="p-6 mt-4 text-left font-semibold text-lg">
          {selectedEpisode?.title}
        </div>
        <button
          className="text-white text-xl cursor-pointer"
          onClick={() => setIsMinimized(true)}
        >
          <BsFullscreenExit size={20} />
        </button>
      </div>

      <div className="flex-grow flex items-center justify-center">
        {episodeWebsiteArtwork(selectedEpisode) && (
          <div className="relative aspect-video w-[min(90vw,640px)] overflow-hidden rounded-lg bg-[#160622] shadow-lg">
            <Image
              src={episodeWebsiteArtwork(selectedEpisode)}
              alt="Podcast episode thumbnail"
              fill
              sizes="(max-width: 640px) 90vw, 640px"
              className={hasWebsiteEpisodeArtwork(selectedEpisode) ? "object-cover" : "object-contain"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
