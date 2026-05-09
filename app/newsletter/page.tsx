import type { Metadata } from "next";
import NewsletterForm from "./NewsletterForm";

export const metadata: Metadata = {
  title: "Newsletter – UK Stats",
  description:
    "Subscribe to the UK Stats monthly newsletter — a concise round-up of the key UK statistics that changed each month.",
};

export default function NewsletterPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      {/* Header band */}
      <div className="rounded-2xl bg-slate-950 px-8 py-10">
        <span className="inline-flex items-center rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300 ring-1 ring-slate-700">
          Monthly newsletter
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
          Stay up to date with the numbers
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-400">
          Once a month, we round up the key UK statistics that changed — no
          filler, no spin. Unsubscribe any time.
        </p>
      </div>

      {/* Form */}
      <div className="mt-8">
        <NewsletterForm />
      </div>
    </main>
  );
}
