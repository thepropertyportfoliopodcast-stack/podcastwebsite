import React from "react";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { MdOutlineLogout } from "react-icons/md";
import { HiOutlineUserCircle } from "react-icons/hi2";
import Link from "next/link";
import { FaRegUser } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { MdOutlinePhoneIphone } from "react-icons/md";
import { MdOutlineAnalytics } from "react-icons/md";
import { usePathname } from "next/navigation";

export default function AdminSidebar({ toggle, handleLogout }) {
  const pathname = usePathname();
  return (
    <>
      <div
        id="sidebar"
        className={`admin-sidebar mobilesidebar fixed top-0 z-[49] max-h-[100vh] overflow-hidden border-r pb-22 w-full max-w-[300px] min-w-[300px] transition-transform duration-300 ease-in-out transform ${toggle ? "translate-x-0 min-h-screen p-4 pt-[30px]" : "-translate-x-full p-8 pt-[140px]"
          } md:sticky md:translate-x-0`}
      >
        <div className="max-h-[76vh] overflow-auto hidescroll">

        <div className=" flex md:hidden items-center mb-8 ">
          <div>
            <HiOutlineUserCircle className="admin-header-icon" size="2.5rem" />
          </div>
          <div className="text-start me-4 ps-2">
            <h2 className="capitalize font-bold text-slate-900">Admin</h2>
            <p className="capitalize text-sm mt-[-3px] text-slate-600">
              Co-Founder
            </p>
          </div>
        </div>
        <ul>
          <li>
            <Link
              className={`admin-sidebar-link ${pathname === "/admin/analytics" ? "is-active" : ""}`}
              href="/admin/analytics"
            >
              <MdOutlineAnalytics className="me-2" size="1.4rem" /> Analytics
            </Link>
          </li>
          <li>
            <Link
              className={`admin-sidebar-link ${pathname === "/admin/hero-phones" ? "is-active" : ""}`}
              href="/admin/hero-phones"
            >
              <MdOutlinePhoneIphone className="me-2" size="1.4rem" /> Hero Phones
            </Link>
          </li>

          <li>
            <Link
              className={`admin-sidebar-link ${pathname?.startsWith("/admin/host") ? "is-active" : ""}`}
              href="/admin/host"
            >
              <FaRegUser className="me-2" size="1.4rem" /> Hosts
            </Link>
          </li>

          <li>
            <Link
              className={`admin-sidebar-link ${pathname === "/admin" ? "is-active" : ""}`}
              href={"/admin"}
            >
              <MdOutlineSpaceDashboard className="me-2" size={"1.4rem"} />{" "}
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              className={`admin-sidebar-link ${pathname === "/admin/podcast" ? "is-active" : ""}`}
              href={"/admin/podcast"}
            >
              <MdOutlineSpaceDashboard className="me-2" size={"1.4rem"} />{" "}
              Podcasts
            </Link>
          </li>

          <li>
            <Link
              className={`admin-sidebar-link ${pathname === "/admin/enquiry" ? "is-active" : ""}`}
              href={"/admin/enquiry"}
            >
              <MdSupportAgent className="me-2" size={"1.4rem"} /> Enquiry
            </Link>
          </li>

          <li>
            <Link
              className={`admin-sidebar-link ${pathname === "/admin/subscriber" ? "is-active" : ""}`}
              href={"/admin/subscriber"}
            >
              <FaRegUser className="me-2" size={"1.4rem"} /> Subscriber
            </Link>
          </li>

          {/* <li>
            <Link
              className={`hover:opacity-[0.7] hover:text-white focus:!text-white bg-dark text-gray-200 mb-2 py-[13px] px-[13px] ${pathname === "/admin/guide" ? "bg-theme" : ""} border border-gray-700 rounded-2xl  flex items-center`}
              href={"/admin/guide"}
            >
              <BsFileEarmarkPdf className="me-2" size={"1.4rem"} /> Guides
            </Link>
          </li> */}

          <li>
            <button className="admin-sidebar-link w-full cursor-pointer" onClick={handleLogout}>
              <MdOutlineLogout className="me-2" size={"1.4rem"} /> Logout
            </button>
          </li>
        </ul>
        </div>
      </div>
    </>
  );
}
