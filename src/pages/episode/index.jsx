import Layout from "@/layout/Layout";
import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import Heading from "@/common/Heading";
import Listing from "../api/Listing";
import EpisodeCard from "@/common/EpisodeCard";
import Testimonials from "../home/Testimonials";
import Loader from "@/common/Loader";

export default function Index() {
  const [data, setData] = useState([]);
  const [topics, setTopics] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const LIMIT = 10;

  const [searchText, setSearchText] = useState("");
  const timerRef = useRef(null);

  const fetchEpisodes = async (search = "", topic = "", pageNumber = 1, append = false) => {
    try {
      if(pageNumber === 1){
        setLoading(true);
      }
      else{
        setLoadingMore(true);
      }
      const main = new Listing();
      const response = await main.EpisodeGetAll(search, topic, pageNumber, LIMIT);
      const resData = response?.data?.data;
      setTopics(resData?.topics || []);
      setHasNextPage(resData?.pagination?.hasNextPage);
      if (append) {
        setData(prev => [...prev, ...(resData?.episodes || [])]);
      } else {
        setData(resData?.episodes || []);
      }
    } catch (error) {
      console.log("error", error);
      if (!append) setData([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchEpisodes(searchText, selectedTopic, 1, false);
  }, [selectedTopic]);

  const handleSearchChange = (e) => {
    const sval = e.target.value;
    setSearchText(sval);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (!sval || sval.trim() === "") {
      timerRef.current = setTimeout(() => {
        setPage(1);
        fetchEpisodes(sval, selectedTopic, 1, false);
      }, 1500);
    } else if (sval.length >= 2) {
      timerRef.current = setTimeout(() => {
        setPage(1);
        fetchEpisodes(sval, selectedTopic, 1, false);
      }, 1500);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchEpisodes(searchText, selectedTopic, nextPage, true);
  };

  return (
    <Layout>
      <div className="bg-black pt-[120px] lg:pt-[160px] ">
        <div className="relative ">
          {/* Background color divs */}

          <div className="absolute z-0 xl:max-w-[578px] w-full md:w-[578px] h-full md:h-[943px]  aspect-square left-[0] bottom-[-250px]  rounded-r-full z-1">
            <Image
              src={"/lightpinkleft.png"}
              layout="fill"
              objectFit="cover"
              className="object-cover w-full"
            />
          </div>

          <div className="absolute z-0 xl:max-w-[578px] w-full md:w-[500px] h-full md:h-[700px]  aspect-square right-[0] top-[-250px]  rounded-r-full z-1">
            <Image
              src={"/lightpinkright.png"}
              layout="fill"
              objectFit="cover"
              className="object-cover w-full"
            />
          </div>

          <div className="max-w-[1310px] mx-auto px-4 pb-[20px] lg:pb-[50px] w-full mb-4 lg:mb-10 relative z-[2]">
            {/* Heading Section */}
            <Heading
              className={"text-center max-w-3xl mx-auto"}
              subtitle={"All Episodes"}
              title={"Browse"}
              content={
                "Browse our complete library, where each episode holds the conversation, adding value to your portfolio every time you listen."
              }
            />
            {/* Search + Filter */}
            <div className="flex flex-col w-full md:flex-row justify-center items-center gap-[10px] mb-[40px]">
              {/* Search Box */}
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchText}
                  onChange={handleSearchChange}
                  placeholder="Search episodes..."
                  aria-label="Search episodes"
                  className="w-full rounded-[40px] bg-[#111111] text-white pt-[12px] pb-[12px] ps-[50px] pe-[50px] 
                                border border-[#FFFFFF] border-[1px] placeholder-[#FFFFFFCC] text-[20px] font-[500] focus:outline-none"
                />
                <FaSearch className="absolute top-[20px] left-[25px] text-white pointer-events-none" />
              </div>

              {/* Dropdown */}
              <div className="relative flex items-center gap-[8px] w-full max-w-[210px] rounded-[40px] ps-[40px] pe-[15px]  border border-[#FFFFFF] border-[1px]">
                <div className="absolute left-[10px]">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.25 11.9999H8.895M4.534 11.9999H2.75M4.534 11.9999C4.534 11.4217 4.76368 10.8672 5.17251 10.4584C5.58134 10.0496 6.13583 9.81989 6.714 9.81989C7.29217 9.81989 7.84666 10.0496 8.25549 10.4584C8.66432 10.8672 8.894 11.4217 8.894 11.9999C8.894 12.5781 8.66432 13.1326 8.25549 13.5414C7.84666 13.9502 7.29217 14.1799 6.714 14.1799C6.13583 14.1799 5.58134 13.9502 5.17251 13.5414C4.76368 13.1326 4.534 12.5781 4.534 11.9999ZM21.25 18.6069H15.502M15.502 18.6069C15.502 19.1852 15.2718 19.7403 14.8628 20.1492C14.4539 20.5582 13.8993 20.7879 13.321 20.7879C12.7428 20.7879 12.1883 20.5572 11.7795 20.1484C11.3707 19.7396 11.141 19.1851 11.141 18.6069M15.502 18.6069C15.502 18.0286 15.2718 17.4745 14.8628 17.0655C14.4539 16.6566 13.8993 16.4269 13.321 16.4269C12.7428 16.4269 12.1883 16.6566 11.7795 17.0654C11.3707 17.4742 11.141 18.0287 11.141 18.6069M11.141 18.6069H2.75M21.25 5.39289H18.145M13.784 5.39289H2.75M13.784 5.39289C13.784 4.81472 14.0137 4.26023 14.4225 3.8514C14.8313 3.44257 15.3858 3.21289 15.964 3.21289C16.2503 3.21289 16.5338 3.26928 16.7983 3.37883C17.0627 3.48839 17.3031 3.64897 17.5055 3.8514C17.7079 4.05383 17.8685 4.29415 17.9781 4.55864C18.0876 4.82313 18.144 5.10661 18.144 5.39289C18.144 5.67917 18.0876 5.96265 17.9781 6.22714C17.8685 6.49163 17.7079 6.73195 17.5055 6.93438C17.3031 7.13681 17.0627 7.29739 16.7983 7.40695C16.5338 7.5165 16.2503 7.57289 15.964 7.57289C15.3858 7.57289 14.8313 7.34321 14.4225 6.93438C14.0137 6.52555 13.784 5.97106 13.784 5.39289Z"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>
                <select
                  aria-label="Filter by topic"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="block w-full max-w-[194px] rounded-[40px] bg-none text-white  pt-[16px] pb-[16px] px-[5px]  border-none focus:outline-none "
                >
                  <option 
                  className="bg-white text-black" value="">All Topics</option>
                  {topics &&
                    topics?.map((topics, index) => (
                      <option className="bg-white text-black" key={index} value={topics}>
                        {topics}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {loading ? (
              <Loader />
            ) : (
              <div className="space-y-8">
                {data &&
                  data?.map((ep, index) => (
                    <EpisodeCard
                      episode={ep}
                      key={index}
                      setIsEpisodePopupOpen={false}
                      setSelectedEpisode={null}
                      fetchDetails={fetchEpisodes}
                      isAdmin={false}
                    />
                  ))}
              </div>
            )}
        {!loading && hasNextPage && (
          <div className="flex justify-center mt-10">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className={`flex items-center gap-2 px-6 py-[10px] rounded-full text-[20px] font-semibold bg-theme w-fit
                ${loadingMore ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
