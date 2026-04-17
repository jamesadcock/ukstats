export default function SkeletonCard() {
  return (
    <div
      className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      aria-hidden="true"
    >
      <div className="mb-3 h-5 w-20 rounded-full bg-slate-200" />
      <div className="mb-2 h-4 w-3/4 rounded bg-slate-200" />
      <div className="h-8 w-1/2 rounded bg-slate-200" />
      <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
    </div>
  );
}
