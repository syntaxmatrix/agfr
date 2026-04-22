import React from "react";
import { supportEmail, ProductName } from "@/constant";
import Link from "next/link";

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

      <p className="mb-4 text-sm text-gray-500">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <p className="mb-6">
        Welcome to <strong>{ProductName} - syntx.in</strong>. By accessing or
        using our platform, you agree to be bound by these Terms and Conditions.
        If you do not agree with any part of these terms, please do not use our
        services.
      </p>

      {/* 1 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of Services</h2>
      <p className="mb-4">
        You agree to use {ProductName} - syntx.in only for lawful purposes and in
        a way that does not infringe the rights of others or restrict their use
        of the platform.
      </p>

      {/* 2 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">2. User Accounts</h2>
      <p className="mb-4">
        You may be required to create an account to access certain features. You
        are responsible for maintaining the confidentiality of your account and
        all activities under it.
      </p>

      {/* 3 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. AI Services & Outputs
      </h2>
      <p className="mb-4">
        {ProductName} provides AI-powered agents that generate responses or
        perform automated actions based on user input.
      </p>

      <p className="mb-4">
        AI-generated outputs may be inaccurate, incomplete, or unsuitable for
        specific purposes. You are responsible for reviewing and verifying all
        outputs before relying on them.
      </p>

      {/* 4 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        4. Agent Actions & Responsibility
      </h2>
      <p className="mb-4">
        Any actions performed by AI agents are based on your instructions.
        {ProductName} does not guarantee correctness, safety, or outcomes of such
        actions.
      </p>

      <p className="mb-4">
        You agree that you are solely responsible for the consequences of using
        AI-generated outputs or automated actions.
      </p>

      {/* 5 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        5. Sensitive Information
      </h2>
      <p className="mb-4">
        You must not submit confidential, sensitive, or personal data (including
        passwords, financial details, or private credentials) into the platform.
      </p>

      {/* 6 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        6. Third-Party Services
      </h2>
      <p className="mb-4">
        Our platform may use third-party services, including AI providers such as
        Google Gemini. Your use of the service may be subject to their respective
        terms and policies.
      </p>

      {/* 7 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        7. Intellectual Property
      </h2>
      <p className="mb-4">
        All content, trademarks, and data on syntx.in are the property of the
        platform or its licensors. You may not reproduce, distribute, or exploit
        any content without permission.
      </p>

      {/* 8 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        8. Prohibited Activities
      </h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Unauthorized access to the platform</li>
        <li>Spreading malware or harmful code</li>
        <li>Using the platform for illegal or harmful purposes</li>
        <li>Attempting to exploit or misuse AI systems</li>
      </ul>

      {/* 9 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        9. Limitation of Liability
      </h2>
      <p className="mb-4">
        {ProductName} - syntx.in is not liable for any indirect, incidental, or
        consequential damages arising from the use of our services, including
        reliance on AI-generated outputs.
      </p>

      {/* 10 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        10. Termination
      </h2>
      <p className="mb-4">
        We reserve the right to suspend or terminate your access at any time
        without prior notice if you violate these terms.
      </p>

      {/* 11 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        11. Changes to Terms
      </h2>
      <p className="mb-4">
        We may update these Terms from time to time. Continued use of the
        platform means you accept the revised terms.
      </p>

      {/* 12 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        12. Contact Information
      </h2>
      <p className="mb-4">
        If you have any questions about these Terms, please contact us:
        <br />
        <br />
        <strong>Email : </strong>
        <Link href={`mailto:${supportEmail}`}>{supportEmail}</Link>
      </p>

      <p className="mt-8 text-sm text-gray-500">
        © {new Date().getFullYear()} {ProductName} - syntx.in All rights
        reserved.
      </p>
    </div>
  );
};

export default TermsAndConditions;