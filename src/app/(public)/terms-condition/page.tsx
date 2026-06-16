// app/terms/page.tsx (Next.js App Router)

export default function TermsAndConditionsPage() {
  const lastUpdated = "June 16, 2026";

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-4">Terms & Conditions</h1>
      <p className="text-gray-600 mb-8">
        Last Updated: {lastUpdated}
      </p>

      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p>
            Welcome to Jomnus ("Platform", "we", "our", or "us"). By
            accessing or using the Jomnus website, mobile application, or
            related services, you agree to be bound by these Terms &
            Conditions. If you do not agree to these terms, you must not use
            the Platform.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">2. Eligibility</h2>
          <p>
            You must be at least 18 years old or have legal parental or
            guardian consent to use the Platform. By registering an account,
            you represent that all information provided is accurate and
            complete.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You are responsible for all activities conducted through your account.</li>
            <li>You must notify us immediately of any unauthorized use of your account.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">4. Platform Services</h2>
          <p>
            Jomnus provides digital services, content, tools, and features
            designed to facilitate interactions between users and the Platform.
            We may modify, update, suspend, or discontinue any part of the
            Platform at any time without prior notice.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">5. User Conduct</h2>
          <p>Users agree not to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Violate any applicable laws or regulations.</li>
            <li>Upload harmful, fraudulent, defamatory, or illegal content.</li>
            <li>Attempt to gain unauthorized access to the Platform.</li>
            <li>Distribute malware, viruses, or harmful code.</li>
            <li>Interfere with the operation or security of the Platform.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">6. Intellectual Property</h2>
          <p>
            All content, trademarks, logos, software, designs, and materials
            available on the Platform are owned by Jomnus or its licensors and
            are protected by applicable intellectual property laws. Users may
            not reproduce, distribute, or modify any Platform content without
            prior written consent.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">7. User Content</h2>
          <p>
            By submitting content to the Platform, you grant Jomnus a
            non-exclusive, worldwide, royalty-free license to use, reproduce,
            modify, and display such content for the purpose of operating and
            improving the Platform.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">8. Payments and Fees</h2>
          <p>
            Certain services may require payment. By making a purchase, you
            agree to provide accurate billing information and authorize us to
            charge the applicable fees. All fees are non-refundable unless
            otherwise stated by law or our refund policy.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">9. Privacy</h2>
          <p>
            Your use of the Platform is also governed by our Privacy Policy,
            which explains how we collect, use, and protect your personal
            information.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">10. Disclaimer of Warranties</h2>
          <p>
            The Platform is provided on an "as is" and "as available" basis.
            We make no warranties, express or implied, regarding the
            availability, reliability, accuracy, or suitability of the
            Platform.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">11. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Jomnus shall not be liable
            for any indirect, incidental, special, consequential, or punitive
            damages arising out of or related to your use of the Platform.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">12. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Jomnus, its affiliates,
            employees, and partners from any claims, damages, liabilities, and
            expenses resulting from your use of the Platform or violation of
            these Terms.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">13. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your access to the
            Platform at any time, with or without notice, if we believe you
            have violated these Terms.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">14. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with
            the laws of the applicable jurisdiction where Jomnus operates,
            without regard to conflict of law principles.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">15. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the
            Platform after changes become effective constitutes acceptance of
            the revised Terms.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-3">16. Contact Information</h2>
          <p>
            If you have any questions regarding these Terms & Conditions,
            please contact us:
          </p>

          <div className="mt-3">
            <p>Email: legal@jomnus.com</p>
            <p>Website: https://www.jomnus.com</p>
          </div>
        </div>
      </section>
    </main>
  );
}