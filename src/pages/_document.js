import NextDocument, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-PN33NMTB";

export default function Document({ isAdminRoute }) {
  return (
    <Html lang="en">
      <Head>
        {!isAdminRoute && (
          <Script
            id="google-tag-manager"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
            }}
          />
        )}
      </Head>
      <body className="antialiased">
        {!isAdminRoute && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        )}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = async (context) => {
  const initialProps = await NextDocument.getInitialProps(context);
  return {
    ...initialProps,
    isAdminRoute: context.pathname?.startsWith("/admin") || false,
  };
};
