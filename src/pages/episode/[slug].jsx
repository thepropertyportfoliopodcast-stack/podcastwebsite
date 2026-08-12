import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaApple, FaInstagram, FaSpotify, FaYoutube } from "react-icons/fa";
import Layout from "@/layout/Layout";
import YouTubeChapterPlayer from "@/components/YouTubeChapterPlayer";
import { contentPath, episodeKeywords, extractUuid, metaDescription, plainText, SITE_URL } from "@/utils/seo";

const hosts = [
  { name: "Parag Dixit", designation: "Mortgage & Investment Strategy Expert", image: "/paragimg.jpg" },
  { name: "Julius Dabre", designation: "Property Acquisition Specialist", image: "/juliusimg.jpg" },
  { name: "Mudit Khandelwal", designation: "Strategic Finance Director", image: "/muditimg.jpg" },
];

function instagramEmbed(url = "") {
  const clean = url.split("?")[0].replace(/\/$/, "");
  return clean ? `${clean}/embed` : "";
}

export default function EpisodePage({ initialData }) {
  const [expanded, setExpanded] = useState(false);
  const data = initialData;
  const transcript = data.transcript || plainText(data.detail) || data.description;
  const topics = data.topicsCovered?.length ? data.topicsCovered : [data.topic].filter(Boolean);
  const related = (data.podcast?.episodes || []).filter((episode) => episode.uuid !== data.uuid).slice(0, 2);

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

          <section className="grid gap-6 lg:grid-cols-[330px_1fr]">
            <aside className="rounded-2xl border border-white/15 bg-[#111] p-6">
              <h2 className="text-2xl font-bold">Topics covered</h2>
              <ul className="mt-5 space-y-3">{topics.map((topic) => <li key={topic} className="rounded-xl bg-white/5 px-4 py-3 text-white/85">{topic}</li>)}</ul>
            </aside>
            <article className="rounded-2xl border border-white/15 bg-[#111] p-6 md:p-8">
              <h2 className="text-2xl font-bold md:text-3xl">Episode transcript</h2>
              <div className={`mt-5 whitespace-pre-wrap text-base leading-8 text-white/75 md:text-lg ${expanded ? "" : "line-clamp-4"}`}>{transcript}</div>
              {transcript?.length > 350 && <button type="button" onClick={() => setExpanded((value) => !value)} className="mt-5 font-bold text-[#c99cff] hover:text-white">{expanded ? "Read less" : "Read more"}</button>}
            </article>
          </section>

          <section className="grid gap-7 lg:grid-cols-[1fr_2fr]">
            <div>
              <h2 className="mb-5 text-3xl font-bold">Related episodes</h2>
              <div className="space-y-4">{related.map((episode) => <Link key={episode.uuid} href={contentPath("episode", episode)} className="flex gap-4 rounded-2xl border border-white/15 bg-[#111] p-3 hover:border-[#9747FF]"><div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl"><Image src={episode.thumbnail} alt="" fill sizes="96px" className="object-cover" /></div><h3 className="self-center font-bold leading-snug">{episode.title}</h3></Link>)}</div>
            </div>
            <div>
              <h2 className="mb-5 text-3xl font-bold">Episode reels</h2>
              {data.reelLinks?.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{data.reelLinks.slice(0, 4).map((url) => <div key={url} className="h-[500px] overflow-hidden rounded-2xl border border-white/15 bg-[#111]"><iframe title="Instagram episode reel" src={instagramEmbed(url)} className="h-full w-full" loading="lazy" allow="autoplay; encrypted-media" /></div>)}</div> : <div className="rounded-2xl border border-white/15 bg-[#111] p-8 text-white/60"><FaInstagram className="mb-3" size={28} />Reels will appear here when their Instagram links are added.</div>}
            </div>
          </section>

          <section>
            <h2 className="mb-7 text-center text-3xl font-extrabold uppercase md:text-4xl">Meet the hosts</h2>
            <div className="grid gap-5 md:grid-cols-3">{hosts.map((host) => <article key={host.name} className="rounded-2xl border border-white/15 bg-[#111] p-6 text-center"><div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full border-2 border-[#9747FF]"><Image src={host.image} alt={host.name} fill sizes="160px" className="object-cover" /></div><h3 className="mt-5 text-xl font-bold">{host.name}</h3><p className="mt-2 text-[#c99cff]">{host.designation}</p></article>)}</div>
          </section>
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
    const episode = (await response.json())?.data;
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
