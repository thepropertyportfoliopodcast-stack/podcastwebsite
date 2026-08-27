import { useAudioPlayer } from "@/context/AudioPlayerContext";
import Image from "next/image";
import { BsFullscreenExit } from "react-icons/bs";

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
        {selectedEpisode?.thumbnail && (
          <div className="w-64 sm:w-80 h-64 sm:h-80 relative shadow-lg rounded-lg overflow-hidden">
            <Image
              src={selectedEpisode.thumbnail}
              alt="Podcast Cover"
              fill
              sizes="(max-width: 640px) 256px, 320px"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
