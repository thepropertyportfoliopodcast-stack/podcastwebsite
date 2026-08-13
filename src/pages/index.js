import Main from "./home/Main";
import { getCachedValue } from "@/utils/serverCache";


export default function Home({ initialEpisodes = [], latestEpisode = null }) {
  return (
    <Main initialEpisodes={initialEpisodes} latestEpisode={latestEpisode} />
  );
}

export async function getServerSideProps({ res }) {
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api";
  res.setHeader(
    "Cache-Control",
    "private, no-cache, no-store, must-revalidate"
  );

  try {
    const [episodes, latestEpisode] = await Promise.all([
      fetch(`${apiUrl}/home/file/getAll`, { cache: "no-store" }).then(async (response) => {
        if (!response.ok) throw new Error(`Episode API returned ${response.status}`);
        const payload = await response.json();
        return Array.isArray(payload?.data) ? payload.data : [];
      }),
      getCachedValue("homepage-latest-episode-v1", async () => {
        const response = await fetch(`${apiUrl}/file/getAll?search=&topic=&page=1&limit=1`);
        if (!response.ok) throw new Error(`Latest episode API returned ${response.status}`);
        const payload = await response.json();
        const rows = payload?.data?.episodes;
        return Array.isArray(rows) && rows.length ? rows[0] : null;
      }),
    ]);
    return { props: { initialEpisodes: episodes, latestEpisode } };
  } catch (error) {
    console.error("Home SSR fetch failed:", error.message);
    return { props: { initialEpisodes: [], latestEpisode: null } };
  }
}
