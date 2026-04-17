import { type Stat } from "../types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ukstats.info";

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "UK Stats",
    description:
      "Unbiased UK public statistics — economy, health, employment, housing and more.",
    url: SITE_URL,
    publisher: {
      "@type": "Organization",
      name: "UK Stats",
      url: SITE_URL,
    },
  };
}

export function datasetJsonLd(stat: Stat) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: stat.title,
    description: stat.summary,
    url: `${SITE_URL}/stats/${stat.slug}`,
    creator: {
      "@type": "Organization",
      name: stat.source.name,
      url: stat.source.url,
    },
    dateModified: stat.lastUpdated,
    license:
      "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
    keywords: stat.tags.join(", "),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}
