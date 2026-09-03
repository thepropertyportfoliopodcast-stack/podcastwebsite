import React from "react";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { MdOutlineLogout } from "react-icons/md";
import { HiOutlineUserCircle } from "react-icons/hi2";
import Link from "next/link";
import { FaRegUser } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import { MdOutlineAnalytics } from "react-icons/md";
import { MdAdminPanelSettings } from "react-icons/md";
import { MdOutlineSubtitles } from "react-icons/md";
import { MdOutlineSecurity } from "react-icons/md";
import { usePathname } from "next/navigation";
import { hasSectionAccess } from "@/config/adminSections";

export default function AdminSidebar({ toggle, collapsed, onNavigate, handleLogout, user }) {
  const pathname = usePathname();
  return (
    <>
      <aside
        id="admin-navigation"
        aria-label="Dashboard navigation"
        className={`admin-sidebar mobilesidebar ${toggle ? "is-open" : ""} ${collapsed ? "is-collapsed" : ""}`}
      >
        <div className="admin-sidebar-menu">

        <div className="admin-mobile-profile flex md:hidden items-center">
          <div>
            <HiOutlineUserCircle className="admin-header-icon" size="2.5rem" />
          </div>
          <div className="text-start me-4 ps-2">
            <h2 className="capitalize font-bold text-slate-900">{user?.name || "Admin"}</h2>
            <p className="text-sm text-slate-600">{user?.email || "Dashboard account"}</p>
          </div>
        </div>
        <ul>
          {hasSectionAccess(user, "analytics") && <li>
            <Link
              className={`admin-sidebar-link ${pathname === "/admin/analytics" ? "is-active" : ""}`}
              href="/admin/analytics"
              onClick={onNavigate}
              aria-label="Analytics"
              title={collapsed ? "Analytics" : undefined}
            >
              <MdOutlineAnalytics className="admin-sidebar-icon" size="1.4rem" />
              <span className="admin-sidebar-label">Analytics</span>
            </Link>
          </li>}

          {user?.role === "SUPER_ADMIN" && <li>
            <Link
              className={`admin-sidebar-link ${pathname === "/admin/ip-whitelist" ? "is-active" : ""}`}
              href="/admin/ip-whitelist"
              onClick={onNavigate}
              aria-label="Analytics IP whitelist"
              title={collapsed ? "IP whitelist" : undefined}
            >
              <MdOutlineSecurity className="admin-sidebar-icon" size="1.4rem" />
              <span className="admin-sidebar-label">IP whitelist</span>
            </Link>
          </li>}

          {hasSectionAccess(user, "hosts") && <li>
            <Link
              className={`admin-sidebar-link ${pathname?.startsWith("/admin/host") ? "is-active" : ""}`}
              href="/admin/host"
              onClick={onNavigate}
              aria-label="Hosts"
              title={collapsed ? "Hosts" : undefined}
            >
              <FaRegUser className="admin-sidebar-icon" size="1.4rem" />
              <span className="admin-sidebar-label">Hosts</span>
            </Link>
          </li>}

          {hasSectionAccess(user, "dashboard") && <li>
            <Link
              className={`admin-sidebar-link ${pathname === "/admin" ? "is-active" : ""}`}
              href={"/admin"}
              onClick={onNavigate}
              aria-label="Dashboard"
              title={collapsed ? "Dashboard" : undefined}
            >
              <MdOutlineSpaceDashboard className="admin-sidebar-icon" size={"1.4rem"} />
              <span className="admin-sidebar-label">Dashboard</span>
            </Link>
          </li>}
          {hasSectionAccess(user, "podcasts") && <li>
            <Link
              className={`admin-sidebar-link ${pathname === "/admin/podcast" ? "is-active" : ""}`}
              href={"/admin/podcast"}
              onClick={onNavigate}
              aria-label="Podcasts"
              title={collapsed ? "Podcasts" : undefined}
            >
              <MdOutlineSpaceDashboard className="admin-sidebar-icon" size={"1.4rem"} />
              <span className="admin-sidebar-label">Podcasts</span>
            </Link>
          </li>}

          {hasSectionAccess(user, "transcripts") && <li>
            <Link
              className={`admin-sidebar-link ${pathname === "/admin/transcripts" ? "is-active" : ""}`}
              href="/admin/transcripts"
              onClick={onNavigate}
              aria-label="Transcripts"
              title={collapsed ? "Transcripts" : undefined}
            >
              <MdOutlineSubtitles className="admin-sidebar-icon" size="1.4rem" />
              <span className="admin-sidebar-label">Transcripts</span>
            </Link>
          </li>}

          {hasSectionAccess(user, "enquiries") && <li>
            <Link
              className={`admin-sidebar-link ${pathname === "/admin/enquiry" ? "is-active" : ""}`}
              href={"/admin/enquiry"}
              onClick={onNavigate}
              aria-label="Enquiry"
              title={collapsed ? "Enquiry" : undefined}
            >
              <MdSupportAgent className="admin-sidebar-icon" size={"1.4rem"} />
              <span className="admin-sidebar-label">Enquiry</span>
            </Link>
          </li>}

          {hasSectionAccess(user, "subscribers") && <li>
            <Link
              className={`admin-sidebar-link ${pathname === "/admin/subscriber" ? "is-active" : ""}`}
              href={"/admin/subscriber"}
              onClick={onNavigate}
              aria-label="Subscriber"
              title={collapsed ? "Subscriber" : undefined}
            >
              <FaRegUser className="admin-sidebar-icon" size={"1.4rem"} />
              <span className="admin-sidebar-label">Subscriber</span>
            </Link>
          </li>}

          {user?.role === "SUPER_ADMIN" && <li>
            <Link className={`admin-sidebar-link ${pathname === "/admin/admins" ? "is-active" : ""}`} href="/admin/admins" onClick={onNavigate} aria-label="Admins" title={collapsed ? "Admins" : undefined}>
              <MdAdminPanelSettings className="admin-sidebar-icon" size="1.4rem" />
              <span className="admin-sidebar-label">Admins</span>
            </Link>
          </li>}

          {/* <li>
            <Link
              className={`hover:opacity-[0.7] hover:text-white focus:!text-white bg-dark text-gray-200 mb-2 py-[13px] px-[13px] ${pathname === "/admin/guide" ? "bg-theme" : ""} border border-gray-700 rounded-2xl  flex items-center`}
              href={"/admin/guide"}
            >
              <BsFileEarmarkPdf className="me-2" size={"1.4rem"} /> Guides
            </Link>
          </li> */}

          <li>
            <button type="button" className="admin-sidebar-link w-full cursor-pointer" onClick={handleLogout} aria-label="Logout" title={collapsed ? "Logout" : undefined}>
              <MdOutlineLogout className="admin-sidebar-icon" size={"1.4rem"} />
              <span className="admin-sidebar-label">Logout</span>
            </button>
          </li>
        </ul>
        </div>
      </aside>
    </>
  );
}
