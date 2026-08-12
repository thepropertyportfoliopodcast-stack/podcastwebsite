import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaApple, FaInstagram, FaSpotify, FaYoutube } from "react-icons/fa";
import Layout from "@/layout/Layout";
import YouTubeChapterPlayer from "@/components/YouTubeChapterPlayer";
import { contentPath, episodeKeywords, extractUuid, metaDescription, plainText, SITE_URL } from "@/utils/seo";
import { mockDataEnabled, mockEpisode } from "@/data/mockPodcast";

const hosts = [
  { name: "Parag Dixit", designation: "Mortgage & Investment Strategy Expert", image: "/paragimg.jpg", accent: "from-[#9747FF] to-[#FC18D8]" },
  { name: "Julius Dabre", designation: "Property Acquisition Specialist", image: "/juliusimg.jpg", accent: "from-[#FC18D8] to-[#ff7ad9]" },
  { name: "Mudit Khandelwal", designation: "Strategic Finance Director", image: "/muditimg.jpg", accent: "from-[#6f5cff] to-[#9747FF]" },
];

function instagramEmbed(url = "") {
  const clean = url.split("?")[0].replace(/\/$/, "");
  return clean ? `${clean}/embed` : "";
}

export default function EpisodePage({ initialData }) {
  const [expanded, setExpanded] = useState(false);
  const data = initialData;
  const transcript = data.transcript || plainText(data.detail) || data.description;
  const topics = Array.isArray(data.topicsCovered) && data.topicsCovered.length
    ? data.topicsCovered
    : [data.topic].filter(Boolean);
  const related = (Array.isArray(data.podcast?.episodes) ? data.podcast.episodes : [])
    .filter((episode) => episode.uuid !== data.uuid)
    .slice(0, 2);
  const reelLinks = Array.isArray(data.reelLinks) ? data.reelLinks : [];

  return (
    <Layout seo={{
      title: data.seoTitle || data.title,
      appendSiteName: !data.seoTitle,
      description: data.seoDescription || metaDescription(data.description || data.detail),
      keywords: episodeKeywords(data), path: contentPath("episode", data), image: data.thumbnail,
      type: "article", publishedTime: data.createdAt,
      jsonLd: { "@context": "https://schema.org", "@type": "PodcastEpisode", name: data.title, description: data.seoDescription || plainText(data.description || data.detail), datePublished: data.createdAt, duration: data.durationInSec ? `PT${data.durationInSec}S` : undefined, associatedMedia: data.youtubeUrl ? { "@type": "VideoObject", embedUrl: data.youtubeUrl } : undefined, partOfSeries: { "@type": "PodcastSeries", name: data.podcast?.name }, image: data.thumbnail, url: `${SITE_URL}${contentPath("episode", data)}` },
    }}>
      <div className="bg-[#070707] pb-16 pt-[110px] text-white md:pt-[125px]">
        <div className="mx-auto max-w-[1310px] space-y-12 px-4">
          <section className="grid items-center gap-7 rounded-3xl border border-white/15 bg-[#111] p-5 md:grid-cols-[360px_1fr] md:p-8 lg:grid-cols-[430px_1fr]">
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image src={data.thumbnail} alt={`${data.title} podcast artwork`} fill priority sizes="(max-width: 768px) 100vw, 430px" className="object-cover" />
            </div>
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[.2em] text-[#c99cff]">The Property Portfolio Podcast</p>
              <h1 className="text-3xl font-extrabold leading-tight md:text-5xl lg:text-6xl">{data.title}</h1>
              <p className="mt-4 text-base text-white/70 md:text-lg">Hosted by {data.podcast?.author}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                {data.youtubeUrl && <a href={data.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="Watch this episode on YouTube" className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/5 hover:bg-red-600"><FaYoutube aria-hidden="true" size={23} /></a>}
                {data.spotifyLink && <a href={data.spotifyLink} target="_blank" rel="noopener noreferrer" aria-label="Listen on Spotify" className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/5 hover:bg-green-600"><FaSpotify aria-hidden="true" size={23} /></a>}
                {data.appleLink && <a href={data.appleLink} target="_blank" rel="noopener noreferrer" aria-label="Listen on Apple Podcasts" className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/5 hover:bg-purple-600"><FaApple aria-hidden="true" size={23} /></a>}
              </div>
            </div>
          </section>

          {data.youtubeUrl && <YouTubeChapterPlayer url={data.youtubeUrl} timestamps={data.timestamps} />}
          {!data.youtubeUrl && data.link && <section className="overflow-hidden rounded-2xl border border-white/20 bg-black"><video src={data.link} poster={data.thumbnail} controls playsInline preload="metadata" className="mx-auto max-h-[75vh] w-full" /></section>}

          <section className={`grid gap-6 lg:grid-cols-[330px_1fr] ${expanded ? "lg:items-start" : "lg:items-stretch"}`}>
            <aside className={`flex flex-col rounded-2xl border border-white/15 bg-[#111] p-6 ${expanded ? "lg:h-auto lg:self-start" : "lg:h-[370px]"}`}>
              <div className="shrink-0">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#c99cff]">In this conversation</p>
                <h2 className="text-2xl font-bold">Topics covered</h2>
              </div>
              <ul className={`mt-5 space-y-3 pr-2 ${expanded ? "" : "lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:[scrollbar-color:#9747FF_#1b1b1b] lg:[scrollbar-width:thin]"}`}>{topics.map((topic, index) => <li key={`${topic}-${index}`} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/85"><span className="font-bold text-[#c99cff]">{String(index + 1).padStart(2, "0")}</span><span>{topic}</span></li>)}</ul>
            </aside>
            <article className={`flex flex-col rounded-2xl border border-white/15 bg-[#111] p-6 md:p-8 ${expanded ? "" : "lg:h-[370px]"}`}>
              <h2 className="text-2xl font-bold md:text-3xl">Episode transcript</h2>
              <div className={`mt-5 whitespace-pre-wrap text-base leading-8 text-white/75 md:text-lg ${expanded ? "" : "line-clamp-4"}`}>{transcript}</div>
              {transcript?.length > 350 && <button type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} className={`w-fit font-bold text-[#c99cff] hover:text-white ${expanded ? "mt-5" : "mt-auto pt-5"}`}>{expanded ? "Read less" : "Read more"}</button>}
            </article>
          </section>

          <section className="grid items-stretch gap-7 lg:grid-cols-[1fr_2fr]">
            <div className="flex min-h-0 flex-col">
              <h2 className="mb-5 text-3xl font-bold">Related episodes</h2>
              <div className="grid flex-1 auto-rows-fr gap-4">{related.length ? related.map((episode) => <Link key={episode.uuid} href={contentPath("episode", episode)} className="group flex h-full min-h-[150px] gap-4 rounded-2xl border border-white/15 bg-[#111] p-4 transition hover:border-[#9747FF] hover:bg-[#151515]"><div className="relative h-full min-h-[118px] w-[118px] shrink-0 overflow-hidden rounded-xl"><Image src={episode.thumbnail} alt={`${episode.title} episode artwork`} fill sizes="118px" className="object-cover transition duration-300 group-hover:scale-105" /></div><h3 className="self-center text-lg font-bold leading-snug">{episode.title}</h3></Link>) : <div className="h-full min-h-[300px] rounded-2xl border border-white/15 bg-[#111] p-8 text-white/60">Related episodes will appear here.</div>}</div>
            </div>
            <div className="flex min-h-0 flex-col">
              <h2 className="mb-5 text-3xl font-bold">Episode reels</h2>
              {reelLinks.length ? <div className="grid flex-1 items-stretch gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">{reelLinks.slice(0, 4).map((url, index) => <div key={url} className="relative aspect-[9/16] min-h-0 overflow-hidden rounded-2xl border border-white/15 bg-[#111]"><iframe title={`Instagram episode reel ${index + 1}`} src={instagramEmbed(url)} className="absolute inset-0 h-full w-full border-0" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>)}</div> : <div className="flex h-full min-h-[300px] flex-1 flex-col justify-center rounded-2xl border border-white/15 bg-[#111] p-8 text-white/60"><FaInstagram className="mb-3 text-[#c99cff]" size={32} aria-hidden="true" />Reels will appear here when their Instagram links are added.</div>}
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0d0d0d] px-5 py-10 md:px-10 md:py-14">
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#9747FF]/20 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-[#FC18D8]/15 blur-3xl" aria-hidden="true" />
            <div className="relative mx-auto mb-10 max-w-2xl text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-[#c99cff]">Experience behind every conversation</p>
              <h2 className="text-3xl font-extrabold uppercase md:text-5xl">Meet the minds behind the mic</h2>
              <p className="mt-4 text-white/60">Finance, acquisition and property strategy expertise brought together in one conversation.</p>
            </div>
            <div className="relative grid gap-5 md:grid-cols-3">{hosts.map((host, index) => <article key={host.name} className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/15 bg-white/[0.045] p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-2 hover:border-white/30 ${index === 1 ? "md:-translate-y-4 md:hover:-translate-y-6" : ""}`}><div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${host.accent}`} aria-hidden="true" /><span className="absolute right-5 top-4 text-5xl font-black text-white/[0.04]" aria-hidden="true">0{index + 1}</span><div className="relative mx-auto mt-3 h-44 w-44"><div className={`absolute inset-0 rounded-full bg-gradient-to-br ${host.accent} opacity-50 blur-xl transition group-hover:opacity-80`} aria-hidden="true" /><div className="relative h-full w-full overflow-hidden rounded-full border-2 border-white/30"><Image src={host.image} alt={host.name} fill sizes="176px" className="object-cover transition duration-500 group-hover:scale-105" /></div></div><div className="mt-7 flex flex-1 flex-col text-center"><h3 className="text-2xl font-extrabold">{host.name}</h3><div className={`mx-auto my-4 h-px w-16 bg-gradient-to-r ${host.accent}`} aria-hidden="true" /><p className="text-sm font-semibold leading-6 text-white/70">{host.designation}</p></div></article>)}</div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params, res }) {
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api";
  if (mockDataEnabled()) {
    return { props: { initialData: mockEpisode } };
  }
  try {
    const response = await fetch(`${apiUrl}/file/get/${encodeURIComponent(extractUuid(params.slug))}`);
    if (response.status === 404) return { notFound: true };
    if (!response.ok) throw new Error(`Episode API returned ${response.status}`);
    const payload = (await response.json())?.data;
    const episode = payload && typeof payload === "object" && !Array.isArray(payload) ? payload : null;
    if (!episode) return { notFound: true };
    const canonicalPath = contentPath("episode", episode);
    if (`/episode/${params.slug}` !== canonicalPath) return { redirect: { destination: canonicalPath, permanent: true } };
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    return { props: { initialData: episode } };
  } catch (error) {
    console.error("Episode SSR fetch failed:", error.message);
    return { notFound: true };
  }
}
