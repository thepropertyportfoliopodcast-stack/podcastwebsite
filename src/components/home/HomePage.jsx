import PublicLayout from "@/components/layout/PublicLayout";
import PremiumHomepage from "@/components/home/PremiumHomepage";
import GlobalSpotifyPlaylist from "@/components/media/GlobalSpotifyPlaylist";
export default function HomePage({ initialEpisodes = [], latestEpisode = null, initialHeroPhones = [], initialHosts = [] }) {
  return (
    <PublicLayout>
      <PremiumHomepage episodes={initialEpisodes} latestEpisode={latestEpisode} heroPhones={initialHeroPhones} hosts={initialHosts} />
      <GlobalSpotifyPlaylist />
    </PublicLayout>
  );
}
