import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
import { HiOutlineArrowTurnDownRight } from "react-icons/hi2";

const faqs = [
  {
    question: "What is The Property Portfolio Podcast about?",
    answer:
      "It’s a show that helps Australians build smarter property portfolios through expert tips and real stories.",
  },
  {
    question: "Who is this podcast for?",
    answer:
      "Anyone looking to grow their property knowledge, from first-home buyers to seasoned investors.",
  },
  {
    question: "Can I be a guest on the podcast? ",
    answer: "Yes, we’re always looking for interesting guests with valuable property insights. Use the contact form above with “Guest Opportunity” as the subject and tell us about your experience in the message box.",
  },
  {
    question: "Do you offer personal consultations?",
    answer:
      "While we don't provide individual financial advice, we can point you to trusted professionals in our network. Reach out, and we’ll help connect you with the right resources.",
  },
  {
    question: "Are your guides really free?",
    answer:
      "Yes, all our guides are completely free with no hidden costs. Because we believe quality property education should be accessible to everyone.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="mt-[30px] mb-[30px] md:mt-[50px] lg:mb-[40px] lg:mt-[60px] lg:mb-[50px]">
      <h2 className="text-[25px] md:text-[35px] xl:text-[40px] font-work font-[800] leading-[1.15] uppercase text-center mb-[25px]">
        <span className="text-theme">Frequently </span> Asked Questions
      </h2>
      <div className=" p-[15px] md:p-[30px] lg:p-[40px] bg-[#0F0F0F] border border-[#FFFFFF66] rounded-[10px] md:rounded-[15px]">
        {faqs &&
          faqs?.map((faq, index) => (
            <div key={index} onClick={() => toggleIndex(index)} className={` ${index === 0 ? "border-t" : ""}  border-b border-[#FFFFFF14] cursor-pointer`}>
              <div className="w-full flex justify-between items-center text-left  py-6">
              <span className="text-[16px] md:text-[20px] lg:text-[25px] leading-[22px] md:leading-[24px] font-[600] text-white">
                {faq?.question}
              </span>
              {activeIndex === index ? (
                <FiMinus className="text-white" size={24} />
              ) : (
                <FiPlus className="text-white" size={24} />
              )}
            </div>
              {activeIndex === index && (
                <div className="flex gap-2 px-2 md:px-6 pb-4 text-[14px] md:text-[18px] lg:text-[20px] font-[600] leading-[20px] md:leading-[22px] text-white max-w-4xl">
                    <HiOutlineArrowTurnDownRight size={24} className="min-w-fit text-purple-200"/>
                  {faq?.answer}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
