import Heading from "@/common/Heading";
import Layout from "@/layout/Layout";
import Image from "next/image";
import React from "react";
import {
  HiOutlineMicrophone,
  HiOutlineUsers,
  HiOutlineBriefcase,
  HiOutlineChartBar,
} from "react-icons/hi";
import MeetYourHost from "./MeetYourHost";
import Mission from "./mission";
import NewVoice from "./NewVoice";
import Vision from "./Vision";
import Approach from "./Approach";

const Index = () => {
  const journeyEvents = [
    {
      year: "2021",
      title: "The Beginning",
      description:
        "Started as weekend conversations about property investing between two mates who wanted to share knowledge.",
    },
    {
      year: "2022",
      title: "First 50 Episode",
      description:
        "Started as weekend conversations about property investing between two mates who wanted to share knowledge.",
    },
    {
      year: "2023",
      title: "Community Growth",
      description:
        "Started as weekend conversations about property investing between two mates who wanted to share knowledge.",
    },
    {
      year: "2024",
      title: "Industry Recognition",
      description:
        "Started as weekend conversations about property investing between two mates who wanted to share knowledge.",
    },
    {
      year: "2025",
      title: "Expanding Impact",
      description:
        "Started as weekend conversations about property investing between two mates who wanted to share knowledge.",
    },
  ];

  const stats = [
    {
      value: "150+",
      label: "Episode published",
      icon: <HiOutlineMicrophone size={16} className=" text-white" />,
    },
    {
      value: "75k+",
      label: "Monthly listener",
      icon: <HiOutlineUsers size={16} className=" text-white" />,
    },
    {
      value: "20+",
      label: "Year Experience",
      icon: <HiOutlineBriefcase size={16} className=" text-white" />,
    },
    {
      value: "500+",
      label: "Property analyze",
      icon: <HiOutlineChartBar size={16} className=" text-white" />,
    },
  ];

  return (
    <Layout>
      <div className=" pt-[118px] lg:pt-[128px] pb-[40px] md:pb-[60px] lg:pb-[0px]">
          <NewVoice />
          <MeetYourHost />
      </div>






      <div className="relative overflow-hidden mt-2  md:mt-10 ">
            <div className="absolute z-0 xl:max-w-[378px] w-full md:w-[578px] h-full md:h-[800px]  aspect-square left-[0] top-[-100px]  1111blurcircle rounded-r-full z-1">
              <Image src={"/lightpinkleft.png"} layout="fill" objectFit="cover" className="object-cover w-full" />
            </div>

             

        <div className="px-4 max-w-[1310px] m-auto">
          <div className="flex gap-[15px] flex-wrap md:flex-nowrap">
            <Vision />
            <Mission />
          </div>
          <Approach />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
