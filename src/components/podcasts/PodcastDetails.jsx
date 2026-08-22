import React from 'react'
import podcastImage from "@/assets/e-guidebanner.png"
import Image from 'next/image'
import { useAudioPlayer } from '@/context/AudioPlayerContext';

export default function PodcastDetails({ podcast }) {
    const { playTrack } = useAudioPlayer();
    // console.log("podcast", podcast);
    return (
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className='w-48 h-48 min-w-48 md:w-48 md:h-48 md:min-w-48 relative'>
            <Image
              src={podcast?.thumbnail || podcastImage} // Replace with actual image
              alt={podcast?.name || "Podcast artwork"}
              fill
              sizes="192px"
              className="w-full h-full rounded-lg object-cover left-0 md:absolute top-0"
            />
            </div>
            <div>
                <h1 className="mb-1 line-clamp-2 text-3xl font-bold text-white">{podcast?.name}</h1>
                <p className="text-white">Author: {podcast?.author}</p>
                <div className="flex items-center text-[#727272]  mt-1">
                    <span className="text-[12px] md:text-[14px] font-[400]">Cast: {podcast?.cast?.join(",")}</span>
                </div>
                <p className="mt-2 line-clamp-3 text-[16px] font-[400] leading-snug text-[#727272]">
                    {podcast?.description}
                </p>
                <button className="mt-4 px-4 py-2 bg-theme rounded cursor-pointer" 
                onClick={()=>{
                    console.log("podcast episodes", podcast?.episodes);
                    playTrack(podcast?.episodes[0]);
                }}
                >
                    ▶ Latest Episode
                </button>
            </div>
        </div>
    )
}
