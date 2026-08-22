import PublicLayout from "@/components/layout/PublicLayout";
import React from "react";

export default function Use() {
  return (
    <PublicLayout>
      <div className="relative isolate overflow-hidden pt-[120px] pb-24">
        
        {/* Ambient Light Theme Background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#f3e8ff] opacity-70 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#fce7f3] opacity-70 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute inset-0 bg-[radial-gradient(#e0d4e7_1px,transparent_1px)] [background-size:24px_24px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"></div>
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-12 text-center sm:text-left">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#e0d4e7] bg-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#76239e] shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FC18D8] animate-pulse"></span>
              Legal Documents
            </span>
            <h1 className="text-4xl font-black tracking-tight text-[#211628] sm:text-5xl">
              Terms of Use
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#6f6278]">
              The Property Portfolio Podcast ACN 687 075 565 owns and operates this website. 
              Access to and use of this Website is and the products and services available 
              through this Website (collectively, Services) is subject to the following 
              terms, conditions and notices (Terms of Use). By using the Services, you are 
              agreeing to all of the Terms of Use, as may be updated by us from time to time. 
              You should check this page regularly to take notice of any changes we may have 
              made to the Terms of Use.
            </p>
          </div>

          {/* Sections Container */}
          <div className="space-y-5 text-sm leading-7 text-[#6f6278]">
            
            <Section title="Amendments to Terms of Use">
              <p>
                Website Owner reserves the right to amend these Terms of Use from time to
                time. Amendments will be effective immediately upon notification on this
                Website. Your continued use of the Website following such notification
                will represent an agreement by you to be bound by the terms and conditions
                as amended.
              </p>
            </Section>

            <Section title="Website">
              <p>
                Access to this Website is permitted on a temporary basis, and we reserve
                the right to withdraw or amend the Services without notice. We will not be
                liable if for any reason this Website is unavailable at any time or for any
                period. From time to time, we may restrict access to some parts or all of
                this Website.
              </p>
            </Section>

            <Section title="Linked Sites">
              <p>
                This Website may contain links to other websites (Linked Sites), which are
                not operated by Website Owner. Website Owner has no control over the Linked
                Sites and accepts no responsibility for them or for any loss or damage that
                may arise from your use of them. Your use of the Linked Sites will be
                subject to the Terms of Use and service contained within each such site.
              </p>
            </Section>

            <Section title="Privacy Policy">
              <p>
                By using this Website, you consent to the processing described in the
                privacy policy and warrant that all data provided by you is accurate.
              </p>
            </Section>

            <Section title="Prohibitions">
              <p>(a) You must not misuse this Website. You will not:</p>
              <ul className="space-y-3 pl-1 mt-4">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#9747FF] to-[#FC18D8]"></span>
                  <span>(i) commit or encourage a criminal offense;</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#9747FF] to-[#FC18D8]"></span>
                  <span>
                    (ii) transmit or distribute a virus, trojan, worm, logic bomb or any other
                    material which is malicious, technologically harmful, in breach of
                    confidence or in any way offensive or obscene;
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#9747FF] to-[#FC18D8]"></span>
                  <span>
                    (iii) hack into any aspect of the Service; corrupt data; cause annoyance
                    to other users;
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#9747FF] to-[#FC18D8]"></span>
                  <span>
                    (iv) infringe upon the rights of any other person’s proprietary rights;
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#9747FF] to-[#FC18D8]"></span>
                  <span>
                    (v) send any unsolicited advertising or promotional material, commonly
                    referred to as “spam”; or
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#9747FF] to-[#FC18D8]"></span>
                  <span>
                    (vi) attempt to affect the performance or functionality of any computer
                    facilities or accessed through this Website.
                  </span>
                </li>
              </ul>
              <p className="mt-4">
                Breaching this provision would constitute a criminal offense and Website
                Owner will report any such breach to the relevant law enforcement
                authorities and disclose your identity to them.
              </p>
              <p className="mt-4">
                (b) We will not be liable for any loss or damage caused by a distributed
                denial-of-service attack, viruses or other technologically harmful material
                that may infect your computer equipment, computer programs, data or other
                proprietary material due to your use of this Website or to your downloading
                of any material posted on it, or on any Linked Sites.
              </p>
            </Section>

            <Section title="Intellectual Property, Software and Content">
              <p>
                The intellectual property rights in all software and content (including
                photographic images) made available to you on or through this Website
                remain the property of Website Owner or its licensors and are protected by
                copyright laws and treaties around the world. All such rights are reserved
                by Website Owner and its licensors. You may store, print and display the
                content supplied solely for your own personal use. You are not permitted
                to publish, manipulate, distribute or otherwise reproduce, in any format,
                any of the content or copies of the content supplied to you or which appears
                on this Website nor you may use any such content in connection with any
                business or commercial enterprise.
              </p>
            </Section>

            <Section title="Disclaimer of Liability">
              <p>
                (a) Subject to any non-excludable consumer guarantees and other consumer
                protection provisions set out in the Australian Consumer Law, the material
                displayed on this Website is provided without any guarantees, conditions or
                warranties as to its accuracy.
              </p>
              <p className="mt-4">
                (b) To the fullest extent permitted by law Website Owner hereby expressly
                excludes all warranties and other terms which might otherwise be implied by
                statute, common law or the law of equity and must not be liable for any
                damages whatsoever, including but without limitation to any direct,
                indirect, special, consequential, punitive or incidental damages, or
                damages for loss of use, profits, data or other intangibles, damage to
                goodwill or reputation, or the cost of procurement of substitute goods and
                services, arising out of or related to the use, inability to use,
                performance or failures of this Website or the Linked Sites and any
                materials posted on those sites, irrespective of whether such damages were
                foreseeable or arise in contract, tort, equity, restitution, by statute, at
                common law or otherwise.
              </p>
              <p className="mt-4">
                (c) This does not affect Website Owner’s liability for death or personal
                injury arising from its negligence, fraudulent misrepresentation,
                misrepresentation as to a fundamental matter or any other liability which
                cannot be excluded or limited under applicable law.
              </p>
            </Section>

            <Section title="Linking to this Website">
              <p>
                You may link to our home page, provided you do so in a way that is fair and
                legal and does not damage our reputation or take advantage of it, but you
                must not establish a link in such a way as to suggest any form of
                association, approval or endorsement on our part where none exists.
                You must not establish a link from any Website that is not owned by you.
                This Website must not be framed on any other site, nor you may create a
                link to any part of this Website other than the home page. We reserve the
                right to withdraw linking permission without notice.
              </p>
            </Section>

            <Section title="Disclaimer as to Ownership of Trade Marks, Images of Personalities and Third Party Copyright">
              <p>
                Except where expressly stated to the contrary all persons (including their
                names and images), third party trade marks and content, services and/or
                locations featured on this Website are in no way associated, linked or
                affiliated with Website Owner and you should not rely on the existence of
                such a connection or affiliation. Any trade marks/names featured on this
                Website are owned by the respective trade mark owners. Where a trade mark
                or brand name is referred to it is used solely to describe or identify the
                products and services and is in no way an assertion that such products or
                services are endorsed by or connected to Website Owner.
              </p>
            </Section>

            <Section title="Indemnity">
              <p>
                You agree to indemnify, defend and hold harmless Website Owner, its
                directors, officers, employees, consultants, agents, and affiliates, from
                any and all third party claims, liability, damages or costs (including, but
                not limited to, legal fees) arising from your use of this Website or your
                breach of the Terms of Use.
              </p>
            </Section>

            <Section title="Variation">
              <p>
                Website Owner must have the right in its absolute discretion at any time
                and without notice to amend, remove or vary the Services or any page of
                this Website.
              </p>
            </Section>

            <Section title="Invalidity">
              <p>
                If any part of the Terms of Use is unenforceable (including any provision
                in which we exclude our liability to you) the enforceability of any other
                part of the Terms of Use will not be affected and all other clauses remain
                in full force and effect. So far as possible where any clause/sub-clause or
                part of a clause/sub-clause can be severed to render the remaining part
                valid, the clause must be interpreted accordingly. Alternatively, you
                agree that the clause must be rectified and interpreted in such a way that
                closely resembles the original meaning of the clause/sub-clause as is
                permitted by law.
              </p>
            </Section>

            <Section title="Complaints">
              <p>
                We operate a complaints handling procedure which we will use to try to
                resolve disputes when they first arise, please let us know if you have
                any complaints or comments.
              </p>
            </Section>

          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

function Section({ title, children }) {
  return (
    <section className="group relative overflow-hidden rounded-[24px] border border-[#e0d4e7] bg-white p-6 shadow-[0_15px_40px_-15px_rgba(118,35,158,0.1)] transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(118,35,158,0.2)] sm:p-8">
      {/* Left Accent Bar */}
      <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full bg-gradient-to-b from-[#9747FF] to-[#FC18D8] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
      
      <h2 className="mb-4 text-xl font-extrabold tracking-tight text-[#211628] sm:text-2xl">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-7 text-[#6f6278]">
        {children}
      </div>
    </section>
  );
}