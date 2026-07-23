import Head from "next/head";
import { useRouter } from "next/router";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "@/utils/seo";

const pageMeta = {
  "/": {
    title: "Australian Property Podcast | Property Portfolio",
    description: "Listen to Australian property investing insights, market trends, lending strategy and investor stories from The Property Portfolio Podcast.",
    keywords: "Australian property podcast, Australian property investing podcast, property investment podcast Australia, real estate podcast Australia, property market Australia, investment property podcast, Australian real estate investing",
  },
  "/episode": {
    title: "Property Podcast Episodes | Property Portfolio",
    description: "Browse every Property Portfolio Podcast episode on Australian property markets, investment strategies, finance, suburb trends and investor insights.",
    keywords: "property podcast episodes, Australian property podcast episodes, property investment episodes, real estate podcast episodes, Australian property market podcast, investment property podcast Australia, property investing videos",
  },
  "/about": {
    title: "About The Property Portfolio Podcast",
    description: "Learn about The Property Portfolio Podcast, sharing Australian property insights, market views and investor conversations from Nfinity and PropWealth.",
    keywords: "Australian property insights, about property podcast, Australian property podcast hosts, property investing Australia, real estate investing podcast, Nfinity Financials podcast, PropWealth podcast",
  },
  "/contact": {
    title: "Contact The Property Portfolio Podcast",
    description: "Contact The Property Portfolio Podcast for guest enquiries, listener questions, topic ideas, feedback and Australian property collaborations.",
    keywords: "contact property podcast, property podcast guest enquiry, Australian property podcast contact, property podcast collaboration, real estate podcast Australia contact, property podcast feedback",
  },
  "/access": {
    title: "Terms of Access | The Property Portfolio Podcast",
    description: "Read the Terms of Access for The Property Portfolio Podcast website, including content access, website use and liability information.",
    keywords: "terms of access, website terms of access, property podcast terms, website access terms, The Property Portfolio Podcast terms, Australian website terms",
  },
  "/use": {
    title: "Terms of Use | The Property Portfolio Podcast",
    description: "Read the Terms of Use for The Property Portfolio Podcast website, including user responsibilities, linked sites and content conditions.",
    keywords: "terms of use, website terms of use, podcast website terms, The Property Portfolio Podcast terms of use, content usage terms, Australian website terms",
  },
  "/privacy": {
    title: "Privacy Policy | The Property Portfolio Podcast",
    description: "Read how The Property Portfolio Podcast may collect and use personal information, email details, cookies and website data.",
    keywords: "privacy policy, website privacy policy, podcast privacy policy, The Property Portfolio Podcast privacy, Australian privacy policy, personal information policy",
  },
  "/host": {
    title: "Meet the Hosts | The Property Portfolio Podcast",
    description: "Meet the hosts and property professionals behind The Property Portfolio Podcast and discover their experience in Australian property and finance.",
    keywords: "Australian property podcast hosts, property experts Australia, property investment podcast hosts",
  },
  "/e-guide": {
    title: "Australian Property Investment Guides | Property Portfolio",
    description: "Explore practical Australian property investment guides covering finance, portfolio strategy, market research and informed investing.",
    keywords: "Australian property investment guides, property investing resources, property finance guide Australia",
  },
};

export default function SEO({ title, description, keywords, path, image = "/logo.webp", type = "website", noindex = false, jsonLd, appendSiteName = true, publishedTime }) {
  const router = useRouter();
  const defaults = pageMeta[router.pathname] || {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    keywords: "Australian property podcast, property investment podcast Australia",
  };
  const fullTitle = title ? (appendSiteName ? `${title} | ${SITE_NAME}` : title) : defaults.title;
  const metaDescription = description || defaults.description;
  const metaKeywords = keywords || defaults.keywords;
  const canonicalPath = path || router.asPath.split(/[?#]/)[0];
  const canonical = `${SITE_URL}${canonicalPath === "/" ? "/" : canonicalPath}`;
  const socialImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;
  const structuredData = jsonLd || {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: fullTitle,
    description: metaDescription,
    url: canonical,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large"} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={socialImage} />
      <meta property="og:image:alt" content={fullTitle} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={socialImage} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </Head>
  );
}
