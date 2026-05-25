import { useAudioPlayer } from "@/context/AudioPlayerContext";
import Player from "./Player";

export default function AudioPlayerWrapper() {
  const { selectedEpisode } = useAudioPlayer();
  if (!selectedEpisode) return null;
  return <Player />;
}