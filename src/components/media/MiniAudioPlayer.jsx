import { useAudioPlayer } from "@/context/AudioPlayerContext";
import FullAudioPlayer from "./FullAudioPlayer";
import VideoPlayer from "./VideoPlayer";
import AudioPlayer from "./AudioPlayer";
import { useEffect } from "react";

function isVideo(url) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/.test(url);
}

export default function Player() {
  const { isMinimized, selectedEpisode, pauseTrack } = useAudioPlayer();

  if (!selectedEpisode) return null;

  const isVideoFile = isVideo(selectedEpisode.link);

  useEffect(() => {
  if (!selectedEpisode) return;

  const isVideo = /\.(mp4|webm|ogg|mov)/.test(selectedEpisode.link);
  if (isVideo) pauseTrack();
}, [selectedEpisode]);


  if (isVideoFile) return <VideoPlayer />;

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full z-[99]">
        {isMinimized ? <></> : <FullAudioPlayer />}
      <AudioPlyr/> 
      </div>
    </>
  );
}
