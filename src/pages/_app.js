import "@/styles/components.css";
import "@/styles/pages.css";
import { Toaster } from "react-hot-toast";
import { RoleProvider } from "@/context/RoleContext";
import { AudioPlayerProvider, useAudioPlayer } from "@/context/AudioPlayerContext";
import Head from "next/head";
import { useRouter } from "next/router";
import { Geist } from "next/font/google";
import { lazy, Suspense, useEffect, useState } from "react";

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

const AudioPlayerClient = lazy(() => import("@/components/media/AudioPlayerClient"));
const FirstPartyAnalytics = lazy(() => import("@/components/analytics/FirstPartyAnalytics"));
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-PN33NMTB";
const GTM_ENABLED = /^GTM-[A-Z0-9]+$/i.test(GTM_ID);

function DeferredAudioPlayer() {
  const { selectedEpisode } = useAudioPlayer();
  return selectedEpisode ? <Suspense fallback={null}><AudioPlayerClient /></Suspense> : null;
}

function DeferredFirstPartyAnalytics() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timerId;
    let idleId;
    const activate = () => setReady(true);
    const schedule = () => {
      timerId = window.setTimeout(() => {
        if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(activate, { timeout: 2000 });
        else activate();
      }, 6000);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      window.clearTimeout(timerId);
      if (idleId && "cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
    };
  }, []);

  return ready ? <Suspense fallback={null}><FirstPartyAnalytics /></Suspense> : null;
}

function DeferredTagManager() {
  useEffect(() => {
    if (!GTM_ENABLED) return undefined;
    let loaded = false;
    let timerId;
    const events = ["pointerdown", "touchstart", "keydown"];
    const removeListeners = () => events.forEach((event) => window.removeEventListener(event, load));
    const load = () => {
      if (loaded) return;
      loaded = true;
      removeListeners();
      window.clearTimeout(timerId);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
      document.head.appendChild(script);
    };
    const schedule = () => { timerId = window.setTimeout(load, 12000); };
    events.forEach((event) => window.addEventListener(event, load, { once: true, passive: true }));
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      removeListeners();
      window.clearTimeout(timerId);
    };
  }, []);

  return null;
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");
  return <>
    <style jsx global>{`
      html,
      body,
      button,
      input,
      textarea,
      select {
        font-family: ${geistSans.style.fontFamily};
      }
    `}</style>
    {!isAdminRoute && <DeferredTagManager />}
    {isAdminRoute && (
      <Head><meta name="robots" content="noindex,nofollow" /></Head>
    )}
    {!isAdminRoute && <DeferredFirstPartyAnalytics />}
    <Toaster
      toastOptions={{
        duration: 5000,
        success: { duration: 5000 },
        className: "",
        style: {
          fontSize: "14px", // Corrected "font-size" to camelCase as required in JSX styles
        },
      }}
    />
    <RoleProvider>
      <AudioPlayerProvider>
        <Component {...pageProps} />
        <DeferredAudioPlayer />
      </AudioPlayerProvider>
    </RoleProvider>
  </>;
}
