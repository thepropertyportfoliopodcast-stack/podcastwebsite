import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaApple, FaFacebook, FaInstagram, FaLinkedin, FaSpotify, FaYoutube } from "react-icons/fa";
import PodcastApi from "@/services/podcastApi";

const social = [
  ["https://www.facebook.com/thepropertyportfoliopodcast", "Facebook", FaFacebook],
  ["https://www.instagram.com/propertyportfoliopodcast/", "Instagram", FaInstagram],
  ["https://www.linkedin.com/company/the-property-portfolio-podcast/", "LinkedIn", FaLinkedin],
  ["https://www.youtube.com/@ThePropertyPortfolioPodcast", "YouTube", FaYoutube],
  ["https://open.spotify.com/show/7BWrKVuUSeX1Qat3VEjUaU", "Spotify", FaSpotify],
  ["https://podcasts.apple.com/us/podcast/the-property-portfolio-podcast/id1876516932", "Apple Podcasts", FaApple],
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email.");
      return;
    }
    setLoading(true);
    try {
      await new PodcastApi().AddSubscriber({ email });
      setEmail("");
      toast.success("Thank you for subscribing!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-[#C347FF]/20 bg-[linear-gradient(180deg,#0b0810_0%,#07070b_100%)] py-12 text-white before:absolute before:inset-x-0 before:top-0 before:h-24 before:bg-[radial-gradient(ellipse_at_top,rgba(168,55,244,0.15),transparent_70%)] sm:py-16">
      <div className="relative mx-auto w-[calc(100%-32px)] max-w-[1280px] sm:w-[calc(100%-64px)]">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.6fr_0.6fr_1.1fr] lg:gap-12">
          
          {/* Brand Info */}
          <div className="flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-block transition-opacity hover:opacity-90">
                <Image
                  src="/logo.png"
                  alt="The Property Portfolio Podcast"
                  width={211}
                  height={52}
                  sizes="211px"
                  className="h-auto w-[175px] sm:w-[190px]"
                />
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
                Australian property conversations featuring investors, finance professionals and industry voices.
              </p>
            </div>

            {/* Social Icons */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {social.map(([href, label, Icon]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} — The Property Portfolio Podcast`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/80 transition-all duration-200 hover:scale-105 hover:border-[#C347FF]/60 hover:bg-[#C347FF]/10 hover:text-[#DDBBFF]"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Wrapper for Navigation & Legal: Side-by-Side on Mobile, Flattens on Desktop */}
          <div className="grid grid-cols-2 gap-8 sm:contents">
            {/* Navigation Section */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-white/90">Navigation</h2>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
                {[
                  ["/", "Home"],
                  ["/episode", "Episodes"],
                  ["/about", "About"],
                  ["/contact", "Contact"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="inline-block transition-colors duration-200 hover:text-[#DDBBFF]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Section */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-white/90">Legal</h2>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
                {[
                  ["/access", "Terms of Access"],
                  ["/use", "Terms of Use"],
                  ["/privacy", "Privacy Policy"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="inline-block transition-colors duration-200 hover:text-[#DDBBFF]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-white/90">Newsletter</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                Get the latest episodes and market discussions in your inbox.
              </p>
            </div>
            <form onSubmit={submit} className="mt-5 flex gap-2">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="Email address"
                className="min-h-11 min-w-0 flex-1 rounded-lg border border-white/15 bg-white/[0.04] px-3.5 text-sm text-white placeholder-white/40 outline-none transition duration-200 focus:border-[#C347FF] focus:ring-2 focus:ring-[#C347FF]/30"
              />
              <button
                type="submit"
                disabled={loading}
                className="min-h-11 rounded-lg bg-[#A837F4] px-4 text-xs font-bold tracking-wide text-white transition-all duration-200 hover:bg-[#b842ff] hover:shadow-lg hover:shadow-[#A837F4]/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "…" : "Subscribe"}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/40 sm:mt-16">
          <p>© {new Date().getFullYear()} The Property Portfolio Podcast. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
