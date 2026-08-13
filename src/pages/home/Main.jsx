import Layout from "../../layout/Layout";
import PremiumHomepage from "@/components/home/PremiumHomepage";
export default function Main({ initialEpisodes = [], latestEpisode = null }) {
  return (
    <Layout>
      <PremiumHomepage episodes={initialEpisodes} latestEpisode={latestEpisode} />
    </Layout>
  );
}
