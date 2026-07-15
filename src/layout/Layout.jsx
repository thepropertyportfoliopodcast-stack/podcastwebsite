import React from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import SEO from "../common/SEO";

export default function Layout({ children, seo = {} }) {

    return (
        <>
            <SEO {...seo} />
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    );
}
