import React, { useEffect, useMemo, useState } from "react";
import AuthLayout from "@/layout/AuthLayout";
import { FaMoneyBillWave } from "react-icons/fa";
import { MdPaid, MdWallet } from "react-icons/md";
import { MdRequestQuote } from "react-icons/md";
import Listing from "../api/Listing";
import Loader from "@/common/Loader";
import Link from "next/link";
import Image from "next/image";
import EpisodeCard from "@/common/EpisodeCard";

export default function Index() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const main = new Listing();
      const response = await main.Dashboard();
      setData(response?.data?.data || []);
    } catch (error) {
      console.log("error", error);
      setData({});
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  // console.log("data", data);

  const stats = useMemo(
    () => [
      {
        label: "Total Podcasts",
        value: data?.podcastCount || "N/A",
        icon: <FaMoneyBillWave className="w-6 h-6 text-white" />,
      },
      {
        label: "Total Episodes",
        value: data?.fileCount || "N/A",
        icon: <MdWallet className="w-6 h-6 text-white" />,
      },
      {
        label: "Average Episode Duration",
        value: data?.averageDuration || "N/A",
        icon: <MdRequestQuote className="w-6 h-6 text-white" />,
      },
      {
        label: "Total Guides",
        value: "N/A",
        icon: <MdPaid className="w-6 h-6 text-white" />,
      },
    ],
    [data]
  );

  return (
    <AuthLayout>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
            {stats &&
              stats?.map((item, idx) => (
                <div
                  className="flex justify-between py-4 lg:py-6 px-4 xl:px-5 rounded-xl shadow-sm border border-[#333] text-white bg-[#1e1e1e]"
                  key={idx}
                >
                  <div>
                    <p className="text-[#888888] text-lg xl:text-lg font-medium tracking-[-0.04em]">
                      {item?.label}
                    </p>
                    <p className="text-white text-xl lg:text-[30px] font-bold mt-3 tracking-[-0.04em]">
                      {item?.value === "N/A" ? "N/A" : `${item?.value}`}
                    </p>
                  </div>
                  <div className="flex items-center justify-center p-2 rounded-md w-[60px] h-[60px] border border-[#555]">
                    {item?.icon}
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-12 flex items-center justify-between tracking-tight border-b border-[#2a2a2a] w-full">
            <h1 className="mb-3 text-3xl lg:text-4xl font-bold text-white">
              Latest Episodes
            </h1>
          </div>
          {data?.latestEpisodes?.map((episode) => (
            <div className="mt-3">
              <EpisodeCard
                key={episode.uuid}
                episode={episode}
                isAdmin={true}     // dashboard/admin context
                fetchDetails={() => {}} // noop since dashboard doesn’t refetch list
              />
            </div>
          ))}

        </>
      )}
    </AuthLayout>
  );
}
