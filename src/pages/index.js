import Main from "./home/Main";


export default function Home({ initialEpisodes = [] }) {
  return (
    <Main initialEpisodes={initialEpisodes} />
  );
}

export async function getServerSideProps({ res }) {
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api";
  try {
    const response = await fetch(`${apiUrl}/home/file/getAll`);
    const payload = response.ok ? await response.json() : null;
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    return { props: { initialEpisodes: payload?.data || [] } };
  } catch (error) {
    console.error("Home SSR fetch failed:", error.message);
    return { props: { initialEpisodes: [] } };
  }
}
