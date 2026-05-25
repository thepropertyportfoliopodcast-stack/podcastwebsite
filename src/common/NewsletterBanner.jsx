import React, { useState } from "react";
import news from "../assets/episode.png";
import Image from "next/image";
import Listing from "@/pages/api/Listing";
import toast from "react-hot-toast";

const NewsletterBanner = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email.");
      return;
    }

    setLoading(true);
    try {
      const main = new Listing();
      const response = await main.AddSubscriber({ email: email });
      toast.success("Thank you for subscribing!");
      setEmail(""); // clear field
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container xl:max-w-[1310px] px-4 mx-auto mb-[40px] lg:mb-[80px] xl:mb-[100px]">
      <div className="relative subscribebanner rounded-[10px] md:rounded-[20px] border border-[rgba(255, 255, 255, 1)] overflow-hidden flex flex-col lg:flex-row items-center lg:items-stretch">
        <div className="block xl:hidden absolute top-0 bottom-0 left-0 right-0 w-full h-full bg-[#000000bd] z-1"></div>
        {/* Left Content */}
        <div className="absolute right-0 bottom-0 w-full h-full">
           <Image src={"/subscribebanner.png"} layout="fill" objectFit="cover" className="object-cover w-full h-full" /></div>
        <div className="w-full lg:w-[54%] p-4 md:p-6 lg:p-8 xl:p-12 flex flex-col justify-center z-1">
          <h2 className="text-[25px] md:text-[35px] xl:text-[40px] font-work font-[800] leading-[1.15] uppercase text-white mb-[20px] md:mb-[25px] lg:mb-[45px] xl:mb-[50px]">
            Subscribe to our newsletter for the <span className="text-theme">latest updates</span>
          </h2>
          {/* Input Box */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center mb-[22px] bg-transparent border rounded-full overflow-hidden">
            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 ps-[25px] bg-transparent text-white placeholder-gray-400 outline-none"
            />
            <button
              className={`hidden sm:block mt-2 sm:mt-0 sm:ml-2 px-6 py-3 bg-white hover:bg-gradient-to-r hover:from-[#9747FF] hover:to-[#FC18D8] transition text-[18px] text-black hover:text-white font-bold rounded-full ${loading ? "opacity-50 cursor-not-allowed" : " cursor-pointer"
                }`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
          <button
            className={`block sm:hidden mt-2 sm:mt-0 mb-3 sm:ml-2 px-6 py-3 bg-white hover:bg-gradient-to-r hover:from-[#9747FF] hover:to-[#FC18D8] transition text-[18px] text-black hover:text-white font-bold rounded-full ${loading ? "opacity-50 cursor-not-allowed" : " cursor-pointer"
              }`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
          <p className="text-[#FFFFFF] text-base sm:text-lg">
           Subscribe to our newsletter for the latest updates
          </p>
        </div>

        {/* Right Image */}
        
      </div>
    </section>
  );
};

export default NewsletterBanner;