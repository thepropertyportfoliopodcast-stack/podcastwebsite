import { useState } from "react";
import Image from "next/image";
import { FaPlay, FaYoutube } from "react-icons/fa";

export function youtubeVideoId(url = "") {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/i);
  return match?.[1] || "";
}

export default function YouTubeFacade({ url, title, className = "", onActivate }) {
  const [active, setActive] = useState(false);
  const id = youtubeVideoId(url);
  if (!id) return null;

  if (active) {
    return <iframe title={title} src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} className={`h-full w-full border-0 ${className}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />;
  }

  return <button type="button" onClick={() => { if (onActivate) onActivate(); else setActive(true); }} className={`group relative block h-full w-full overflow-hidden bg-black text-white ${className}`} aria-label={`Play ${title} on YouTube`}>
    <Image src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" fill sizes="(max-width: 768px) 100vw, 720px" className="object-cover" />
    <span className="absolute inset-0 bg-black/10 transition group-hover:bg-black/5" aria-hidden="true" />
    <span className="absolute left-1/2 top-1/2 grid h-14 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[15px] bg-[#ff0033] shadow-[0_10px_30px_rgba(0,0,0,.45)] transition duration-200 group-hover:scale-110 group-focus-visible:scale-110" aria-hidden="true"><FaPlay className="ml-1 text-white" size={24} /></span>
    <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-md bg-black/80 px-3 py-2 text-xs font-bold shadow-lg text-[#ff0033]" aria-hidden="true"><FaYoutube className="text-[#ff0033]" />Watch on YouTube</span>
  </button>;
}
