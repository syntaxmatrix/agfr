import Link from "next/link";
import Footer from "@/components/Footer";
import { ProductName, supportEmail } from "@/constant";

export const metadata = {
  title: `Terms of Service | ${ProductName}`,
  description: `Terms of service for users of ${ProductName}.`,
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-4xl px-6 py-16 sm:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.35)] md:p-10">
          <p className="text-sm font-medium text-slate-500">Last updated: April 22, 2026</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Terms of Service</h1>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-slate-950">Use of the service</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              {ProductName} provides an AI-powered assistant that helps users send emails and perform tasks using natural language. Users must use the service lawfully and only with accounts and data they are authorized to access.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-slate-950">Accounts and user responsibility</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Users are responsible for maintaining the security of their account, reviewing actions before relying on them, and ensuring that any emails or tasks performed through the app are appropriate and authorized.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-slate-950">Liability disclaimer</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              The service is provided on an as-is basis. To the fullest extent permitted by law, {ProductName} disclaims liability for indirect, incidental, special, consequential, or exemplary damages arising from use of the app, Gmail integrations, AI-generated suggestions, or user-submitted instructions.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-slate-950">Changes and contact</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              We may update these terms from time to time. Questions about these terms can be sent to{" "}
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
