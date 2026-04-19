"use client";

import { useEffect, useState } from "react";

type ConsentState = "accepted" | "declined" | null;

const STORAGE_KEY = "ukstats_cookie_consent";

export function getStoredConsent(): ConsentState {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "accepted" || stored === "declined") return stored;
  return null;
}

export default function CookieBanner({
  onConsent,
}: {
  onConsent: (accepted: boolean) => void;
}) {
  // Initialise lazily so we only read localStorage once, on mount
  const [consent, setConsent] = useState<ConsentState>(() => {
    if (typeof window === "undefined") return null;
    return getStoredConsent();
  });

  // If consent was already recorded, notify parent once on mount
  useEffect(() => {
    if (consent !== null) {
      onConsent(consent === "accepted");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChoice(accepted: boolean) {
    const value: ConsentState = accepted ? "accepted" : "declined";
    localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
    onConsent(accepted);
  }

  // Show banner only when no decision has been recorded yet
  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      aria-describedby="cookie-banner-desc"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:gap-6 sm:px-6">
        {/* Icon + text */}
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="mt-0.5 shrink-0 text-indigo-600" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zm-.75 7.5a.875.875 0 110-1.75.875.875 0 010 1.75z"
              />
            </svg>
          </span>
          <p
            id="cookie-banner-desc"
            className="text-sm leading-relaxed text-slate-600"
          >
            <span className="font-semibold text-slate-900">
              Can we use cookies?
            </span>{" "}
            We use Google Analytics to understand how people find and use this
            site — this helps us improve it. No personal data is sold or shared
            with advertisers. You can{" "}
            <a
              href="/cookies"
              className="underline underline-offset-2 hover:text-indigo-600 transition-colors"
            >
              read more about our cookies
            </a>
            .
          </p>
        </div>

        {/* Buttons */}
        <div className="flex shrink-0 flex-wrap gap-2 sm:flex-nowrap">
          <button
            onClick={() => handleChoice(false)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
          >
            No thanks
          </button>
          <button
            onClick={() => handleChoice(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
          >
            Accept cookies
          </button>
        </div>
      </div>
    </div>
  );
}
