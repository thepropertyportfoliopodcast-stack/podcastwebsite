import React, { useEffect, useMemo, useRef, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import PodcastApi from "@/services/podcastApi";
import { FaMicrophoneAlt } from "react-icons/fa";
import PodcastFormModal from "@/components/admin/podcasts/PodcastFormModal";
import Image from "next/image";
import Link from "next/link";
import { BsThreeDots } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import toast from "react-hot-toast";
import PageLoader from "@/components/ui/PageLoader";
import { MdAudiotrack, MdOutlineMenuBook, MdTimer } from "react-icons/md";

export default function Index() {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [data, setData] = useState([]);
  const [dashboardData, setDashboardData] = useState({});
  const [showMenu, setShowMenu] = useState(false);
  const [isPodcastPopupOpen, setIsPodcastPopupOpen] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const menuRef = useRef();

  const fetchPodcasts = async () => {
    try {
      setLoading(true);
      const main = new PodcastApi();
      const [response, dashboardResponse] = await Promise.allSettled([
        main.AdminPodcastGet(),
        main.Dashboard(),
      ]);
      setData(response.status === "fulfilled" && Array.isArray(response.value?.data?.data) ? response.value.data.data : []);
      setDashboardData(dashboardResponse.status === "fulfilled" ? dashboardResponse.value?.data?.data || {} : {});
    } catch (error) {
      console.log("error", error);
      setData([]);
      setDashboardData({});
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const stats = useMemo(() => [
    { label: "Total Podcasts", value: dashboardData?.podcastCount ?? "N/A", icon: <FaMicrophoneAlt aria-hidden="true" /> },
    { label: "Total Episodes", value: dashboardData?.fileCount ?? "N/A", icon: <MdAudiotrack aria-hidden="true" /> },
    { label: "Average Episode Duration", value: dashboardData?.averageDuration ?? "N/A", icon: <MdTimer aria-hidden="true" /> },
    { label: "Total Guides", value: "N/A", icon: <MdOutlineMenuBook aria-hidden="true" /> },
  ], [dashboardData]);

  const latestPodcasts = useMemo(() => [...data]
    .sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime())
    .slice(0, 3), [data]);

  const handleDelete = async (id) => {
    if (deleteLoading) return;
    setDeleteLoading(true);
    try {
      const main = new PodcastApi();
      const response = await main.PodcastDelete(id);
      if (response?.data?.status) {
        toast.success(response.data.message);
        fetchPodcasts();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-podcast-page min-h-screen space-y-6 px-1 py-2 text-slate-900 md:px-3">
        <div className="admin-page-header flex items-center justify-between border-b border-violet-200 pb-4 w-full">
          <h1 className="text-3xl lg:text-4xl font-bold">Podcasts</h1>
          <button
            onClick={() => {
              setSelectedPodcast(null);
              setIsPodcastPopupOpen(true);
            }}
            className="w-fit button-bg px-4 xl:px-8 py-2 h-[44px] rounded-md tracking-[-0.06em] text-sm font-medium cursor-pointer"
          >
            Add Podcast
          </button>
        </div>
        <section aria-label="Podcast overview" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div className="admin-stat-card flex min-h-[132px] items-center justify-between gap-4 rounded-2xl px-5 py-5" key={item.label}>
              <div className="min-w-0">
                <p className="admin-stat-label text-sm font-semibold leading-snug sm:text-base">{item.label}</p>
                <p className="admin-stat-value mt-3 text-2xl font-bold tabular-nums sm:text-3xl">{item.value}</p>
              </div>
              <div className="admin-stat-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl sm:h-14 sm:w-14">{item.icon}</div>
            </div>
          ))}
        </section>
        <div className="admin-section-heading flex items-center justify-between border-b pb-3 pt-3">
          <h2 className="text-2xl font-bold lg:text-3xl">Latest Podcasts</h2>
          <span className="text-sm text-slate-500">Showing {Math.min(latestPodcasts.length, 3)} most recent</span>
        </div>
        {loading ? (
          <PageLoader />
        ) : data?.length === 0 ? (
          <p className="text-gray-500 text-center mt-20">No podcasts found.</p>
        ) : (
          <div className="grid items-stretch gap-5 xl:grid-cols-2">
          {latestPodcasts.map((podcast) => (
            <div
              key={podcast.id}
              className="admin-podcast-card relative h-full w-full overflow-hidden rounded-xl border border-violet-200 bg-white shadow-sm"
            >
              {/* 3 Dots Dropdown in top-right corner */}
              <div
                className="absolute top-4 right-4 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <BsThreeDots
                  className="cursor-pointer text-xl text-slate-600"
                  onClick={() => {
                    setSelectedPodcast(podcast);
                    setShowMenu((prev) => !prev);
                  }}
                />
                {showMenu && selectedPodcast?.id === podcast?.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 z-30 mt-2 w-32 rounded-md border border-violet-200 bg-white shadow-lg"
                  >
                    <button
                      onClick={() => {
                        setIsPodcastPopupOpen(true);
                        setShowMenu(false);
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 border-b border-violet-100 px-4 py-2 text-left text-sm text-slate-900 hover:bg-violet-50"
                    >
                      Edit <MdEdit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        handleDelete(podcast?.uuid);
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50"
                    >
                      {podcast?.isDeleted ? (
                        <>Enable</>
                      ) : (
                        <>
                          Disable <RiDeleteBin5Line size={16} />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Main Link Content */}
              <Link
                className={`flex h-full cursor-pointer flex-col gap-4 p-4 transition hover:bg-violet-50 sm:flex-row sm:items-center
                ${podcast?.isDeleted ? "opacity-50" : ""}`}
                href={`/admin/podcast/${podcast?.uuid}`}
              >

                
                <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-center">
                  <Image
                    src={podcast?.thumbnail}
                    height={240}
                    width={240}
                    alt="Thumbnail"
                    sizes="(max-width: 639px) calc(100vw - 64px), 192px"
                    className="aspect-square w-full rounded-lg object-cover shadow-sm sm:h-48 sm:w-48 sm:min-w-48"
                  />

                  <div className="min-w-0 pr-7">
                    <h2 className="mb-1 line-clamp-2 text-xl font-bold leading-tight">{podcast?.name}</h2>
                    <p className="text-sm text-slate-600">
                      By {podcast?.author}
                    </p>
                    <p className="text-sm text-slate-500">
                      Created: {new Date(podcast?.createdAt).toLocaleString()}
                    </p>
                    <p className="mt-2 text-sm text-slate-700">
                      <span className="font-semibold">Language:</span>{" "}
                      {Array.isArray(podcast?.language) ? podcast.language.join(", ") : podcast?.language || ""}
                    </p>
                    <p className="mt-2 text-sm text-slate-700">
                      <span className="font-semibold">Cast:</span>{" "}
                      {Array.isArray(podcast?.cast) ? podcast.cast.join(", ") : podcast?.cast || ""}
                    </p>

                    <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                      {podcast?.description}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
          </div>
        )}
      </div>
      <PodcastFormModal
        isOpen={isPodcastPopupOpen}
        onClose={() => {
          setIsPodcastPopupOpen(false);
        }}
        fetchPodcasts={fetchPodcasts}
        selectedPodcast={selectedPodcast}
      />
    </AdminLayout>
  );
}
