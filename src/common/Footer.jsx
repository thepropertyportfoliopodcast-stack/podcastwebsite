import Link from "next/link";
import React, { useState } from "react";
import Logo from "../assets/logo.avif";
import Image from "next/image";
import Listing from "@/pages/api/Listing";
import toast from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setEmail("");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="from-[#441051] via-[#441051]/90 to-[#000000]/80 text-white  pt-[30px] md:pt-[50px] lg:pt-[80px] pb-[20px] lg:pb-[40px] ">
      <div className="mx-auto container xl:max-w-[1310px] px-4">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          {/* Left - Logo & Tagline */}
          <div>
            <div className="flex items-center gap-3">
              <Image src={"/logo.png"} alt="Podcast Logo" width={170} height={50}
                className="w-auto max-w-[180px] object-content" />
            </div>
            <p className="mt-[4px] ms-[10px] max-w-[169px] pt-[2px] pb-[2px] text-white text-[9.1px] font-[600] border-t-[1px] border-t-[#fff] border-b-[1px] border-b-[#fff] ">
              Episodes That Build Stronger Portfolio
              
            </p>

            <div className=" mt-[20px] md:mt-[40px]">
              <h3 className="font-[800] mb-4 text-white text-[16px] uppercase">Follow us On</h3>
               <ul className="flex items-center gap-[15px]">
                <li>
                  <a href="https://www.facebook.com/thepropertyportfoliopodcast" target="blank">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_1975_843)"> <path d="M24 12C24 5.37262 18.6274 0 12 0C5.37262 0 0 5.37262 0 12C0 17.9895 4.38825 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9705 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.3399 7.875 13.875 8.80003 13.875 9.74906V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6117 22.954 24 17.9896 24 12Z" fill="#1877F2"/> <path d="M16.6711 15.4688L17.2031 12H13.875V9.74906C13.875 8.79994 14.3399 7.875 15.8306 7.875H17.3438V4.92188C17.3438 4.92188 15.9705 4.6875 14.6575 4.6875C11.9166 4.6875 10.125 6.34875 10.125 9.35625V12H7.07812V15.4688H10.125V23.8542C10.7453 23.9514 11.3722 24.0001 12 24C12.6278 24.0001 13.2547 23.9514 13.875 23.8542V15.4688H16.6711Z" fill="white"/> </g> <defs> <clipPath id="clip0_1975_843"> <rect width="24" height="24" fill="white"/> </clipPath> </defs> </svg>
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/propertyportfoliopodcast/" target="blank">
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_1975_851)"> <path d="M19.25 0H5.89286C2.63832 0 0 2.63832 0 5.89286V19.25C0 22.5045 2.63832 25.1429 5.89286 25.1429H19.25C22.5045 25.1429 25.1429 22.5045 25.1429 19.25V5.89286C25.1429 2.63832 22.5045 0 19.25 0Z" fill="url(#paint0_radial_1975_851)"/> <path d="M19.25 0H5.89286C2.63832 0 0 2.63832 0 5.89286V19.25C0 22.5045 2.63832 25.1429 5.89286 25.1429H19.25C22.5045 25.1429 25.1429 22.5045 25.1429 19.25V5.89286C25.1429 2.63832 22.5045 0 19.25 0Z" fill="url(#paint1_radial_1975_851)"/> <path d="M12.5723 2.75C9.90501 2.75 9.5702 2.76169 8.52264 2.80932C7.47705 2.85725 6.76333 3.02274 6.13888 3.26562C5.49283 3.51646 4.94489 3.85206 4.39902 4.39813C3.85265 4.94411 3.51705 5.49204 3.26543 6.1378C3.02186 6.76245 2.85617 7.47646 2.80912 8.52156C2.76228 9.56921 2.75 9.90413 2.75 12.5715C2.75 15.2389 2.76179 15.5727 2.80932 16.6202C2.85745 17.6658 3.02294 18.3795 3.26562 19.004C3.51666 19.65 3.85226 20.198 4.39833 20.7438C4.94411 21.2902 5.49204 21.6266 6.13761 21.8774C6.76254 22.1203 7.47637 22.2858 8.52176 22.3337C9.56941 22.3814 9.90393 22.3931 12.5711 22.3931C15.2387 22.3931 15.5725 22.3814 16.62 22.3337C17.6656 22.2858 18.3801 22.1203 19.0051 21.8774C19.6508 21.6266 20.198 21.2902 20.7436 20.7438C21.29 20.198 21.6255 19.65 21.8772 19.0043C22.1186 18.3795 22.2844 17.6656 22.3335 16.6204C22.3806 15.5729 22.3929 15.2389 22.3929 12.5715C22.3929 9.90413 22.3806 9.56941 22.3335 8.52176C22.2844 7.47617 22.1186 6.76254 21.8772 6.1381C21.6255 5.49204 21.29 4.94411 20.7436 4.39813C20.1974 3.85187 19.651 3.51627 19.0045 3.26572C18.3783 3.02274 17.6642 2.85715 16.6186 2.80932C15.571 2.76169 15.2375 2.75 12.5693 2.75H12.5723ZM11.6912 4.51992C11.9528 4.51953 12.2446 4.51992 12.5723 4.51992C15.1947 4.51992 15.5055 4.52935 16.5411 4.57639C17.4986 4.6202 18.0184 4.78019 18.3646 4.91464C18.823 5.09261 19.1497 5.30544 19.4933 5.64929C19.837 5.99304 20.0498 6.32038 20.2282 6.77875C20.3627 7.12446 20.5229 7.64421 20.5665 8.6018C20.6135 9.63718 20.6237 9.94812 20.6237 12.5693C20.6237 15.1904 20.6135 15.5015 20.5665 16.5367C20.5227 17.4943 20.3627 18.0141 20.2282 18.3599C20.0503 18.8182 19.837 19.1446 19.4933 19.4882C19.1495 19.8319 18.8232 20.0447 18.3646 20.2227C18.0188 20.3578 17.4986 20.5174 16.5411 20.5612C15.5057 20.6082 15.1947 20.6184 12.5723 20.6184C9.94979 20.6184 9.63895 20.6082 8.60367 20.5612C7.64608 20.517 7.12633 20.357 6.77983 20.2225C6.32156 20.0445 5.99412 19.8317 5.65037 19.488C5.30662 19.1442 5.09388 18.8177 4.91543 18.3591C4.78097 18.0133 4.62079 17.4935 4.57718 16.5359C4.53013 15.5006 4.52071 15.1896 4.52071 12.5668C4.52071 9.944 4.53013 9.63472 4.57718 8.59935C4.62098 7.64176 4.78097 7.12201 4.91543 6.7758C5.09349 6.31744 5.30662 5.99009 5.65046 5.64634C5.99431 5.30259 6.32156 5.08976 6.77993 4.9114C7.12613 4.77636 7.64608 4.61676 8.60367 4.57276C9.5097 4.5318 9.86081 4.51953 11.6912 4.51746V4.51992ZM17.815 6.15067C17.1643 6.15067 16.6364 6.67808 16.6364 7.32885C16.6364 7.97952 17.1643 8.50742 17.815 8.50742C18.4657 8.50742 18.9936 7.97952 18.9936 7.32885C18.9936 6.67818 18.4657 6.15028 17.815 6.15028V6.15067ZM12.5723 7.52773C9.78696 7.52773 7.52862 9.78607 7.52862 12.5715C7.52862 15.357 9.78696 17.6142 12.5723 17.6142C15.3578 17.6142 17.6153 15.357 17.6153 12.5715C17.6153 9.78617 15.3576 7.52773 12.5721 7.52773H12.5723ZM12.5723 9.29765C14.3803 9.29765 15.8462 10.7633 15.8462 12.5715C15.8462 14.3796 14.3803 15.8454 12.5723 15.8454C10.7643 15.8454 9.29854 14.3796 9.29854 12.5715C9.29854 10.7633 10.7642 9.29765 12.5723 9.29765Z" fill="white"/> </g> <defs> <radialGradient id="paint0_radial_1975_851" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(6.67857 27.0793) rotate(-90) scale(24.9184 23.1761)"> <stop stop-color="#FFDD55"/> <stop offset="0.1" stop-color="#FFDD55"/> <stop offset="0.5" stop-color="#FF543E"/> <stop offset="1" stop-color="#C837AB"/> </radialGradient> <radialGradient id="paint1_radial_1975_851" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(-4.21153 1.81117) rotate(78.681) scale(11.1387 45.914)"> <stop stop-color="#3771C8"/> <stop offset="0.128" stop-color="#3771C8"/> <stop offset="1" stop-color="#6600FF" stop-opacity="0"/> </radialGradient> <clipPath id="clip0_1975_851"> <rect width="25.1429" height="25.1429" fill="white"/> </clipPath> </defs> </svg>
                  </a>
                </li>
                {/* <li><a href="#">E-guides</a></li> */}
                <li>
                  <a href="https://www.linkedin.com/company/the-property-portfolio-podcast/" target="blank">
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_1975_846)"> <path d="M22.7863 0.588958H2.3577C1.89419 0.584241 1.44774 0.763592 1.11631 1.08766C0.784879 1.41172 0.595542 1.85403 0.589844 2.31753V22.8286C0.596573 23.2914 0.786363 23.7327 1.11768 24.0559C1.449 24.3792 1.89486 24.558 2.3577 24.5532H22.7863C23.2498 24.5569 23.696 24.377 24.0272 24.0527C24.3585 23.7284 24.5479 23.2862 24.5541 22.8227V2.31164C24.5459 1.8495 24.3555 1.4093 24.0245 1.08672C23.6935 0.764142 23.2485 0.585261 22.7863 0.588958Z" fill="#0076B2"/> <path d="M4.13833 9.57143H7.69565V21.0173H4.13833V9.57143ZM5.91797 3.875C6.32598 3.875 6.72482 3.99601 7.06404 4.22273C7.40326 4.44945 7.66761 4.77168 7.82366 5.14867C7.97971 5.52566 8.02044 5.94046 7.94069 6.3406C7.86095 6.74074 7.66432 7.10823 7.37568 7.3966C7.08704 7.68497 6.71935 7.88125 6.31914 7.96061C5.91892 8.03997 5.50416 7.99884 5.12732 7.84244C4.75048 7.68603 4.4285 7.42137 4.20211 7.08193C3.97571 6.7425 3.85508 6.34354 3.85547 5.93554C3.85599 5.38887 4.07352 4.86477 4.46026 4.4784C4.84699 4.09203 5.3713 3.875 5.91797 3.875ZM9.92708 9.57143H13.3371V11.1429H13.3842C13.8596 10.2432 15.0185 9.29446 16.749 9.29446C20.3515 9.28661 21.0194 11.6575 21.0194 14.7316V21.0173H17.4621V15.4486C17.4621 14.1227 17.4385 12.4157 15.6137 12.4157C13.7889 12.4157 13.4785 13.8614 13.4785 15.3621V21.0173H9.92708V9.57143Z" fill="white"/> </g> <defs> <clipPath id="clip0_1975_846"> <rect width="25.1429" height="25.1429" fill="white"/> </clipPath> </defs> </svg>
                  </a>
                </li>

                <li>
                  <a href="https://www.youtube.com/@ThePropertyPortfolioPodcast" target="blank">
                    <svg width="31" height="22" viewBox="0 0 31 22" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_1975_902)"> <path d="M30.3154 3.43139C30.1375 2.76816 29.7907 2.16351 29.3094 1.67766C28.828 1.1918 28.229 0.841697 27.5719 0.6622C25.1662 0 15.4843 0 15.4843 0C15.4843 0 5.80187 0.0200444 3.39622 0.682244C2.7391 0.861752 2.14004 1.21188 1.6587 1.69775C1.17735 2.18363 0.830511 2.7883 0.652719 3.45156C-0.0749338 7.76576 -0.357203 14.3396 0.672699 18.4812C0.85051 19.1445 1.19736 19.7491 1.6787 20.235C2.16005 20.7208 2.7591 21.0709 3.4162 21.2504C5.82185 21.9126 15.504 21.9126 15.504 21.9126C15.504 21.9126 25.1861 21.9126 27.5916 21.2504C28.2487 21.0709 28.8478 20.7208 29.3292 20.235C29.8105 19.7491 30.1574 19.1445 30.3352 18.4812C31.1027 14.1609 31.3392 7.5911 30.3154 3.43139Z" fill="#FF0000"/> <path d="M12.4023 15.6518L20.4342 10.9563L12.4023 6.26074V15.6518Z" fill="white"/> </g> <defs> <clipPath id="clip0_1975_902"> <rect width="31" height="22" fill="white"/> </clipPath> </defs> </svg>
                  </a>
                </li>
                <li>
                  <a href="https://podcasts.apple.com/us/podcast/the-property-portfolio-podcast/id1876516932" target="blank">
                    <img width="28" height="22" className="min-w-[28px]" src="/musicicon.svg" alt="" />
                  </a>
                </li>
                <li>
                  <a href="https://open.spotify.com/show/7BWrKVuUSeX1Qat3VEjUaU" target="blank">
                    <img width="28" height="22" className="min-w-[28px]" src="/spotify.svg" alt="" /> 
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Company Links */}
          <div className=" border-t  border-t-[#FFFFFF33] sm:border-t-[0] pt-[20px] sm:pt-[0px]">
            <h3 className="font-semibold mb-4  font-[700] text-[16px] uppercase">COMPANY</h3>
            <ul className="space-y-4 text-white text-[16px] font-[600]">
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/episode">Episodes</Link>
              </li>
              {/* <li><Link href="#">E-guides</Link></li> */}
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Help Links */}
          <div className=" border-t  border-t-[#FFFFFF33] lg:border-t-[0] pt-[20px] lg:pt-[0px]">
            <h3 className="font-semibold mb-4 font-[700] text-[16px] uppercase">HELP</h3>
            <ul className="space-y-4 text-white text-[16px] font-[600]">
              {/* <li><a href="#">Delivery Details</a></li> */}
              {/* <li><Link href="/contact">Customer Support</Link></li> */}
              <li>
                <Link href="/access">Terms Of Access</Link>
              </li>
              <li>
                <Link href="/use">Terms Of Use</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className=" border-t  border-t-[#FFFFFF33] lg:border-t-[0] pt-[20px] lg:pt-[0px]">
            <h3 className="font-semibold mb-4 font-[700] text-[16px] uppercase ps-[1px]">NEWSLETTER</h3>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                required
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                className="mb-[15px] px-[15px] py-[12px] rounded-[80px] bg-[#0F0F0F]  border-[1px] border-[#FFFFFF66] text-white outline-none text-[14px] font-[400] w-full"
              />
              <button
                type="submit"
                className="px-[35px] py-[10px] rounded-full bg-white hover:bg-gradient-to-r hover:from-[#9747FF] hover:to-[#FC18D8] transition text-[18px] text-black hover:text-white font-semibold w-fit cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-[#FFFFFF33] mt-5 md:mt-10 pt-[20px] lg:pt-[38px]  text-center text-white text-[14px]">
          © Copyright {new Date()?.getFullYear() || "2025"}, All Rights
          Reserved.
        </div>
      </div>
    </footer>
  );
}