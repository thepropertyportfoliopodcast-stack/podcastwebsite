import Layout from "@/layout/Layout";
import React, { useEffect, useState } from "react";

export default function Privacy() {
  return (
      <Layout>
        <main className="mt-16 min-h-screen bg-zinc-950 text-zinc-300">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <header className="mb-12">
              <h1 className="text-3xl font-bold text-white mb-4">
                Privacy Policy
              </h1>
            </header>

            <div className="space-y-10 text-[15px] leading-relaxed">
              <section>
                <h2 className="text-lg font-semibold text-white mb-2">
                  What is Personal Information
                </h2>
                <p className="mb-4">
                  (a) The Privacy Act 1988 (Cth) currently defines “personal
                  information” as meaning information or an opinion about an
                  identified individual or an individual who is reasonably
                  identifiable:
                </p>
                <p className="ml-4">
                  (i) whether the information or opinion is true or not;
                </p>
                <p className="ml-4 mb-4">
                  (ii) whether the information or opinion is recorded in a
                  material form or not.
                </p>
                <p>
                  (b) If information does not disclose your identity or enable
                  your identity to be ascertained, it will in most cases not be
                  classified as “personal information” and will not be subject
                  to this privacy policy.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-2">
                  What Information do we Collect
                </h2>
                <p className="mb-4">
                  The kind of personal information that we collect from you will
                  depend on how you use the website. The personal information
                  which we collect and hold about you may include but is not
                  limited to:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>a. Names</li>
                  <li>b. Email address</li>
                  <li>c. Username</li>
                  <li>d. Password</li>
                  <li>e. Credit card details</li>
                  <li>f. IDs and/or</li>
                  <li>g. Location information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-2">
                  How we Collect your Personal Information
                </h2>
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
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-2">
                  Purpose of Collection
                </h2>
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
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-2">
                  Access and Correction
                </h2>
                <p>
                  Australian Privacy Principle 12 permits you to obtain access
                  to the personal information we hold about you in certain
                  circumstances, and Australian Privacy Principle 13 allows you
                  to correct inaccurate personal information subject to certain
                  exceptions. If you would like to obtain such access, please
                  contact us as set out below.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-2">
                  Complaint Procedure
                </h2>
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
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-2">
                  Overseas Transfer
                </h2>
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
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-2">GDPR</h2>
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
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-2">
                  How to Contact us about Privacy
                </h2>
                <p>
                  If you have any queries, or if you seek access to your
                  personal information, or if you have a complaint about our
                  privacy practices, you can contact us on: 1300-438-562.
                </p>
              </section>
            </div>
          </div>
        </main>
      </Layout>
  );
}