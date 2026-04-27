import Link from "next/link";
import Footer from "@/components/Footer";
import { ProductName, supportEmail } from "@/constant";

export const metadata = {
  title: `Privacy Policy | ${ProductName}`,
  description: `Privacy policy for ${ProductName} and its Gmail integration.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-4xl px-6 py-16 sm:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] md:p-10">
          <p className="text-sm font-medium text-slate-500">Last updated: April 22, 2026</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Privacy Policy</h1>
          <p className="mt-6 text-base leading-8 text-slate-600">
            This Privacy Policy explains how {ProductName} collects, uses, stores, and protects information when users access the app and connect Google services.
          </p>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-slate-950">What data we collect</h2>
            <ul className="mt-4 list-disc space-y-3 pl-6 text-slate-600">
              <li>Google account email address used to identify the connected account.</li>
              <li>Google OAuth access and refresh tokens needed to maintain the authorized Gmail connection.</li>
              <li>Basic account data required to operate the app securely and provide support.</li>
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-slate-950">Why we use this data</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              We use connected Google account data only to let users send emails from their own Gmail account through Syntx AI and to support related account functionality inside the app.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-slate-950">How data is stored and protected</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Google account email information and OAuth tokens are stored securely, access is limited to what is necessary to operate the service, and the data is not shared except when required to provide the requested functionality or comply with law.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-600">
              We do not sell or share Google user data with third parties.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-slate-950">Google API compliance</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              This app complies with Google API Services User Data Policy.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-slate-950">Contact</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Questions about this policy can be sent to{" "}
              <Link href={`mailto:${supportEmail}`} className="font-medium text-slate-900 underline underline-offset-4">
                {supportEmail}
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
