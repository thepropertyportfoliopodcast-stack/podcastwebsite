import PublicLayout from "@/components/layout/PublicLayout";
import PremiumHomepage from "@/components/home/PremiumHomepage";
export default function HomePage({ initialEpisodes = [], latestEpisode = null, initialHeroPhones = [], initialHosts = [] }) {
  return (
    <PublicLayout>
      <PremiumHomepage episodes={initialEpisodes} latestEpisode={latestEpisode} heroPhones={initialHeroPhones} hosts={initialHosts} />
    </PublicLayout>
  );
}
