"use client";

import { useSyncExternalStore } from "react";

interface ShareButtonsProps {
  title: string;
  summary: string;
  /** Canonical path, e.g. /stats/uk-inflation-rate-cpi */
  path: string;
}

const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.25 2.25h6.846l4.261 5.636 4.887-5.636Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const platforms = [
  {
    id: "x",
    label: "Share on X",
    icon: XIcon,
    colour: "border-slate-800 bg-slate-900 text-white hover:bg-slate-700",
    buildUrl: (url: string, title: string, summary: string) =>
      `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + " — " + summary + " via UK Stats")}`,
  },
  {
    id: "facebook",
    label: "Share on Facebook",
    icon: FacebookIcon,
    colour: "border-[#1877f2] bg-[#1877f2] text-white hover:bg-[#1565d8]",
    // Facebook removed support for pre-filled text; sharing is via link-preview card from OG tags
    buildUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: "linkedin",
    label: "Share on LinkedIn",
    icon: LinkedInIcon,
    colour: "border-[#0a66c2] bg-[#0a66c2] text-white hover:bg-[#084f99]",
    // shareArticle supports title + summary fields visible in the LinkedIn composer
    buildUrl: (url: string, title: string, summary: string) =>
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}&source=${encodeURIComponent("UK Stats")}`,
  },
];

export default function ShareButtons({
  title,
  summary,
  path,
}: ShareButtonsProps) {
  // useSyncExternalStore correctly returns null on the server (SSR/SSG)
  // and the real URL on the client, with no setState-in-effect cascade.
  const pageUrl = useSyncExternalStore(
    (cb) => {
      window.addEventListener("popstate", cb);
      return () => window.removeEventListener("popstate", cb);
    },
    () => window.location.href,
    () => null,
  );

  const url =
    pageUrl ??
    `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://ukstats.info"}${path}`;

  function openShare(shareUrl: string, platformId: string) {
    window.open(
      shareUrl,
      `share-${platformId}`,
      "width=600,height=480,noopener,noreferrer",
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
        Share
      </span>
      {platforms.map(({ id, label, icon: Icon, colour, buildUrl }) => (
        <button
          key={id}
          onClick={() => openShare(buildUrl(url, title, summary), id)}
          aria-label={label}
          title={label}
          className={[
            "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500",
            colour,
          ].join(" ")}
        >
          <Icon />
          <span className="hidden sm:inline">
            {label.replace("Share on ", "")}
          </span>
        </button>
      ))}
    </div>
  );
}
