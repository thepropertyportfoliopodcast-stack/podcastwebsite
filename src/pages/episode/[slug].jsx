import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaApple, FaInstagram, FaSpotify, FaYoutube } from "react-icons/fa";
import Layout from "@/layout/Layout";
import YouTubeChapterPlayer from "@/components/YouTubeChapterPlayer";
import SpotifyEmbed from "@/components/SpotifyEmbed";
import { contentPath, episodeKeywords, extractUuid, metaDescription, plainText, SITE_URL } from "@/utils/seo";
import { getMockEpisode, mockDataEnabled } from "@/data/mockPodcast";
import { fallbackHosts, fixedShowcaseHosts, resolveEpisodeHosts } from "@/data/hosts";

const hostAccents = ["from-[#FC18D8] to-[#ff7ad9]", "from-[#9747FF] to-[#FC18D8]", "from-[#6f5cff] to-[#9747FF]"];

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
  const episodeHosts = resolveEpisodeHosts(data, Array.isArray(data.hostProfiles) ? data.hostProfiles : fallbackHosts);

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
          <section className="grid items-center gap-7 rounded-3xl border border-white/15 bg-[#111] p-5 md:grid-cols-[360px_1fr] md:p-8 lg:grid-cols-[430px_1fr]">
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image src={data.thumbnail} alt={`${data.title} podcast artwork`} fill priority sizes="(max-width: 768px) 100vw, 430px" className="object-cover" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-[#9747FF] via-[#d536f0] to-[#FC18D8] bg-clip-text text-3xl font-extrabold leading-tight text-transparent md:text-5xl lg:text-6xl">{data.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-1.5 text-base text-white/70 md:text-lg"><span>Hosted by</span>{episodeHosts.map((host, index) => <span key={host.slug} className="contents"><Link href={`/host/${host.slug}`} className="font-bold text-[#c99cff] transition hover:text-[#FC18D8] hover:underline">{host.name}</Link>{index < episodeHosts.length - 1 && <span aria-hidden="true">{index === episodeHosts.length - 2 ? "and" : ","}</span>}</span>)}</div>
              <div className="mt-7 flex flex-wrap gap-3">
                {data.youtubeUrl && <a href={data.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="Watch this episode on YouTube" className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/5 hover:bg-red-600"><FaYoutube aria-hidden="true" size={23} /></a>}
                {data.spotifyLink && <a href={data.spotifyLink} target="_blank" rel="noopener noreferrer" aria-label="Listen on Spotify" className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/5 hover:bg-green-600"><FaSpotify aria-hidden="true" size={23} /></a>}
                {data.appleLink && <a href={data.appleLink} target="_blank" rel="noopener noreferrer" aria-label="Listen on Apple Podcasts" className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/5 hover:bg-purple-600"><FaApple aria-hidden="true" size={23} /></a>}
              </div>
            </div>
          </section>

          {data.youtubeUrl && <YouTubeChapterPlayer url={data.youtubeUrl} timestamps={data.timestamps} />}
          {!data.youtubeUrl && data.link && <section className="overflow-hidden rounded-2xl border border-white/20 bg-black"><video src={data.link} poster={data.thumbnail} controls playsInline preload="metadata" className="mx-auto max-h-[75vh] w-full" /></section>}
          <SpotifyEmbed url={data.spotifyLink} title={data.title} />

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

          <section className="relative isolate overflow-hidden rounded-[36px] border border-white/10 bg-[#090909] px-5 py-12 md:px-10 md:py-16 lg:px-14">
            <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9747FF]/25 blur-[100px]" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-[#FC18D8]/15 blur-[90px]" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-44 -right-20 h-80 w-80 rounded-full bg-[#6f5cff]/15 blur-[90px]" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-x-10 top-[46%] hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block" aria-hidden="true" />

            <div className="relative mx-auto mb-12 max-w-2xl text-center md:mb-16">
              <h2 className="text-3xl font-extrabold md:text-5xl">Meet the minds behind the mic</h2>
              <p className="mt-4 text-white/60">Finance, acquisition and property strategy expertise brought together in one conversation.</p>
            </div>

            <div className="relative overflow-x-auto pb-4">
            <div className="grid min-w-[820px] grid-cols-3 items-end gap-6 px-1 pt-10">
              {fixedShowcaseHosts.map((host, index) => (
                <article
                  key={host.name}
                  className={`group relative overflow-hidden rounded-[30px] border border-white/15 bg-[#111] shadow-2xl transition duration-500 hover:-translate-y-3 hover:border-white/40 hover:shadow-[#9747FF]/20 ${index === 1 ? "mb-10" : ""}`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={host.image}
                      alt={host.name}
                      fill
                      sizes="(max-width: 767px) 100vw, 33vw"
                      className="object-cover object-top transition duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/5 to-transparent" aria-hidden="true" />
                    <div className={`absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t ${hostAccents[index]} opacity-25 blur-2xl transition duration-500 group-hover:opacity-45`} aria-hidden="true" />
                    <span className="absolute left-5 top-5 rounded-full border border-white/25 bg-black/35 px-3 py-1 text-xs font-extrabold tracking-[0.2em] text-white/80 backdrop-blur-md">
                      HOST 0{index + 1}
                    </span>
                    <span className="absolute -right-2 top-2 text-[92px] font-black leading-none text-white/[0.08] transition duration-500 group-hover:text-white/[0.13]" aria-hidden="true">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="relative -mt-20 p-6 pt-0 md:p-7 md:pt-0">
                    <div className="rounded-2xl border border-white/15 bg-black/55 p-5 backdrop-blur-xl transition duration-500 group-hover:border-white/25 group-hover:bg-black/70">
                      <div className={`mb-4 h-1 w-12 rounded-full bg-gradient-to-r ${hostAccents[index]} transition-all duration-500 group-hover:w-20`} aria-hidden="true" />
                      <h3 className="whitespace-nowrap text-xl font-extrabold lg:text-[26px]">{host.name}</h3>
                      <p className="mt-3 min-h-[48px] text-sm font-semibold leading-6 text-white/65">{host.designation}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params, res }) {
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api";
  if (mockDataEnabled()) {
    const episode = getMockEpisode(params.slug);
    if (!episode) return { notFound: true };
    const canonicalPath = contentPath("episode", episode);
    if (`/episode/${params.slug}` !== canonicalPath) return { redirect: { destination: canonicalPath, permanent: false } };
    return { props: { initialData: { ...episode, hostProfiles: fallbackHosts } } };
  }
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
