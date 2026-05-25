import Layout from "@/layout/Layout";
import React, { useState } from "react";
import {
  FaTwitter,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
  FaSpotify,
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import Heading from "@/common/Heading";
import Link from "next/link";
import FAQSection from "./FAQSection";
import toast from "react-hot-toast";
import Listing from "../api/Listing";
import GetInTouch from "./GetInTouch";
const Index = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.email || !formData.email.includes("@")) {
      toast.error("Please enter a valid email.");
      return;
    }
    if (!formData.name || !formData.message) {
      toast.error("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const main = new Listing();
      const response = await main.AddContact(formData);
      console.log("Success:", response);
      toast.success("Thank you for contacting us!");
      // Reset form
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to contact. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const faqs = [
    {
      question: "Can I be a guest on the podcast?",
      answer:
        'We\'re always looking for interesting guests with valuable property insights. Use the contact form above with "Guest Opportunity" as the subject and tell us about your experience.',
    },
    {
      question: "Do you offer personal consultations?",
      answer:
        "While we don't provide individual financial advice, we can put you in touch with trusted professionals in our network. Reach out and we'll help connect you with the right resources.",
    },
    {
      question: "How can I suggest episode topics?",
      answer:
        "We love hearing from our community! Send us your topic suggestions through the contact form. Many of our best episodes come from listener requests.",
    },
    {
      question: "Are your guides really free?",
      answer:
        "Yes! All our guides are completely free with no hidden costs. We believe quality property education should be accessible to everyone.",
    },
  ];

  return (
    <Layout>
      <div className=" bg-[#000]">
      <div className="mx-auto container xl:max-w-[1310px] px-4 py-4 md:py-6 lg:py-16">
        <GetInTouch />
        {/* <section className=" rounded-[10px] p-[20px] md:p-[40px] mt-4"> */}
          <FAQSection />
        {/* </section> */}
      </div>
      </div>
    </Layout>
  );
};

export default Index;
