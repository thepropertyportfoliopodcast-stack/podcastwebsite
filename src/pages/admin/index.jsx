import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { FaMoneyBillWave } from "react-icons/fa";
import { MdPaid, MdWallet } from "react-icons/md";
import { MdRequestQuote } from "react-icons/md";
import PodcastApi from "@/services/podcastApi";
import PageLoader from "@/components/ui/PageLoader";
import Link from "next/link";
import Image from "next/image";
import AdminEpisodeCard from "@/components/admin/episodes/AdminEpisodeCard";

export default function Index() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const main = new PodcastApi();
      const response = await main.Dashboard();
      setData(response?.data?.data && typeof response.data.data === "object" ? response.data.data : {});
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
        icon: <FaMoneyBillWave className="w-6 h-6" />,
      },
      {
        label: "Total Episodes",
        value: data?.fileCount || "N/A",
        icon: <MdWallet className="w-6 h-6" />,
      },
      {
        label: "Average Episode Duration",
        value: data?.averageDuration || "N/A",
        icon: <MdRequestQuote className="w-6 h-6" />,
      },
      {
        label: "Total Guides",
        value: "N/A",
        icon: <MdPaid className="w-6 h-6" />,
      },
    ],
    [data]
  );

  return (
    <AdminLayout>
      {loading ? (
        <PageLoader />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
            {stats &&
              stats?.map((item, idx) => (
                <div
                  className="admin-stat-card flex justify-between py-4 lg:py-6 px-4 xl:px-5 rounded-2xl"
                  key={idx}
                >
                  <div>
                    <p className="admin-stat-label text-lg xl:text-lg font-medium">
                      {item?.label}
                    </p>
                    <p className="admin-stat-value text-xl lg:text-[30px] font-bold mt-3">
                      {item?.value === "N/A" ? "N/A" : `${item?.value}`}
                    </p>
                  </div>
                  <div className="admin-stat-icon flex items-center justify-center p-2 rounded-xl w-[60px] h-[60px]">
                    {item?.icon}
                  </div>
                </div>
              ))}
          </div>
          <div className="admin-section-heading mt-12 flex items-center justify-between w-full">
            <h1 className="mb-3 text-3xl lg:text-4xl font-bold">
              Latest Episodes
            </h1>
          </div>
          {(Array.isArray(data?.latestEpisodes) ? data.latestEpisodes : []).map((episode) => (
            <div className="mt-3" key={episode.uuid}>
              <AdminEpisodeCard
                episode={episode}
                fetchDetails={() => {}} // noop since dashboard doesn’t refetch list
              />
            </div>
          ))}

        </>
      )}
    </AdminLayout>
  );
}
