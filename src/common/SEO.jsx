import Head from "next/head";
import { useRouter } from "next/router";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "@/utils/seo";

const pageMeta = {
  "/": ["Australian Property Investing Podcast", DEFAULT_DESCRIPTION],
  "/episode": ["Property Investment Podcast Episodes", "Browse every episode of The Property Portfolio Podcast for Australian market insights, finance strategies and portfolio-building guidance."],
  "/about": ["About The Property Portfolio Podcast", "Meet the team behind The Property Portfolio Podcast and learn how we help Australians make informed property investment decisions."],
  "/contact": ["Contact The Property Portfolio Podcast", "Contact The Property Portfolio Podcast team with questions, feedback or collaboration enquiries."],
  "/privacy": ["Privacy Policy", "Read the privacy policy for The Property Portfolio Podcast."],
  "/access": ["Terms of Access", "Read the terms governing access to The Property Portfolio Podcast website."],
  "/use": ["Terms of Use", "Read the terms governing use of The Property Portfolio Podcast website."],
};

export default function SEO({ title, description, path, image = "/logo.png", type = "website", noindex = false, jsonLd }) {
  const router = useRouter();
  const defaults = pageMeta[router.pathname] || [SITE_NAME, DEFAULT_DESCRIPTION];
  const metaTitle = title || defaults[0];
  const fullTitle = metaTitle === SITE_NAME ? SITE_NAME : `${metaTitle} | ${SITE_NAME}`;
  const metaDescription = description || defaults[1];
  const canonicalPath = path || router.asPath.split(/[?#]/)[0];
  const canonical = `${SITE_URL}${canonicalPath === "/" ? "" : canonicalPath}`;
  const socialImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large"} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={socialImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={socialImage} />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
    </Head>
  );
}
