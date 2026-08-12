function spotifyEmbedUrl(value = "") {
  try {
    const url = new URL(value.trim());
    if (url.hostname !== "open.spotify.com") return "";
    const parts = url.pathname.split("/").filter(Boolean);
    const localeIndex = parts[0]?.startsWith("intl-") ? 1 : 0;
    const type = parts[localeIndex];
    const id = parts[localeIndex + 1];
    if (!["episode", "show", "track"].includes(type) || !id) return "";
    return `https://open.spotify.com/embed/${type}/${encodeURIComponent(id)}?utm_source=generator&theme=0`;
  } catch {
    return "";
  }
}

export default function SpotifyEmbed({ url, title }) {
  const src = spotifyEmbedUrl(url);
  if (!src) return null;
  return (
    <section className="overflow-hidden rounded-2xl border border-white/15 bg-[#111] p-4 sm:p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[.22em] text-[#1ed760]">Listen on Spotify</p><h2 className="mt-1 text-xl font-bold sm:text-2xl">Full podcast episode</h2></div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-full border border-[#1ed760]/50 px-4 py-2 text-sm font-bold text-[#1ed760] transition hover:bg-[#1ed760] hover:text-black">Open Spotify</a>
      </div>
      <iframe title={`Listen to ${title || "this episode"} on Spotify`} src={src} width="100%" height="232" className="block h-[152px] w-full rounded-xl border-0 sm:h-[232px]" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" />
    </section>
  );
}
