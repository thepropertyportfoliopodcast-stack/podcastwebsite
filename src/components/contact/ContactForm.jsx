import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import PodcastApi from "@/services/podcastApi";
import { FiArrowUpRight, FiMail, FiMapPin, FiMessageCircle, FiPhone, FiSend, FiUser } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const initial = { name: "", email: "", subject: "Suggest a Topic", message: "" };
const subjects = ["Suggest a Topic", "Ask a Question", "Guest Opportunity", "Give Feedback"];

export default function ContactForm() {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const update = ({ target }) => setForm((current) => ({ ...current, [target.name]: target.value }));
  const submit = async (event) => {
    event.preventDefault();
    if (loading) return;
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email) || form.message.trim().length < 5) return toast.error("Please complete every field with a valid email.");
    setLoading(true);
    try {
      await new PodcastApi().AddContact({ ...form, source: "contact_page" });
      setForm(initial);
      toast.success("Thanks — your message is safely with our team.");
    } catch (error) { toast.error(error?.response?.data?.message || error?.response?.data?.errors || "We could not send your message. Please try again."); }
    finally { setLoading(false); }
  };

  return <section className={"contact-hero"}>
    <div className={"contact-orbOne"}/><div className={"contact-orbTwo"}/>
    <div className={"contact-heroCopy"}>
      <span className={"contact-eyebrow"}><FiMessageCircle/> START A CONVERSATION</span>
      <h1>Your Next Property Question <em>Starts Here.</em></h1>
      <p>Suggest an episode, ask our hosts a question, propose a guest or tell us what you think. Every useful conversation begins with one clear idea.</p>
      <div className={"contact-quickGrid"}>
        <a href="mailto:info@thepropertyportfolio.com.au"><FiMail/><span><small>Email us</small>info@thepropertyportfolio.com.au</span></a>
        <a href="tel:+61497570833"><FiPhone/><span><small>Call us</small>0497 570 833</span></a>
        <a href="https://maps.google.com/?q=215%2F33+Lexington+Dr+Bella+Vista+NSW+2153" target="_blank" rel="noopener noreferrer"><FiMapPin/><span><small>Visit us</small>Bella Vista, NSW</span></a>
      </div>
      <div className={"contact-socials"}><span>Follow The Conversation</span>{[
        ["Facebook", "https://www.facebook.com/thepropertyportfoliopodcast", FaFacebookF], ["Instagram", "https://www.instagram.com/propertyportfoliopodcast/", FaInstagram],
        ["LinkedIn", "https://www.linkedin.com/company/the-property-portfolio-podcast/", FaLinkedinIn], ["YouTube", "https://www.youtube.com/@ThePropertyPortfolioPodcast", FaYoutube],
      ].map(([label,href,Icon])=><a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Follow The Property Portfolio Podcast on ${label}`}><Icon aria-hidden="true"/></a>)}</div>
    </div>
    <div className={"contact-formShell"}>
      <div className={"contact-formHead"}><div><span>Direct to our team</span><h2>What would you like to discuss?</h2></div><FiSend/></div>
      <form onSubmit={submit} className={"contact-form"}>
        <div className={"contact-twoColumns"}><label><span>Your name</span><div><FiUser/><input name="name" value={form.name} onChange={update} placeholder="Enter your name" autoComplete="name" required/></div></label><label><span>Email address</span><div><FiMail/><input type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com" autoComplete="email" required/></div></label></div>
        <fieldset><legend>I’d like to</legend><div className={"contact-subjects"}>{subjects.map((subject)=><button type="button" key={subject} onClick={()=>setForm((current)=>({...current,subject}))} aria-pressed={form.subject===subject} className={form.subject===subject?"selected":""}>{subject}</button>)}</div></fieldset>
        <label className={"contact-message"}><span>Your message</span><textarea name="message" value={form.message} onChange={update} maxLength={1500} rows={6} placeholder="Share the question, idea or opportunity you would like our hosts to unpack…" required/><small>{form.message.length}/1500</small></label>
        <button className={"contact-submit"} disabled={loading}>{loading ? "Sending securely…" : "Send my message"}<FiArrowUpRight/></button>
        <p className={"contact-privacy"}>Your details are used only to respond to your enquiry. Read our <Link href="/privacy">privacy policy</Link>.</p>
      </form>
    </div>
  </section>;
}
