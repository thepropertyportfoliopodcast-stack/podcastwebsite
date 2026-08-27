import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import PodcastApi from "@/services/podcastApi";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { IoIosArrowDown, IoMdTime } from "react-icons/io";
import toast from "react-hot-toast";
import { MdOutlineHeadphones } from "react-icons/md";
import Link from "next/link";

export default function AdminEpisodeCard({
  episode,
  fetchDetails,
  slug,
  data,
}) {
  const { playTrack } = useAudioPlayer();
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const menuRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (id) => {
    if (deleteLoading) return;
    setDeleteLoading(true);
    try {
      const main = new PodcastApi();
      const response = await main.EpisodeDelete(id);
      if (response?.data?.status) {
        toast.success(response.data.message);
        fetchDetails(slug);
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

  const handlePermanentDelete = async (id) => {
    if (deleteLoading) return;
    const ok = window.confirm("Ye episode permanently delete ho jayega. Confirm?");
    if (!ok) return;
    setDeleteLoading(true);
    try {
      const main = new PodcastApi();
      const response = await main.EpisodePermanentDelete(id);
      if (response?.data?.status) {
        toast.success(response.data.message);
        fetchDetails(slug);
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
    <div className={`group relative flex w-full min-w-0 flex-col items-stretch gap-4 overflow-hidden rounded-[10px] border border-white/40 bg-[#0F0F0F] p-3 shadow-lg transition-colors duration-200 hover:border-[#FC18D8] sm:p-4 md:flex-row md:items-center md:gap-6 md:p-5 xl:rounded-2xl
    ${episode?.isDeleted ? "opacity-50" : ""} transition-colors duration-200 cursor-pointer`}
  onClick={() => {
    playTrack(episode);
    }}
>
  {/* Image */}
  <div className="relative aspect-square w-full overflow-hidden rounded-xl sm:aspect-[16/10] md:h-[300px] md:w-[300px] md:min-w-[300px] md:rounded-2xl">
    {episode?.thumbnail && (
      <Image
        src={episode.thumbnail}
        alt={episode?.title || "Podcast episode artwork"}
        fill
        sizes="(max-width: 639px) calc(100vw - 48px), (max-width: 767px) 600px, 300px"
        quality={82}
        className="rounded-xl object-cover transition-transform duration-300 group-hover:scale-105 md:rounded-2xl md:object-contain"
      />
    )}
    {/* Hover Play Icon */}
    <div className="absolute  top-0 bottom-0 left-0 right-0 w-full h-full inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <div className="bg-theme p-4 sm:p-5 rounded-full">
        <FaPlay className="text-white text-2xl sm:text-3xl" aria-hidden="true" />
      </div>
    </div>
  </div>

{/* Content */}
  <div className="flex w-full min-w-0 flex-1 flex-col items-center font-outfit text-white md:items-start">
    <h3 className="mb-2 break-words text-center text-xl font-bold leading-snug text-white sm:text-2xl md:text-left xl:text-[30px]">
      {episode?.title}
    </h3>

    {/* Meta Info */}
    <div className="mb-3 flex w-full flex-wrap items-center justify-center gap-2 text-xs text-white/75 sm:gap-3 sm:text-sm md:justify-start lg:text-base">
      {/* <span className="">Episode: {episode?.episode?._count?.episodes || 11}</span> | */}
      <span className="flex items-center gap-1">
         <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
         >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.8 4.3335V8.3335C5.8 8.6224 5.8569 8.90848 5.96747 9.1754C6.07803 9.44232 6.24008 9.68484 6.44437 9.88913C6.64865 10.0934 6.89118 10.2555 7.1581 10.366C7.42501 10.4766 7.71109 10.5335 8 10.5335C8.28891 10.5335 8.57499 10.4766 8.8419 10.366C9.10882 10.2555 9.35135 10.0934 9.55563 9.88913C9.75992 9.68484 9.92197 9.44232 10.0325 9.1754C10.1431 8.90848 10.2 8.6224 10.2 8.3335V4.3335C10.2 3.75002 9.96821 3.19044 9.55563 2.77786C9.14305 2.36528 8.58348 2.1335 8 2.1335C7.41652 2.1335 6.85695 2.36528 6.44437 2.77786C6.03179 3.19044 5.8 3.75002 5.8 4.3335ZM8.4 13.3175V15.3335H7.6V13.3175C6.34718 13.2169 5.17819 12.6483 4.32576 11.7247C3.47333 10.8011 2.99999 9.59034 3 8.3335V7.3335H3.8V8.3335C3.8 9.44741 4.2425 10.5157 5.03015 11.3033C5.8178 12.091 6.88609 12.5335 8 12.5335C9.11391 12.5335 10.1822 12.091 10.9698 11.3033C11.7575 10.5157 12.2 9.44741 12.2 8.3335V7.3335H13V8.3335C13 9.59034 12.5267 10.8011 11.6742 11.7247C10.8218 12.6483 9.65282 13.2169 8.4 13.3175ZM5 4.3335C5 3.53785 5.31607 2.77478 5.87868 2.21218C6.44129 1.64957 7.20435 1.3335 8 1.3335C8.79565 1.3335 9.55871 1.64957 10.1213 2.21218C10.6839 2.77478 11 3.53785 11 4.3335V8.3335C11 9.12915 10.6839 9.89221 10.1213 10.4548C9.55871 11.0174 8.79565 11.3335 8 11.3335C7.20435 11.3335 6.44129 11.0174 5.87868 10.4548C5.31607 9.89221 5 9.12915 5 8.3335V4.3335Z"
            fill="white"
            stroke="white"
            strokeWidth="0.5"
         />
        </svg>
        <span>{episode?.podcast?.author || data?.author || "N/A"}</span>
      </span><span className="text-white/35" aria-hidden="true">|</span>
      <span className="flex items-center gap-1">
        <IoMdTime size={14} aria-hidden="true" /> {episode?.duration} mins
      </span>
    </div>

    {/* Description */}
    <p
      className={`break-words text-center text-sm font-semibold leading-6 text-white transition-all duration-300 sm:text-base md:text-left lg:text-xl ${isOpen ? "" : "line-clamp-2"}`}>
      {episode?.description}
    </p>

    {/* See more */}
    {/* <button className="flex items-center gap-1 text-sm sm:text-base text-white/70 mt-2 cursor-pointer"
        onClick={(e) => {
        e.stopPropagation(); // prevent triggering playTrack
        setIsOpen(!isOpen);  // toggle description expand/collapse
      }}
    >
       {isOpen ? "See Less" : "See More"} <IoIosArrowDown />
    </button> */}

    {/* Listen Button */}
    <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-theme px-5 py-2.5 text-base font-semibold sm:w-fit sm:text-lg">
     <MdOutlineHeadphones size={23} aria-hidden="true" /> Listen Now
    </button>
  </div>

  {/* Dropdown Menu (Admin Only) */}
  {(
    <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
      <BsThreeDots
        className="text-gray-300 hover:text-white text-xl cursor-pointer"
        onClick={() => setShowMenu((prev) => !prev)}
      />
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-44 bg-[#1c1c1c] border border-gray-700 rounded-md shadow-lg z-10"
        >
          <Link
            href={`/admin/episode/edit?id=${episode?.uuid}`}
            className="flex gap-2 items-center w-full px-4 py-2 text-sm text-white hover:bg-white/10 border-b border-gray-700"
          >
            Edit <MdEdit size={16} />
          </Link>
          <button
            onClick={() => {
              setShowMenu(false);
              handleDelete(episode?.uuid);
            }}
            className="flex gap-2 items-center w-full px-4 py-2 text-sm hover:bg-white/10 border-b border-gray-700"
          >
            {episode?.isDeleted ? (
              <span className="text-green-400">Enable</span>
            ) : (
              <span className="text-red-400 flex items-center gap-2">
                Delete <RiDeleteBin5Line size={16} />
              </span>
            )}
          </button>
          {episode?.isDeleted && (
            <button
              onClick={() => {
                setShowMenu(false);
                handlePermanentDelete(episode?.uuid);
              }}
              className="flex gap-2 items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-white/10"
            >
              Delete Permanently <RiDeleteBin5Line size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  )}
</div>
  );
}
