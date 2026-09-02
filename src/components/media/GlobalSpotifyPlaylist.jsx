import { useEffect, useState } from "react";
import { FaSpotify } from "react-icons/fa";

function embedUrl(value = "") {
  try {
    const url = new URL(value.trim());
    if (url.hostname !== "open.spotify.com") return "";
    const parts = url.pathname.split("/").filter(Boolean);
    const start = parts[0]?.startsWith("intl-") ? 1 : 0;
    const type = parts[start];
    const id = parts[start + 1];
    if (!["playlist", "show", "episode", "album"].includes(type) || !id) return "";
    return `https://open.spotify.com/embed/${type}/${encodeURIComponent(id)}?utm_source=generator&theme=0`;
  } catch { return ""; }
}

export default function GlobalSpotifyPlaylist() {
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const playlistUrl = process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_URL || "";
  const src = embedUrl(playlistUrl);
  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    let aboutObserver;

    const revealPlayer = () => {
      setScrolledPastHero(true);
      setShouldLoad(true);
    };

    if (mobileQuery.matches) {
      const aboutSection = document.getElementById("home-about-podcast");
      if (aboutSection) {
        aboutObserver = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              revealPlayer();
              aboutObserver?.disconnect();
            }
          },
          { rootMargin: "0px 0px -35% 0px", threshold: 0.05 },
        );
        aboutObserver.observe(aboutSection);
      }
      return () => aboutObserver?.disconnect();
    }

    let frameId = 0;
    const updateVisibility = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        const visible = window.scrollY >= Math.max(180, window.innerHeight * .62);
        setScrolledPastHero((current) => current === visible ? current : visible);
        if (visible) setShouldLoad(true);
      });
    };
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    return () => { window.removeEventListener("scroll", updateVisibility); window.removeEventListener("resize", updateVisibility); if (frameId) window.cancelAnimationFrame(frameId); aboutObserver?.disconnect(); };
  }, []);
  if (!src) return null;
  return <aside className={`global-spotify-player ${scrolledPastHero ? "is-scroll-visible" : ""}`} aria-label="The Property Portfolio Podcast on Spotify">
    <div className="global-spotify-label"><FaSpotify aria-hidden="true"/><span>Listen on Spotify</span></div>
    <div className="global-spotify-embed">
      {shouldLoad && <iframe title="The Property Portfolio Podcast on Spotify" src={src} width="100%" height="80" loading="lazy" scrolling="no" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" />}
    </div>
  </aside>;
}
