import { useState } from "react";
import { FaApple } from "react-icons/fa";

function appleEntity(value = "") {
  try {
    const url = new URL(value.trim());
    if (!url.hostname.includes("podcasts.apple.com")) return null;
    const embedUrl = value.trim().replace("podcasts.apple.com", "embed.podcasts.apple.com");
    return { originalUrl: value, embedUrl };
  } catch {
    return null;
  }
}

export default function ApplePodcastEmbed({ url, title }) {
  const [activated, setActivated] = useState(false);
  const entity = appleEntity(url);

  if (!entity) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-[#8d2dcc]/20 bg-white/80 p-4 text-[#201527] shadow-[0_18px_45px_rgba(69,36,82,.08)] sm:p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.22em] text-[#7b249d]">Listen on Apple</p>
          <h2 className="mt-1 flex items-center gap-3 text-xl font-bold text-[#6f218f] sm:text-2xl">
            <FaApple aria-hidden="true" />
            <span>Apple Podcasts</span>
          </h2>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full border border-[#7b249d]/50 px-4 py-2 text-sm font-bold text-[#7b249d] transition hover:bg-[#7b249d] hover:text-white"
        >
          Open Apple
        </a>
      </div>

      {!activated ? (
        <button
          type="button"
          onClick={() => setActivated(true)}
          className="flex h-[152px] w-full items-center justify-center rounded-xl border border-[#7b249d]/35 bg-[radial-gradient(circle_at_center,rgba(151,71,255,.10),transparent_62%),#fcfaff] text-[#201527] transition hover:border-[#7b249d] sm:h-[232px]"
          aria-label={`Load ${title} Apple player`}
        >
          <span className="flex flex-col items-center gap-3">
            <FaApple className="text-[#7b249d]" size={48} aria-hidden="true" />
            <strong className="text-lg">Play on Apple Podcasts</strong>
            <small className="text-[#5f5366]">Load the full episode player</small>
          </span>
        </button>
      ) : (
        <div className="h-[152px] overflow-hidden rounded-xl sm:h-[232px]">
          <iframe
            src={entity.embedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            className="w-full rounded-xl border-0"
            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
            loading="lazy"
            title={title || "Apple Podcast Episode"}
          />
        </div>
      )}
    </section>
  );
}