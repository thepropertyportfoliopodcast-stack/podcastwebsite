import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { TbLogout } from "react-icons/tb";
import { HiOutlineUserCircle } from "react-icons/hi2";
import AdminSidebar from "./AdminSidebar";
import PodcastApi from "@/services/podcastApi";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useRole } from "@/context/RoleContext";
import Link from "next/link";
import { firstAccessibleRoute, hasSectionAccess, sectionForPath } from "@/config/adminSections";

export default function AdminLayout({ children }) {
  const [toggle, setToggle] = useState(false);
  const [verified, setVerified] = useState(false);
  const menuButtonRef = useRef(null);
  const router = useRouter();
  const {user, setUser} = useRole();

  const closeSidebar = useCallback((restoreFocus = false) => {
    setToggle(false);
    if (restoreFocus) window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, []);

  const showSidebar = () => setToggle((open) => !open);

  const fetchData = async (signal) => {
    try {
      const main = new PodcastApi();
      const response = await main.profileVerify(signal);
      const profile = response?.data?.data?.user;
      if (profile) {
        setUser(profile);
        setVerified(true);
      }
    } catch (error) {
      // React runs effect cleanup once during development Strict Mode. The
      // cleanup abort is expected and must never invalidate a valid login.
      if (signal?.aborted || error?.code === "ERR_CANCELED" || error?.name === "CanceledError") {
        return;
      }

      console.error("Dashboard profile verification failed:", error);
      localStorage?.removeItem("token");
      setUser(null);
      router.replace("/admin/login");
      toast.error("Please log in first.");
    }
  };

  const handleLogout = () => {
    closeSidebar();
    localStorage && localStorage.removeItem("token");
    router.push("/admin/login");
    toast.success("Logout Successfully");
    setUser(null);
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    fetchData(signal);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!verified || !user) return;
    const section = sectionForPath(router.pathname);
    const allowed = section === "super_admin" ? user.role === "SUPER_ADMIN" : !section || hasSectionAccess(user, section);
    if (!allowed) {
      toast.error("You do not have access to that dashboard section.");
      router.replace(firstAccessibleRoute(user));
    }
  }, [router, router.pathname, user, verified]);

  useEffect(() => {
    const closeOnRouteChange = () => closeSidebar();
    const closeOnEscape = (event) => {
      if (event.key === "Escape" && toggle) closeSidebar(true);
    };
    const closeOnDesktop = () => {
      if (window.matchMedia("(min-width: 768px)").matches) closeSidebar();
    };

    router.events.on("routeChangeStart", closeOnRouteChange);
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnDesktop);
    document.body.style.overflow = toggle ? "hidden" : "";

    return () => {
      router.events.off("routeChangeStart", closeOnRouteChange);
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktop);
      document.body.style.overflow = "";
    };
  }, [closeSidebar, router.events, toggle]);

  // console.log("user", user);

  return (
    <>
      <button
        type="button"
        aria-label="Close admin navigation"
        aria-hidden={!toggle}
        tabIndex={toggle ? 0 : -1}
        onClick={() => closeSidebar(true)}
        className={`admin-drawer-backdrop ${toggle ? "is-open" : ""}`}
      />
      <div className="auth-wrap flex justify-between max-lg:flex-wrap">
        <main className="main-wrap">
          <header className="admin-shell-header fixed top-0 left-0 w-full z-[51] px-6 md:px-7 py-2 xl:py-4 flex items-center justify-between">
              <Link href="/" aria-label="Go to The Property Portfolio Podcast website">
                <Image
                  className="admin-brand-logo h-auto w-auto object-contain"
                  src="/logo.webp"
                  width={2110}
                  height={520}
                  priority
                  alt="The Property Portfolio Podcast"
                />
              </Link>
            <div className="flex gap-2 items-center">
              <div className="hidden md:flex items-center">
                <div>
                  <HiOutlineUserCircle className="admin-header-icon" size="2.5rem" />
                </div>
                <div className="text-start me-4 ps-2">
                  <h2 className="admin-header-name capitalize font-bold">{user?.name || "Admin"}</h2>
                  <p className="admin-header-email text-sm mt-[-3px]">
                    {user?.email || ""}
                  </p>
                </div>
              </div>
              <button type="button" aria-label="Log out" className="hidden md:flex cursor-pointer" onClick={handleLogout}>
                <TbLogout className="admin-header-icon me-2" size={"2rem"} />
              </button>

              <button
                ref={menuButtonRef}
                type="button"
                onClick={showSidebar}
                className="admin-mobile-menu block md:hidden flex flex-col gap-[4px] px-2 py-1 rounded-md"
                aria-label={toggle ? "Close admin navigation" : "Open admin navigation"}
                aria-expanded={toggle}
                aria-controls="admin-navigation"
              >
                <span className="w-5 h-[2px]" />
                <span className="w-5 h-[2px]" />
                <span className="w-5 h-[2px]" />
              </button>
            </div>
          </header>
          <div className="admin-workspace flex w-screen overflow-hidden">
            <AdminSidebar toggle={toggle} onNavigate={closeSidebar} handleLogout={handleLogout} user={user}/>
            <div className="admin-content content min-w-0 flex-1 md:max-h-[100vh] overflow-y-auto p-4 md:p-6 !pt-[105px] lg:!pt-[112px] w-full">
              <div className="admin-page-frame">
                {verified ? children : <div className="grid min-h-64 place-items-center text-slate-500">Checking dashboard access…</div>}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
