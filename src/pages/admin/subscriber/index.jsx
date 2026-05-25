import React, { useEffect, useState } from "react";
import moment from "moment";
import * as XLSX from 'xlsx';
import Listing from "@/pages/api/Listing";
import NoData from "@/common/NoDataFound";
import { TableLoader } from "@/common/LoadingSpinner";
import AuthLayout from "@/layout/AuthLayout";

export default function SubscriberList() {
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);

  const EnquiryList = async (pg, signal) => {
    try {
      if (pg === 1) setLoading(true);
      setLoadingButton(true);

      const main = new Listing();
      const response = await main.GetSubscriber(pg, limit, { signal });

      const records = response?.data?.data?.records;
      const pagination = response?.data?.data?.pagination;

      if (records) {
        setListing((prev) => (pg === 1 ? records : [...prev, ...records]));

        setHasMore(pagination?.nextPage !== null);
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    } finally {
      setLoading(false);
      setLoadingButton(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    EnquiryList(page, controller.signal);
    return () => controller.abort();
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const downloadExcel = () => {
    if (!listing || listing.length === 0) {
      toast.error("No data to export");
      return;
    }

    const result = listing && listing?.map((item, index) => ({
      "S.No.": index+1 || "",
      "Email": item?.email || "",
      "Date": moment(item?.createdAt).format("DD MMM YYYY, hh:mm A") || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(result);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Subcribers.xlsx");
  };

  return (
    <AuthLayout>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4 mb-6">
        <h1 className="text-3xl lg:text-4xl font-bold">Subscription List</h1>
        <button
            onClick={downloadExcel}
            className="px-6 py-2 bg-theme text-white rounded-lg disabled:opacity-50 cursor-pointer"
          >
            Export as Excel
          </button>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        {loading ? (
          <TableLoader length={2} />
        ) : listing?.length === 0 ? (
          <NoData />
        ) : (
          <table className="w-full table-auto whitespace-nowrap border-collapse">
            <thead>
              <tr className="bg-theme">
                <th className="border-b border-white/30 text-sm text-white uppercase text-left px-6 py-4">
                  S.No.
                </th>
                <th className="border-b border-white/30 text-sm text-white uppercase text-left px-6 py-4">
                  Email
                </th>
                <th className="border-b border-white/30 text-sm text-white uppercase text-left px-6 py-4">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {listing.map((item, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="font-medium text-white text-[15px] text-left px-6 py-4 border-b border-white/10">
                    {index + 1}
                  </td>

                  <td className="font-medium text-white text-[15px] text-left px-6 py-4 border-b border-white/10 break-all">
                    {item?.email || "-"}
                  </td>

                  <td className="font-medium text-white text-[15px] text-left px-6 py-4 border-b border-white/10 whitespace-nowrap">
                    {item?.createdAt
                      ? moment(item.createdAt).format("DD MMM YYYY, hh:mm A")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Load More Button */}
      {listing.length > 0 && hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loadingButton}
            className="px-6 py-2 bg-theme text-white rounded-lg disabled:opacity-50 cursor-pointer"
          >
            {loadingButton ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </AuthLayout>
  );
}
