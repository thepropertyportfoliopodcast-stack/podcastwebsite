export const fallbackHosts = [
  { uuid: "host-parag", slug: "parag-dixit", name: "Parag Dixit", designation: "Mortgage & Investment Strategy Expert", shortBio: "Turning lending strategy into practical pathways for property buyers and investors.", bio: "Parag combines lending knowledge with investment strategy to help Australians understand borrowing capacity, structure finance and plan sustainable property portfolios.", image: "/paragimg.jpg", displayOrder: 2 },
  { uuid: "host-mudit", slug: "mudit-khandelwal", name: "Mudit Khandelwal", designation: "Strategic Finance Director", shortBio: "Bringing commercial discipline and clear financial thinking to every conversation.", bio: "Mudit brings strategic financial insight to the podcast, translating complex market and portfolio considerations into clear, useful conversations.", image: "/muditimg.jpg", displayOrder: 3 },
  { uuid: "host-julius", slug: "julius-dabre", name: "Julius Dabre", designation: "Property Acquisition Specialist", shortBio: "Helping buyers identify and secure property with strong long-term fundamentals.", bio: "Julius brings a research-led approach to property acquisition, helping buyers move from market noise to confident, evidence-based decisions.", image: "/juliusimg.jpg", displayOrder: 1 },
];

export const fixedShowcaseHosts = fallbackHosts;

export function resolveEpisodeHosts(episode = {}, availableHosts = fallbackHosts) {
  const selected = Array.isArray(episode.hostSlugs) ? episode.hostSlugs : [];
  const matches = availableHosts.filter((host) => selected.includes(host.slug));
  return matches.length ? matches : fallbackHosts;
}
