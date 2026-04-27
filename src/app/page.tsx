import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Mail, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ProductName } from "@/constant";

const features = [
  {
    title: "Natural language email help",
    description:
      "Write and send email instructions in plain language so Syntx AI can help users act faster.",
    icon: Sparkles,
  },
  {
    title: "Secure Gmail connection",
    description:
      "Users can securely connect their Gmail account to send emails directly from the app.",
    icon: Mail,
  },
  {
    title: "Clear, user-controlled actions",
    description:
      "The app is designed to help users perform tasks intentionally with a transparent sign-in and consent flow.",
    icon: ShieldCheck,
  },
];

export const metadata = {
  title: `${ProductName} | AI Assistant`,
  description:
    "Syntx AI is an AI-powered assistant that helps users send emails and perform tasks using natural language.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen text-slate-900">
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.16),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_30%)]" />
          <div className="relative mx-auto flex min-h-[calc(100vh-96px)] w-full max-w-7xl flex-col justify-center px-6 py-20 sm:px-8 lg:px-10">
            <div className="rounded-[2.25rem] border border-white/70 bg-white/85 px-8 py-10 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur md:px-12 md:py-14">
              <div className="flex flex-col items-center gap-10 lg:flex-row lg:justify-between lg:gap-16">
                <div className="w-full max-w-2xl text-center lg:text-left">
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
                    <Sparkles className="size-4 text-sky-600" />
                    Beta v0.2
                  </div>

                  <h1 className="max-w-2xl font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                    {ProductName}
                  </h1>
                  <p className="mt-2 text-3xl font-display font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    Ready to Achieve Great Things?
                  </p>

                  <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-700">
                    Syntx AI is an AI-powered assistant that helps users send emails and perform tasks using natural language.
                  </p>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                    Users can securely connect their Gmail account to send emails directly from the app.
                  </p>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                    The app purpose is simple: help users describe what they want to do, then let Syntx AI assist with email and workflow actions inside a clear, consent-based interface.
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:justify-start">
                    <Button asChild size="lg" className="rounded-full bg-slate-950 px-7 text-white hover:bg-slate-800">
                      <a href="/register">Start</a>
                    </Button>
                    <Button asChild size="lg" className="rounded-full bg-slate-950 px-7 text-white hover:bg-slate-800">
                      <a href="/login">Login</a>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-full border-slate-300 px-7">
                      <Link href="/privacy">Review Privacy Policy</Link>
                    </Button>
                  </div>
                </div>

                <div className="flex w-full max-w-[520px] justify-center lg:justify-end">
                  <div className="relative h-[260px] w-[260px] sm:h-[320px] sm:w-[320px] lg:h-[420px] lg:w-[420px]">
                    <div className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(135deg,rgba(226,232,240,0.95),rgba(207,250,254,0.9))] shadow-[0_30px_80px_-45px_rgba(15,23,42,0.45)]" />
                    <Image
                      src="/robot.png"
                      alt="Syntx AI assistant robot"
                      fill
                      priority
                      className="object-contain p-6"
                    />
                    <div className="absolute right-3 top-7 rounded-[1.5rem] rounded-tr-md bg-white px-5 py-4 text-base font-semibold text-slate-700 shadow-lg sm:right-0 sm:top-8 sm:px-6">
                      How can I help you?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-20 sm:px-8 lg:px-10">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.35)]"
              >
                <feature.icon className="mb-4 size-10 rounded-2xl bg-slate-100 p-2 text-slate-900" />
                <h2 className="text-xl font-semibold text-slate-950">{feature.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
