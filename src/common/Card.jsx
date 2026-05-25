import Link from 'next/link';
import React from 'react'
import { RiChatVoiceLine } from "react-icons/ri";
export default function Card({ index, podcast }) {
    // console.log("Link", podcast)
    return (
        <div key={index} className=" rounded-lg p-3">
            <img
                src={podcast.thumbnail}
                alt={podcast.name}
                className="w-full h-[223px] object-cover rounded-lg"
            />

            <h3 className="text-[16px] sm:text-[18px]  heading text-center mt-3 mb-1 text-[#b5afaf]">
                {podcast.name}
            </h3>
            <p className="text-[14px] sm:text-[16px] paragraph mb-3 text-center line-clamp-2">{podcast.description}</p>
            <Link
                href={`/podcast/${podcast?.uuid}`}
                className="flex items-center justify-center gap-3 text-center mx-auto rounded-[40px] button-bg py-2 px-5 cursor-pointer " >
                <RiChatVoiceLine size={20} />
                Listen Now
            </Link>
        </div>
    )
}
