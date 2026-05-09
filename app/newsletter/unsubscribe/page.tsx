import type { Metadata } from "next";
import UnsubscribeForm from "./UnsubscribeForm";

export const metadata: Metadata = {
  title: "Unsubscribe – UK Stats Newsletter",
  description: "Unsubscribe from the UK Stats monthly newsletter.",
  robots: { index: false },
};

export default function UnsubscribePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="rounded-2xl bg-slate-950 px-8 py-10">
        <span className="inline-flex items-center rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300 ring-1 ring-slate-700">
          Monthly newsletter
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
          Unsubscribe from the newsletter
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-400">
          Enter your email address below and we&rsquo;ll remove you from the
          list immediately.
        </p>
      </div>

      <div className="mt-8">
        <UnsubscribeForm />
      </div>
    </main>
  );
}
