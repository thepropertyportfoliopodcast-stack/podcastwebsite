import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import PodcastApi from "@/services/podcastApi";
import { useSearchParams } from "next/navigation";
import { firstAccessibleRoute } from "@/config/adminSections";

export default function Login() {
  const router = useRouter();
  const [showConfirPassword, setShowConfirPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    try {
      const main = new PodcastApi();
      const response = await main.Login({
        email: data?.email,
        password: data?.password,
      });

      if (response?.data?.status) {
        toast.success(response.data.message);
        localStorage &&
          localStorage.setItem("token", response?.data?.data?.token);
        if (redirect && redirect.startsWith("/admin") && !redirect.startsWith("//")) {
          router.push(redirect);
          return;
        }
        router.push(firstAccessibleRoute(response.data.data));
        setData({
          email: "",
          password: "",
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("API error:", error);
      const isNetworkError = error?.code === "ERR_NETWORK" || !error?.response;
      toast.error(
        isNetworkError
          ? `Cannot reach the backend at ${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api"}. Check that the backend is running, then restart the frontend.`
          : error?.response?.data?.message || "Unable to log in. Please try again."
      );
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="h-[100vh] overflow-hidden lg:flex justify-center items-center bg-black">
      {/* Side Image */}
      <div className="side-image w-full hidden lg:block lg:max-w-[50%] min-w-[50%] bg-dark2">
        <img
          src="/login-bg.png"
          className="img-fluid block m-3 rounded-[30px] w-full"
          alt="loginimage"
        />
      </div>

      {/* Login Form Section */}
      <div className="w-full h-screen flex lg:block items-center lg:items-auto lg:h-auto lg:max-w-[50%] min-w-[50%]">
        <div className="max-h-[100vh] py-6 overflow-auto w-full">
          <div className="w-full py-8 max-w-[390px] lg:max-w-[600px] m-auto lg:py-0 px-8 lg:px-5 text-slate-500">
            {/* Logo */}
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <Link href="/">
                <Image
                  src="/logo.png"
                  width={2110}
                  height={520}
                  alt="logo"
                  className="w-[300px] h-auto "
                />
              </Link>
            </div>

            {/* Headings */}
            <h2 className="font-bold mb-1 text-[24px] mt-6 text-center lg:text-start text-white sm:px-12 lg:px-0">
              Welcome Back!
            </h2>
            <p className="text-gray-500 hidden lg:block lg:text-start mb-2">
              Enter your credentials to login to your account
            </p>
            <div className="bg-[#D278D5] m-auto lg:m-0 h-[3px] w-[100px] mt-4"></div>

            {/* Form */}
            <main className="mt-8">
              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-4 lg:mb-5">
                  <label className="block text-base font-medium text-gray-300 tracking-[-0.06em] mb-1">
                    Email
                  </label>
                  <input
                    value={data?.email}
                    onChange={handleChange}
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 h-[48px] lg:h-[56px] rounded-[10px] bg-[#1f1f1f] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                    required
                  />
                </div>

                {/* Password */}
                <div className="mb-6 lg:mb-10">
                  <label className="block text-base font-medium text-gray-300 tracking-[-0.06em] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={data.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="w-full px-4 py-2 h-[48px] lg:h-[56px] rounded-[10px] bg-[#1f1f1f] border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirPassword(!showConfirPassword)}
                      className="absolute top-1/2 cursor-pointer right-4 -translate-y-1/2"
                    >
                      {showConfirPassword ? (
                        <IoEyeOff size={24} className="text-gray-400" />
                      ) : (
                        <IoEye size={24} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <div className="mt-2 flex justify-center lg:justify-start">
                  <button
                    className="admin-login-submit mt-6 w-full cursor-pointer rounded-[10px] border-2 px-[50px] py-3 text-center text-[16px] font-bold transition lg:w-auto"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Logging In..." : "LOG IN"}
                  </button>
                </div>
              </form>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
