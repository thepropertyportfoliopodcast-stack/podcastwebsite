import PublicLayout from "@/components/layout/PublicLayout";
import React from "react";

export default function Privacy() {
  return (
    <PublicLayout>
      <div className="relative isolate overflow-hidden pt-[120px] pb-24">
        
        {/* Ambient Light Theme Background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#f3e8ff] opacity-70 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#fce7f3] opacity-70 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute inset-0 bg-[radial-gradient(#e0d4e7_1px,transparent_1px)] [background-size:24px_24px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"></div>
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center sm:text-left">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#e0d4e7] bg-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#76239e] shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#9747FF] animate-pulse"></span>
              Legal Documents
            </span>
            <h1 className="text-4xl font-black tracking-tight text-[#211628] sm:text-5xl">
              Privacy Policy
            </h1>
          </div>

          <div className="space-y-5 text-sm leading-7 text-[#6f6278]">
            
            <Section title="What is Personal Information">
              <p className="mb-4">
                (a) The Privacy Act 1988 (Cth) currently defines “personal
                information” as meaning information or an opinion about an
                identified individual or an individual who is reasonably
                identifiable:
              </p>
              <div className="ml-4 space-y-2 mb-4">
                <p className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#9747FF] to-[#FC18D8]"></span>
                  <span>(i) whether the information or opinion is true or not;</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#9747FF] to-[#FC18D8]"></span>
                  <span>(ii) whether the information or opinion is recorded in a material form or not.</span>
                </p>
              </div>
              <p>
                (b) If information does not disclose your identity or enable
                your identity to be ascertained, it will in most cases not be
                classified as “personal information” and will not be subject
                to this privacy policy.
              </p>
            </Section>

            <Section title="What Information do we Collect">
              <p className="mb-4">
                The kind of personal information that we collect from you will
                depend on how you use the website. The personal information
                which we collect and hold about you may include but is not
                limited to:
              </p>
              <ul className="space-y-2 pl-1">
                {["Names", "Email address", "Username", "Password", "Credit card details", "IDs and/or", "Location information"].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#9747FF] to-[#FC18D8]"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="How we Collect your Personal Information">
              <p className="mb-4">
                (a) We may collect personal information from you whenever you
                input such information into the website.
              </p>
              <p>
                (b) We also collect cookies from your computer which enable us
                to tell when you use the website and also to help customize
                your website experience. As a general rule, however, it is not
                possible to identify you personally from our use of cookies.
              </p>
            </Section>

            <Section title="Purpose of Collection">
              <p className="mb-4">
                (a) The purpose for which we collect personal information is
                to provide you with the best service experience possible on
                the website.
              </p>
              <p className="mb-4">
                (b) We customarily disclose personal information only to our
                service providers who assist us in operating the website. Your
                personal information may also be exposed from time to time to
                maintenance and support personnel acting in the normal course
                of their duties.
              </p>
              <p>
                (c) By using our website, you consent to the receipt of direct
                marketing material. We will only use your personal information
                for this purpose if we have collected such information direct
                from you, and if it is material of a type which you would
                reasonably expect to receive from user. We do not use
                sensitive personal information in direct marketing activity.
                Our direct marketing material will include a simple means by
                which you can request not to receive further communications of
                this nature.
              </p>
            </Section>

            <Section title="Access and Correction">
              <p>
                Australian Privacy Principle 12 permits you to obtain access
                to the personal information we hold about you in certain
                circumstances, and Australian Privacy Principle 13 allows you
                to correct inaccurate personal information subject to certain
                exceptions. If you would like to obtain such access, please
                contact us as set out below.
              </p>
            </Section>

            <Section title="Complaint Procedure">
              <p>
                If you have a complaint concerning the manner in which we
                maintain the privacy of your personal information, please
                contact us as set out below. All complaints will be considered
                by our privacy officer and we may seek further information
                from you to clarify your concerns. If we agree that your
                complaint is well founded, we will, in consultation with you,
                take appropriate steps to rectify the problem. If you remain
                dissatisfied with the outcome, you may refer the matter to the
                Office of the Australian Information Commissioner.
              </p>
            </Section>

            <Section title="Overseas Transfer">
              <p>
                Your personal information may be transferred overseas or
                stored overseas for a variety of reasons. It is not possible
                to identify each and every country to which your personal
                information may be sent. If your personal information is sent
                to a recipient in a country with data protection laws which
                are at least substantially similar to the Australian Privacy
                Principles, and where there are mechanisms available to you to
                enforce protection of your personal information under that
                overseas law, we will not be liable for a breach of the
                Australian Privacy Principles if your personal information is
                mishandled in that jurisdiction. If your personal information
                is transferred to a jurisdiction which does not have data
                protection laws as comprehensive as Australia’s, we will take
                reasonable steps to secure a contractual commitment from the
                recipient to handle your information in accordance with the
                Australian Privacy Principles.
              </p>
            </Section>

            <Section title="GDPR">
              <p>
                In some circumstances, the European Union General Data
                Protection Regulation (GDPR) provides additional protection to
                individuals located in Europe. The fact that you may be
                located in Europe does not, however, on its own entitle you to
                protection under the GDPR. Our website does not specifically
                target customers located in the European Union and we do not
                monitor the behavior of individuals in the European Union, and
                accordingly the GDPR does not apply.
              </p>
            </Section>

            <Section title="How to Contact us about Privacy">
              <p>
                If you have any queries, or if you seek access to your
                personal information, or if you have a complaint about our
                privacy practices, you can contact us on:{" "}
                <span className="font-bold text-[#76239e]">1300-438-562</span>.
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