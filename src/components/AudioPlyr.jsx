import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { useRef } from "react";
import { GoScreenFull } from "react-icons/go";
import { BsFullscreenExit } from "react-icons/bs";
import Image from "next/image";

export default function AudioPlyr() {
  const AudioPlayer = require("react-h5-audio-player").default;
  const { RHAP_UI } = require("react-h5-audio-player");
  require("react-h5-audio-player/lib/styles.css");

  const {
    pauseTrack,
    playTrack,
    currentTrack,
    setIsMinimized,
    selectedEpisode,
    isMinimized,
  } = useAudioPlayer();
  const playerRef = useRef(null);

  const forward = () => {
    const player = playerRef.current.audio.current;
    if (player) player.currentTime += 10;
  };

  const backward = () => {
    const player = playerRef.current.audio.current;
    if (player) player.currentTime -= 10;
  };

  const isVideo = /\.(mp4|webm|ogg|mov)/.test(selectedEpisode?.link);
  if (!selectedEpisode || isVideo) return null;


  return (
    <div className="flex justify-between z-[51] !bg-[#111827] sm:px-3">
      {isMinimized && (
        <div className="flex gap-2 items-center w-[16vw]">
          <div className=" relative w-18 h-18">
            <Image
              src={selectedEpisode?.thumbnail || ""}
              alt={selectedEpisode?.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <div className="text-sm">
            <p className="capitalize">{selectedEpisode?.title || ""}</p>
            <p className="line-clamp-1 text-gray-500 fon-tbold text-[12px]">
              {selectedEpisode?.description || ""}
            </p>
          </div>
        </div>
      )}
      <AudioPlayer
        ref={playerRef}
        src={selectedEpisode.link}
        autoPlay
        showJumpControls={false}
        // onPlay={() => playTrack(selectedEpisode)}
        onPause={pauseTrack}
        customVolumeControls={[
          RHAP_UI.VOLUME,
          <button
            key="fullscreen"
            className="pl-5 cursor-pointer"
            title="Enter Full Screen"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <GoScreenFull size={20} /> : <BsFullscreenExit size={20} />}
          </button>,
        ]}
      />
    </div>
  );
}
