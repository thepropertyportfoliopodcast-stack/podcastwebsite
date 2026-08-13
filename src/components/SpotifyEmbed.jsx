import { useEffect, useRef, useState } from "react";
import { FaSpotify } from "react-icons/fa";

function spotifyEntity(value = "") {
  try {
    const url = new URL(value.trim());
    if (url.hostname !== "open.spotify.com") return null;
    const parts = url.pathname.split("/").filter(Boolean);
    const localeIndex = parts[0]?.startsWith("intl-") ? 1 : 0;
    const type = parts[localeIndex];
    const id = parts[localeIndex + 1];
    if (!["episode", "show", "track"].includes(type) || !id) return null;
    return { url: value, type, id };
  } catch { return null; }
}

export default function SpotifyEmbed({ url, title, onPlaybackUpdate }) {
  const mountRef = useRef(null);
  const controllerRef = useRef(null);
  const callbackRef = useRef(onPlaybackUpdate);
  const [ready, setReady] = useState(false);
  const entity = spotifyEntity(url);

  useEffect(() => { callbackRef.current = onPlaybackUpdate; }, [onPlaybackUpdate]);
  useEffect(() => {
    if (!entity || !mountRef.current) return undefined;
    let cancelled = false;
    const initialise = (IFrameAPI) => {
      if (cancelled || controllerRef.current || !mountRef.current) return;
      IFrameAPI.createController(mountRef.current, { url: entity.url, width: "100%", height: 232 }, (controller) => {
        if (cancelled) { controller.destroy?.(); return; }
        controllerRef.current = controller;
        controller.addListener("ready", () => setReady(true));
        controller.addListener("playback_update", event => callbackRef.current?.({
          position: Number(event?.data?.position) || 0,
          duration: Number(event?.data?.duration) || 0,
          isPaused: Boolean(event?.data?.isPaused),
          playingURI: event?.data?.playingURI || "",
        }));
      });
    };
    if (window.SpotifyIframeApi) initialise(window.SpotifyIframeApi);
    const previous = window.onSpotifyIframeApiReady;
    window.onSpotifyIframeApiReady = api => { window.SpotifyIframeApi = api; previous?.(api); initialise(api); };
    if (!document.querySelector('script[src="https://open.spotify.com/embed/iframe-api/v1"]')) {
      const script = document.createElement("script");
      script.src = "https://open.spotify.com/embed/iframe-api/v1";
      script.async = true;
      document.body.appendChild(script);
    }
    return () => { cancelled = true; controllerRef.current?.destroy?.(); controllerRef.current = null; };
  }, [entity?.url]);

  if (!entity) return null;
  return <section className="overflow-hidden rounded-2xl border border-[#c99cff]/25 bg-[#111] p-4 sm:p-5 md:p-6">
    <div className="mb-4 flex items-center justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[.22em] text-[#1ed760]">Listen on Spotify</p><h2 className="mt-1 flex items-center gap-3 text-xl font-bold text-[#c99cff] sm:text-2xl"><FaSpotify aria-hidden="true"/><span>Full podcast episode</span></h2></div>
      <a href={url} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-full border border-[#1ed760]/50 px-4 py-2 text-sm font-bold text-[#1ed760] transition hover:bg-[#1ed760] hover:text-black">Open Spotify</a>
    </div>
    <div ref={mountRef} className="spotify-episode-controller h-[152px] overflow-hidden rounded-xl sm:h-[232px]" aria-busy={!ready}/>
  </section>;
}
