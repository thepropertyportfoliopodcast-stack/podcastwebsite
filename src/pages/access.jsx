import React from "react";
import Layout from "@/layout/Layout";

export default function TermsOfAccess() {
  return (
    <Layout>
    <div className="mt-16 bg-gray-950 text-gray-300">
      <div className="max-w-[1310px] mx-auto px-6 py-12">
        {/* Header */}
        <h1 className="text-3xl font-semibold text-white mb-6">
          Terms of Access
        </h1>

        <p className="text-sm text-gray-400 mb-10">
          This website is owned and operated by{" "}
          <span className="text-gray-200 font-medium">
            The Property Portfolio Podcast ACN 687 075 565
          </span>
          . By accessing or using this Website, you agree to the following Terms of Access.
        </p>

        {/* Section */}
        <Section title="Acceptance of Terms">
          <p>
            The Website is available for you to access or upload material
            conditional on your acceptance of these Terms of Access without
            alteration. Continued use of this Website constitutes acceptance
            of these terms.
          </p>
        </Section>

        <Section title="Use of Material on the Website">
          <ul className="list-disc pl-5 space-y-2">
            <li>Reproduction or distribution of material in any form is prohibited</li>
            <li>Re-transmission, uploading, reposting, or framing is prohibited</li>
            <li>Modifying the Website layout, software, or code is prohibited</li>
            <li>All intellectual property rights are reserved</li>
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
    </Layout>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-medium text-gray-100 mb-3">
        {title}
      </h2>
      <div className="space-y-3 text-gray-400 text-sm leading-relaxed">
        {children}
      </div>
    </section>
  );
}

