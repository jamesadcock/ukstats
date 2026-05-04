"use client";

import {
  useEffect,
  useRef,
  useState,
  useActionState,
  useTransition,
} from "react";
import {
  subscribeToNewsletter,
  type NewsletterState,
} from "../../app/actions/newsletter";

const STORAGE_KEY = "ukstats_newsletter_prompt";
const CONSENT_KEY = "ukstats_cookie_consent";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function shouldShow(): boolean {
  if (typeof window === "undefined") return false;
  // Don't show until the user has settled cookie consent
  const consent = localStorage.getItem(CONSENT_KEY);
  if (consent === null) return false;
  // Show if never dismissed/subscribed, or more than 30 days ago
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return true;
  const ts = parseInt(raw, 10);
  return isNaN(ts) || Date.now() - ts > THIRTY_DAYS_MS;
}

function dismiss() {
  localStorage.setItem(STORAGE_KEY, String(Date.now()));
}

const initialState: NewsletterState = { status: "idle" };

export default function NewsletterModal() {
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, formAction] = useActionState(
    subscribeToNewsletter,
    initialState,
  );
  const [isPending, startTransition] = useTransition();

  // Determine visibility after mount (localStorage is not available during SSR)
  useEffect(() => {
    // Give the cookie banner a moment to render first
    const id = setTimeout(() => {
      if (shouldShow()) setVisible(true);
    }, 800);
    return () => clearTimeout(id);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (visible) inputRef.current?.focus();
  }, [visible]);

  // Close and stamp on success
  useEffect(() => {
    if (state.status === "success") {
      const id = setTimeout(() => {
        dismiss();
        setVisible(false);
      }, 2200);
      return () => clearTimeout(id);
    }
  }, [state.status]);

  // Trap focus within the modal
  useEffect(() => {
    if (!visible) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleClose() {
    dismiss();
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-heading"
      aria-describedby="newsletter-desc"
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center px-4 pb-4 sm:pb-0"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        aria-hidden="true"
        onClick={handleClose}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10">
        {/* Header — matches site header colour */}
        <div className="relative bg-slate-950 px-6 py-6">
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close newsletter signup"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <span className="inline-flex items-center rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300 ring-1 ring-slate-700">
            Monthly newsletter
          </span>
          <h2
            id="newsletter-heading"
            className="mt-3 text-xl font-bold tracking-tight text-white"
          >
            Stay up to date with the numbers
          </h2>
          <p
            id="newsletter-desc"
            className="mt-1.5 text-sm leading-relaxed text-slate-400"
          >
            Once a month, we round up the key UK statistics that changed — no
            filler, no spin. Unsubscribe any time.
          </p>
        </div>

        <div className="px-6 py-5">
          {state.status === "success" ? (
            <div
              role="status"
              className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-4 text-sm text-emerald-800 ring-1 ring-emerald-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
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
                You&rsquo;re subscribed — thank you!
              </span>
            </div>
          ) : (
            <form
              action={(formData) => startTransition(() => formAction(formData))}
              noValidate
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  ref={inputRef}
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="your@email.com"
                  disabled={isPending}
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending ? "Subscribing…" : "Subscribe"}
                </button>
              </div>

              {state.status === "error" && state.message && (
                <p role="alert" className="mt-2.5 text-xs text-red-600">
                  {state.message}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
