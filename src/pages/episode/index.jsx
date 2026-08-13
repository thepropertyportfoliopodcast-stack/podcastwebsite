import Layout from "@/layout/Layout";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaCheck, FaChevronDown, FaSearch } from "react-icons/fa";
import { useRouter } from "next/router";
import Heading from "@/common/Heading";
import Listing from "../api/Listing";
import EpisodeCard from "@/common/EpisodeCard";
import Loader from "@/common/Loader";

export default function Index({ initialEpisodes = [], initialTopics = [], initialPagination = {} }) {
  const router = useRouter();
  const [data, setData] = useState(Array.isArray(initialEpisodes) ? initialEpisodes : []);
  const [topics, setTopics] = useState(Array.isArray(initialTopics) ? initialTopics : []);
  const [page, setPage] = useState(Number(initialPagination.page) || 1);
  const [totalPages, setTotalPages] = useState(Number(initialPagination.totalPages) || 1);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const LIMIT = 10;

  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [topicOpen, setTopicOpen] = useState(false);
  const timerRef = useRef(null);
  const searchRef = useRef(null);
  const topicRef = useRef(null);

  const fetchEpisodes = async (search = "", topic = "", pageNumber = 1) => {
    try {
      setLoading(true);
      const main = new Listing();
      const response = await main.EpisodeGetAll(search, topic, pageNumber, LIMIT);
      const resData = response?.data?.data;
      const nextTopics = Array.isArray(resData?.topics) ? resData.topics : [];
      const nextEpisodes = Array.isArray(resData?.episodes) ? resData.episodes : [];
      setTopics(nextTopics);
      setTotalPages(Math.max(1, Number(resData?.pagination?.totalPages) || 1));
      setPage(Number(resData?.pagination?.page) || pageNumber);
      setData(nextEpisodes);
    } catch (error) {
      console.log("error", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (!initialEpisodes.length) fetchEpisodes("", "", 1); }, []);
  useEffect(() => {
    const close = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) setSuggestionsOpen(false);
      if (topicRef.current && !topicRef.current.contains(event.target)) setTopicOpen(false);
    };
    const escape = (event) => { if (event.key === "Escape") { setSuggestionsOpen(false); setTopicOpen(false); } };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); };
  }, []);

  const handleSearchChange = (e) => {
    const sval = e.target.value;
    setSearchText(sval);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (sval.trim().length < 2) { setSuggestions([]); setSuggestionsOpen(false); return; }
    timerRef.current = setTimeout(async () => {
      try {
        const response = await new Listing().EpisodeGetAll(sval.trim(), "", 1, 6);
        const matches = response?.data?.data?.episodes;
        setSuggestions(Array.isArray(matches) ? matches.slice(0, 6) : []);
        setSuggestionsOpen(true);
      } catch { setSuggestions([]); setSuggestionsOpen(false); }
    }, 300);
  };

  const submitSearch = (value = searchText) => {
    const query = value.trim();
    setSearchText(value);
    setAppliedSearch(query);
    setSuggestionsOpen(false);
    setPage(1);
    fetchEpisodes(query, selectedTopic, 1);
    router.replace({ pathname: "/episode", query: query ? { search: query } : {} }, undefined, { shallow: true, scroll: false });
  };

  const chooseTopic = (topic) => {
    setSelectedTopic(topic);
    setTopicOpen(false);
    setPage(1);
    fetchEpisodes(appliedSearch, topic, 1);
  };

  const goToPage = (pageNumber) => {
    const nextPage = Math.min(Math.max(1, pageNumber), totalPages);
    if (nextPage === page || loading) return;
    fetchEpisodes(appliedSearch, selectedTopic, nextPage);
    router.replace(
      { pathname: "/episode", query: nextPage > 1 ? { page: nextPage } : {} },
      undefined,
      { shallow: true, scroll: false }
    );
    document.getElementById("episode-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const paginationItems = Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter((item) => item === 1 || item === totalPages || Math.abs(item - page) <= 1)
    .reduce((items, item, index, visible) => {
      if (index > 0 && item - visible[index - 1] > 1) items.push(`ellipsis-${item}`);
      items.push(item);
      return items;
    }, []);

  return (
    <Layout>
      <div className="min-h-screen overflow-hidden bg-black pt-[105px] sm:pt-[120px] lg:pt-[150px]">
        <div className="relative">
          {/* Background color divs */}

          <div className="pointer-events-none absolute -left-[24rem] bottom-[-18rem] h-[760px] w-[760px] rounded-full bg-[radial-gradient(circle,rgba(252,24,216,.4)_0%,rgba(151,71,255,.22)_40%,transparent_70%)] blur-3xl" aria-hidden="true" />

          <div className="pointer-events-none absolute -right-[24rem] top-[-18rem] h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(151,71,255,.4)_0%,rgba(252,24,216,.2)_42%,transparent_72%)] blur-3xl" aria-hidden="true" />

          <div className="relative z-[2] mx-auto mb-4 w-full max-w-[1310px] px-4 pb-8 sm:px-6 lg:mb-10 lg:px-8 lg:pb-12">
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
            <div className="mb-8 flex w-full flex-col items-stretch justify-center gap-3 sm:mb-10 md:flex-row md:items-center">
              {/* Search Box */}
              <form ref={searchRef} className="relative w-full" onSubmit={(event) => { event.preventDefault(); submitSearch(); }} role="search">
                <input
                  type="text"
                  value={searchText}
                  onChange={handleSearchChange}
                  placeholder="Search episodes..."
                  aria-label="Search episodes"
                  aria-autocomplete="list"
                  aria-expanded={suggestionsOpen}
                  aria-controls="episode-suggestions"
                  onFocus={() => suggestions.length && setSuggestionsOpen(true)}
                  className="w-full rounded-full border border-white/40 bg-[#111111] py-3 pe-14 ps-5 text-base font-medium text-white placeholder-white/60 focus:border-[#9747FF] focus:outline-none sm:text-lg"
                />
                <button type="submit" aria-label="Search episodes" className="absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-r from-[#9747FF] to-[#FC18D8] text-white transition hover:scale-105"><FaSearch aria-hidden="true" /></button>
                {suggestionsOpen && <div id="episode-suggestions" role="listbox" className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 max-h-80 overflow-y-auto rounded-2xl border border-white/20 bg-[#111] p-2 shadow-2xl shadow-black/70">
                  {suggestions.length ? suggestions.map((episode) => <button key={episode.uuid || episode.id} type="button" role="option" onClick={() => submitSearch(episode.title)} className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/10 focus:bg-white/10 focus:outline-none"><span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white/5">{episode.thumbnail && <Image src={episode.thumbnail} alt="" fill sizes="48px" className="object-cover" />}</span><span className="min-w-0"><strong className="line-clamp-2 text-sm text-white">{episode.title}</strong><small className="mt-1 block text-xs text-[#c99cff]">{episode.topic || "Podcast episode"}</small></span></button>) : <p className="p-3 text-sm text-white/60">No matching suggestions.</p>}
                </div>}
              </form>

              {/* Dropdown */}
              <div ref={topicRef} className="relative w-full md:max-w-[230px]">
                <button type="button" onClick={() => setTopicOpen((open) => !open)} aria-haspopup="listbox" aria-expanded={topicOpen} className="flex w-full items-center gap-3 rounded-full border border-white/40 bg-[#111] px-4 py-3 text-left text-white transition hover:border-[#9747FF] focus:border-[#9747FF] focus:outline-none">
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
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span className="min-w-0 flex-1 truncate pl-6">{selectedTopic || "All Topics"}</span><FaChevronDown className={`shrink-0 transition ${topicOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
                {topicOpen && <div role="listbox" aria-label="Filter episodes by topic" className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-64 overflow-y-auto rounded-2xl border border-white/20 bg-[#111] p-2 shadow-2xl shadow-black/70"><button type="button" role="option" aria-selected={!selectedTopic} onClick={() => chooseTopic("")} className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-white hover:bg-white/10"><span>All Topics</span>{!selectedTopic && <FaCheck className="text-[#c99cff]" />}</button>{topics.map((topic) => <button key={topic} type="button" role="option" aria-selected={selectedTopic === topic} onClick={() => chooseTopic(topic)} className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-white hover:bg-white/10"><span className="truncate">{topic}</span>{selectedTopic === topic && <FaCheck className="text-[#c99cff]" />}</button>)}</div>}
              </div>
            </div>

            {loading ? (
              <Loader />
            ) : (
              <div id="episode-results" className="scroll-mt-28 space-y-8">
                {data.map((ep, index) => (
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
        {!loading && totalPages > 1 && (
          <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Episodes pagination">
            <button type="button" onClick={() => goToPage(page - 1)} disabled={page === 1} className="min-h-11 rounded-xl border border-white/20 bg-[#111] px-4 font-semibold text-white transition hover:border-[#c99cff] disabled:cursor-not-allowed disabled:opacity-35">
              Previous
            </button>
            {paginationItems.map((item) => typeof item === "string" ? (
              <span key={item} className="flex h-11 min-w-8 items-center justify-center text-white/50" aria-hidden="true">…</span>
            ) : (
              <button key={item} type="button" onClick={() => goToPage(item)} aria-current={item === page ? "page" : undefined} aria-label={`Go to episode page ${item}`} className={`h-11 min-w-11 rounded-xl border px-3 font-bold transition ${item === page ? "border-[#FC18D8] bg-gradient-to-r from-[#9747FF] to-[#FC18D8] text-white" : "border-white/20 bg-[#111] text-white hover:border-[#c99cff]"}`}>
                {item}
              </button>
            ))}
            <button type="button" onClick={() => goToPage(page + 1)} disabled={page === totalPages} className="min-h-11 rounded-xl border border-white/20 bg-[#111] px-4 font-semibold text-white transition hover:border-[#c99cff] disabled:cursor-not-allowed disabled:opacity-35">
              Next
            </button>
          </nav>
        )}
        {!loading && data.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/[.03] p-8 text-center text-white/65">No episodes found. Try a different search or topic.</p>
        )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ res, query }) {
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api";
  const requestedPage = Math.max(1, Number.parseInt(query.page, 10) || 1);
  try {
    const response = await fetch(`${apiUrl}/file/getAll?search=&topic=&page=${requestedPage}&limit=10`);
    if (!response.ok) throw new Error(`Episode API returned ${response.status}`);
    const payload = await response.json();
    const data = payload?.data || {};
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    return {
      props: {
        initialEpisodes: data.episodes || [],
        initialTopics: data.topics || [],
        initialPagination: data.pagination || {},
      },
    };
  } catch (error) {
    console.error("Episode listing SSR fetch failed:", error.message);
    return { props: { initialEpisodes: [], initialTopics: [], initialPagination: {} } };
  }
}
