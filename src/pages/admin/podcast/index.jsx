import React, { useEffect, useRef, useState } from "react";
import AuthLayout from "@/layout/AuthLayout";
import Listing from "@/pages/api/Listing";
import { FaChevronDown } from "react-icons/fa";
import AddPodcast from "./AddPodcast";
import Image from "next/image";
import Link from "next/link";
import { BsThreeDots } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import toast from "react-hot-toast";
import Loader from "@/common/Loader";

export default function Index() {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [data, setData] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [isPodcastPopupOpen, setIsPodcastPopupOpen] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const menuRef = useRef();

  const fetchPodcasts = async () => {
    try {
      setLoading(true);
      const main = new Listing();
      const response = await main.AdminPodcastGet();
      setData(response?.data?.data || []);
    } catch (error) {
      console.log("error", error);
      setData({});
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const handleDelete = async (id) => {
    if (deleteLoading) return;
    setDeleteLoading(true);
    try {
      const main = new Listing();
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
    <AuthLayout>
      <div className="bg-[#0a0a0a] text-white min-h-screen py-8 px-4 lg:px-12 space-y-8">
        <div className="flex items-center justify-between tracking-tight border-b border-[#2a2a2a] pb-4 mb-6 w-full">
          <h1 className="text-3xl lg:text-4xl font-bold">🎙️ Latest Podcasts</h1>
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
        {loading ? (
          <Loader />
        ) : data?.length === 0 ? (
          <p className="text-gray-500 text-center mt-20">No podcasts found.</p>
        ) : (
          data?.map((podcast) => (
            <div
              key={podcast.id}
              className={`bg-[#1a1a1a] rounded-2xl shadow-xl overflow-hidden w-full relative`}
            >
              {/* 3 Dots Dropdown in top-right corner */}
              <div
                className="absolute top-4 right-4 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <BsThreeDots
                  className="text-gray-400 text-xl cursor-pointer"
                  onClick={() => {
                    setSelectedPodcast(podcast);
                    setShowMenu((prev) => !prev);
                  }}
                />
                {showMenu && selectedPodcast?.id === podcast?.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-32 bg-[#1c1c1c] border border-gray-700 rounded-md shadow-lg z-30"
                  >
                    <button
                      onClick={() => {
                        setIsPodcastPopupOpen(true);
                        setShowMenu(false);
                      }}
                      className="flex gap-2 items-center w-full px-4 py-2 text-sm text-white hover:bg-white/10 text-left border-b border-gray-700 cursor-pointer"
                    >
                      Edit <MdEdit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        handleDelete(podcast?.uuid);
                      }}
                      className="flex gap-2 items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-white/10 text-left cursor-pointer"
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
                className={`flex flex-col md:flex-row justify-between md:items-center p-6 gap-6 cursor-pointer hover:bg-[#232323] transition 
                ${podcast?.isDeleted ? "opacity-50" : ""}`}
                href={`/admin/podcast/${podcast?.uuid}`}
              >

                
                <div className="flex flex-col md:flex-row md:items-center gap-6 flex-1">
                  <Image
                    src={podcast?.thumbnail}
                    height={880}
                    width={1200}
                    alt="Thumbnail"
                    className="h-full w-full max-w-[360px] object-cover rounded-md shadow-sm"
                  />

                  <div>
                    <h2 className="text-2xl font-bold mb-1">{podcast?.name}</h2>
                    <p className="text-sm text-gray-400">
                      By {podcast?.author}
                    </p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(podcast?.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm mt-2 text-gray-300">
                      <span className="font-semibold">Language:</span>{" "}
                      {podcast?.language.join(", ") || ""}
                    </p>
                    <p className="text-sm mt-2 text-gray-300">
                      <span className="font-semibold">Cast:</span>{" "}
                      {podcast?.cast.join(", ") || ""}
                    </p>

                    <p className="text-sm mt-6 text-gray-200 line-clamp-2">
                      {podcast?.description}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
      <AddPodcast
        isOpen={isPodcastPopupOpen}
        onClose={() => {
          setIsPodcastPopupOpen(false);
        }}
        fetchPodcasts={fetchPodcasts}
        selectedPodcast={selectedPodcast}
      />
    </AuthLayout>
  );
}
