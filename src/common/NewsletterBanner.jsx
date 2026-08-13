import React, { useState } from "react";
import Image from "next/image";
import Listing from "@/pages/api/Listing";
import toast from "react-hot-toast";

export default function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (loading) return;
    if (!email || !email.includes("@")) { toast.error("Please enter a valid email."); return; }
    setLoading(true);
    try { const main = new Listing(); await main.AddSubscriber({ email }); toast.success("Thank you for subscribing!"); setEmail(""); }
    catch (error) { console.error("Error:", error); toast.error(error?.response?.data?.errors); }
    finally { setLoading(false); }
  };
  return (
    <section className="container mx-auto mb-[40px] px-4 lg:mb-[80px] xl:mb-[100px] xl:max-w-[1310px]">
      <div className="subscribebanner relative flex flex-col items-center overflow-hidden rounded-[10px] border border-white md:rounded-[20px] lg:flex-row lg:items-stretch">
        <div className="absolute inset-0 z-[1] block bg-black/75 xl:hidden" />
        <div className="absolute inset-0"><Image src="/subscribebanner.png" fill sizes="(max-width:1310px) 100vw,1310px" alt="" className="h-full w-full object-cover" /></div>
        <div className="z-[2] flex w-full flex-col justify-center p-4 md:p-6 lg:w-[54%] lg:p-8 xl:p-12">
          <h2 className="mb-5 font-work text-[25px] font-[800] uppercase leading-[1.15] text-white md:mb-6 md:text-[35px] lg:mb-10 xl:text-[40px]">Subscribe to our newsletter for the <span className="text-theme">latest updates</span></h2>
          <div className="mb-5 flex items-center overflow-hidden rounded-full border bg-transparent"><input type="email" placeholder="Email" value={email} required name="email" onChange={(event) => setEmail(event.target.value)} className="min-w-0 flex-1 bg-transparent px-5 py-3 text-white placeholder-gray-400 outline-none" /><button className={`m-1 rounded-full bg-white px-4 py-2.5 font-bold text-black transition hover:bg-gradient-to-r hover:from-[#9747FF] hover:to-[#FC18D8] hover:text-white sm:px-6 ${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`} onClick={handleSubmit} disabled={loading}>{loading ? "Subscribing..." : "Subscribe"}</button></div>
          <p className="text-base text-white sm:text-lg">Subscribe to our newsletter for the latest updates</p>
        </div>
      </div>
    </section>
  );
}
