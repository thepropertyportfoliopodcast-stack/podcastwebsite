export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://thepropertyportfolio.com.au").replace(/\/$/, "");
export const SITE_NAME = "The Property Portfolio Podcast";
export const DEFAULT_DESCRIPTION = "Australian property investing insights, market analysis and practical strategies to help you build a stronger property portfolio.";

export function slugify(value = "") {
  return value
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "podcast";
}

export function contentPath(type, item) {
  return `/${type}/${item?.slug || `${slugify(item?.title || item?.name)}--${item?.uuid}`}`;
}

export function extractUuid(value = "") {
  const match = value.toString().match(/([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i);
  return match?.[1] || value;
}

export function plainText(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function metaDescription(value = "", fallback = DEFAULT_DESCRIPTION) {
  const text = plainText(value) || fallback;
  if (text.length <= 160) return text;
  return `${text.slice(0, 157).replace(/\s+\S*$/, "")}...`;
}

export function episodeKeywords(episode = {}) {
  const primary = [
    episode.title,
    episode.topic ? `${episode.topic} property podcast` : null,
    episode.podcast?.name ? `${episode.podcast.name} episode` : null,
  ];
  const secondary = [
    "Australian property podcast",
    "property investment podcast Australia",
    "Australian property market insights",
    "real estate investing Australia",
    episode.podcast?.author ? `${episode.podcast.author} property podcast` : null,
  ];
  return [...new Set([...primary, ...secondary].filter(Boolean))].join(", ");
}

export function podcastKeywords(podcast = {}) {
  const primary = [podcast.name, podcast.name ? `${podcast.name} podcast` : null];
  const secondary = [
    "Australian property podcast",
    "property investment podcast Australia",
    "Australian real estate investing",
    "property market Australia",
    podcast.author ? `${podcast.author} podcast` : null,
    ...(Array.isArray(podcast.cast) ? podcast.cast.map((person) => `${person} property podcast`) : []),
  ];
  return [...new Set([...primary, ...secondary].filter(Boolean))].join(", ");
}
