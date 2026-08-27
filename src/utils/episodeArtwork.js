/**
 * Website-only episode artwork. `thumbnail` remains the square RSS artwork and
 * is only used here as a backwards-compatible fallback for older episodes.
 */
export function episodeWebsiteArtwork(episode, fallback = "") {
  return episode?.homepageThumbnail || episode?.thumbnail || fallback;
}

export function hasWebsiteEpisodeArtwork(episode) {
  return Boolean(episode?.homepageThumbnail);
}
