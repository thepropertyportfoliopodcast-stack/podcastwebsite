import "@/styles/globals.css";
import "plyr/dist/plyr.css";
import "./style.css";
import { Toaster } from "react-hot-toast";
import { RoleProvider } from "@/context/RoleContext";
import NextNProgress from 'nextjs-progressbar';
import { AudioPlayerProvider, useAudioPlayer } from "@/context/AudioPlayerContext";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
// import AudioPlayerWrapper from "@/components/AudioPlayerWrapper";

const AudioPlyr = dynamic(() => import("@/components/AudioPlyrWrapper"), { ssr: false });
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-PN33NMTB";

function DeferredAudioPlayer() {
  const { selectedEpisode } = useAudioPlayer();
  return selectedEpisode ? <AudioPlyr /> : null;
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");
  return <>
    {!isAdminRoute && (
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
    )}
    {isAdminRoute && (
      <Head><meta name="robots" content="noindex,nofollow" /></Head>
    )}
    <NextNProgress color="#FC18D8" />
    <Toaster
      toastOptions={{
        position: "top-right",
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
