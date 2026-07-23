import Main from "./home/Main";


export default function Home({ initialEpisodes = [] }) {
  return (
    <Main initialEpisodes={initialEpisodes} />
  );
}

export async function getStaticProps() {
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api";
  try {
    const response = await fetch(`${apiUrl}/home/file/getAll`);
    const payload = response.ok ? await response.json() : null;
    return { props: { initialEpisodes: payload?.data || [] }, revalidate: 300 };
  } catch (error) {
    console.error("Home SSR fetch failed:", error.message);
    return { props: { initialEpisodes: [] }, revalidate: 60 };
  }
}
