import PublicLayout from "@/components/layout/PublicLayout";
import ContactForm from "@/components/contact/ContactForm";
import FaqSection from "@/components/contact/FaqSection";

export default function ContactPage() {
  return <PublicLayout seo={{ title: "Contact The Property Portfolio Podcast", appendSiteName: false, description: "Contact The Property Portfolio Podcast for guest enquiries, listener questions, topic ideas, feedback and Australian property collaborations.", path: "/contact" }}>
    <div className={"contact-page"}><ContactForm /><FaqSection /></div>
  </PublicLayout>;
}
