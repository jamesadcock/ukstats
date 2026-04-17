export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-3 h-5 w-24 animate-pulse rounded-full bg-slate-200" />
      <div className="mb-4 h-10 w-3/4 animate-pulse rounded bg-slate-200" />
      <div className="mb-10 h-5 w-full animate-pulse rounded bg-slate-100" />
      <div className="mb-10 h-24 w-full animate-pulse rounded-2xl bg-slate-100" />
      <div className="h-[280px] w-full animate-pulse rounded-xl bg-slate-100" />
    </div>
  );
}
