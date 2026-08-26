import React from "react";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { MdOutlineLogout } from "react-icons/md";
import { HiOutlineUserCircle } from "react-icons/hi2";
import Link from "next/link";
import { FaRegUser } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import { MdOutlineAnalytics } from "react-icons/md";
import { MdAdminPanelSettings } from "react-icons/md";
import { usePathname } from "next/navigation";
import { hasSectionAccess } from "@/config/adminSections";

export default function AdminSidebar({ toggle, onNavigate, handleLogout, user }) {
  const pathname = usePathname();
  return (
    <>
      <aside
        id="admin-navigation"
        aria-label="Dashboard navigation"
        className={`admin-sidebar mobilesidebar ${toggle ? "is-open" : ""}`}
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
            >
              <MdOutlineAnalytics className="me-2" size="1.4rem" /> Analytics
            </Link>
          </li>}

          {hasSectionAccess(user, "hosts") && <li>
            <Link
              className={`admin-sidebar-link ${pathname?.startsWith("/admin/host") ? "is-active" : ""}`}
              href="/admin/host"
              onClick={onNavigate}
            >
              <FaRegUser className="me-2" size="1.4rem" /> Hosts
            </Link>
          </li>}

          {hasSectionAccess(user, "dashboard") && <li>
            <Link
              className={`admin-sidebar-link ${pathname === "/admin" ? "is-active" : ""}`}
              href={"/admin"}
              onClick={onNavigate}
            >
              <MdOutlineSpaceDashboard className="me-2" size={"1.4rem"} />{" "}
              Dashboard
            </Link>
          </li>}
          {hasSectionAccess(user, "podcasts") && <li>
            <Link
              className={`admin-sidebar-link ${pathname === "/admin/podcast" ? "is-active" : ""}`}
              href={"/admin/podcast"}
              onClick={onNavigate}
            >
              <MdOutlineSpaceDashboard className="me-2" size={"1.4rem"} />{" "}
              Podcasts
            </Link>
          </li>}

          {hasSectionAccess(user, "enquiries") && <li>
            <Link
              className={`admin-sidebar-link ${pathname === "/admin/enquiry" ? "is-active" : ""}`}
              href={"/admin/enquiry"}
              onClick={onNavigate}
            >
              <MdSupportAgent className="me-2" size={"1.4rem"} /> Enquiry
            </Link>
          </li>}

          {hasSectionAccess(user, "subscribers") && <li>
            <Link
              className={`admin-sidebar-link ${pathname === "/admin/subscriber" ? "is-active" : ""}`}
              href={"/admin/subscriber"}
              onClick={onNavigate}
            >
              <FaRegUser className="me-2" size={"1.4rem"} /> Subscriber
            </Link>
          </li>}

          {user?.role === "SUPER_ADMIN" && <li>
            <Link className={`admin-sidebar-link ${pathname === "/admin/admins" ? "is-active" : ""}`} href="/admin/admins" onClick={onNavigate}>
              <MdAdminPanelSettings className="me-2" size="1.4rem" /> Admins
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
            <button type="button" className="admin-sidebar-link w-full cursor-pointer" onClick={handleLogout}>
              <MdOutlineLogout className="me-2" size={"1.4rem"} /> Logout
            </button>
          </li>
        </ul>
        </div>
      </aside>
    </>
  );
}
