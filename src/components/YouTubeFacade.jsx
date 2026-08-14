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

  return <button type="button" onClick={() => { setActive(true); onActivate?.(); }} className={`group relative block h-full w-full overflow-hidden bg-black text-white ${className}`} aria-label={`Play ${title}`}>
    <Image src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" fill sizes="(max-width: 768px) 100vw, 720px" className="object-cover" />
    <span className="absolute inset-0 bg-black/20 transition group-hover:bg-black/10" />
    <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-red-600 shadow-2xl transition group-hover:scale-110"><FaPlay className="ml-1" size={22} aria-hidden="true" /></span>
    <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-lg bg-black/75 px-3 py-2 text-xs font-bold"><FaYoutube className="text-red-500" aria-hidden="true" />YouTube</span>
  </button>;
}
