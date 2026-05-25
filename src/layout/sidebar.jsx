import React from "react";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { MdOutlineLogout } from "react-icons/md";
import { HiOutlineUserCircle } from "react-icons/hi2";
import Link from "next/link";
import { FaRegUser } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { usePathname } from "next/navigation";

export default function Sidebar({ toggle, handleLogout }) {
  const pathname = usePathname();
  return (
    <>
      <div
        id="sidebar"
        className={`mobilesidebar fixed top-0 z-[49] max-h-[100vh] overflow-hidden bg-dark border-r  pb-22 w-full max-w-[300px] min-w-[300px] border-gray-800 transition-transform duration-300 ease-in-out transform ${toggle ? "bg-black translate-x-0 min-h-screen p-4 pt-[30px]" : "-translate-x-full p-8 pt-[140px]"
          } md:sticky md:translate-x-0`}
      >
        <div className="max-h-[76vh] overflow-auto hidescroll">

        <div className=" flex md:hidden items-center mb-8 ">
          <div>
            <HiOutlineUserCircle color="white" size="2.5rem" />
          </div>
          <div className="text-start me-4 ps-2">
            <h2 className="capitalize font-bold text-white">Admin</h2>
            <p className="capitalize text-sm mt-[-3px] text-gray-400">
              Co-Founder
            </p>
          </div>
        </div>
        <ul>
          <li>
            <Link
              className={`bg-dark hover:opacity-[0.7] hover:text-white focus:!text-white  text-gray-200 mb-2 py-[13px] px-[13px] ${pathname === "/admin" ? "bg-theme" : ""} border border-gray-700 rounded-2xl  flex items-center`}
              href={"/admin"}
            >
              <MdOutlineSpaceDashboard className="me-2" size={"1.4rem"} />{" "}
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              className={`hover:opacity-[0.7] hover:text-white focus:!text-white bg-dark text-gray-200 mb-2 py-[13px] px-[13px] ${pathname === "/admin/podcast" ? "bg-theme" : ""} border border-gray-700 rounded-2xl  flex items-center`}
              href={"/admin/podcast"}
            >
              <MdOutlineSpaceDashboard className="me-2" size={"1.4rem"} />{" "}
              Podcasts
            </Link>
          </li>

          <li>
            <Link
              className={`hover:opacity-[0.7] hover:text-white focus:!text-white bg-dark text-gray-200 mb-2 py-[13px] px-[13px] ${pathname === "/admin/enquiry" ? "bg-theme" : ""} border border-gray-700 rounded-2xl  flex items-center`}
              href={"/admin/enquiry"}
            >
              <MdSupportAgent className="me-2" size={"1.4rem"} /> Enquiry
            </Link>
          </li>

          <li>
            <Link
              className={`hover:opacity-[0.7] hover:text-white focus:!text-white bg-dark text-gray-200 mb-2 py-[13px] px-[13px] ${pathname === "/admin/subscriber" ? "bg-theme" : ""} border border-gray-700 rounded-2xl  flex items-center`}
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
            <button className="hover:opacity-[0.7] hover:text-white focus:!text-white text-gray-200 w-full mb-2 py-[13px] px-[13px] border border-gray-700 rounded-2xl bg-dark flex items-center cursor-pointer" onClick={handleLogout}>
              <MdOutlineLogout className="me-2" size={"1.4rem"} /> Logout
            </button>
          </li>
        </ul>
        </div>
      </div>
    </>
  );
}
