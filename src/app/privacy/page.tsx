import Link from "next/link";
import Footer from "@/components/Footer";
import { ProductName, supportEmail , grievanceEmail ,googleDeveloperAPI_UserDataPolicy} from "@/constant";

export const metadata = {
  title: `Privacy Policy | ${ProductName}`,
  description: `Privacy policy for ${ProductName} and its Gmail integration.`,
};

export default function PrivacyPolicy() {
  
  const grievanceOfficer = {
    name: "Grievance Officer", 
    email: grievanceEmail,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto w-full max-w-4xl px-6 py-16 sm:px-8">
        <div className="rounded-4xl border border-slate-200 bg-white/90 p-8 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] md:p-10">
          <p className="text-sm font-medium text-slate-500">Last updated: May 3, 2026</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Privacy Policy</h1>
          
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-slate-950">1. Introduction</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              This Privacy Policy explains how {ProductName} collects, uses, stores, and protects information when users access the app and connect Google services.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-slate-950">2. What data we collect</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">We collect:</p>
            <ul className="mt-4 list-disc space-y-3 pl-6 text-slate-600">
              <li><strong>Google account email address</strong> (to identify the connected account).</li>
              <li><strong>Google OAuth access and refresh tokens</strong> (to maintain the authorized Gmail connection).</li>
              <li><strong>Basic account data</strong> (required to operate the app securely and provide support).</li>
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-slate-950">3. Why we use this data</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              We use connected Google account data only to let users send emails from their own Gmail account through {ProductName} and to support related account functionality inside the app. We do not use this data for advertising or sell it to third parties.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-slate-950">4. Data Protection</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              We protect Google user data using industry-standard security measures. All data in transit is encrypted using TLS, and data at rest is stored using secure, encrypted databases. Access to user data is strictly limited to authorized personnel and automated systems necessary to perform the service, and we employ rigorous access control policies to prevent unauthorized access.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-slate-950">5. Data Retention and Deletion</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              We retain Google user data (such as email addresses and OAuth tokens) only as long as is necessary to provide the features of {ProductName}. Users may revoke our access to their Google account at any time via their Google Account security settings. To request the permanent deletion of any data we have collected, users may contact us at <Link href={`mailto:${supportEmail}`} className="font-medium text-slate-900 underline underline-offset-4">{supportEmail}</Link>, and we will process such requests within 30 days.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-slate-950">6. User Rights & Indian Law Compliance</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              In compliance with the Digital Personal Data Protection Act, 2023 (DPDPA) and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 of India, users have the right to:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-6 text-slate-600">
              <li><strong>Access and Correction:</strong> Request a summary of the personal data we process and request corrections to any inaccurate data.</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing at any time (which may result in the termination of related services).</li>
              <li><strong>Erasure:</strong> Request the deletion of personal data when it is no longer necessary for the purpose it was collected.</li>
              <li><strong>Nomination:</strong> Nominate an individual to exercise these rights in the event of death or incapacity.</li>
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-slate-950">7. Google API Compliance</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              This app complies with the <Link href= {googleDeveloperAPI_UserDataPolicy} target="_blank" rel="noopener noreferrer" className="font-medium text-slate-900 underline underline-offset-4">Google API Services User Data Policy</Link>, including the Limited Use requirements.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-slate-950">8. Contact & Grievance Officer</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Questions about this policy can be sent to{" "}
              <Link href={`mailto:${supportEmail}`} className="font-medium text-slate-900 underline underline-offset-4">
                {supportEmail}
              </Link>.
            </p>
            <div className="mt-6 rounded-2xl bg-slate-100 p-6">
              <p className="text-sm font-semibold text-slate-900">Grievance Officer (India)</p>
              <p className="mt-2 text-sm text-slate-600">
                In accordance with Indian laws, the contact details of the Grievance Officer are provided below to address any discrepancies or grievances regarding your data:
              </p>
              <p className="mt-4 text-sm text-slate-900">
                <strong>Name:</strong> {grievanceOfficer.name}<br />
                <strong>Email:</strong> <Link href={`mailto:${grievanceOfficer.email}`} className="underline hover:text-slate-700">{grievanceOfficer.email}</Link>
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}