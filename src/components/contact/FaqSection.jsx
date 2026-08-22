import { useState } from "react";
import { FiArrowRight, FiMinus, FiPlus } from "react-icons/fi";
const faqs = [
  ["Can I suggest a future episode?", "Absolutely. Choose ‘Suggest a Topic’ above. Listener questions regularly shape future conversations."],
  ["Can I be a guest on the podcast?", "Choose ‘Guest Opportunity’ and include your expertise, suggested discussion and the value it offers Australian property audiences."],
  ["Do you provide personal financial advice?", "The podcast provides general information, not personal financial advice. We can help point you toward trusted professionals where appropriate."],
  ["How quickly will the team reply?", "We aim to review every genuine enquiry within two business days. Partnership and guest proposals can require a little longer."],
];
export default function FaqSection() {
  const [open, setOpen] = useState(0);
  return <section className={"contact-faq"}><div className={"contact-faqIntro"}><span className={"contact-eyebrow"}>Before you send</span><h2>QUICK ANSWERS.<br/><em>ZERO GUESSWORK.</em></h2><p>Everything you may want to know before starting the conversation.</p><a href="mailto:info@thepropertyportfolio.com.au">Still need help? Email us <FiArrowRight/></a></div><div className={"contact-accordion"}>{faqs.map(([question,answer],index)=><article key={question} className={open===index?"contact-open":""}><button onClick={()=>setOpen(open===index?-1:index)} aria-expanded={open===index}><span>{String(index+1).padStart(2,"0")}</span><b>{question}</b>{open===index?<FiMinus/>:<FiPlus/>}</button>{open===index&&<p>{answer}</p>}</article>)}</div></section>;
}
