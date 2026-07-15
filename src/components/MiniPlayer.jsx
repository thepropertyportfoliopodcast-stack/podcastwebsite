import { useAudioPlayer } from "@/context/AudioPlayerContext";
import Image from "next/image";
import { FaPlayCircle } from "react-icons/fa";
import { GoScreenFull } from "react-icons/go";
import { MdOutlinePauseCircleFilled } from "react-icons/md";

export default function MiniPlayer() {
  const { isPlaying, pauseTrack, playTrack, currentTrack, setIsMinimized, selectedEpisode } = useAudioPlayer();

  return (
    <div className="bg-gray-900 text-white p-2 flex justify-between items-center px-4">
      <div className="flex gap-2 items-center">
      <div className=" relative w-12 h-12">
        {selectedEpisode?.thumbnail && (
          <Image
            src={selectedEpisode.thumbnail}
            alt={selectedEpisode?.title || "Podcast episode artwork"}
            fill
            sizes="48px"
            className="object-cover rounded-lg"
          />
        )}
      </div>
      <div className="text-sm w-1/2 capitalize">{selectedEpisode?.title || ""}</div>
      </div>
      <div className="flex items-center space-x-4">
        {isPlaying ? (
          <button className="cursor-pointer" title="Pause" onClick={pauseTrack}><MdOutlinePauseCircleFilled size={24}/></button>
        ) : (
          <button className="cursor-pointer" title="Play" onClick={() => playTrack(selectedEpisode)}><FaPlayCircle size={20}/></button>
        )}
        <button className="cursor-pointer" title="Enter Full Screen" onClick={() => setIsMinimized(false)}><GoScreenFull size={20}/></button>
      </div>
    </div>
  );
}
