import Main from "./home/Main";
import { getCachedValue } from "@/utils/serverCache";


export default function Home({ initialEpisodes = [] }) {
  return (
    <Main initialEpisodes={initialEpisodes} />
  );
}

export async function getServerSideProps({ res }) {
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api";
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=3600"
  );

  try {
    const episodes = await getCachedValue("homepage-episodes", async () => {
      const response = await fetch(`${apiUrl}/home/file/getAll`);
      if (!response.ok) throw new Error(`Episode API returned ${response.status}`);
      const payload = await response.json();
      return payload?.data || [];
    });
    return { props: { initialEpisodes: episodes } };
  } catch (error) {
    console.error("Home SSR fetch failed:", error.message);
    return { props: { initialEpisodes: [] } };
  }
}
