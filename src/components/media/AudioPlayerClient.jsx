// components/AudioPlyrWrapper.js
import dynamic from "next/dynamic";

const AudioPlyr = dynamic(() => import("./AudioPlayerWrapper.jsx"), { ssr: false });

export default AudioPlyr;
