/**
 * Card-only episode artwork. `thumbnail` remains the square RSS artwork and is
 * used as the fallback until an episode receives its landscape card image.
 */
export function episodeWebsiteArtwork(episode, fallback = "") {
  return episode?.websiteThumbnail || episode?.thumbnail || fallback;
}

export function hasWebsiteEpisodeArtwork(episode) {
  return Boolean(episode?.websiteThumbnail);
}
