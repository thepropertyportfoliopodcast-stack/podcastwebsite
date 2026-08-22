import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import SeoHead from "@/components/seo/SeoHead";

export default function PublicLayout({ children, seo = {} }) {

    return (
        <div className="public-site min-h-screen bg-black text-white">
            <SeoHead {...seo} />
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
