import React, { useEffect, useState } from "react";
import moment from "moment";
import * as XLSX from 'xlsx';
import ViewMessage from "@/common/ViewMessage";
import Listing from "@/pages/api/Listing";
import NoData from "@/common/NoDataFound";
import { TableLoader } from "@/common/LoadingSpinner";
import AuthLayout from "@/layout/AuthLayout";
import Loader from "@/common/Loader";
import toast from "react-hot-toast";

export default function index() {
  const [listing, setLisitng] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);

  const EnquiryList = async (pg, signal) => {
    try {
      if (pg === 1) {
        setLoading(true);
      }
      setLoadingButton(true);

      const main = new Listing();
      const response = await main.enquiryGet(pg, limit, { signal });

      const records = response?.data?.data?.records;
      const pagination = response?.data?.data?.pagination;

      if (records) {
        setLisitng((prevData) => {
          if (pg === 1) {
            return records;
          } else {
            return [...prevData, ...records];
          }
        });

        setHasMore(pagination?.nextPage !== null);
      }
    } catch (error) {
      console.log("Error fetching enquiry data:", error);
    } finally {
      setLoading(false);
      setLoadingButton(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    EnquiryList(page, signal);
    return () => controller.abort();
  }, [page, limit]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const downloadExcel = () => {
    if (!listing || listing.length === 0) {
      toast.error("No data to export");
      return;
    }

    const result = listing && listing?.map((item, index) => ({
      "S.No.": index+1 || "",
      "Name": item?.name || "",
      "Email": item?.email || "",
      "Subject": item?.subject || "",
      "Message": item?.message || "",
      "Date": moment(item?.createdAt).format("DD MMM YYYY, hh:mm A") || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(result);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Enquiries.xlsx");
  };

  return (
    <AuthLayout>
      <div className="flex items-center justify-between tracking-tight border-b border-[#2a2a2a] pb-4 mb-6 w-full">
        <h1 className="text-3xl lg:text-4xl font-bold text-white">Enquiries</h1>
        <button
          onClick={downloadExcel}
          className="px-6 py-2 bg-theme text-white rounded-lg disabled:opacity-50 cursor-pointer"
        >
          Export as Excel
        </button>
      </div>
      <div className="overflow-auto">
        {loading ? (
          <TableLoader length={10} />
        ) : // <Loader/>
        listing?.length === 0 ? (
          <NoData />
        ) : (
          <>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-theme">
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-white border-b border-white/30 w-[60px]">
                    S.No.
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-white border-b border-white/30">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-white border-b border-white/30">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-white border-b border-white/30">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-white border-b border-white/30">
                    Message
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-white border-b border-white/30 w-[160px]">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {listing?.length > 0 &&
                  listing.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-white border-b border-white/10">
                        {index + 1}
                      </td>

                      <td className="px-4 py-4 text-sm text-white border-b border-white/10">
                        {item?.name || "-"}
                      </td>

                      <td className="px-4 py-4 text-sm text-white border-b border-white/10 break-all">
                        {item?.email || "-"}
                      </td>

                      <td className="px-4 py-4 text-sm text-white border-b border-white/10">
                        {item?.subject || "-"}
                      </td>

                      <td className="px-4 py-4 text-sm text-white border-b border-white/10">
                        <ViewMessage text={item?.message} />
                      </td>

                      <td className="px-4 py-4 text-sm text-white border-b border-white/10 whitespace-nowrap">
                        {item?.createdAt
                          ? moment(item.createdAt).format(
                              "DD MMM YYYY, hh:mm A",
                            )
                          : "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {hasMore && !loading && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMore}
                  disabled={loadingButton}
                  className="px-6 py-2 bg-theme text-white rounded-lg disabled:opacity-50 cursor-pointer"
                >
                  {loadingButton ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AuthLayout>
  );
}
