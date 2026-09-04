import Image from "next/image";
import Link from "next/link";
import { FaClock, FaPlay } from "react-icons/fa";
import { contentPath } from "@/utils/seo";
import { episodeWebsiteArtwork, hasWebsiteEpisodeArtwork } from "@/utils/episodeArtwork";

function formatEpisodeDate(value) {
  if (!value) return "LATEST";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "LATEST";
  return date
    .toLocaleDateString("en-AU", { day: "2-digit", month: "short" })
    .toUpperCase();
}

export default function PublicEpisodeCard({ episode, imagePriority = false }) {
  const href = contentPath("episode", episode);
  const artwork = episodeWebsiteArtwork(episode);
  const hasWebsiteArtwork = hasWebsiteEpisodeArtwork(episode);
  const minutes =
    Number(episode?.duration) ||
    (episode?.durationInSec
      ? Math.ceil(Number(episode.durationInSec) / 60)
      : 0);

  return (
    <Link
      href={href}
      prefetch={false}
      className="episode-grid-card group flex h-full min-w-0 flex-col text-inherit no-underline"
    >
      <article className="episode-card-surface flex h-full flex-col">
        <div className="episode-grid-image relative overflow-visible rounded-[22px]">
          <div className="absolute inset-0 overflow-hidden rounded-[22px]">
            {artwork && (
              <Image
                src={artwork}
                alt={episode?.title ? `${episode.title} website thumbnail` : "Podcast episode thumbnail"}
                fill
                sizes="(max-width:639px) calc(100vw - 32px), (max-width:1023px) 50vw, 420px"
                quality={68}
                priority={imagePriority}
                fetchPriority={imagePriority ? "high" : "auto"}
                className={`episode-card-artwork transition duration-500 group-hover:brightness-105 ${hasWebsiteArtwork ? "object-cover" : "episode-card-artwork--rss object-contain"}`}
              />
            )}
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-white/10 opacity-80"
              aria-hidden="true"
            />
          </div>

          <span
            className="episode-grid-play absolute right-4 top-4 z-10 grid h-12 w-12 place-items-center rounded-full"
            aria-hidden="true"
          >
            <FaPlay className="ml-0.5 text-sm" />
          </span>

          <div className="episode-meta-pill absolute -bottom-6 left-4 right-4 z-10 flex min-h-[54px] items-center justify-between gap-2.5 rounded-2xl px-3.5">
            <span className="episode-card-chip rounded-lg px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[.08em]">
              {episode?.episodeNumber
                ? `EP ${episode.episodeNumber}`
                : "EPISODE"}
            </span>
            <span className="episode-card-meta ml-auto text-[11px] font-bold uppercase tracking-[.04em]">
              {formatEpisodeDate(episode?.publishedAt || episode?.createdAt)}
            </span>
            <span className="episode-card-divider" aria-hidden="true">|</span>
            <span className="episode-card-meta inline-flex shrink-0 items-center gap-1.5 text-[11px] font-bold uppercase">
              <FaClock className="episode-card-icon" aria-hidden="true" />
              {minutes ? `${minutes} min` : "Listen"}
            </span>
          </div>
        </div>

        <div className="episode-card-content flex flex-1 flex-col px-5 pb-6 pt-10">
          <p className="episode-card-topic mb-2 text-[11px] font-black uppercase tracking-[.16em]">
            {episode?.topic || "Property insights"}
          </p>
          <h3 className="episode-card-title line-clamp-2 min-h-[3rem] text-lg font-bold leading-snug">
            {episode?.title}
          </h3>
          <p className="episode-card-description mt-2.5 line-clamp-3 min-h-[4.2rem] text-xs font-medium leading-relaxed">
            {episode?.description ||
              "Listen for practical Australian property insights and clear strategies for your next decision."}
          </p>
        </div>
      </article>
    </Link>
  );
}
