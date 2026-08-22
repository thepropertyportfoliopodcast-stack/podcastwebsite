import PublicLayout from "@/components/layout/PublicLayout";
import PremiumHomepage from "@/components/home/PremiumHomepage";
export default function HomePage({ initialEpisodes = [], latestEpisode = null, initialHeroPhones = [] }) {
  return (
    <PublicLayout>
      <PremiumHomepage episodes={initialEpisodes} latestEpisode={latestEpisode} heroPhones={initialHeroPhones} />
    </PublicLayout>
  );
}
