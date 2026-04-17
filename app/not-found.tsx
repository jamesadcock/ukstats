import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-400">
        404
      </p>
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">
        Page not found
      </h1>
      <p className="mb-8 text-slate-600">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved.
      </p>
      <Link
        href="/"
        className="inline-flex h-10 items-center rounded-full bg-indigo-600 px-6 text-sm font-medium text-white transition hover:bg-indigo-700"
      >
        Back to home
      </Link>
    </div>
  );
}
