const MOCK_PODCAST_UUID = "11111111-1111-4111-8111-111111111111";
const MOCK_EPISODE_UUID = "22222222-2222-4222-8222-222222222222";

const relatedEpisodes = [
  {
    id: 902,
    uuid: "33333333-3333-4333-8333-333333333333",
    slug: "where-to-buy-in-melbourne-in-2026",
    title: "Where to Buy in Melbourne in 2026",
    description: "A practical review of Melbourne markets, infrastructure and long-term investment fundamentals.",
    thumbnail: "/episodeimg02.jpg",
    audio: "",
    durationInSec: 2460,
    createdAt: "2026-08-01T10:00:00.000Z",
  },
  {
    id: 903,
    uuid: "44444444-4444-4444-8444-444444444444",
    slug: "building-a-resilient-property-portfolio",
    title: "Building a Resilient Property Portfolio",
    description: "How to balance cash flow, borrowing capacity and growth assets throughout a property cycle.",
    thumbnail: "/episodeimg01.jpg",
    audio: "",
    durationInSec: 2280,
    createdAt: "2026-07-24T10:00:00.000Z",
  },
];

export const mockEpisode = {
  id: 901,
  uuid: MOCK_EPISODE_UUID,
  slug: "is-australia-raising-a-generation-of-renters",
  title: "Is Australia Raising a Generation of Renters?",
  description: "We examine housing affordability, first-home buyer challenges and practical strategies Australians can use to enter the property market.",
  detail: "This development-only preview demonstrates the complete redesigned episode experience without writing to your database.",
  transcript: "Australia's property market is changing quickly, and affordability remains one of the biggest concerns for aspiring homeowners. In this episode, our hosts explore the forces affecting first-home buyers, including deposit requirements, borrowing capacity, interest rates and changing lifestyle expectations.\n\nWe also discuss practical ways buyers can prepare: establishing a realistic budget, understanding lending policy, comparing locations using long-term fundamentals and getting professional advice before committing to a purchase. The aim is to replace uncertainty with a clear, evidence-based plan.\n\nFinally, the conversation covers how investors and owner-occupiers can think about risk, time in the market and portfolio resilience. This sample transcript is intentionally long enough to preview the four-line collapsed state and the Read more interaction.",
  thumbnail: "/episodeimg01.jpg",
  youtubeUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
  link: "",
  audio: "",
  timestamps: "00:00 Introduction\n01:12 The affordability challenge\n03:45 Deposits and borrowing capacity\n06:30 Rent versus ownership\n09:20 Strategies for first-home buyers\n12:10 Choosing the right market\n15:00 Final takeaways",
  topicsCovered: [
    "Australian housing affordability",
    "First-home buyer preparation",
    "Borrowing capacity and deposits",
    "Renting versus home ownership",
  ],
  reelLinks: [],
  topic: "Property market",
  spotifyLink: "https://open.spotify.com/",
  appleLink: "https://podcasts.apple.com/",
  seoTitle: "Is Australia Raising a Generation of Renters?",
  seoDescription: "Explore Australian housing affordability, first-home buyer challenges and practical property strategies in this podcast episode.",
  primaryKeyword: "Australian housing affordability podcast",
  secondaryKeywords: "first home buyers Australia, property market podcast, generation rent Australia",
  durationInSec: 1080,
  createdAt: "2026-08-10T10:00:00.000Z",
  isDeleted: false,
  podcast: {
    id: 101,
    uuid: MOCK_PODCAST_UUID,
    slug: "the-property-portfolio-podcast",
    name: "The Property Portfolio Podcast",
    author: "Parag Dixit, Julius Dabre and Mudit Khandelwal",
    episodes: relatedEpisodes,
  },
};

export const mockPodcast = {
  id: 101,
  uuid: MOCK_PODCAST_UUID,
  slug: "the-property-portfolio-podcast",
  name: "The Property Portfolio Podcast",
  author: "Parag Dixit, Julius Dabre and Mudit Khandelwal",
  cast: ["Parag Dixit", "Julius Dabre", "Mudit Khandelwal"],
  language: ["English"],
  email: "podcast@example.com",
  thumbnail: "/episodeimg01.jpg",
  description: "Australian property insights, market analysis and practical strategies for buyers and investors.",
  seoTitle: "Australian Property Podcast | Property Portfolio",
  seoDescription: "Listen to Australian property investing insights, market trends, lending strategy and investor stories.",
  primaryKeyword: "Australian property podcast",
  secondaryKeywords: "property investing podcast, Australian property market, real estate investing Australia",
  createdAt: "2026-08-01T10:00:00.000Z",
  isDeleted: false,
  episodes: [mockEpisode, ...relatedEpisodes],
};

export const mockEpisodes = mockPodcast.episodes;

export function mockDataEnabled() {
  return process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
}
