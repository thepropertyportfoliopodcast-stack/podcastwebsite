import Image from "next/image";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import PublicEpisodeCard from "@/components/episodes/PublicEpisodeCard";
import { fallbackHosts } from "@/data/hosts";
import { metaDescription } from "@/utils/seo";

function paragraphs(value = "") {
  return String(value)
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .split(/\n\s*\n|\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default function HostProfile({ host }) {
  const biography = paragraphs(host.bio);

  return (
    <PublicLayout seo={{
      title: host.seoTitle || `${host.name} | Podcast Host`,
      description: host.seoDescription || metaDescription(host.bio),
      keywords: [host.primaryKeyword, host.secondaryKeywords, host.designation, "Australian property podcast host"].filter(Boolean).join(", "),
      path: `/host/${host.slug}`,
      image: host.image,
    }}>
      <main className="relative isolate min-h-screen overflow-hidden bg-[#070707] pb-20 pt-[120px] text-white sm:pt-[135px] lg:pt-[150px]">
        <div className="pointer-events-none absolute -left-80 top-20 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(252,24,216,.38)_0%,rgba(151,71,255,.24)_40%,transparent_70%)] blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6">
          <section className="grid items-start gap-8 rounded-[26px] border border-white/15 bg-[#111]/90 p-5 backdrop-blur sm:p-7 lg:grid-cols-[minmax(300px,420px)_minmax(0,1fr)] lg:gap-11 lg:p-10">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl">
              <Image src={host.image} alt={`${host.name}, ${host.designation}`} fill priority sizes="(max-width:1023px) calc(100vw - 72px), 420px" className="object-cover object-top" />
            </div>
            <div className="min-w-0">
              <p className="font-bold uppercase tracking-[.22em] text-[#c99cff]">Podcast host</p>
              <h1 className="mt-3 break-words bg-gradient-to-r from-[#9747FF] to-[#FC18D8] bg-clip-text text-4xl font-black leading-tight text-transparent sm:text-5xl lg:text-6xl">{host.name}</h1>
              <p className="mt-4 text-lg font-bold text-white/80 sm:text-xl">{host.designation}</p>
              {host.shortBio && (
                <p className="mt-7 rounded-2xl border-l-4 border-[#FC18D8] bg-gradient-to-r from-[#9747FF]/20 to-[#FC18D8]/5 px-5 py-4 text-lg font-semibold leading-8 text-white/90">
                  {host.shortBio}
                </p>
              )}
              <div className="mt-7 space-y-5 text-base leading-8 text-white/70 sm:text-lg">
                {biography.map((paragraph, index) => <p key={`${host.slug}-bio-${index}`}>{paragraph}</p>)}
              </div>
              {host.linkedinUrl && <Link href={host.linkedinUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex rounded-full border border-white/20 px-6 py-3 font-bold transition hover:border-[#c99cff] hover:text-[#c99cff]">Connect on LinkedIn</Link>}
            </div>
          </section>

          {Array.isArray(host.episodes) && host.episodes.length > 0 && (
            <section className="mt-14 sm:mt-16">
              <h2 className="mb-7 text-3xl font-extrabold sm:text-4xl">Episodes featuring {host.name}</h2>
              <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
                {host.episodes.map((episode) => <PublicEpisodeCard key={episode.uuid} episode={episode} />)}
              </div>
            </section>
          )}
        </div>
      </main>
    </PublicLayout>
  );
}

export async function getServerSideProps({ params, res }) {
  const fallback = fallbackHosts.find((host) => host.slug === params.slug);
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api";
  try {
    const response = await fetch(`${apiUrl}/host/get/${encodeURIComponent(params.slug)}`);
    if (!response.ok) throw new Error();
    const host = (await response.json())?.data;
    if (!host) return { notFound: true };
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    return { props: { host } };
  } catch {
    return fallback ? { props: { host: { ...fallback, episodes: [] } } } : { notFound: true };
  }
}
