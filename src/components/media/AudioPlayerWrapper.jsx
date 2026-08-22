import { useAudioPlayer } from "@/context/AudioPlayerContext";
import MiniAudioPlayer from "./MiniAudioPlayer";

export default function AudioPlayerWrapper() {
  const { selectedEpisode } = useAudioPlayer();
  if (!selectedEpisode) return null;
  return <MiniAudioPlayer />;
}