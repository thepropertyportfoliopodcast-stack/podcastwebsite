import HomePage from "@/components/home/HomePage";
import { getCachedValue } from "@/utils/serverCache";

export default function Home({ initialEpisodes = [], latestEpisode = null, initialHeroPhones = [], initialHosts = [] }) {
  return (
    <HomePage initialEpisodes={initialEpisodes} latestEpisode={latestEpisode} initialHeroPhones={initialHeroPhones} initialHosts={initialHosts} />
  );
}

export async function getServerSideProps({ res }) {
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api";
  const safely = (request, fallback, label) => request.catch((error) => {
    console.error(`${label} fetch failed:`, error.message);
    return fallback;
  });
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300"
  );

  try {
    const [episodes, latestEpisode, heroPhones, hosts] = await Promise.all([
      safely(getCachedValue("homepage-episodes-v2", async () => {
        const response = await fetch(`${apiUrl}/home/file/getAll`);
        if (!response.ok) throw new Error(`Episode API returned ${response.status}`);
        const payload = await response.json();
        const featured = Array.isArray(payload?.data) ? payload.data : [];
        if (featured.length) return featured;

        const allResponse = await fetch(`${apiUrl}/file/getAll?search=&topic=&page=1&limit=6`);
        if (!allResponse.ok) throw new Error(`Episode API returned ${allResponse.status}`);
        const allPayload = await allResponse.json();
        return Array.isArray(allPayload?.data?.episodes) ? allPayload.data.episodes : [];
      }), [], "Homepage episodes"),
      safely(getCachedValue("homepage-latest-episode-v2", async () => {
        const response = await fetch(`${apiUrl}/file/getAll?search=&topic=&page=1&limit=1`);
        if (!response.ok) throw new Error(`Latest episode API returned ${response.status}`);
        const payload = await response.json();
        const rows = payload?.data?.episodes;
        return Array.isArray(rows) && rows.length ? rows[0] : null;
      }), null, "Latest episode"),
      safely(getCachedValue("homepage-hero-phones-v2", async () => {
        const response = await fetch(`${apiUrl}/hero-phone/get`);
        if (!response.ok) throw new Error(`Hero phone API returned ${response.status}`);
        const payload = await response.json();
        return Array.isArray(payload?.data) ? payload.data.slice(0, 3) : [];
      }), [], "Hero phones"),
      safely(getCachedValue("homepage-hosts-v2", async () => {
        const response = await fetch(`${apiUrl}/host/get`);
        if (!response.ok) throw new Error(`Host API returned ${response.status}`);
        const payload = await response.json();
        return Array.isArray(payload?.data) ? payload.data : [];
      }, 30000), [], "Homepage hosts"),
    ]);
    return {
      props: {
        initialEpisodes: episodes,
        latestEpisode: latestEpisode || episodes[0] || null,
        initialHeroPhones: heroPhones,
        initialHosts: hosts,
      },
    };
  } catch (error) {
    console.error("Home SSR fetch failed:", error.message);
    return {
      props: {
        initialEpisodes: [],
        latestEpisode: null,
        initialHeroPhones: [],
        initialHosts: [],
      },
    };
  }
}
