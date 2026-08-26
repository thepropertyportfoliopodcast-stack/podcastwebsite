import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { MdOutlineHeadphones } from "react-icons/md";
import { RiMenu3Line } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const toggleMenu = () => setMenuOpen(!menuOpen);
  useEffect(() => { const update = () => setScrolled(window.scrollY > 20); update(); window.addEventListener("scroll", update, { passive: true }); return () => window.removeEventListener("scroll", update); }, []);
  useEffect(() => setMenuOpen(false), [router.asPath]);
  const links = [["/","Home"],["/episode","Episodes"],["/about","About"],["/contact","Contact"]];
  const active = (href) => href === "/" ? router.pathname === "/" : router.pathname.startsWith(href);

  return (
     <header className={`site-header fixed top-0 z-50 w-full border-b py-3 text-white transition-all duration-300 ${scrolled || router.pathname !== "/" ? "border-white/10 bg-[#07070B]/90 shadow-xl backdrop-blur-xl" : "border-white/10 bg-black/25 backdrop-blur-sm"}`}>
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
                quality={68}
                priority
              />
            </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-7 lg:flex">
          <nav aria-label="Primary navigation" className="flex gap-x-8">
            {links.map(([href,label]) => <Link key={href} href={href} aria-current={active(href) ? "page" : undefined} className={`relative inline-flex min-h-11 items-center text-lg font-semibold transition hover:text-[#DDBBFF] focus-visible:outline-2 focus-visible:outline-[#DDBBFF] ${active(href) ? "text-white after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[#C347FF]" : "text-white/75"}`}>{label}</Link>)}
          </nav>
          <Link href="/episode" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-[#8b2fd1] to-[#C347FF] px-5 text-sm font-bold shadow-[0_10px_30px_rgba(168,55,244,.2)] transition hover:brightness-110"><MdOutlineHeadphones size={19} aria-hidden="true"/>Listen Now</Link>
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
                className="fixed inset-x-0 top-[73px] z-40 bg-black sm:top-[84px]"
              >
                <ul className="relative flex w-full flex-col border-y border-white/15 bg-black px-5 py-3 font-manrope text-[15px] font-semibold text-white shadow-2xl md:text-[18px]">
                  {links.map(([href,label]) => <li key={href} className="border-b border-[#323232]"><Link href={href} className="flex min-h-12 items-center text-sm font-semibold">{label}</Link></li>)}
                  <li><Link href="/episode" className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#A837F4] font-bold"><MdOutlineHeadphones aria-hidden="true"/>Listen Now</Link></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
     </header>
  );
}
