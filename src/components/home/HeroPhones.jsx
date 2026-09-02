import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaChevronLeft, FaChevronRight, FaPlay, FaTimes } from "react-icons/fa";

const youtubeIdFrom = (value = "") => {
  try {
    const url = new URL(value.trim());
    if (url.hostname.includes("youtu.be")) return url.pathname.split("/").filter(Boolean)[0] || "";
    if (url.pathname.startsWith("/shorts/") || url.pathname.startsWith("/embed/")) return url.pathname.split("/")[2] || "";
    return url.searchParams.get("v") || "";
  } catch {
    return value.trim();
  }
};

const imageFor = (phone) => phone?.thumbnail || phone?.homepageThumbnail || "/heroimg01.jpg";

const isPhoneDevice = () => {
  const userAgent = window.navigator.userAgent || "";
  const isIPad = /iPad/i.test(userAgent) || (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
  if (isIPad || (/Android/i.test(userAgent) && !/Mobile/i.test(userAgent))) return false;
  if (/iPhone|iPod|Windows Phone|IEMobile/i.test(userAgent) || (/Android/i.test(userAgent) && /Mobile/i.test(userAgent))) return true;

  const coarsePointer = window.matchMedia("(pointer: coarse)").matches || window.navigator.maxTouchPoints > 0;
  const shortestScreenSide = Math.min(window.screen?.width || window.innerWidth, window.screen?.height || window.innerHeight);
  return coarsePointer ? shortestScreenSide <= 550 : window.matchMedia("(max-width: 720px)").matches;
};

function YouTubeShortPreview({ url, title, onEnded }) {
  const mountRef = useRef(null);
  const endedRef = useRef(onEnded);
  endedRef.current = onEnded;

  useEffect(() => {
    const videoId = youtubeIdFrom(url);
    if (!videoId || !mountRef.current) return undefined;
    let player;
    let cancelled = false;

    const createPlayer = () => {
      if (cancelled || !mountRef.current || !window.YT?.Player) return;
      player = new window.YT.Player(mountRef.current, {
        videoId,
        playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, modestbranding: 1, mute: 1, playsinline: 1, rel: 0 },
        events: {
          onReady: (event) => { event.target.mute(); event.target.playVideo(); },
          onStateChange: (event) => { if (event.data === 0) endedRef.current?.(); },
        },
      });
    };

    if (window.YT?.Player) createPlayer();
    else {
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { previousReady?.(); createPlayer(); };
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      try { player?.destroy(); } catch {}
    };
  }, [url]);

  return <div className="tppp-phone-short" aria-label={`${title} short preview`}><div ref={mountRef} /></div>;
}

export default function HeroPhones({ phones = [], episodes = [] }) {
  const timers = useRef([]);
  const swipeRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [viewer, setViewer] = useState(null);
  const [failedVideos, setFailedVideos] = useState(() => new Set());
  const items = useMemo(() => {
    const unique = [];
    const source = (phones.length ? phones : episodes).filter((item) => item?.isActive !== false).slice(0, 3);
    for (const phone of source) {
      if (phone?.uuid && !unique.some((item) => item.uuid === phone.uuid)) unique.push(phone);
    }
    return unique;
  }, [phones, episodes]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    document.body.style.overflow = viewer ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [viewer]);

  const closeViewer = useCallback(() => {
    clearTimers();
    setViewer((current) => current ? { ...current, phase: "closing" } : null);
    timers.current.push(setTimeout(() => setViewer(null), 400));
  }, [clearTimers]);

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === "Escape") closeViewer(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeViewer]);
  useEffect(() => () => clearTimers(), [clearTimers]);

  const openViewer = (phoneData) => {
    const phone = document.querySelector(`[data-hero-phone="${phoneData.uuid}"]`);
    if (!phone) return;
    const rect = phone.getBoundingClientRect();
    const mobile = isPhoneDevice();
    clearTimers();
    setViewer({
      episode: phoneData,
      youtubeId: youtubeIdFrom(phoneData.youtubeVideoUrl || phoneData.youtubeUrl || phoneData.youtubeShortUrl),
      phase: "moving",
      mobile,
      ox: rect.left + rect.width / 2 - window.innerWidth / 2,
      oy: rect.top + rect.height / 2 - window.innerHeight / 2,
      sx: rect.width / (mobile ? 320 : 270),
      sy: rect.height / (mobile ? 650 : 557),
    });
    timers.current = [
      setTimeout(() => setViewer((current) => current ? { ...current, phase: mobile ? "open" : "rotating" } : null), 280),
      ...(!mobile ? [setTimeout(() => setViewer((current) => current ? { ...current, phase: "open" } : null), 700)] : []),
    ];
  };

  const selectViewerPhone = (phoneData) => {
    setViewer((current) => current ? { ...current, episode: phoneData, youtubeId: youtubeIdFrom(phoneData.youtubeVideoUrl || phoneData.youtubeUrl || phoneData.youtubeShortUrl), phase: "open" } : current);
  };

  const advancePhone = useCallback(() => {
    setActive((value) => items.length ? (value + 1) % items.length : 0);
  }, [items.length]);

  const handlePreviewError = useCallback((uuid) => {
    setFailedVideos((current) => {
      if (current.has(uuid)) return current;
      const next = new Set(current);
      next.add(uuid);
      return next;
    });
  }, []);

  const startSwipe = useCallback((event) => {
    if (!event.isPrimary || event.pointerType === "mouse" || event.target.closest("button")) return;
    swipeRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
  }, []);

  const finishSwipe = useCallback((event) => {
    const swipe = swipeRef.current;
    swipeRef.current = null;
    if (!swipe || swipe.pointerId !== event.pointerId || items.length < 2) return;
    const deltaX = event.clientX - swipe.x;
    const deltaY = event.clientY - swipe.y;
    if (Math.abs(deltaX) < 42 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.15) return;

    suppressClickRef.current = true;
    setActive((value) => deltaX < 0 ? (value + 1) % items.length : (value - 1 + items.length) % items.length);
    window.setTimeout(() => { suppressClickRef.current = false; }, 0);
  }, [items.length]);

  const cancelSwipe = useCallback(() => { swipeRef.current = null; }, []);

  useEffect(() => {
    if (viewer || items.length < 2) return undefined;
    const current = items[active];
    const previewControlsRotation = (current?.shortVideo && !failedVideos.has(current.uuid)) || current?.youtubeShortUrl;
    if (previewControlsRotation) return undefined;
    const timer = window.setTimeout(advancePhone, 5000);
    return () => window.clearTimeout(timer);
  }, [active, advancePhone, failedVideos, items, viewer]);

  const position = (index) => {
    if (index === active) return "tppp-phone-active";
    if (index === (active - 1 + items.length) % items.length) return "tppp-phone-left";
    if (index === (active + 1) % items.length) return "tppp-phone-right";
    return "tppp-phone-hidden";
  };

  if (!items.length) return null;

  const modal = viewer && (
    <div className={`tppp-viewer tppp-viewer-${viewer.phase} ${viewer.mobile ? "tppp-viewer-mobile" : "tppp-viewer-desktop"}`} onMouseDown={closeViewer}>
      <div className="tppp-viewer-glow" aria-hidden="true" />
      <div className="tppp-viewer-device" style={{ "--phone-ox": `${viewer.ox}px`, "--phone-oy": `${viewer.oy}px`, "--phone-sx": viewer.sx, "--phone-sy": viewer.sy }} onMouseDown={(event) => event.stopPropagation()}>
        <div className="tppp-viewer-frame">
          <span className="tppp-phone-notch" aria-hidden="true" />
          <div className="tppp-viewer-backdrop" style={{ backgroundImage: `url(${imageFor(viewer.episode)})` }} />
          {viewer.youtubeId && viewer.phase === "open" ? (
            <div className="tppp-viewer-screen">
              <iframe className="tppp-viewer-video" src={`https://www.youtube.com/embed/${viewer.youtubeId}?autoplay=1&controls=1&rel=0&playsinline=1`} title={viewer.episode.title} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />
              <span className="tppp-landscape-island" aria-hidden="true" />
            </div>
          ) : (
            <Image src={imageFor(viewer.episode)} alt={viewer.episode.title} fill sizes="90vw" className="tppp-viewer-poster object-cover" />
          )}
          <div className="tppp-mobile-info">
            <span>Featured video</span>
            <h2>{viewer.episode.title}</h2>
            {viewer.episode.description && <p>{viewer.episode.description}</p>}
            <div className="tppp-mobile-divider" />
            <div className="tppp-mobile-playlist" aria-label="More featured videos">
              {items.filter((item) => item.uuid !== viewer.episode.uuid).map((item) => <button type="button" key={item.uuid} onClick={() => selectViewerPhone(item)}><span className="tppp-mobile-thumb"><Image src={imageFor(item)} alt="" fill sizes="92px" className="object-cover" /></span><strong>{item.title}</strong></button>)}
            </div>
          </div>
        </div>
      </div>
      <button type="button" className="tppp-viewer-close" onMouseDown={(event) => event.stopPropagation()} onClick={closeViewer} aria-label="Close video"><FaTimes /></button>
    </div>
  );

  return <>
    <div
      className="tppp-phone-area"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured episode phones. Swipe left or right to change the centred phone."
      onPointerDown={startSwipe}
      onPointerUp={finishSwipe}
      onPointerCancel={cancelSwipe}
    >
      {items.map((episode, index) => (
        <div role="button" tabIndex={index === active ? 0 : -1} key={episode.uuid} data-hero-phone={episode.uuid} onClick={(event) => { if (suppressClickRef.current) { event.preventDefault(); event.stopPropagation(); return; } openViewer(episode); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openViewer(episode); } }} className={`tppp-hero-phone ${position(index)}`}>
          <span className="tppp-phone-frame">
            <span className="tppp-phone-notch" aria-hidden="true" />
            <Image src={imageFor(episode)} alt={episode.title} fill priority={index === 0} fetchPriority={index === 0 ? "high" : "auto"} sizes="(max-width:620px) 188px, 270px" quality={68} className="object-cover" />
            {mounted && !viewer && index === active && episode.shortVideo && !failedVideos.has(episode.uuid) ? <video key={`${episode.uuid}-${active}`} src={episode.shortVideo} muted autoPlay playsInline preload="metadata" onEnded={advancePhone} onError={() => handlePreviewError(episode.uuid)} className="absolute inset-0 z-[2] h-full w-full object-cover" aria-hidden="true" /> : null}
            {mounted && !viewer && index === active && (!episode.shortVideo || failedVideos.has(episode.uuid)) && episode.youtubeShortUrl ? <YouTubeShortPreview key={`${episode.uuid}-${active}`} url={episode.youtubeShortUrl} title={episode.title} onEnded={advancePhone} /> : null}
            <span className="tppp-phone-overlay">
              <span className="tppp-phone-copy"><small>{episode.episodeNumber ? `Episode ${episode.episodeNumber}` : "Featured video"}</small><strong>{episode.title}</strong>{episode.description && <span>{episode.description}</span>}<em><FaPlay /> Tap to watch</em></span>
            </span>
          </span>
        </div>
      ))}
      {items.length > 1 && <><button type="button" className="tppp-phone-arrow tppp-phone-prev" aria-label="Previous episode" onClick={() => setActive((value) => (value - 1 + items.length) % items.length)}><FaChevronLeft /></button><button type="button" className="tppp-phone-arrow tppp-phone-next" aria-label="Next episode" onClick={() => setActive((value) => (value + 1) % items.length)}><FaChevronRight /></button></>}
    </div>
    {mounted && viewer ? createPortal(modal, document.body) : null}
  </>;
}
