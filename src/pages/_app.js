import "@/styles/globals.css";
import "plyr/dist/plyr.css";
import "./style.css";
import { Toaster } from "react-hot-toast";
import { RoleProvider } from "@/context/RoleContext";
import NextNProgress from 'nextjs-progressbar';
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import AudioPlyr from "@/components/AudioPlyrWrapper";
import Head from "next/head";
import { useRouter } from "next/router";
// import AudioPlayerWrapper from "@/components/AudioPlayerWrapper";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  return <>
    {router.pathname.startsWith("/admin") && (
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
        <AudioPlyr />
      </AudioPlayerProvider>
    </RoleProvider>
  </>;
}
