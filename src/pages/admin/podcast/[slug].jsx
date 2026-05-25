import React, { useEffect, useState } from "react";
import AuthLayout from "@/layout/AuthLayout";
import { MdVerified } from "react-icons/md";
import Image from "next/image";
import Listing from "@/pages/api/Listing";
import { useRouter } from "next/router";
import moment from "moment";
import EpisodeCard from "../../../common/EpisodeCard";
import AddEpisode from "./AddEpisode";
import PodcastDetails from "@/common/PodcastDetails";
import Link from "next/link";
import Loader from "@/common/Loader";
import toast from "react-hot-toast";

export default function Detail() {
  const router = useRouter();
  const { slug } = router.query;
  const [loading, setLoading] = useState(false);
  const [isEpisodePopupOpen, setIsEpisodePopupOpen] = useState(false);
  const [data, setData] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  const fetchDetails = async (slug) => {
    try {
      setLoading(true);
      const main = new Listing();
      const response = await main.AdminPodcastDetail(slug);
      setData(response?.data?.data || []);
    } catch (error) {
      console.log("error", error);
      setData({});
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
  // console.log("data", data);

  return (
    <AuthLayout>
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
      {loading ? <Loader/> : 
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

      <div className="mt-8">
        <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold">Episodes</h2>
        <Link
          href={`/admin/episode/add?id=${data?.id}`}
          className="rounded-[40px] bg-theme py-1 sm:py-2 px-3 sm:px-5 cursor-pointer text-sm sm:text-base md:text-md inline-block"
        >
          Add New Episode
        </Link>
        </div>
         <div className="space-y-8 mt-6">
          {data && data?.episodes && data?.episodes?.map((item,index)=>(
            <EpisodeCard episode={item} key={index} setIsEpisodePopupOpen={setIsEpisodePopupOpen} setSelectedEpisode={setSelectedEpisode} fetchDetails={fetchDetails} isAdmin={true} slug={slug} data={data}/>
          ))}
         </div>
      </div>
      <AddEpisode
        isOpen={isEpisodePopupOpen}
        onClose={()=>{setIsEpisodePopupOpen(false);}}
        podcast={data}
        fetchDetails={fetchDetails}
        selectedEpisode={selectedEpisode}
      />
      </>}
    </AuthLayout>
  );
}