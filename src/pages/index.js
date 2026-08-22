import HomePage from "@/components/home/HomePage";
import { getCachedValue } from "@/utils/serverCache";


export default function Home({ initialEpisodes = [], latestEpisode = null, initialHeroPhones = [] }) {
  return (
    <HomePage initialEpisodes={initialEpisodes} latestEpisode={latestEpisode} initialHeroPhones={initialHeroPhones} />
  );
}

export async function getServerSideProps({ res }) {
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api";
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300"
  );

  try {
    const [episodes, latestEpisode, heroPhones] = await Promise.all([
      getCachedValue("homepage-featured-episodes-v1", async () => {
        const response = await fetch(`${apiUrl}/home/file/getAll`);
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
      getCachedValue("homepage-hero-phones-v1", async () => {
        const response = await fetch(`${apiUrl}/hero-phone/get`);
        if (!response.ok) throw new Error(`Hero phone API returned ${response.status}`);
        const payload = await response.json();
        return Array.isArray(payload?.data) ? payload.data : [];
      }),
    ]);
    return { props: { initialEpisodes: episodes, latestEpisode, initialHeroPhones: heroPhones } };
  } catch (error) {
    console.error("Home SSR fetch failed:", error.message);
    return { props: { initialEpisodes: [], latestEpisode: null, initialHeroPhones: [] } };
  }
}
