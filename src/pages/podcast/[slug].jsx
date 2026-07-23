import Layout from "@/layout/Layout";
import Image from "next/image";
import PodcastDetails from "@/common/PodcastDetails";
import { useEffect, useState } from "react";
import Listing from "../api/Listing";
import EpisodeCard from "@/common/EpisodeCard";
import { useRouter } from "next/router";
import { contentPath, extractUuid, metaDescription, plainText, podcastKeywords, SITE_URL } from "@/utils/seo";

export default function Index({ initialData = null }) {
  const router = useRouter();
  const { slug } = router.query;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(initialData);

  const fetchDetails = async (slug) => {
    try {
      setLoading(true);
      const main = new Listing();
      const response = await main.PodcastDetail(extractUuid(slug));
      const podcast = response?.data?.data || null;
      setData(podcast);
      if (podcast) {
        const canonicalPath = contentPath("podcast", podcast);
        if (`/podcast/${slug}` !== canonicalPath) {
          router.replace(canonicalPath, undefined, { shallow: true });
        }
      }
    } catch (error) {
      console.log("error", error);
      setData({});
    }
    setLoading(false);
  };

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    } else if (slug) {
      fetchDetails(slug);
    }
  }, [slug, initialData]);

  // const episodes = [
  //   {
  //     title: "Mahabharata Episode 1: Beginnings",
  //     description:
  //       "Ganga, Devabrata and Shantanu... This episode tells the story of the beginnings of the great saga told by Rishi Vyasa and written by Lord Ganesha. , Ganga, Devabrata and Shantanu... This episode tells the story of the beginnings of the great saga told by Rishi Vyasa and written by Lord Ganesha.,Ganga, Devabrata and Shantanu... This episode tells the story of the beginnings of the great saga told by Rishi Vyasa and written by Lord Ganesha.",
  //     duration: "23 min",
  //   },
  //   {
  //     title: "Mahabharata Episode 2: Amba’s Plight",
  //     description:
  //       "Bhishma abducts Amba, Ambika and Ambalika... Audio engineering and sound design by Avi Ziv.",
  //     duration: "26 min",
  //   },
  //   {
  //     title: "Mahabharata Episode 3: Birth of the Kuru Princes",
  //     description:
  //       "Pandu Hunts the Deer Couple... We also learn about the tragic death of King Pandu.",
  //     duration: "20 min",
  //   },
  //   {
  //     title: "Mahabharata Episode 4: The Conflict Begins",
  //     description:
  //       "Young Bheema fights with the Nagas... Enjoy and do not forget to give your feedback.",
  //     duration: "15 min",
  //   },
  // ];

  return (
    <Layout seo={data?.uuid ? {
      title: data.seoTitle || data.name,
      appendSiteName: !data.seoTitle,
      description: data.seoDescription || metaDescription(data.description),
      keywords: podcastKeywords(data),
      path: contentPath("podcast", data),
      image: data.thumbnail,
      type: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "PodcastSeries",
        name: data.name,
        description: data.seoDescription || plainText(data.description),
        keywords: podcastKeywords(data),
        author: { "@type": "Person", name: data.author },
        image: data.thumbnail,
        url: `${SITE_URL}${contentPath("podcast", data)}`,
      },
    } : { title: "Podcast" }}>
      <div className=" pt-[118px] lg:pt-[128px] ">
        <div className="mx-auto container sm:container md:container lg:container xl:max-w-[1440px]  px-4">
         <PodcastDetails podcast={data}/>

          {/* Episodes List */}
          <h2 className="mt-10 text-xl font-semibold text-white">Episodes </h2>
          {/* <div className="mt-4 divide-y divide-[#FFFFFF1A]">
            {episodes.map((ep, index) => (
              <div key={index} className="py-6">
                <h4 className="font-bold text-[15px] leading-snug text-white uppercase mb-1">
                  Episode {index + 1}
                </h4>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="flex-1">
                    <h2 className="font-bold text-[17px] leading-snug text-white mb-1">{ep.title}</h2>
                    <p className="text-sm text-[#AAAAAA] leading-snug line-clamp-3">
                      {ep.description}
                    </p>
                  </div>

                  <div className="flex-shrink-0 flex flex-row items-center gap-4 mt-[30px]">
                    <span className="text-[#727272] text-[16px]">{ep.duration}</span>
                    <span className="text-[#727272] text-[16px]">
                      ...
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div> */}
           {data && data?.episodes && data?.episodes?.map((item,index)=>(
              <EpisodeCard episode={item} key={index} setIsEpisodePopupOpen={false} setSelectedEpisode={null} fetchDetails={fetchDetails} isAdmin={false}/>
            ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params, res }) {
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api";
  try {
    const response = await fetch(`${apiUrl}/podcast/get/${encodeURIComponent(extractUuid(params.slug))}`);
    if (response.status === 404) return { notFound: true };
    if (!response.ok) throw new Error(`Podcast API returned ${response.status}`);
    const payload = await response.json();
    const podcast = payload?.data || null;
    if (!podcast) return { notFound: true };

    const canonicalPath = contentPath("podcast", podcast);
    if (`/podcast/${params.slug}` !== canonicalPath) {
      return { redirect: { destination: canonicalPath, permanent: true } };
    }

    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    return { props: { initialData: podcast } };
  } catch (error) {
    console.error("Podcast SSR fetch failed:", error.message);
    return { props: { initialData: null } };
  }
}
