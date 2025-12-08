import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import moment from "moment";
import { BsThreeDots } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import Listing from "@/pages/api/Listing";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { FaHeadphones, FaUser, FaClock } from "react-icons/fa";
import { IoIosArrowDown, IoMdTime } from "react-icons/io";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Link from "next/link";

export default function EpisodeCard({
  episode,
  setIsEpisodePopupOpen,
  setSelectedEpisode,
  fetchDetails,
  isAdmin = false,
  slug,
}) {
  const router = useRouter();
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
      const main = new Listing();
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

  return (
    <div
  className={`group relative flex flex-col md:flex-row items-center gap-4 sm:gap-6 bg-[#4B4B4B] rounded-2xl shadow-lg overflow-hidden p-4 sm:p-6 md:p-8
    ${episode?.isDeleted ? "opacity-50" : ""} transition-colors duration-200 cursor-pointer`}
  onClick={() => {
    if(isAdmin){
      playTrack(episode);
      return;
    }
    router.push(`/episode/${episode?.uuid}`);
    }}
>
  {/* Image */}
  <div className="relative w-full md:min-h-[260px] h-full md:w-[400px] aspect-video rounded-2xl overflow-hidden flex-shrink-0">
    <Image
      src={episode?.thumbnail || ""}
      alt={episode?.title}
      layout="fill"
      objectFit="cover"
      className="rounded-2xl  object-cover h-full"
    />
    {/* Hover Play Icon */}
    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <div className="bg-theme p-4 sm:p-5 rounded-full">
        <FaPlay className="text-white text-2xl sm:text-3xl" />
      </div>
    </div>
  </div>

  {/* Content */}
  <div className="flex-1 font-outfit text-white flex flex-col items-start w-full">
    <h3 className="font-bold text-lg sm:text-xl md:text-2xl mb-2 tracking-wide capitalize">
      {episode?.title}
    </h3>

    {/* Meta Info */}
    <div className="flex flex-wrap items-center text-xs sm:text-sm md:text-base text-white gap-2 sm:gap-4 mb-3">
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
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M5.8 4.3335V8.3335C5.8 8.6224 5.8569 8.90848 5.96747 9.1754C6.07803 9.44232 6.24008 9.68484 6.44437 9.88913C6.64865 10.0934 6.89118 10.2555 7.1581 10.366C7.42501 10.4766 7.71109 10.5335 8 10.5335C8.28891 10.5335 8.57499 10.4766 8.8419 10.366C9.10882 10.2555 9.35135 10.0934 9.55563 9.88913C9.75992 9.68484 9.92197 9.44232 10.0325 9.1754C10.1431 8.90848 10.2 8.6224 10.2 8.3335V4.3335C10.2 3.75002 9.96821 3.19044 9.55563 2.77786C9.14305 2.36528 8.58348 2.1335 8 2.1335C7.41652 2.1335 6.85695 2.36528 6.44437 2.77786C6.03179 3.19044 5.8 3.75002 5.8 4.3335ZM8.4 13.3175V15.3335H7.6V13.3175C6.34718 13.2169 5.17819 12.6483 4.32576 11.7247C3.47333 10.8011 2.99999 9.59034 3 8.3335V7.3335H3.8V8.3335C3.8 9.44741 4.2425 10.5157 5.03015 11.3033C5.8178 12.091 6.88609 12.5335 8 12.5335C9.11391 12.5335 10.1822 12.091 10.9698 11.3033C11.7575 10.5157 12.2 9.44741 12.2 8.3335V7.3335H13V8.3335C13 9.59034 12.5267 10.8011 11.6742 11.7247C10.8218 12.6483 9.65282 13.2169 8.4 13.3175ZM5 4.3335C5 3.53785 5.31607 2.77478 5.87868 2.21218C6.44129 1.64957 7.20435 1.3335 8 1.3335C8.79565 1.3335 9.55871 1.64957 10.1213 2.21218C10.6839 2.77478 11 3.53785 11 4.3335V8.3335C11 9.12915 10.6839 9.89221 10.1213 10.4548C9.55871 11.0174 8.79565 11.3335 8 11.3335C7.20435 11.3335 6.44129 11.0174 5.87868 10.4548C5.31607 9.89221 5 9.12915 5 8.3335V4.3335Z"
            fill="white"
            stroke="white"
            stroke-width="0.5"
         />
        </svg>
        <span>{episode?.author || "Nolan Bator"}</span>
      </span> |
      <span className="flex items-center gap-1">
        <IoMdTime size={14} /> {episode?.duration} mins
      </span>
    </div>

    {/* Description */}
    <p
      className={`text-sm sm:text-base md:text-lg text-white/70 transition-all duration-300 ${isOpen ? "" : "line-clamp-2"}`}>
      {episode?.description}
    </p>

    {/* See more */}
    <button className="flex items-center gap-1 text-sm sm:text-base text-white/70 mt-2 cursor-pointer"
        onClick={(e) => {
        e.stopPropagation(); // prevent triggering playTrack
        setIsOpen(!isOpen);  // toggle description expand/collapse
      }}
    >
       {isOpen ? "See Less" : "See More"} <IoIosArrowDown />
    </button>

    {/* Listen Button */}
    <button className="mt-4 sm:mt-6 flex items-center gap-2 bg-[#5B5B5B] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full transition-all hover:scale-105 hover:bg-gradient-to-r hover:from-[#9747FF] hover:to-[#FC18D8] cursor-pointer">
      <FaHeadphones /> Listen Now
    </button>
  </div>

  {/* Dropdown Menu (Admin Only) */}
  {isAdmin && (
    <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
      <BsThreeDots
        className="text-gray-300 hover:text-white text-xl cursor-pointer"
        onClick={() => setShowMenu((prev) => !prev)}
      />
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-32 bg-[#1c1c1c] border border-gray-700 rounded-md shadow-lg z-10"
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
            className="flex gap-2 items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-white/10"
          >
            {episode?.isDeleted ? "Enable" : <>Delete <RiDeleteBin5Line size={16} /></>}
          </button>
        </div>
      )}
    </div>
  )}
</div>
  );
}