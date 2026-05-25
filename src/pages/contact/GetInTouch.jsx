import Heading from "@/common/Heading";
import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

import { FaLocationDot, FaXTwitter } from "react-icons/fa6";
import { SiSpotify } from "react-icons/si";
import Listing from "../api/Listing";
import toast from "react-hot-toast";
import Image from "next/image";

export default function GetInTouch() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    if (loading) return;
    setLoading(true);
    try {
      const main = new Listing();
      const response = await main.AddContact(formData);
      if (response?.data?.status) {
        toast.success("Thank you for contacting us!");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative mt-24 px-[20px] py-[25px] md:px-[40px] md:py-[45px] lg:px-[50px] lg:py-[65px] ">
      <div className="relative z-[1]">
        <div className="text-center">
          <h2 className="text-[25px] md:text-[35px] xl:text-[40px] font-work font-[800] leading-[1.15] uppercase">
            Get in <span className="text-theme">Touch </span> With Us
          </h2>
          <p className="mt-[10px] md:mt-[15px] lg:mt-[15px] text-white font-outfit font-[600] text-[16px] md:text-[18px] lg:text-[20px]">
          Tell us what you want to hear next or give us your honest take on the podcast. <br/> We're open to all your questions, ideas, and feedback.
          </p>
        </div>
        <div className="w-full max-w-[100%] lg:max-w-[1100px] mx-auto flex flex-col lg:flex-row  justify-between gap-[25px] text-white mt-4 md:mt-8 lg:mt-12 px-0 md:px-3 lg:px-4">
          {/* Left Side */}
          <div className="flex flex-col justify-center space-y-4 md:space-y-5 lg:space-y-8 w-full md:w-[50%] xl-w-[45%]">
            <div className="space-y-[20px] md:space-y-[30px] lg:space-y-[40px] ">
              {/* Phone */}
              <div className="flex items-start gap-[15px] lg:gap-[25px]">
                <div className="w-[35px] h-[35px] min-w-[35px]  md:w-[54px] md:h-[54px] md:min-w-[54px] flex items-center justify-center rounded-full bg-[#0000001A] border border-white/40">
                  <FaPhoneAlt className="text-[14px] sm:text-[16px] md:text-[18px]"  />
                </div>
                <div>
                  <h4 className="text-white font-[700] text-[16px] md:text-[18px] lg:text-[20px] mb-[5px]">
                    Phone
                  </h4>
                  <p className="text-white font-[600] text-[16px] md:text-[18px] lg:text-[20px] mb-[0]">
                   0497 570 833
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-[15px] lg:gap-[25px]">
                <div className="w-[35px] h-[35px] min-w-[35px]  md:w-[54px] md:h-[54px] md:min-w-[54px] flex items-center justify-center rounded-full bg-[#0000001A] border border-white/40">
                  <FaLocationDot className="text-[14px] sm:text-[16px] md:text-[18px]"  />
                </div>
                <div>
                  <h4 className="text-white font-[700] text-[16px] md:text-[18px] lg:text-[20px] mb-[5px]">Our Location</h4>
                  <p className="text-white font-[600] text-[16px] md:text-[18px] lg:text-[20px] mb-[0]">
                   The Property Portfolio Podcast, <br />
                    215/33 Lexington Dr, <br />
                    Bella Vista <br />
                    NSW 2153

                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-[15px] lg:gap-[25px]">
                <div className="w-[35px] h-[35px] min-w-[35px]  md:w-[54px] md:h-[54px] md:min-w-[54px] flex items-center justify-center rounded-full bg-[#0000001A] border border-white/40">
                  <FaEnvelope className="text-[14px] sm:text-[16px] md:text-[18px]"  />
                </div>
                <div>
                  <h4 className="text-white font-[700] text-[16px] md:text-[18px] lg:text-[20px] mb-[5px]">Email</h4>
                  <p className="text-white font-[600] text-[16px] md:text-[18px] lg:text-[20px] mb-[0] break-words break-normal break-all">
                    <a href="mailto:info@thepropertyportfolio.com.au">info@thepropertyportfolio.com.au</a>
                  </p>
                </div>
              </div>

              {/* Socials */}
              <div>
                <h4 className="text-white text-[18px] md:text-[20px] font-[600] text-white uppercase mb-[10px] md:mb-[15px]">
                  Follow us on
                </h4>
                <div className="flex items-center justify-center gap-[5px] md:gap-[15px] border border-[#A7A7A7] p-[10px] md:p-[15px] rounded-[15px] max-w-[280px]">
                  <a
                    href="https://www.facebook.com/thepropertyportfoliopodcast"
                    className=""
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_2186_1217)">
                        <path
                          d="M23.8574 12C23.8574 5.37262 18.4848 0 11.8574 0C5.23005 0 -0.142578 5.37262 -0.142578 12C-0.142578 17.9895 4.24567 22.954 9.98242 23.8542V15.4688H6.93555V12H9.98242V9.35625C9.98242 6.34875 11.774 4.6875 14.515 4.6875C15.8279 4.6875 17.2012 4.92188 17.2012 4.92188V7.875H15.688C14.1973 7.875 13.7324 8.80003 13.7324 9.74906V12H17.0605L16.5285 15.4688H13.7324V23.8542C19.4692 22.954 23.8574 17.9896 23.8574 12Z"
                          fill="#1877F2"
                        />
                        <path
                          d="M16.5285 15.4688L17.0605 12H13.7324V9.74906C13.7324 8.79994 14.1973 7.875 15.688 7.875H17.2012V4.92188C17.2012 4.92188 15.8279 4.6875 14.515 4.6875C11.774 4.6875 9.98242 6.34875 9.98242 9.35625V12H6.93555V15.4688H9.98242V23.8542C10.6027 23.9514 11.2296 24.0001 11.8574 24C12.4853 24.0001 13.1122 23.9514 13.7324 23.8542V15.4688H16.5285Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_2186_1217">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </a>
                  {/* <a
                    href="#"
                    className=""
                  >
                    <FaXTwitter size={18} />
                  </a> */}
                  <a
                    href="https://www.instagram.com/propertyportfoliopodcast/"
                    className=""
                  >
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 26 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_2186_1220)">
                        <path
                          d="M19.1074 0H5.75028C2.49574 0 -0.142578 2.63832 -0.142578 5.89286V19.25C-0.142578 22.5045 2.49574 25.1429 5.75028 25.1429H19.1074C22.362 25.1429 25.0003 22.5045 25.0003 19.25V5.89286C25.0003 2.63832 22.362 0 19.1074 0Z"
                          fill="url(#paint0_radial_2186_1220)"
                        />
                        <path
                          d="M19.1074 0H5.75028C2.49574 0 -0.142578 2.63832 -0.142578 5.89286V19.25C-0.142578 22.5045 2.49574 25.1429 5.75028 25.1429H19.1074C22.362 25.1429 25.0003 22.5045 25.0003 19.25V5.89286C25.0003 2.63832 22.362 0 19.1074 0Z"
                          fill="url(#paint1_radial_2186_1220)"
                        />
                        <path
                          d="M12.4297 2.75C9.76243 2.75 9.42762 2.76169 8.38006 2.80932C7.33448 2.85725 6.62075 3.02274 5.99631 3.26562C5.35025 3.51646 4.80231 3.85206 4.25644 4.39813C3.71007 4.94411 3.37448 5.49204 3.12285 6.1378C2.87928 6.76245 2.71359 7.47646 2.66655 8.52156C2.6197 9.56921 2.60742 9.90413 2.60742 12.5715C2.60742 15.2389 2.61921 15.5727 2.66674 16.6202C2.71487 17.6658 2.88036 18.3795 3.12305 19.004C3.37408 19.65 3.70968 20.198 4.25575 20.7438C4.80153 21.2902 5.34947 21.6266 5.99503 21.8774C6.61997 22.1203 7.33379 22.2858 8.37918 22.3337C9.42683 22.3814 9.76135 22.3931 12.4286 22.3931C15.0962 22.3931 15.4299 22.3814 16.4774 22.3337C17.523 22.2858 18.2375 22.1203 18.8625 21.8774C19.5082 21.6266 20.0554 21.2902 20.6011 20.7438C21.1474 20.198 21.4829 19.65 21.7347 19.0043C21.9761 18.3795 22.1418 17.6656 22.191 16.6204C22.238 15.5729 22.2503 15.2389 22.2503 12.5715C22.2503 9.90413 22.238 9.56941 22.191 8.52176C22.1418 7.47617 21.9761 6.76254 21.7347 6.1381C21.4829 5.49204 21.1474 4.94411 20.6011 4.39813C20.0548 3.85187 19.5084 3.51627 18.8619 3.26572C18.2358 3.02274 17.5217 2.85715 16.4761 2.80932C15.4284 2.76169 15.0949 2.75 12.4267 2.75H12.4297ZM11.5487 4.51992C11.8102 4.51953 12.102 4.51992 12.4297 4.51992C15.0522 4.51992 15.3629 4.52935 16.3985 4.57639C17.3561 4.6202 17.8758 4.78019 18.222 4.91464C18.6804 5.09261 19.0071 5.30544 19.3507 5.64929C19.6944 5.99304 19.9072 6.32038 20.0856 6.77875C20.2201 7.12446 20.3803 7.64421 20.4239 8.6018C20.4709 9.63718 20.4811 9.94812 20.4811 12.5693C20.4811 15.1904 20.4709 15.5015 20.4239 16.5367C20.3801 17.4943 20.2201 18.0141 20.0856 18.3599C19.9077 18.8182 19.6944 19.1446 19.3507 19.4882C19.0069 19.8319 18.6806 20.0447 18.222 20.2227C17.8762 20.3578 17.3561 20.5174 16.3985 20.5612C15.3631 20.6082 15.0522 20.6184 12.4297 20.6184C9.80722 20.6184 9.49637 20.6082 8.46109 20.5612C7.5035 20.517 6.98375 20.357 6.63725 20.2225C6.17898 20.0445 5.85154 19.8317 5.50779 19.488C5.16404 19.1442 4.95131 18.8177 4.77285 18.3591C4.6384 18.0133 4.47821 17.4935 4.4346 16.5359C4.38756 15.5006 4.37813 15.1896 4.37813 12.5668C4.37813 9.944 4.38756 9.63472 4.4346 8.59935C4.4784 7.64176 4.6384 7.12201 4.77285 6.7758C4.95091 6.31744 5.16404 5.99009 5.50789 5.64634C5.85173 5.30259 6.17898 5.08976 6.63735 4.9114C6.98356 4.77636 7.5035 4.61676 8.46109 4.57276C9.36712 4.5318 9.71823 4.51953 11.5487 4.51746V4.51992ZM17.6724 6.15067C17.0217 6.15067 16.4938 6.67808 16.4938 7.32885C16.4938 7.97952 17.0217 8.50742 17.6724 8.50742C18.3231 8.50742 18.851 7.97952 18.851 7.32885C18.851 6.67818 18.3231 6.15028 17.6724 6.15028V6.15067ZM12.4297 7.52773C9.64438 7.52773 7.38604 9.78607 7.38604 12.5715C7.38604 15.357 9.64438 17.6142 12.4297 17.6142C15.2152 17.6142 17.4727 15.357 17.4727 12.5715C17.4727 9.78617 15.215 7.52773 12.4295 7.52773H12.4297ZM12.4297 9.29765C14.2378 9.29765 15.7036 10.7633 15.7036 12.5715C15.7036 14.3796 14.2378 15.8454 12.4297 15.8454C10.6217 15.8454 9.15596 14.3796 9.15596 12.5715C9.15596 10.7633 10.6216 9.29765 12.4297 9.29765Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <radialGradient
                          id="paint0_radial_2186_1220"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(6.53599 27.0793) rotate(-90) scale(24.9184 23.1761)"
                        >
                          <stop stop-color="#FFDD55" />
                          <stop offset="0.1" stop-color="#FFDD55" />
                          <stop offset="0.5" stop-color="#FF543E" />
                          <stop offset="1" stop-color="#C837AB" />
                        </radialGradient>
                        <radialGradient
                          id="paint1_radial_2186_1220"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(-4.3541 1.81117) rotate(78.681) scale(11.1387 45.914)"
                        >
                          <stop stop-color="#3771C8" />
                          <stop offset="0.128" stop-color="#3771C8" />
                          <stop
                            offset="1"
                            stop-color="#6600FF"
                            stop-opacity="0"
                          />
                        </radialGradient>
                        <clipPath id="clip0_2186_1220">
                          <rect width="25.1429" height="25.1429" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </a>

                  <a
                    href="https://www.linkedin.com/company/the-property-portfolio-podcast/"
                    className=""
                  >
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 26 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_2186_1225)">
                        <path
                          d="M22.6437 0.588958H2.21512C1.75161 0.584241 1.30516 0.763592 0.973731 1.08766C0.642301 1.41172 0.452964 1.85403 0.447266 2.31753V22.8286C0.453995 23.2914 0.643785 23.7327 0.975103 24.0559C1.30642 24.3792 1.75228 24.558 2.21512 24.5532H22.6437C23.1072 24.5569 23.5534 24.377 23.8846 24.0527C24.2159 23.7284 24.4053 23.2862 24.4116 22.8227V2.31164C24.4033 1.8495 24.2129 1.4093 23.8819 1.08672C23.5509 0.764142 23.1059 0.585261 22.6437 0.588958Z"
                          fill="#0076B2"
                        />
                        <path
                          d="M3.99575 9.57143H7.55307V21.0173H3.99575V9.57143ZM5.77539 3.875C6.1834 3.875 6.58224 3.99601 6.92146 4.22273C7.26068 4.44945 7.52503 4.77168 7.68108 5.14867C7.83713 5.52566 7.87786 5.94046 7.79812 6.3406C7.71837 6.74074 7.52174 7.10823 7.2331 7.3966C6.94446 7.68497 6.57677 7.88125 6.17656 7.96061C5.77634 8.03997 5.36158 7.99884 4.98474 7.84244C4.60791 7.68603 4.28592 7.42137 4.05953 7.08193C3.83314 6.7425 3.7125 6.34354 3.71289 5.93554C3.71341 5.38887 3.93094 4.86477 4.31768 4.4784C4.70441 4.09203 5.22872 3.875 5.77539 3.875ZM9.7845 9.57143H13.1945V11.1429H13.2416C13.717 10.2432 14.8759 9.29446 16.6065 9.29446C20.209 9.28661 20.8768 11.6575 20.8768 14.7316V21.0173H17.3195V15.4486C17.3195 14.1227 17.2959 12.4157 15.4711 12.4157C13.6463 12.4157 13.3359 13.8614 13.3359 15.3621V21.0173H9.7845V9.57143Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_2186_1225">
                          <rect width="25.1429" height="25.1429" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </a>
                  <a
                    href="https://www.youtube.com/@ThePropertyPortfolioPodcast"
                    className=""
                  >
                    <svg
                      width="31"
                      height="22"
                      viewBox="0 0 31 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_2186_1228)">
                        <path
                          d="M30.1728 3.43139C29.995 2.76816 29.6481 2.16351 29.1668 1.67766C28.6854 1.1918 28.0864 0.841697 27.4293 0.6622C25.0236 0 15.3417 0 15.3417 0C15.3417 0 5.65929 0.0200444 3.25364 0.682244C2.59653 0.861752 1.99747 1.21188 1.51612 1.69775C1.03477 2.18363 0.687933 2.7883 0.51014 3.45156C-0.217512 7.76576 -0.499781 14.3396 0.530121 18.4812C0.707932 19.1445 1.05478 19.7491 1.53613 20.235C2.01747 20.7208 2.61652 21.0709 3.27362 21.2504C5.67927 21.9126 15.3614 21.9126 15.3614 21.9126C15.3614 21.9126 25.0435 21.9126 27.449 21.2504C28.1061 21.0709 28.7052 20.7208 29.1866 20.235C29.668 19.7491 30.0148 19.1445 30.1926 18.4812C30.9601 14.1609 31.1966 7.5911 30.1728 3.43139Z"
                          fill="#FF0000"
                        />
                        <path
                          d="M12.2598 15.6518L20.2917 10.9563L12.2598 6.26074V15.6518Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_2186_1228">
                          <rect width="31" height="22" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </a>
                  <a href="https://podcasts.apple.com/us/podcast/the-property-portfolio-podcast/id1863885688" target="blank">
                    <img   width="26" height="26" src="/musicicon.svg" alt="" />
                  </a>
                  <a href="https://open.spotify.com/show/7BWrKVuUSeX1Qat3VEjUaU" target="blank">
                    <img width="26" height="26"  src="/spotify.svg" alt="" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="  w-full md:w-[100%] lg:w-[50%] xl-w-[45%] lg:max-w-[560px] bg-[#00000099] rounded-[15px] px-[20px] py-[25px] md:px-[30px] md:py-[35px] lg:px-[40px] lg:py-[45px]">
            <h3 className="text-[18px] md:text-[22px] text-white font-[700] mb-3 md:mb-6 lg:mb-8">We're always open to your ideas</h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[16px] md:text-[18px] font-[700] mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute top-[16px] left-[15px] min-w-[17px]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g opacity="0.6">
                      <path d="M13.3346 12.3333C13.3346 13.3529 11.0489 14 8.0013 14C4.95368 14 2.66797 13.3529 2.66797 12.3333C2.66797 10.8462 5.33464 10 8.0013 10C10.668 10 13.3346 11 13.3346 12.3333Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M8 8C9.65686 8 11 6.65685 11 5C11 3.34315 9.65686 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                      </g>
                    </svg>
                  </div>

                    <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 ps-[40px] rounded-lg bg-[#0F0F0F] text-white text-[16px] border border-[#fff] placeholder-gray-400 focus:outline-none"
                  required
                />
                </div>
                
              </div>

              <div>
                <label className="block text-[16px] md:text-[18px] font-[700] mb-2">
                  Email
                </label>

                <div className="relative">
                  <div className="absolute top-[16px] left-[15px] min-w-[17px]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.6">
                    <path d="M10.0579 14.0173C9.42444 14.2549 8.71175 14.3341 7.99906 14.3341C4.51481 14.3341 1.66406 11.4833 1.66406 7.99906C1.66406 4.51481 4.51481 1.66406 7.99906 1.66406C11.4833 1.66406 14.3341 4.51481 14.3341 7.99906C14.3341 8.395 14.3341 8.15744 14.3341 8.395C13.9381 11.5625 11.6724 11.676 10.7706 10.5331C10.0697 9.64468 10.4539 8.395 11.3249 5.861M8.83363 5.09412C10.2061 5.66615 10.7595 7.47154 10.0697 9.12657C9.37988 10.7816 7.70809 11.6595 6.33563 11.0875C4.96316 10.5155 4.40976 8.71008 5.09956 7.05505C5.78937 5.40003 7.46117 4.52208 8.83363 5.09412Z" stroke="white" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    </svg>

                  </div>
                <input
                  type="email"
                  name="email"
                  placeholder="yourwinzy@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 ps-[40px] rounded-lg bg-[#0F0F0F] text-white text-[16px] border border-[#fff] placeholder-gray-400 focus:outline-none"
                  required
                />
                </div>
              </div>

              <div>
                <label className="block text-[16px] md:text-[18px] font-[700] mb-2">
                  I’d like to
                </label>

                <div className="relative">
                
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#0F0F0F] text-white text-[16px] border border-[#fff] focus:outline-none"
                  required
                >
                  <option value="" disabled>
                    Select a subject
                  </option>
                  <option value="Suggest a Topic">Suggest a Topic</option>
                  <option value="Ask a Question">Ask a Question</option>
                  <option value="Give Feedback">Give Feedback</option>
                </select>
              </div>
              </div>

              <div>
                <label className="block text-[16px] md:text-[18px] font-[700] mb-2">
                  {formData.subject === "Suggest a Topic" && "What topic should we cover?"}
                  {formData.subject === "Ask a Question" && "Your Question"}
                  {formData.subject === "Give Feedback" && "Your Thoughts/Feedback"}
                  {!formData.subject && "Message"}
                </label>

                <input
                  type="text"
                  name="message"
                  placeholder={
                    formData.subject === "Suggest a Topic"
                      ? "What topic should we cover?"
                      : formData.subject === "Ask a Question"
                      ? "Your Question"
                      : formData.subject === "Give Feedback"
                      ? "Your Thoughts/Feedback"
                      : "Your message"
                  }
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#0F0F0F] text-white text-[16px] border border-[#fff] placeholder-gray-400 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#FFFFFF33] text-[#FFFFFF] bg-gradient-to-r from-[#9747FF] to-[#FC18D8] transition-all text-white py-3 rounded-full font-semibold cursor-pointer"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-[url('/contact-bg.jpg')] bg-no-repeat bg-center bg-cover border border-[#FFFFFF33] rounded-[12px] " />
    </section>
  );
}
