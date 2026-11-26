import React, { useEffect, useState } from "react";
import moment from "moment";
import * as XLSX from 'xlsx';
import MessageViewer from "@/components/admin/enquiries/MessageViewer";
import PodcastApi from "@/services/podcastApi";
import EmptyState from "@/components/ui/EmptyState";
import { TableLoader } from "@/components/ui/LoadingSpinner";
import AdminLayout from "@/components/layout/AdminLayout";
import PageLoader from "@/components/ui/PageLoader";
import toast from "react-hot-toast";

export default function index() {
  const [listing, setLisitng] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [syncingId, setSyncingId] = useState(null);
  const [adminProfiles, setAdminProfiles] = useState([]);
  const [selectedAdminIds, setSelectedAdminIds] = useState([]);
  const [loadingRecipients, setLoadingRecipients] = useState(true);
  const [savingRecipients, setSavingRecipients] = useState(false);
  const [recipientSettingsWarning, setRecipientSettingsWarning] = useState("");

  useEffect(() => {
    let active = true;
    new PodcastApi().emailNotificationRecipientsGet()
      .then((response) => {
        if (!active) return;
        const payload = response?.data?.data;
        setAdminProfiles(Array.isArray(payload?.admins) ? payload.admins : []);
        setSelectedAdminIds(Array.isArray(payload?.selectedAdminIds) ? payload.selectedAdminIds : []);
        setRecipientSettingsWarning("");
      })
      .catch(async (error) => {
        if (!active) return;
        try {
          // Super admins can still select profiles if the notification settings endpoint is temporarily unavailable.
          const fallback = await new PodcastApi().AdminUsersGet();
          const users = fallback?.data?.data?.users;
          if (active && Array.isArray(users)) {
            setAdminProfiles(users.filter((user) => user?.isActive));
            setSelectedAdminIds([]);
            setRecipientSettingsWarning("Profiles are loaded, but the saved CC selection could not be retrieved. Choose the recipients and save to replace it.");
            return;
          }
          throw error;
        } catch (fallbackError) {
          if (active) toast.error(error?.response?.data?.message || fallbackError?.response?.data?.message || "Unable to load email recipients");
        }
      })
      .finally(() => { if (active) setLoadingRecipients(false); });
    return () => { active = false; };
  }, []);

  const toggleAdminRecipient = (adminId) => {
    setSelectedAdminIds((current) => current.includes(adminId)
      ? current.filter((id) => id !== adminId)
      : [...current, adminId]);
  };

  const saveAdminRecipients = async () => {
    try {
      setSavingRecipients(true);
      const response = await new PodcastApi().emailNotificationRecipientsSave(selectedAdminIds);
      setSelectedAdminIds(response?.data?.data?.selectedAdminIds || selectedAdminIds);
      setRecipientSettingsWarning("");
      toast.success("Email notification recipients saved");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save email recipients");
    } finally {
      setSavingRecipients(false);
    }
  };

  const EnquiryList = async (pg, signal) => {
    try {
      if (pg === 1) {
        setLoading(true);
      }
      setLoadingButton(true);

      const main = new PodcastApi();
      const response = await main.enquiryGet(pg, limit, { signal });

      const records = Array.isArray(response?.data?.data?.records)
        ? response.data.data.records
        : [];
      const pagination = response?.data?.data?.pagination;

      if (records.length || pg === 1) {
        setLisitng((prevData) => {
          if (pg === 1) {
            return records;
          } else {
            return [...(Array.isArray(prevData) ? prevData : []), ...records];
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
      "Type": item?.kind === "TOPIC_SUGGESTION" ? "Topic suggestion" : "Enquiry",
      "Message": item?.message || "",
      "Google Sheet": item?.sheetSyncedAt ? "Synced" : item?.sheetSyncError ? "Sync failed" : "Not configured",
      "Date": moment(item?.createdAt).format("DD MMM YYYY, hh:mm A") || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(result);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Enquiries.xlsx");
  };

  const deleteEnquiry = async (item) => {
    if (!item?.id || !window.confirm(`Delete the enquiry from ${item.name || item.email || "this sender"}? This cannot be undone.`)) return;

    try {
      setDeletingId(item.id);
      const main = new PodcastApi();
      await main.enquiryDelete(item.id);
      setLisitng((current) => current.filter((record) => record.id !== item.id));
      toast.success("Enquiry deleted from the database");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to delete the enquiry");
    } finally {
      setDeletingId(null);
    }
  };

  const retrySheetSync = async (item) => {
    try {
      setSyncingId(item.id);
      const response = await new PodcastApi().enquirySheetSync(item.id);
      const updated = response?.data?.data;
      setLisitng((current) => current.map((record) => record.id === item.id ? { ...record, ...updated } : record));
      toast.success("Enquiry synced to Google Sheets");
    } catch (error) {
      const message = error?.response?.data?.message || "Google Sheets sync failed";
      setLisitng((current) => current.map((record) => record.id === item.id ? { ...record, sheetSyncError: message } : record));
      toast.error(message, { duration: 6000 });
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header flex items-center justify-between tracking-tight border-b border-[#2a2a2a] pb-4 mb-6 w-full">
        <h1 className="text-3xl lg:text-4xl font-bold text-white">Enquiries</h1>
        <button
          onClick={downloadExcel}
          className="px-6 py-2 bg-theme text-white rounded-lg disabled:opacity-50 cursor-pointer"
        >
          Export as Excel
        </button>
      </div>
      <section className="mb-7 rounded-2xl border border-violet-200 bg-white p-5 text-slate-900 shadow-lg" aria-labelledby="enquiry-email-recipients-title">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h2 id="enquiry-email-recipients-title" className="text-lg font-bold text-slate-900">Email notification recipients</h2>
            <p className="mt-1 max-w-3xl text-sm text-slate-700">New enquiries and subscribers are sent to the configured SMTP mailbox. Selected active admins are added in CC.</p>
          </div>
          <button type="button" onClick={saveAdminRecipients} disabled={loadingRecipients || savingRecipients} className="shrink-0 rounded-lg bg-theme px-4 py-2 font-semibold !text-white disabled:cursor-not-allowed disabled:opacity-50">
            {savingRecipients ? "Saving…" : "Save recipients"}
          </button>
        </div>
        {loadingRecipients ? <p className="mt-4 text-sm text-slate-600">Loading admin profiles…</p> : adminProfiles.length ? (
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {adminProfiles.map((admin) => (
              <label key={admin.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-violet-100 bg-violet-50/60 p-3 hover:bg-violet-50">
                <input type="checkbox" checked={selectedAdminIds.includes(admin.id)} onChange={() => toggleAdminRecipient(admin.id)} className="mt-1 h-4 w-4 accent-violet-500" />
                <span className="min-w-0"><span className="block font-semibold text-slate-900">{admin.name} {admin.role === "SUPER_ADMIN" ? <span className="text-xs text-violet-800">(Super admin)</span> : null}</span><span className="block break-all text-sm text-slate-700">{admin.email}</span></span>
              </label>
            ))}
          </div>
        ) : <p className="mt-4 text-sm text-slate-600">No active admin profiles are available.</p>}
        {recipientSettingsWarning && <p role="status" className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{recipientSettingsWarning}</p>}
      </section>
      <div className="admin-table-scroll overflow-auto">
        {loading ? (
          <TableLoader length={10} />
        ) : // <Loader/>
        listing?.length === 0 ? (
          <EmptyState />
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
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-white border-b border-white/30">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-white border-b border-white/30">
                    Message
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-white border-b border-white/30 w-[160px]">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase text-white border-b border-white/30">Sheet</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold uppercase text-white border-b border-white/30">Action</th>
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
                      <td className="px-4 py-4 text-sm text-white border-b border-white/10"><span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold !text-slate-950 ${item?.kind === "TOPIC_SUGGESTION" ? "bg-fuchsia-200" : "bg-blue-200"}`}>{item?.kind === "TOPIC_SUGGESTION" ? "Topic suggestion" : "Enquiry"}</span></td>

                      <td className="px-4 py-4 text-sm text-white border-b border-white/10">
                        <MessageViewer enquiry={item} />
                      </td>

                      <td className="px-4 py-4 text-sm text-white border-b border-white/10 whitespace-nowrap">
                        {item?.createdAt
                          ? moment(item.createdAt).format(
                              "DD MMM YYYY, hh:mm A",
                            )
                          : "-"}
                      </td>
                      <td className="px-4 py-4 text-sm border-b border-white/10"><span title={item?.sheetSyncError || ""} className={item?.sheetSyncedAt ? "text-green-400" : item?.sheetSyncError ? "text-red-400" : "text-gray-500"}>{item?.sheetSyncedAt ? "Synced" : item?.sheetSyncError ? "Failed" : "Pending"}</span></td>
                      <td className="px-4 py-4 text-right text-sm border-b border-white/10">
                        {!item?.sheetSyncedAt && (
                          <button
                            type="button"
                            onClick={() => retrySheetSync(item)}
                            disabled={syncingId === item.id}
                            className="mr-2 rounded-lg border border-purple-500/50 bg-purple-500/10 px-3 py-2 font-semibold text-purple-700 transition hover:bg-purple-500/20 disabled:opacity-50"
                          >
                            {syncingId === item.id ? "Syncing..." : "Retry Sheet sync"}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteEnquiry(item)}
                          disabled={deletingId === item.id}
                          aria-label={`Delete enquiry from ${item?.name || item?.email || "sender"}`}
                          className="rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2 font-semibold text-red-300 transition hover:border-red-400 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === item.id ? "Deleting..." : "Delete"}
                        </button>
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
    </AdminLayout>
  );
}
