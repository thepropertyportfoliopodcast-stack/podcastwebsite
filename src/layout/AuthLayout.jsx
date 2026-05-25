import React, { useEffect, useState } from "react";
import { TbLogout } from "react-icons/tb";
import { HiOutlineUserCircle } from "react-icons/hi2";
import Sidebar from "./sidebar";
import Listing from "@/pages/api/Listing";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useRole } from "@/context/RoleContext";
import Link from "next/link";

export default function AuthLayout({ children }) {
  const [toggle, setToggle] = useState(false);
  const router = useRouter();
  const {user, setUser} = useRole();

  function showSidebar() {
    setToggle(!toggle);
  }

  const fetchData = async (signal) => {
    try {
      const main = new Listing();
      const response = await main.profileVerify(signal);
      if (response.data) {
        // console.log("token verify data",response?.data);
        setUser(response.data.data.user);
      }
    } catch (error) {
      console.log("error", error);
      localStorage?.removeItem("token");
      setUser(null);
      router.push("/admin/login");
      toast.error("Please log in first.");
    }
  };

  const handleLogout = () => {
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

  // console.log("user", user);

  return (
    <>
      {toggle ? (
        <div
          onClick={showSidebar}
          className="fixed top-0 left-0 w-full h-full bg-[#0009] blur z-[9999]"
        ></div>
      ) : (
        ""
      )}
      <div className="auth-wrap flex justify-between max-lg:flex-wrap">
        <main className="main-wrap">
          <header className="fixed top-0 left-0 w-full z-[51] bg-black shadow-lg border-b border-gray-800 px-6 md:px-7 py-2 xl:py-4 flex items-center justify-between">
              <Link href="/">
                <img
                  className="max-w-[170px] h-auto"
                  src="/logo.png"
                />
              </Link>
            <div className="flex gap-2 items-center">
              <div className="hidden md:flex items-center">
                <div>
                  <HiOutlineUserCircle color="white" size="2.5rem" />
                </div>
                <div className="text-start me-4 ps-2">
                  <h2 className="capitalize font-bold text-white">{user?.name || ""}</h2>
                  <p className="text-sm mt-[-3px] text-gray-400">
                    {user?.email || ""}
                  </p>
                </div>
              </div>
              <button className="hidden md:flex cursor-pointer" onClick={handleLogout}>
                <TbLogout color="#fff" className="me-2" size={"2rem"} />
              </button>

              <button
                onClick={showSidebar}
                className="block md:hidden flex flex-col gap-[4px] px-2 py-1 rounded-md border border-gray-700"
              >
                <span className="w-5 h-[2px] bg-white" />
                <span className="w-5 h-[2px] bg-white" />
                <span className="w-5 h-[2px] bg-white" />
              </button>
            </div>
          </header>
          <div className="flex w-screen overflow-hidden">
            <Sidebar toggle={toggle} handleLogout={handleLogout}/>
            <div className="content md:max-h-[100vh] overflow-y-auto lg:w-[calc(100%-300px)] p-6 md:p-8 !pt-[120px]   lg:!pt-[150px] w-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
