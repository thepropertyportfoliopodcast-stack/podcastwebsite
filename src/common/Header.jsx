import Link from 'next/link';
import { useState } from 'react';
import { RiMenu3Line } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
     <header className="site-header fixed top-0 z-50 w-full border-b border-white/20 bg-black py-4 text-white transition-all duration-300 ease-in-out">
      <div className="mx-auto container sm:container md:container lg:container xl:max-w-[1310px] px-4">
        <div className="relative flex items-center justify-between">
          {/* Logo */}
            <Link href="/" className="relative z-10 shrink-0">
              <Image
                width={211}
                height={52}
                style={{ width: "auto", height: "auto" }}
                className=" max-w-[170px] sm:max-w-[200px] md:max-w-[211px] w-auto h-auto object-content"
                src={"/logo.webp"}
                alt="The Property Portfolio Podcast"
                sizes="(max-width: 640px) 170px, (max-width: 768px) 200px, 211px"
                priority
              />
            </Link>

          {/* Desktop Links */}
          <div className="hidden items-center lg:flex">
          <nav aria-label="Primary navigation" className="flex gap-x-10">
            <Link href="/" className="text-sm font-semibold ">Home</Link>
            <Link href="/episode" className="text-sm font-semibold ">Episode</Link>
            <Link href="/about" className="text-sm font-semibold ">About</Link>
            <Link href="/contact" className="text-sm font-semibold ">Contact</Link>
          </nav>
          </div>
          {/* Mobile Menu Open Button */}

          <div className="relative z-20 ml-auto flex shrink-0 items-center lg:hidden">
            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={toggleMenu}
            >
              {menuOpen ? <IoCloseSharp size={30} aria-hidden="true" /> : <RiMenu3Line size={30} aria-hidden="true" />}
            </button>
          </div>
          <div className="flex lg:hidden">
            {/* Mobile Menu Panel */}
            {menuOpen && (
              <div
                id="mobile-menu"
                className="absolute right-0 top-0 h-full pt-[60px]"
              >
                <ul className="mobile-menu-panel relative z-[9] flex h-full w-[250px] flex-col bg-[#161616] px-[20px] pb-[20px] pt-[10px] font-manrope text-[15px] font-[600] md:text-[18px] lg:text-[20px]">
                  <li className='border-b border-b-[#323232]'>
                    <Link href="/" className="block text-sm font-semibold  py-[9px] ">Home </Link>
                  </li>
                  <li className='border-b border-b-[#323232]'>
                    <Link href="/episode" className="block text-sm font-semibold  py-[9px]">Episode</Link>

                  </li>

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
     </header>
  );
}
