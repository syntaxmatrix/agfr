import React from "react";
import{supportEmail,ProductName} from "@/constant"
import Link from "next/link";


const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4 text-sm text-gray-500">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <p className="mb-6">
        Welcome to <strong>{ ProductName } - syntx.in</strong>. This Privacy Policy explains how we
        collect, use, and protect your information when you use our AI-powered
        agent platform.
      </p>

      {/* 1 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Information We Collect
      </h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Account information (name, email, login credentials)</li>
        <li>User inputs, prompts, and interactions with AI agents</li>
        <li>Usage data (features used, session activity)</li>
        <li>Device and technical data (IP address, browser type)</li>
      </ul>
{/* 1 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Information We Collect
      </h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Account information (name, email, login credentials)</li>
        <li>User inputs and interactions with AI agents</li>
        <li>Usage data (features used, session activity)</li>
        <li>Device and technical data (IP address, browser type)</li>
      </ul>

      {/* 2 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. AI Processing & User Inputs
      </h2>
      <p className="mb-4">
        Your inputs (such as prompts, commands, or uploaded content) are processed
        by AI systems to generate responses or automate tasks.
      </p>

      <p className="mb-4">
        <strong>Prompt Storage:</strong> We currently do <strong>not store</strong> your prompts
        or AI interactions permanently. However, we may introduce limited storage
        in the future to improve performance, debugging, or user experience. Any
        such change will be reflected in this Privacy Policy.
      </p>

      <p className="mb-4">
        <strong>Sensitive Information Warning:</strong> You should not submit
        confidential, personal, or sensitive information (such as passwords,
        financial data, or private credentials) into the platform.
      </p>

      {/* 3 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. How We Use Your Data
      </h2>
      <ul className="list-disc pl-6 mb-4">
        <li>To provide and operate AI agent services</li>
        <li>To improve system performance and reliability</li>
        <li>To detect abuse, fraud, or security issues</li>
        <li>To communicate updates or support</li>
      </ul>

      {/* 4 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        4. Third-Party Services
      </h2>
      <p className="mb-4">
        We may use third-party services for AI processing, analytics, and
        infrastructure.
      </p>

      <p className="mb-4">
        Our platform may use AI models provided by <strong>Google Gemini</strong>.
        Your inputs may be processed by these systems in accordance with their
        respective privacy policies.
      </p>

      {/* 5 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        5. Automation & Agent Responsibility
      </h2>
      <p className="mb-4">
        syntx.in provides AI agents that can generate outputs or perform
        automated actions based on user instructions. You are responsible for
        reviewing and verifying any outputs or actions taken by the system.
      </p>

      <p className="mb-4">
        We are not liable for decisions made or actions taken based on AI-generated
        outputs.
      </p>

      {/* 6 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        6. Data Storage & Retention
      </h2>
      <p className="mb-4">
        We retain data only as long as necessary to provide services, comply with
        legal obligations, and maintain platform security.
      </p>

      {/* 7 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        7. Data Security
      </h2>
      <p className="mb-4">
        We implement reasonable security measures to protect your data. However,
        no method of transmission or storage is completely secure.
      </p>

      {/* 8 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        8. Your Rights
      </h2>
      <p className="mb-4">
        You may request access, correction, or deletion of your personal data by
        contacting us.
      </p>

      {/* 9 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        9. Legal Compliance
      </h2>
      <p className="mb-4">
        We aim to comply with applicable data protection laws, including India’s
        Digital Personal Data Protection Act (DPDP Act), where applicable.
      </p>

      {/* 10 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        10. Changes to This Policy
      </h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. Continued use of the
        platform indicates acceptance of the updated policy.
      </p>

      {/* 10 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        10. Contact Us
      </h2>
      <p className="mb-4">
        If you have any questions about this Privacy Policy:
        <br />
        <br />
        <strong>Email : </strong><Link href={`mailto:${supportEmail}`}>{ supportEmail }</Link>
      </p>

      <p className="mt-8 text-sm text-gray-500">
        © {new Date().getFullYear()} { ProductName } - syntx.in. All rights reserved.
      </p>
    </div>
  );
};

export default PrivacyPolicy;

