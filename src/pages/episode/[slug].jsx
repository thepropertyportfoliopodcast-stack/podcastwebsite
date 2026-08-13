import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaApple, FaCalendarAlt, FaChevronRight, FaClock, FaMicrophoneAlt, FaPlayCircle, FaSpotify, FaTag, FaUser, FaYoutube } from "react-icons/fa";
import Layout from "@/layout/Layout";
import YouTubeChapterPlayer from "@/components/YouTubeChapterPlayer";
import SpotifyEmbed from "@/components/SpotifyEmbed";
import SyncedTranscript from "@/components/SyncedTranscript";
import TopicSuggestion from "@/components/TopicSuggestion";
import { contentPath, episodeKeywords, extractUuid, metaDescription, plainText, SITE_URL } from "@/utils/seo";
import { fallbackHosts, resolveEpisodeHosts } from "@/data/hosts";

function youtubeShortEmbed(url = "") {
  const match = url.match(/(?:youtube\.com\/(?:shorts\/|watch\?v=|embed\/)|youtu\.be\/)([^?&/]+)/i);
  return match?.[1] ? `https://www.youtube.com/embed/${match[1]}?rel=0` : "";
}

function episodeDuration(seconds, minutes) {
  const total = Number(seconds) || (Number(minutes) * 60) || 0;
  if (!total) return "Duration unavailable";
  const hours = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  return [hours ? `${hours} hr` : "", mins ? `${mins} min` : "", secs ? `${secs} sec` : ""].filter(Boolean).join(" ");
}

function episodeDate(value) {
  if (!value) return "Date unavailable";
  return new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

export default function EpisodePage({ initialData }) {
  const [expanded, setExpanded] = useState(false);
  const [spotifyPlayback, setSpotifyPlayback] = useState({ position: 0, duration: 0, isPaused: true });
  const data = initialData;
  const transcript = data.transcript || plainText(data.detail) || data.description;
  const related = Array.isArray(data.relatedEpisodes) ? data.relatedEpisodes.slice(0, 3) : [];
  const reelLinks = Array.isArray(data.reelLinks) ? data.reelLinks : [];
  const episodeHosts = resolveEpisodeHosts(data, Array.isArray(data.hostProfiles) ? data.hostProfiles : fallbackHosts);
  useEffect(() => {
    if (!spotifyPlayback.isPaused && spotifyPlayback.position > 0) setExpanded(true);
  }, [spotifyPlayback.isPaused, spotifyPlayback.position]);

  return (
    <Layout seo={{
      title: data.seoTitle || data.title,
      appendSiteName: !data.seoTitle,
      description: data.seoDescription || metaDescription(data.description || data.detail),
      keywords: episodeKeywords(data), path: contentPath("episode", data), image: data.thumbnail,
      type: "article", publishedTime: data.createdAt,
      jsonLd: { "@context": "https://schema.org", "@type": "PodcastEpisode", name: data.title, description: data.seoDescription || plainText(data.description || data.detail), datePublished: data.createdAt, duration: data.durationInSec ? `PT${data.durationInSec}S` : undefined, associatedMedia: data.youtubeUrl ? { "@type": "VideoObject", embedUrl: data.youtubeUrl } : undefined, partOfSeries: { "@type": "PodcastSeries", name: data.podcast?.name }, image: data.thumbnail, url: `${SITE_URL}${contentPath("episode", data)}` },
    }}>
      <div className="relative isolate overflow-hidden bg-[#070707] pb-16 pt-[110px] text-white md:pt-[125px]">
        <div className="pointer-events-none absolute -left-[22rem] top-44 h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,#fc18d8_0%,#9747ff_38%,transparent_70%)] opacity-35 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-[24rem] top-[58rem] h-[760px] w-[760px] rounded-full bg-[radial-gradient(circle,#9747ff_0%,#fc18d8_40%,transparent_72%)] opacity-30 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1310px] space-y-12 px-4">
          <section className="episode-hero grid items-stretch gap-5 rounded-3xl border border-white/15 bg-[#111] p-4 md:grid-cols-[minmax(220px,32%)_1fr] md:p-6">
            <div className="episode-hero-art relative aspect-square overflow-hidden rounded-2xl md:aspect-auto md:h-full">
              <Image src={data.thumbnail} alt={`${data.title} podcast artwork`} fill priority sizes="(max-width: 768px) 100vw, 430px" className="object-cover" />
            </div>
            <div className="flex min-w-0 flex-col justify-center py-1 md:py-2">
              <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-white/50 sm:text-sm"><Link href="/" className="transition hover:text-[#c99cff]">Home</Link><FaChevronRight size={9} aria-hidden="true"/><Link href="/episode" className="transition hover:text-[#c99cff]">Episodes</Link><FaChevronRight size={9} aria-hidden="true"/><span className="rounded-lg bg-gradient-to-r from-[#9747FF] to-[#FC18D8] px-3 py-1.5 font-extrabold text-white">{data.episodeNumber ? `Episode ${data.episodeNumber}` : "Episode"}</span></nav>
              <h1 className="episode-hero-title font-extrabold leading-[1.05] text-white">{data.title}</h1>
              <p className="mt-4 line-clamp-3 text-sm font-medium leading-6 text-white/65 sm:text-base sm:leading-7">{data.description}</p>

              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-3">{episodeHosts.map((host, index) => <span key={host.slug} className="flex items-center gap-3"><Link href={`/host/${host.slug}`} className="inline-flex items-center gap-2 font-bold text-[#c99cff] transition hover:text-[#FC18D8] hover:underline"><FaUser aria-hidden="true" />{host.name}</Link>{index < episodeHosts.length - 1 && <span className="text-[#c99cff]" aria-hidden="true">♦</span>}</span>)}</div>

              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-3 text-sm font-semibold text-white/65">
                <span className="inline-flex items-center gap-2"><FaCalendarAlt className="text-[#c99cff]" aria-hidden="true" />{episodeDate(data.createdAt)}</span>
                <span className="hidden text-[#c99cff] sm:inline" aria-hidden="true">|</span>
                <span className="inline-flex items-center gap-2"><FaClock className="text-[#c99cff]" aria-hidden="true" />{episodeDuration(data.durationInSec, data.duration)}</span>
                {data.topic && <><span className="hidden text-[#c99cff] sm:inline" aria-hidden="true">|</span><span className="inline-flex items-center gap-2"><FaTag className="text-[#c99cff]" aria-hidden="true" />{data.topic}</span></>}
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {data.youtubeUrl && <a href={data.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="Watch this episode on YouTube" className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/30 bg-black/30 px-4 py-3 text-sm font-bold transition hover:border-red-500 hover:text-red-400"><FaYoutube className="text-red-500" aria-hidden="true" size={21} /><span>Watch on YouTube</span></a>}
                {data.spotifyLink && <a href={data.spotifyLink} target="_blank" rel="noopener noreferrer" aria-label="Listen to this episode on Spotify" className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/30 bg-black/30 px-4 py-3 text-sm font-bold transition hover:border-[#1ed760] hover:text-[#1ed760]"><FaSpotify className="text-[#1ed760]" aria-hidden="true" size={21} /><span>Listen on Spotify</span></a>}
                {data.appleLink && <a href={data.appleLink} target="_blank" rel="noopener noreferrer" aria-label="Listen to this episode on Apple Podcasts" className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/30 bg-black/30 px-4 py-3 text-sm font-bold transition hover:border-[#c99cff] hover:text-[#c99cff] sm:col-span-2 xl:col-span-1"><FaApple className="text-[#c99cff]" aria-hidden="true" size={21} /><span>Apple Podcasts</span></a>}
              </div>
            </div>
          </section>

          {data.youtubeUrl && <YouTubeChapterPlayer url={data.youtubeUrl} timestamps={data.timestamps} />}
          {!data.youtubeUrl && data.link && <section className="overflow-hidden rounded-2xl border border-white/20 bg-black"><video src={data.link} poster={data.thumbnail} controls playsInline preload="metadata" className="mx-auto max-h-[75vh] w-full" /></section>}
          <SpotifyEmbed url={data.spotifyLink} title={data.title} onPlaybackUpdate={setSpotifyPlayback} />

          <section>
            <article className={`flex flex-col rounded-2xl border border-white/15 bg-[#111] p-6 md:p-8 ${expanded ? "h-[520px]" : "md:h-[370px]"}`}>
              <h2 className="flex items-center gap-3 text-2xl font-bold text-[#c99cff] md:text-3xl"><FaMicrophoneAlt aria-hidden="true" /><span>Episode transcript</span></h2>
              <div className={`mt-5 text-base leading-8 text-white/75 md:text-lg ${expanded ? "min-h-0 flex-1 overflow-y-auto pr-3 [scrollbar-color:#9747FF_#1b1b1b] [scrollbar-width:thin]" : "line-clamp-4 md:min-h-0 md:flex-1 md:overflow-hidden md:[display:block]"}`}><SyncedTranscript transcript={transcript} timestamps={data.timestamps} positionMs={spotifyPlayback.position} expanded={expanded}/></div>
              {transcript?.length > 350 && <button type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} className={`w-fit font-bold text-[#c99cff] hover:text-white ${expanded ? "mt-5" : "mt-auto pt-5"}`}>{expanded ? "Read less" : "Read more"}</button>}
            </article>
          </section>

          <section className="grid items-stretch gap-7 lg:grid-cols-[1fr_2fr]">
            <div className="flex min-h-0 flex-col">
              <h2 className="mb-5 flex items-center gap-3 text-3xl font-bold text-[#c99cff]"><FaPlayCircle aria-hidden="true" /><span>Related episodes</span></h2>
              <div className="grid flex-1 auto-rows-fr gap-4">{related.length ? related.map((episode) => <Link key={episode.uuid} href={contentPath("episode", episode)} className="group flex h-full min-h-[150px] gap-4 rounded-2xl border border-white/15 bg-[#111] p-4 transition hover:border-[#9747FF] hover:bg-[#151515]"><div className="relative h-full min-h-[118px] w-[118px] shrink-0 overflow-hidden rounded-xl"><Image src={episode.thumbnail} alt={`${episode.title} episode artwork`} fill sizes="118px" className="object-cover transition duration-300 group-hover:scale-105" /></div><div className="flex min-w-0 flex-1 flex-col justify-center"><h3 className="text-lg font-bold leading-snug">{episode.title}</h3><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-white/60"><span className="flex items-center gap-1.5"><FaClock className="text-[#c99cff]" aria-hidden="true" />{episodeDuration(episode.durationInSec, episode.duration)}</span>{episode.topic && <span className="flex items-center gap-1.5"><FaTag className="text-[#c99cff]" aria-hidden="true" />{episode.topic}</span>}</div></div></Link>) : <div className="h-full min-h-[300px] rounded-2xl border border-white/15 bg-[#111] p-8 text-white/60">Related episodes will appear here.</div>}</div>
            </div>
            <div className="flex min-h-0 flex-col">
              <h2 className="mb-5 flex items-center gap-3 text-3xl font-bold text-[#c99cff]"><FaYoutube aria-hidden="true" /><span>YouTube Shorts</span></h2>
              {reelLinks.length ? <div className={`grid flex-1 items-start justify-center gap-4 ${reelLinks.length === 1 ? "grid-cols-[minmax(220px,320px)]" : reelLinks.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"}`}>{reelLinks.slice(0, 4).map((url, index) => { const embedUrl = youtubeShortEmbed(url); return embedUrl ? <div key={url} className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-white/15 bg-[#111]"><iframe title={`YouTube Short ${index + 1}`} src={embedUrl} className="absolute inset-0 h-full w-full border-0" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div> : null; })}</div> : <div className="flex h-full min-h-[300px] flex-1 flex-col justify-center rounded-2xl border border-white/15 bg-[#111] p-8 text-white/60"><FaYoutube className="mb-3 text-[#c99cff]" size={32} aria-hidden="true" />YouTube Shorts will appear here when their links are added.</div>}
            </div>
          </section>

          <TopicSuggestion episodeTitle={data.title} />

        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params, res }) {
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api";
  try {
    const response = await fetch(`${apiUrl}/file/get/${encodeURIComponent(extractUuid(params.slug))}`);
    if (response.status === 404) return { notFound: true };
    if (!response.ok) throw new Error(`Episode API returned ${response.status}`);
    const payload = (await response.json())?.data;
    let episode = payload && typeof payload === "object" && !Array.isArray(payload) ? payload : null;
    if (!episode) return { notFound: true };
    try {
      const hostsResponse = await fetch(`${apiUrl}/host/get`);
      const hostsPayload = hostsResponse.ok ? (await hostsResponse.json())?.data : [];
      episode = { ...episode, hostProfiles: Array.isArray(hostsPayload) ? hostsPayload : [] };
    } catch { episode = { ...episode, hostProfiles: [] }; }
    const canonicalPath = contentPath("episode", episode);
    if (`/episode/${params.slug}` !== canonicalPath) return { redirect: { destination: canonicalPath, permanent: true } };
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    return { props: { initialData: episode } };
  } catch (error) {
    console.error("Episode SSR fetch failed:", error.message);
    return { notFound: true };
  }
}
