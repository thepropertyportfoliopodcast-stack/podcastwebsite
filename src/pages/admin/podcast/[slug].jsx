import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { MdVerified } from "react-icons/md";
import Image from "next/image";
import PodcastApi from "@/services/podcastApi";
import { useRouter } from "next/router";
import moment from "moment";
import AdminEpisodeCard from "@/components/admin/episodes/AdminEpisodeCard";
import EpisodeFormModal from "@/components/admin/podcasts/EpisodeFormModal";
import PodcastDetails from "@/components/podcasts/PodcastDetails";
import Link from "next/link";
import PageLoader from "@/components/ui/PageLoader";
import toast from "react-hot-toast";
import { FiSearch } from "react-icons/fi";

const EPISODES_PER_PAGE = 6;

export default function Detail() {
  const router = useRouter();
  const { slug } = router.query;
  const [loading, setLoading] = useState(false);
  const [isEpisodePopupOpen, setIsEpisodePopupOpen] = useState(false);
  const [data, setData] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [episodeSearch, setEpisodeSearch] = useState("");
  const [episodePage, setEpisodePage] = useState(1);

  const fetchDetails = async (slug) => {
    try {
      setLoading(true);
      const main = new PodcastApi();
      const response = await main.AdminPodcastDetail(slug);
      setData(response?.data?.data && typeof response.data.data === "object" ? response.data.data : null);
    } catch (error) {
      console.log("error", error);
      setData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (slug) {
      fetchDetails(slug);
    }
  }, [slug]);

  const videoRss = `https://api.thepropertyportfolio.com.au/rss/video/podcasts/${data?.uuid}`;
  const audioRss = `https://api.thepropertyportfolio.com.au/rss/audio/podcasts/${data?.uuid}`;

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard")
    } catch {
      toast.error("Copy failed")
    }
  }

  const filteredEpisodes = useMemo(() => {
    const query = episodeSearch.trim().toLowerCase();
    const episodes = Array.isArray(data?.episodes) ? [...data.episodes] : [];

    return episodes
      .sort((firstEpisode, secondEpisode) => {
        const firstDate = Date.parse(firstEpisode?.createdAt || firstEpisode?.updatedAt || "") || 0;
        const secondDate = Date.parse(secondEpisode?.createdAt || secondEpisode?.updatedAt || "") || 0;

        return (
          secondDate - firstDate ||
          (Number(secondEpisode?.episodeNumber) || 0) -
            (Number(firstEpisode?.episodeNumber) || 0)
        );
      })
      .filter((episode) => {
        if (!query) return true;

        const searchableValues = [
          episode?.title,
          episode?.description,
          episode?.detail,
          episode?.topic,
          episode?.seoTitle,
          episode?.seoDescription,
          episode?.episodeNumber,
          episode?.duration,
          episode?.podcast?.author,
          data?.author,
          `episode ${episode?.episodeNumber || ""}`,
          `ep ${episode?.episodeNumber || ""}`,
          `ep${episode?.episodeNumber || ""}`,
        ];

        return searchableValues.some((value) =>
          String(value || "").toLowerCase().includes(query)
        );
      });
  }, [data, episodeSearch]);

  const totalEpisodePages = Math.max(
    1,
    Math.ceil(filteredEpisodes.length / EPISODES_PER_PAGE)
  );

  const visibleEpisodes = useMemo(() => {
    const pageStart = (episodePage - 1) * EPISODES_PER_PAGE;
    return filteredEpisodes.slice(pageStart, pageStart + EPISODES_PER_PAGE);
  }, [episodePage, filteredEpisodes]);

  useEffect(() => {
    if (episodePage > totalEpisodePages) {
      setEpisodePage(totalEpisodePages);
    }
  }, [episodePage, totalEpisodePages]);

  const changeEpisodePage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalEpisodePages);
    setEpisodePage(nextPage);

    window.requestAnimationFrame(() => {
      document
        .getElementById("admin-podcast-episodes")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };
  // console.log("data", data);

  return (
    <AdminLayout>
      {/* <div className="rounded-xl w-full mx-auto bg-[#e65b96] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:gap-8">
        <div className="w-44 h-44 min-w-44 md:w-44 md:h-44 md:min-w-44 relative rounded-full overflow-hidden border-4 border-white shadow-md mx-auto sm:mx-0">
          <Image
            src={data?.thumbnail || ""}
            alt="Podcast Thumbnail"
            layout="fill"
            objectFit="cover"
            className="w-full h-full rounded-full object-cover left-0 md:absolute top-0"
          />
        </div>

        <div className="mt-4 sm:mt-0 text-center sm:text-left">
          <h1 className="text-2xl md:text-5xl font-extrabold leading-snug capitalize">
            {data?.name}
          </h1>

          <p className="text-white text-sm mt-2 sm:max-w-3xl line-clamp-2">
            {data?.description}
          </p>

          <p className="text-white text-sm mt-2">
            Last episode added on{" "}
            {moment(data?.files?.at(-1)?.createdAt).format("DD-MMM-YYYY") || ""}
          </p>
        </div>
      </div> */}
      {loading ? <PageLoader /> : 
      <>
      <PodcastDetails podcast={data}/>
        {/* 🔗 RSS Feed Links */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            RSS feed links
          </h3>

          {/* Video RSS */}
          {/* <div className="mb-3">
            <p className="text-sm text-gray-400 mb-1">
              Video RSS Link
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={videoRss}
                className="flex-1 bg-[#1c1c1c] text-gray-300 text-sm px-3 py-2 rounded border border-gray-700"
              />
              <button
                onClick={() => copyToClipboard(videoRss)}
                className="px-3 py-2 bg-[#2a2a2a] text-white rounded hover:bg-[#3a3a3a] cursor-pointer"
              >
                Copy
              </button>
            </div>
          </div> */}

          {/* Audio RSS */}
          <div className="mb-3">
            <p className="text-sm text-gray-400 mb-1">
              Audio RSS Link
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={audioRss}
                className="flex-1 bg-[#1c1c1c] text-gray-300 text-sm px-3 py-2 rounded border border-gray-700"
              />
              <button
                onClick={() => copyToClipboard(audioRss)}
                className="px-3 py-2 bg-[#2a2a2a] text-white rounded hover:bg-[#3a3a3a] cursor-pointer"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

      <div id="admin-podcast-episodes" className="mt-8 scroll-mt-24">
        <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold">Episodes</h2>
        <Link
          href={`/admin/episode/add?id=${data?.id}`}
          className="rounded-[40px] bg-theme py-1 sm:py-2 px-3 sm:px-5 cursor-pointer text-sm sm:text-base md:text-md inline-block"
        >
          Add New Episode
        </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-[#e5d5f0] bg-white p-3 shadow-sm sm:p-4">
          <label htmlFor="episode-search" className="sr-only">
            Search episodes
          </label>
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-lg text-[#7b6f83]"
            >
              <FiSearch />
            </span>
            <input
              id="episode-search"
              type="search"
              value={episodeSearch}
              onChange={(event) => {
                setEpisodeSearch(event.target.value);
                setEpisodePage(1);
              }}
              placeholder="Search by title, description, episode number or topic..."
              className="w-full rounded-xl border border-[#dcc8eb] bg-white py-3 pl-12 pr-4 text-sm text-[#170d1c] outline-none transition focus:border-[#b52bea] focus:ring-2 focus:ring-[#b52bea]/20 sm:text-base"
            />
          </div>
          <p className="mt-2 px-1 text-xs text-[#736879] sm:text-sm">
            {filteredEpisodes.length} {filteredEpisodes.length === 1 ? "episode" : "episodes"}
            {episodeSearch.trim() ? " found" : " · latest first"}
          </p>
        </div>

        {visibleEpisodes.length > 0 ? (
          <div className="space-y-8 mt-6">
            {visibleEpisodes.map((item) => (
              <AdminEpisodeCard
                episode={item}
                key={item?.uuid || item?.id}
                fetchDetails={fetchDetails}
                slug={slug}
                data={data}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-[#e5d5f0] bg-white px-5 py-10 text-center">
            <p className="font-semibold text-[#170d1c]">No episodes found</p>
            <p className="mt-1 text-sm text-[#736879]">
              Try a different title, description, topic, or episode number.
            </p>
          </div>
        )}

        {totalEpisodePages > 1 && (
          <nav
            aria-label="Episode pagination"
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            <button
              type="button"
              onClick={() => changeEpisodePage(episodePage - 1)}
              disabled={episodePage === 1}
              className="rounded-lg border border-[#dcc8eb] bg-white px-4 py-2 text-sm font-semibold text-[#5c246f] transition hover:border-[#b52bea] disabled:cursor-not-allowed disabled:opacity-45"
            >
              Previous
            </button>

            {Array.from({ length: totalEpisodePages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  aria-current={page === episodePage ? "page" : undefined}
                  onClick={() => changeEpisodePage(page)}
                  className={`min-w-10 rounded-lg border px-3 py-2 text-sm font-bold transition ${
                    page === episodePage
                      ? "border-[#9b22cf] bg-[#9b22cf] !text-white"
                      : "border-[#dcc8eb] bg-white text-[#5c246f] hover:border-[#b52bea]"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => changeEpisodePage(episodePage + 1)}
              disabled={episodePage === totalEpisodePages}
              className="rounded-lg border border-[#dcc8eb] bg-white px-4 py-2 text-sm font-semibold text-[#5c246f] transition hover:border-[#b52bea] disabled:cursor-not-allowed disabled:opacity-45"
            >
              Next
            </button>
          </nav>
        )}
      </div>
      <EpisodeFormModal
        isOpen={isEpisodePopupOpen}
        onClose={()=>{setIsEpisodePopupOpen(false);}}
        podcast={data}
        fetchDetails={fetchDetails}
        selectedEpisode={selectedEpisode}
      />
      </>}
    </AdminLayout>
  );
}
