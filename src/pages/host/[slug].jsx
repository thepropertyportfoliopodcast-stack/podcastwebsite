import Image from "next/image";
import Link from "next/link";
import Layout from "@/layout/Layout";
import EpisodeCard from "@/common/EpisodeCard";
import { fallbackHosts } from "@/data/hosts";
import { metaDescription } from "@/utils/seo";

export default function HostProfile({ host }) {
  return <Layout seo={{ title: host.seoTitle || `${host.name} | Podcast Host`, description: host.seoDescription || metaDescription(host.bio), keywords: [host.primaryKeyword, host.secondaryKeywords, host.designation, "Australian property podcast host"].filter(Boolean).join(", "), path: `/host/${host.slug}`, image: host.image }}><main className="relative isolate overflow-hidden bg-[#070707] pb-20 pt-[120px] text-white"><div className="absolute -left-80 top-20 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,#fc18d8_0%,#9747ff_38%,transparent_70%)] opacity-30 blur-3xl"/><div className="relative mx-auto max-w-[1200px] px-4"><section className="grid items-center gap-10 rounded-[32px] border border-white/15 bg-[#111]/90 p-6 backdrop-blur md:grid-cols-[420px_1fr] md:p-10"><div className="relative aspect-[4/5] overflow-hidden rounded-3xl"><Image src={host.image} alt={host.name} fill priority sizes="(max-width:768px) 100vw,420px" className="object-cover object-top"/></div><div><p className="font-bold uppercase tracking-[.25em] text-[#c99cff]">Podcast host</p><h1 className="mt-3 bg-gradient-to-r from-[#9747FF] to-[#FC18D8] bg-clip-text text-5xl font-black text-transparent md:text-7xl">{host.name}</h1><p className="mt-5 text-xl font-bold text-white/80">{host.designation}</p><p className="mt-7 text-lg leading-8 text-white/65">{host.bio}</p>{host.linkedinUrl && <Link href={host.linkedinUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-block rounded-full border border-white/20 px-6 py-3 font-bold">Connect on LinkedIn</Link>}</div></section>{Array.isArray(host.episodes) && host.episodes.length > 0 && <section className="mt-16"><h2 className="mb-7 text-4xl font-extrabold">Episodes featuring {host.name}</h2><div className="space-y-7">{host.episodes.map((episode) => <EpisodeCard key={episode.uuid} episode={episode}/>)}</div></section>}</div></main></Layout>;
}

export async function getServerSideProps({ params, res }) {
  const fallback = fallbackHosts.find((host) => host.slug === params.slug);
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api";
  try { const response = await fetch(`${apiUrl}/host/get/${encodeURIComponent(params.slug)}`); if (!response.ok) throw new Error(); const host = (await response.json())?.data; if (!host) return { notFound: true }; res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600"); return { props: { host } }; } catch { return fallback ? { props: { host: { ...fallback, episodes: [] } } } : { notFound: true }; }
}
