import NextDocument, { Html, Head, Main, NextScript } from "next/document";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-PN33NMTB";

export default function Document({ isAdminRoute }) {
  return (
    <Html lang="en" data-theme="dark">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var admin=location.pathname.indexOf('/admin')===0;var saved=localStorage.getItem('site-theme');document.documentElement.dataset.theme=admin?'dark':(saved==='light'?'light':'dark')}catch(e){}})();` }} />
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
