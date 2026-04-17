interface SourceAttributionProps {
  name: string;
  url: string;
  lastUpdated: string;
  publishedAt?: string;
}

export default function SourceAttribution({
  name,
  url,
  lastUpdated,
  publishedAt,
}: SourceAttributionProps) {
  const updated = new Date(lastUpdated).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const published = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <aside
      className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
      aria-label="Data source"
    >
      <p>
        <span className="font-medium text-slate-800">Source: </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 underline hover:text-indigo-800 transition-colors"
        >
          {name}
        </a>
      </p>
      {published && <p className="mt-0.5">Published: {published}</p>}
      <p className="mt-0.5">Last updated on this site: {updated}</p>
      <p className="mt-2 text-xs text-slate-400">
        Data used under the{" "}
        <a
          href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-slate-600 transition-colors"
        >
          Open Government Licence v3.0
        </a>
        .
      </p>
    </aside>
  );
}
