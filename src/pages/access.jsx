import React from "react";
import PublicLayout from "@/components/layout/PublicLayout";

export default function TermsOfAccess() {
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
              Terms of Access
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#6f6278]">
              This website is owned and operated by{" "}
              <span className="font-bold text-[#76239e]">
                The Property Portfolio Podcast ACN 687 075 565
              </span>
              . By accessing or using this Website, you agree to the following Terms of Access.
            </p>
          </div>

          {/* Sections Container */}
          <div className="space-y-5">
            
            <Section title="Acceptance of Terms">
              <p>
                The Website is available for you to access or upload material
                conditional on your acceptance of these Terms of Access without
                alteration. Continued use of this Website constitutes acceptance
                of these terms.
              </p>
            </Section>

            <Section title="Use of Material on the Website">
              <ul className="space-y-3 pl-1">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#9747FF] to-[#FC18D8]"></span>
                  <span>Reproduction or distribution of material in any form is prohibited</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#9747FF] to-[#FC18D8]"></span>
                  <span>Re-transmission, uploading, reposting, or framing is prohibited</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#9747FF] to-[#FC18D8]"></span>
                  <span>Modifying the Website layout, software, or code is prohibited</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#9747FF] to-[#FC18D8]"></span>
                  <span>All intellectual property rights are reserved</span>
                </li>
              </ul>
              <p className="mt-4">
                You may download material strictly for personal, non-commercial use
                provided copyright and trademark notices are not removed.
              </p>
            </Section>

            <Section title="Links to Other Websites">
              <p>
                This Website may contain links to third-party websites not controlled
                by us. These links are provided for convenience only and do not imply
                endorsement. We are not responsible for the content of linked sites.
              </p>
            </Section>

            <Section title="Disclaimer">
              <p>
                We provide this Website without assuming any duty of care. The
                information provided is not professional advice and is supplied
                without warranties of accuracy, reliability, or completeness.
              </p>
              <p className="mt-4">
                To the fullest extent permitted by law, we disclaim all warranties,
                express or implied, including merchantability and fitness for a
                particular purpose.
              </p>
            </Section>

            <Section title="Limitation of Liability">
              <p>
                Where liability cannot be excluded by law, our liability is limited,
                at our discretion, to resupplying services or replacing goods or
                covering the cost of replacement or repair.
              </p>
            </Section>

            <Section title="Use of Personal Information">
              <p>
                We may collect personal information you provide during Website use,
                including through cookies and usage analytics. All personal data is
                handled in compliance with Australian privacy law.
              </p>
            </Section>

            <Section title="Termination of Access">
              <p>
                We may terminate access to the Website at any time without notice and
                without liability for any resulting loss or damage.
              </p>
            </Section>

            <Section title="Alteration of Terms">
              <p>
                We reserve the right to amend these Terms of Access at any time,
                without notice or explanation.
              </p>
            </Section>

            <Section title="Intellectual Property Rights">
              <p>
                All logos, content, and branding on this Website are protected by
                intellectual property laws. Unauthorized use may result in civil or
                criminal penalties.
              </p>
            </Section>

            <Section title="Relevant Jurisdiction">
              <p>
                These Terms are governed by the laws of New South Wales, Australia.
                You agree to the exclusive jurisdiction of the courts of New South
                Wales for any disputes.
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