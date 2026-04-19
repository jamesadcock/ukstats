import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer
      className="mt-auto bg-slate-900 text-sm text-slate-400"
      role="contentinfo"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <strong className="text-white">UK Stats</strong> — presenting
            official public statistics from ONS, DHSC, DfE and other UK
            government sources.
          </p>
          <nav aria-label="Footer navigation">
            <ul className="flex gap-4">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/methodology"
                  className="hover:text-white transition-colors"
                >
                  Methodology
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-white transition-colors"
                >
                  All Topics
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:text-white transition-colors"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <p className="mt-4 text-xs text-slate-500">
          Data sourced under the{" "}
          <a
            href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
            className="underline hover:text-slate-300 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Government Licence v3.0
          </a>
          . UK Stats is not affiliated with any government body.
        </p>
      </div>
    </footer>
  );
}
