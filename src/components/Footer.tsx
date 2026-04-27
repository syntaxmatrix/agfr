import Link from "next/link";
import { ProductName, supportEmail } from "@/constant";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-slate-900">{ProductName}</p>
          <p>AI-powered assistance.</p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-4">
          <Link href="/privacy" className="hover:text-slate-900">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-slate-900">
            Terms of Service
          </Link>
          <Link href={`mailto:${supportEmail}`} className="hover:text-slate-900">
            {supportEmail}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
