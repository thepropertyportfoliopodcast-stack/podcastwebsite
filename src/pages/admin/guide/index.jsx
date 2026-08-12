import React, { useEffect, useState } from "react";
import AuthLayout from "@/layout/AuthLayout";
import AddGuide from "./AddGuide";
import Listing from "@/pages/api/Listing";
import GuideCard from "@/common/GuideCard";
import Loader from "@/common/Loader";

export default function index() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isGuidePopupOpen, setIsGuidePopupOpen] = useState(false);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const main = new Listing();
      const response = await main.AdminGuideGet();
      setData(Array.isArray(response?.data?.data) ? response.data.data : []);
    } catch (error) {
      console.log("error", error);
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  // console.log("data",data);

  return (
    <AuthLayout>
      <div className="flex items-center justify-between tracking-tight border-b border-[#2a2a2a] pb-4 mb-6 w-full">
        <h1 className="text-3xl lg:text-4xl font-bold">
          Property Investing Guides
        </h1>
        <button
          onClick={() => {
            setIsGuidePopupOpen(true);
          }}
          className="w-fit button-bg px-4 xl:px-8 py-2 h-[44px] rounded-md tracking-[-0.06em] text-sm font-medium cursor-pointer"
        >
          Add New Guide
        </button>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {data &&
            (Array.isArray(data) ? data : []).map((guide, index) => (
              <GuideCard guide={guide} key={index} />
            ))}
        </div>
      )}
      <AddGuide
        isOpen={isGuidePopupOpen}
        onClose={() => {
          setIsGuidePopupOpen(false);
        }}
      />
    </AuthLayout>
  );
}
