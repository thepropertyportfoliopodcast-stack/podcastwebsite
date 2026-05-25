import { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { IoMdClose } from "react-icons/io";
import "plyr/dist/plyr.css";

export default function VideoPlayer() {
  const { selectedEpisode, setCurrentTrack, setSelectedEpisode } =
    useAudioPlayer();
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // console.log("selectedEpisode",selectedEpisode);

  useEffect(() => {
    if (!videoRef.current) return;

    const player = new Plyr(videoRef.current, {
      controls: [
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "fullscreen",
      ],
    });

    player.on("enterfullscreen", () => setIsFullscreen(true));
    player.on("exitfullscreen", () => setIsFullscreen(false));

    return () => {
      player.pause();
      player.destroy();
    };
  }, [selectedEpisode?.link]);

  return (
    <div className="fixed inset-0 z-[99] bg-black flex justify-center p-4">
      <div className="relative w-full max-w-[90vw]">
        <div
          className="absolute z-10 w-full flex justify-between items-center
                  bg-black/60 backdrop-blur-md"
        >
          <div className="p-4 text-left font-medium text-base text-gray-100 truncate">
            {selectedEpisode?.title}
          </div>

          <button
            className="text-gray-300 hover:text-white p-4 transition-colors cursor-pointer"
            onClick={() => {
              videoRef.current?.pause();
              setSelectedEpisode(null);
              setCurrentTrack(null);
            }}
          >
            <IoMdClose size={20} />
          </button>
        </div>

        <video
          poster={selectedEpisode?.thumbnail}
          ref={videoRef}
          src={selectedEpisode?.link}
          playsInline
          controls
          autoPlay
          className={`w-full h-full rounded-lg ${
            isFullscreen ? "" : "max-h-[90vh]"
          }`}
        />
      </div>
    </div>
  );
}