import { fallbackHosts } from "./hosts";

export const isDevelopmentExampleMode = process.env.NODE_ENV === "development";

const podcast = {
  uuid: "00000000-0000-4000-8000-000000000100",
  slug: "local-property-portfolio-podcast",
  name: "The Property Portfolio Podcast",
  author: "Parag Dixit, Julius Dabre & Mudit Khandelwal",
  thumbnail: "/heroimg01.jpg",
};

const episodeSeeds = [
  {
    uuid: "00000000-0000-4000-8000-000000000027",
    slug: "local-sydney-suburbs-explained",
    episodeNumber: 27,
    title: "Sydney Suburbs Explained — 5 Worth Watching + 1 Bonus",
    description: "A practical look at Sydney suburbs, affordability, growth drivers and the signals property buyers should watch.",
    topic: "Suburbs",
    duration: 52,
    durationInSec: 3120,
    thumbnail: "/heroimg01.jpg",
    websiteThumbnail: "/conversation.png",
    homepageThumbnail: "/conversation.png",
    createdAt: "2026-08-21T09:00:00.000Z",
    publishedAt: "2026-08-21T09:00:00.000Z",
    youtubeUrl: "https://www.youtube.com/watch?v=UohyC5fQT2s",
    spotifyLink: "https://open.spotify.com/show/7BWrKVuUSeX1Qat3VEjUaU",
    hostSlugs: ["parag-dixit", "mudit-khandelwal", "julius-dabre"],
  },
  {
    uuid: "00000000-0000-4000-8000-000000000026",
    slug: "local-property-market-outlook",
    episodeNumber: 26,
    title: "Australian Property Market Outlook 2026",
    description: "The team discusses market momentum, lending conditions and the fundamentals shaping Australian property decisions.",
    topic: "Market Outlook",
    duration: 61,
    durationInSec: 3660,
    thumbnail: "/aboutimg.jpg",
    websiteThumbnail: "/aboutimg.jpg",
    homepageThumbnail: "/aboutimg.jpg",
    createdAt: "2026-08-14T09:00:00.000Z",
    publishedAt: "2026-08-14T09:00:00.000Z",
    youtubeUrl: "https://www.youtube.com/watch?v=UohyC5fQT2s",
    spotifyLink: "https://open.spotify.com/show/7BWrKVuUSeX1Qat3VEjUaU",
    hostSlugs: ["parag-dixit", "mudit-khandelwal", "julius-dabre"],
  },
  {
    uuid: "00000000-0000-4000-8000-000000000025",
    slug: "local-first-home-buyer-strategies",
    episodeNumber: 25,
    title: "First Home Buyer Strategies: Beating the Deposit Hurdle",
    description: "Clear ways first-home buyers and upgraders can assess borrowing capacity, deposits and the timing of their next move.",
    topic: "Finance",
    duration: 45,
    durationInSec: 2700,
    thumbnail: "/juliusimg.jpg",
    websiteThumbnail: "/juliusimg.jpg",
    homepageThumbnail: "/juliusimg.jpg",
    createdAt: "2026-08-08T09:00:00.000Z",
    publishedAt: "2026-08-08T09:00:00.000Z",
    youtubeUrl: "https://www.youtube.com/watch?v=UohyC5fQT2s",
    spotifyLink: "https://open.spotify.com/show/7BWrKVuUSeX1Qat3VEjUaU",
    hostSlugs: ["parag-dixit", "julius-dabre"],
  },
  {
    uuid: "00000000-0000-4000-8000-000000000024",
    slug: "local-melbourne-investment-red-flags",
    episodeNumber: 24,
    title: "Melbourne Investment Red Flags: 5 Suburbs to Watch",
    description: "How investors can separate attractive pricing from weak fundamentals when comparing Melbourne suburbs.",
    topic: "Due Diligence",
    duration: 50,
    durationInSec: 3000,
    thumbnail: "/muditimg.jpg",
    websiteThumbnail: "/muditimg.jpg",
    createdAt: "2026-08-01T09:00:00.000Z",
    publishedAt: "2026-08-01T09:00:00.000Z",
    hostSlugs: ["mudit-khandelwal", "julius-dabre"],
  },
  {
    uuid: "00000000-0000-4000-8000-000000000023",
    slug: "local-building-a-property-portfolio",
    episodeNumber: 23,
    title: "Building a Property Portfolio with Better Finance Structure",
    description: "A straightforward conversation about serviceability, buffers and keeping future options open.",
    topic: "Investment Strategy",
    duration: 48,
    durationInSec: 2880,
    thumbnail: "/paragimg.jpg",
    websiteThumbnail: "/paragimg.jpg",
    createdAt: "2026-07-25T09:00:00.000Z",
    publishedAt: "2026-07-25T09:00:00.000Z",
    hostSlugs: ["parag-dixit", "mudit-khandelwal"],
  },
  {
    uuid: "00000000-0000-4000-8000-000000000022",
    slug: "local-property-research-framework",
    episodeNumber: 22,
    title: "A Practical Property Research Framework",
    description: "The core numbers, local signals and risk checks to examine before shortlisting an investment location.",
    topic: "Research",
    duration: 43,
    durationInSec: 2580,
    thumbnail: "/conversation.png",
    websiteThumbnail: "/conversation.png",
    createdAt: "2026-07-18T09:00:00.000Z",
    publishedAt: "2026-07-18T09:00:00.000Z",
    hostSlugs: ["julius-dabre", "mudit-khandelwal"],
  },
];

export const developmentEpisodes = episodeSeeds.map((episode) => ({
  ...episode,
  podcast,
  detail: `<p>${episode.description}</p><p>This is local example content provided only while the frontend runs in development mode.</p>`,
  transcript: `Parag Dixit\nWelcome to this local preview of The Property Portfolio Podcast.\n\nJulius Dabre\nThis example transcript makes it possible to review the complete episode layout before deployment.`,
  transcriptIsManual: true,
  transcriptStatus: "READY",
}));

export const developmentHeroPhones = developmentEpisodes.slice(0, 3).map((episode) => ({
  uuid: `phone-${episode.uuid}`,
  title: episode.title,
  description: episode.description,
  episodeNumber: episode.episodeNumber,
  thumbnail: episode.homepageThumbnail || episode.thumbnail,
  youtubeVideoUrl: episode.youtubeUrl,
  isActive: true,
}));

export const developmentHosts = fallbackHosts;

export function developmentEpisodeListing(search = "", topic = "", page = 1, limit = 9) {
  const query = String(search).trim().toLowerCase();
  const selectedTopic = String(topic).trim().toLowerCase();
  const matches = developmentEpisodes.filter((episode) => {
    const searchable = [episode.title, episode.description, episode.topic, episode.episodeNumber, `ep ${episode.episodeNumber}`].join(" ").toLowerCase();
    return (!query || searchable.includes(query)) && (!selectedTopic || episode.topic.toLowerCase() === selectedTopic);
  });
  const pageSize = Math.max(1, Number(limit) || 9);
  const totalPages = Math.max(1, Math.ceil(matches.length / pageSize));
  const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  return {
    episodes: matches.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    topics: [...new Set(developmentEpisodes.map((episode) => episode.topic))].sort(),
    pagination: { page: currentPage, limit: pageSize, total: matches.length, totalPages },
  };
}

export function findDevelopmentEpisode(value = "") {
  const key = String(value);
  const episode = developmentEpisodes.find((item) => item.slug === key || item.uuid === key);
  if (!episode) return null;
  return {
    ...episode,
    hostProfiles: developmentHosts,
    guestHostProfiles: [],
    relatedEpisodes: developmentEpisodes.filter((item) => item.uuid !== episode.uuid).slice(0, 3),
  };
}
