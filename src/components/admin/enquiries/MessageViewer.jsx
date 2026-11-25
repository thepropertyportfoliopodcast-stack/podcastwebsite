import React, { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
};

export default function MessageViewer({ enquiry }) {
  const [isOpen, setIsOpen] = useState(false);
  const type = enquiry?.kind === "TOPIC_SUGGESTION" ? "Topic suggestion" : "Enquiry";
  const sheetStatus = enquiry?.sheetSyncedAt
    ? "Synced to Google Sheets"
    : enquiry?.sheetSyncError
      ? "Google Sheets sync failed"
      : "Not synced";

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="max-w-[420px] cursor-pointer text-left font-[manrope] text-[15px] font-semibold !text-slate-800 underline decoration-slate-300 underline-offset-2 hover:!text-violet-800"
        aria-label={`View enquiry details from ${enquiry?.name || enquiry?.email || "sender"}`}
      >
        <span className="block line-clamp-2 break-words">{enquiry?.message || "View details"}</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-details-title"
            className="flex max-h-[min(88dvh,900px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-violet-100 bg-white text-slate-900 shadow-[0_28px_90px_rgba(15,23,42,.35)]"
          >
            <header className="flex items-start justify-between gap-4 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-fuchsia-50 px-5 py-4 sm:px-7 sm:py-5">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-violet-700">Enquiry details</p>
                <h2 id="enquiry-details-title" className="mt-1 break-words text-xl font-extrabold text-slate-950 sm:text-2xl">
                  {enquiry?.subject || "Message"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-800"
                aria-label="Close enquiry details"
              >
                <IoCloseSharp size={22} aria-hidden="true" />
              </button>
            </header>

            <div className="min-h-0 space-y-6 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
              <dl className="grid gap-3 sm:grid-cols-2">
                <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Name</dt>
                  <dd className="mt-1 break-words text-sm font-semibold text-slate-900">{enquiry?.name || "-"}</dd>
                </div>
                <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Email</dt>
                  <dd className="mt-1 break-all text-sm font-semibold text-slate-900">{enquiry?.email || "-"}</dd>
                </div>
                <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Type</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-900">{type}</dd>
                </div>
                <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Received</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-900">{formatDate(enquiry?.createdAt)}</dd>
                </div>
                <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                  <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">Google Sheets</dt>
                  <dd className={`mt-1 text-sm font-semibold ${enquiry?.sheetSyncedAt ? "text-emerald-700" : enquiry?.sheetSyncError ? "text-red-700" : "text-slate-700"}`}>
                    {sheetStatus}
                    {enquiry?.sheetSyncError && <span className="mt-1 block break-words font-normal">{enquiry.sheetSyncError}</span>}
                  </dd>
                </div>
              </dl>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600">Full message</h3>
                <div className="mt-2 min-h-32 whitespace-pre-wrap break-words rounded-xl border border-slate-200 bg-white p-4 text-[15px] leading-7 text-slate-800 shadow-sm sm:p-5">
                  {enquiry?.message || "No message was provided."}
                </div>
              </section>
            </div>

            <footer className="flex justify-end border-t border-slate-200 bg-slate-50 px-5 py-3 sm:px-7">
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-violet-800">
                Close details
              </button>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
