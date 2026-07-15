import { contentPath, SITE_URL } from "@/utils/seo";

function escapeXml(value = "") {
  return value.replace(/[<>&'\"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[char]));
}

export async function getServerSideProps({ res }) {
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api";
  const staticPaths = ["", "/episode", "/about", "/contact", "/privacy", "/access", "/use"];
  let dynamicEntries = [];

  try {
    const [episodesResponse, podcastsResponse] = await Promise.all([
      fetch(`${apiUrl}/file/getAll?search=&topic=&page=1&limit=100`).then((response) => response.json()),
      fetch(`${apiUrl}/podcast/get-detail/all`).then((response) => response.json()),
    ]);
    const episodes = episodesResponse?.data?.episodes || [];
    const podcasts = podcastsResponse?.data || [];
    dynamicEntries = [
      ...episodes.map((episode) => ({ path: contentPath("episode", episode), modified: episode.createdAt })),
      ...podcasts.map((podcast) => ({ path: contentPath("podcast", podcast), modified: podcast.createdAt })),
    ];
  } catch (error) {
    console.error("Sitemap data fetch failed:", error.message);
  }

  const entries = [
    ...staticPaths.map((path) => ({ path })),
    ...dynamicEntries,
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(({ path, modified }) => `  <url><loc>${escapeXml(`${SITE_URL}${path}`)}</loc>${modified ? `<lastmod>${new Date(modified).toISOString()}</lastmod>` : ""}</url>`).join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(xml);
  res.end();
  return { props: {} };
}

export default function Sitemap() {
  return null;
}
