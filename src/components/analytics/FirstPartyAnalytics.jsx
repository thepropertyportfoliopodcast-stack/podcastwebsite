import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080/api";
const id = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function storedId(storage, key) {
  let value = storage.getItem(key);
  if (!value) { value = id(); storage.setItem(key, value); }
  return value;
}

export default function FirstPartyAnalytics() {
  const router = useRouter();
  const currentPath = useRef("");
  const enteredAt = useRef(Date.now());
  const sentScroll = useRef(new Set());

  useEffect(() => {
    if (router.pathname.startsWith("/admin") || navigator.doNotTrack === "1") return;
    const visitorId = storedId(localStorage, "tppp_visitor_id");
    const campaign = Object.fromEntries(["utm_source","utm_medium","utm_campaign","utm_term","utm_content"].map((key)=>[key.replace("utm_", key === "utm_campaign" ? "name" : ""), new URLSearchParams(location.search).get(key)]).filter(([,value])=>value));
    const campaignKey = JSON.stringify(campaign);
    let sessionId = sessionStorage.getItem("tppp_session_id");
    const lastActivity = Number(sessionStorage.getItem("tppp_last_activity") || 0);
    const previousCampaignKey = sessionStorage.getItem("tppp_campaign_key") || "{}";
    if (!sessionId || Date.now() - lastActivity > 30 * 60 * 1000 || (campaignKey !== "{}" && campaignKey !== previousCampaignKey)) {
      sessionId = id();
      sessionStorage.setItem("tppp_session_id", sessionId);
    }
    if (campaignKey !== "{}") sessionStorage.setItem("tppp_campaign_key", campaignKey);
    const send = (name, extra = {}, useBeacon = false, pathOverride = null) => {
      const eventId = id();
      const eventData = { eventId, sessionId, visitorId, name, path: pathOverride || location.pathname + location.search, title: document.title, referrer: document.referrer, metadata: { screenWidth: screen.width, screenHeight: screen.height, viewportWidth: innerWidth, viewportHeight: innerHeight, language: navigator.language, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, campaign, ...extra.metadata }, value: extra.value };
      // The same first-party event is exposed to GTM for optional tags/triggers.
      // The dashboard itself reads the copy stored by our backend, not GTM.
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "tppp_analytics_event",
        event_name: name,
        tppp_event_name: name,
        tppp_event_id: eventId,
        tppp_path: eventData.path,
        tppp_title: eventData.title,
        tppp_value: extra.value ?? null,
        tppp_metadata: eventData.metadata,
        page_path: eventData.path,
        page_location: location.href,
        page_title: eventData.title,
      });
      const body = JSON.stringify(eventData);
      sessionStorage.setItem("tppp_last_activity", String(Date.now()));
      if (useBeacon && navigator.sendBeacon) navigator.sendBeacon(`${API_URL}/analytics/collect`, new Blob([body], { type: "application/json" }));
      else fetch(`${API_URL}/analytics/collect`, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(()=>{});
    };
    const pageView = () => {
      currentPath.current = location.pathname + location.search; enteredAt.current = Date.now(); sentScroll.current.clear();
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "virtual_page_view", page_path: currentPath.current, page_location: location.href, page_title: document.title, page_referrer: document.referrer });
      send("page_view");
    };
    const engagement = () => { const seconds = Math.round((Date.now() - enteredAt.current) / 1000); if (seconds > 0 && currentPath.current) send("engagement", { value: Math.min(seconds, 1800) }, true, currentPath.current); enteredAt.current = Date.now(); };
    const onRoute = () => { engagement(); setTimeout(pageView, 0); };
    const onVisibility = () => { if (document.visibilityState === "hidden") engagement(); else enteredAt.current = Date.now(); };
    const onScroll = () => { const maximum = document.documentElement.scrollHeight - innerHeight; if (maximum <= 0) return; const depth = Math.min(100, Math.round(scrollY / maximum * 100)); [25,50,75,100].forEach((threshold)=>{ if (depth >= threshold && !sentScroll.current.has(threshold)) { sentScroll.current.add(threshold); send("scroll_depth", { value: threshold }); } }); };
    const onClick = (event) => { const anchor = event.target.closest?.("a[href]"); if (!anchor) return; try { const url = new URL(anchor.href, location.href); if (url.origin !== location.origin) send("outbound_click", { metadata: { url: url.href, domain: url.hostname, text: anchor.textContent?.trim().slice(0,120) } }); } catch {} };
    const onPlay = (event) => { if (event.target.matches?.("audio,video")) send("media_play", { metadata: { source: event.target.currentSrc || event.target.src } }); };
    const onSubmit = (event) => send("form_submit", { metadata: { form: event.target.id || event.target.getAttribute("aria-label") || event.target.action || "form" } });
    const onError = (event) => {
      const target = event.target;
      if (target && target !== window) {
        send("resource_error", { metadata: { source: target.currentSrc || target.src || target.href || target.tagName, message: `Failed to load ${target.tagName || "resource"}` } });
        return;
      }
      send("browser_error", { metadata: { message: String(event.message || "Unknown JavaScript error").slice(0, 500), source: event.filename, line: event.lineno, column: event.colno, stack: String(event.error?.stack || "").slice(0, 1500) } });
    };
    const onRejection = (event) => send("browser_error", { metadata: { message: String(event.reason?.message || event.reason || "Unhandled promise rejection").slice(0, 500), stack: String(event.reason?.stack || "").slice(0, 1500) } });
    pageView();
    router.events.on("routeChangeComplete", onRoute);
    document.addEventListener("visibilitychange", onVisibility); window.addEventListener("scroll", onScroll, { passive: true }); document.addEventListener("click", onClick, true); document.addEventListener("play", onPlay, true); document.addEventListener("submit", onSubmit, true); window.addEventListener("error", onError, true); window.addEventListener("unhandledrejection", onRejection); window.addEventListener("pagehide", engagement);
    const observers = [];
    const observe = (type, callback) => { try { const observer = new PerformanceObserver((list)=>callback(list.getEntries())); observer.observe({ type, buffered: true }); observers.push(observer); } catch {} };
    const navigation = performance.getEntriesByType("navigation")[0];
    if (navigation?.responseStart) send("web_vital", { value: navigation.responseStart, metadata: { metric: "TTFB" } });
    observe("paint", (entries)=>{ const entry = entries.find((item)=>item.name === "first-contentful-paint"); if (entry) send("web_vital", { value: entry.startTime, metadata: { metric: "FCP" } }); });
    observe("largest-contentful-paint", (entries)=>{ const entry = entries.at(-1); if (entry) send("web_vital", { value: entry.startTime, metadata: { metric: "LCP" } }); });
    let cls = 0; observe("layout-shift", (entries)=>{ entries.forEach((entry)=>{ if (!entry.hadRecentInput) cls += entry.value; }); });
    observe("event", (entries)=>{ const value = Math.max(0, ...entries.map((entry)=>entry.duration || 0)); if (value) send("web_vital", { value, metadata: { metric: "INP" } }); });
    return () => { if (cls) send("web_vital", { value: cls, metadata: { metric: "CLS" } }, true); engagement(); router.events.off("routeChangeComplete", onRoute); document.removeEventListener("visibilitychange", onVisibility); window.removeEventListener("scroll", onScroll); document.removeEventListener("click", onClick, true); document.removeEventListener("play", onPlay, true); document.removeEventListener("submit", onSubmit, true); window.removeEventListener("error", onError, true); window.removeEventListener("unhandledrejection", onRejection); window.removeEventListener("pagehide", engagement); observers.forEach((observer)=>observer.disconnect()); };
  }, [router.events]);
  return null;
}
