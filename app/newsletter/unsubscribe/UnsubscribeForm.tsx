"use client";

import { useActionState, useTransition, useRef, useEffect } from "react";
import Link from "next/link";
import {
  unsubscribeFromNewsletter,
  type NewsletterState,
} from "../../actions/newsletter";

const initialState: NewsletterState = { status: "idle" };

export default function UnsubscribeForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, formAction] = useActionState(
    unsubscribeFromNewsletter,
    initialState,
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state.status === "error") inputRef.current?.focus();
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div className="space-y-4">
        <div
          role="status"
          className="flex items-center gap-3 rounded-xl bg-emerald-50 px-5 py-5 text-sm text-emerald-800 ring-1 ring-emerald-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-emerald-600"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="font-medium">
            You&rsquo;ve been unsubscribed — sorry to see you go.
          </span>
        </div>
        <p className="text-sm text-slate-500">
          Changed your mind?{" "}
          <Link
            href="/newsletter"
            className="text-indigo-600 underline hover:text-indigo-700"
          >
            Subscribe again
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      action={(formData) => startTransition(() => formAction(formData))}
      noValidate
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="unsubscribe-email" className="sr-only">
          Email address
        </label>
        <input
          ref={inputRef}
          id="unsubscribe-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="your@email.com"
          disabled={isPending}
          className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-slate-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Unsubscribing…" : "Unsubscribe"}
        </button>
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {state.message}
        </p>
      )}
    </form>
  );
}
