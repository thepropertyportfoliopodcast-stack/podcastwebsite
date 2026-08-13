import { useEffect, useState } from "react";
import { FaSpotify } from "react-icons/fa";
import Head from "next/head";

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
  const playlistUrl = process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_URL || "";
  const src = embedUrl(playlistUrl);
  useEffect(() => {
    const updateVisibility = () => setScrolledPastHero(window.scrollY >= Math.max(180, window.innerHeight * .62));
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    return () => { window.removeEventListener("scroll", updateVisibility); window.removeEventListener("resize", updateVisibility); };
  }, []);
  if (!src) return null;
  return <><Head>
    <link rel="preconnect" href="https://open.spotify.com" />
    <link rel="preconnect" href="https://i.scdn.co" crossOrigin="anonymous" />
    <link rel="preconnect" href="https://image-cdn-ak.spotifycdn.com" crossOrigin="anonymous" />
    <link rel="dns-prefetch" href="https://open.spotifycdn.com" />
  </Head><aside className={`global-spotify-player ${scrolledPastHero ? "is-scroll-visible" : ""}`} aria-label="The Property Portfolio Podcast on Spotify">
    <div className="global-spotify-label"><FaSpotify aria-hidden="true"/><span>Listen on Spotify</span></div>
    <div className="global-spotify-embed">
      <iframe title="The Property Portfolio Podcast on Spotify" src={src} width="100%" height="80" loading="eager" scrolling="no" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" />
    </div>
  </aside></>;
}
