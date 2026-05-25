'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { RiMenu3Line } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import Logo from "../assets/logo.avif"
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // header fixed 
  const [Scrolled, setScrolled] = useState();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 5);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])

  const router = useRouter();

  // console.log(router);

  return (
     <nav className={`fixed w-full top-0 z-50  transition-all duration-300 ease-in-out bg-black border-b-[1px] border-b-[#FFFFFF33] text-white py-4`}>
      <div className="mx-auto container sm:container md:container lg:container xl:max-w-[1310px] px-4">
        <div className="relative flex items-center justify-between">
          {/* Logo */}
            <Link href="/">
              <Image
                width={211}
                height={50}
                className=" max-w-[170px] sm:max-w-[200px] md:max-w-[211px] w-auto object-content"
                src={"/logo.png"}
                alt="Logo"
              />
            </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex gap-x-10">
            <Link href="/" className="text-sm font-semibold ">Home</Link>
            <Link href="/episode" className="text-sm font-semibold ">Episode</Link>
            {/* <Link href="/e-guide" className="text-sm font-semibold ">E-Guide</Link> */}
            <Link href="/about" className="text-sm font-semibold ">About</Link>
            <Link href="/contact" className="text-sm font-semibold ">Contact</Link>
          </nav>
          {/* Mobile Menu Open Button */}

          <div className={`flex lg:hidden ${menuOpen ? "hidden" : ""}`}>
            <button
              type="button"
              className="absolute right-[0px] top-[1px] sm:top-[5px]  z-[1] border border-[#fff] inline-flex items-center justify-center rounded-[3px] w-[40px] h-[40px] focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              onClick={toggleMenu}
            >
              <RiMenu3Line size={30} />
            </button>
          </div>
          {/* Mobile Menu Close Button */}
          <div className={`flex lg:hidden  ${menuOpen ? "block" : "hidden"}`}>
            <button
              type="button"
              className="absolute right-[0px] top-[1px] sm:top-[5px]  z-[1] border border-[#fff] inline-flex items-center justify-center rounded-[3px] w-[40px] h-[40px] focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              onClick={toggleMenu}
            >
              <IoCloseSharp size={30} />
            </button>

            {/* Mobile Menu Panel */}
            {menuOpen && (
              <div
                id="mobile-menu "
                className="absolute top-0 right-[0] 11h-full pt-[60px] "
              >
                <ul className="relative bg-[#161616]  w-[250px] z-[9] h-full flex flex-col  font-manrope font-[600] text-[15px] md:text-[18px] lg:text-[20px]  px-[20px] pt-[10px] pb-[20px] ">
                  <li className='border-b border-b-[#323232]'>
                    <Link href="/" className="block text-sm font-semibold  py-[9px] ">Home </Link>
                  </li>
                  <li className='border-b border-b-[#323232]'>
                    <Link href="/episode" className="block text-sm font-semibold  py-[9px]">Episode</Link>

                  </li>

                  {/* <li>
                    <Link href="/e-guide" className="text-sm font-semibold ">E-Guide</Link>

                  </li> */}
                  <li className='border-b border-b-[#323232]'>
                    <Link href="/about" className="block text-sm font-semibold  py-[9px]">About</Link>

                  </li>
                  <li className='border-b border-b-[#323232]'>
                    <Link href="/contact" className="block text-sm font-semibold  py-[9px]">Contact</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
