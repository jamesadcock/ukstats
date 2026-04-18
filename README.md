# ukstats

**Clear, unbiased UK public statistics — presented simply and transparently.**

ukstats makes important national figures easy to find, understand, and trust. Every statistic is sourced directly from official UK bodies, clearly attributed, and presented without political framing or editorial spin.

---

## Features

|     |                                                                                    |
| --- | ---------------------------------------------------------------------------------- |
| 📊  | Browse by category — Economy, Employment, Health, Population, Housing, Education   |
| 🔢  | Every stat shows its current value, trend direction, source, and last updated date |
| 📈  | Historical charts with accessible data table fallbacks                             |
| ⚡  | Fully static — pre-rendered at build time, fast everywhere                         |
| ♿  | WCAG AA — skip nav, ARIA landmarks, semantic HTML, high-contrast design            |
| 🔍  | JSON-LD structured data (`Dataset`, `BreadcrumbList`) on every stat page           |

---

## Tech stack

| Layer           | Technology                                     |
| --------------- | ---------------------------------------------- |
| Framework       | [Next.js 16](https://nextjs.org/) — App Router |
| Language        | TypeScript                                     |
| Styling         | Tailwind CSS v4                                |
| Charts          | Recharts                                       |
| Content         | Typed TypeScript data files                    |
| Long-form pages | MDX via `@next/mdx`                            |
| Deployment      | Vercel · static export compatible              |

---

## Getting started

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
git clone https://github.com/your-org/ukstats.git
cd ukstats
npm install
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

> **Important:** Always use `localhost` — accessing via LAN IP (e.g. `192.168.x.x`) blocks fonts and HMR.

---

## Scripts

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm start        # Serve production build locally
npm run lint     # Run ESLint
```

---

## Project structure

```
ukstats/
├── app/
│   ├── layout.tsx              # Root layout — header, footer, global metadata
│   ├── page.tsx                # Home page
│   ├── categories/             # Category index + [category] pages
│   ├── stats/[slug]/           # Statistic detail pages
│   ├── methodology/            # Methodology page (MDX)
│   ├── about/                  # About page (MDX)
│   ├── sitemap.ts              # Auto-generated XML sitemap
│   └── robots.ts               # robots.txt
│
├── components/
│   ├── layout/                 # SiteHeader · SiteFooter · SkipNav
│   ├── stats/                  # StatCard · StatGrid · CategoryBadge · SourceAttribution
│   ├── charts/                 # LineChart (client) · ChartFallback (table)
│   └── ui/                     # SkeletonCard and other shared primitives
│
├── content/stats/              # Source data — one typed .ts file per category
├── lib/
│   ├── data/                   # getAllStats · getStatBySlug · getStatsByCategory
│   └── jsonld.ts               # JSON-LD schema helpers
└── types/                      # Stat · Category · DataPoint interfaces
```

---

## Data and sources

**ukstats does not fabricate, estimate, or editorially adjust any statistic.**

All figures come from accredited UK official sources:

- [**Office for National Statistics**](https://www.ons.gov.uk/) — GDP, inflation, employment, population
- [**NHS England**](https://www.england.nhs.uk/statistics/) — waiting times, health outcomes
- [**GOV.UK Statistics**](https://www.gov.uk/government/statistics) — housing, education, public services
- [**Bank of England**](https://www.bankofengland.co.uk/statistics) — interest rates, monetary data

Every stat page links to the original publication and shows when it was last updated. Data is currently stored as typed TypeScript files in `content/stats/`. The `lib/data/` layer is intentionally decoupled — switching to live API data in a future phase requires no changes to routes or components.

---

## Roadmap

- [x] Live ONS API integration — CPI inflation fetched daily from ONS timeseries
      API
- [x] Fetch UK GDP Growth Rate from API — CDID `IHYQ`, quarterly
- [x] Fetch UK Unemployment Rate from API — CDID `MGSX`, monthly
- [x] Fetch UK Population Estimate from API — CDID `UKPOP`, annual
- [x] Fetch UK Public Sector Net Debt from API — CDID `HF6X`, monthly
- [x] Fetch UK Average House Price from API — Land Registry Linked Data API, monthly
- [x] Fetch UK Life Expectancy at Birth from API — World Bank Open Data API (`SP.DYN.LE00.MA.IN` / `SP.DYN.LE00.FE.IN`), annual
- [x] Fetch NHS A&E 4-Hour Wait Target from API — NHS England monthly XLS time series, parsed with SheetJS
- [ ] Search — server-side full-text filtering
- [ ] Embeddable widgets for third-party sites

---

## Contributing

Contributions are welcome. Three ground rules:

1. **Data accuracy** — every statistic must link to a verifiable official UK source with a publication date.
2. **Neutral framing** — no political or editorial language in titles, summaries, or methodology notes.
3. **Accessibility** — WCAG AA required; charts must have a data table fallback.

```bash
git checkout -b feat/your-feature-name
# make changes
npm run lint && npm run build
# open a pull request
```

Open an issue before starting significant work so the approach can be agreed first.

---

## License

[MIT](./LICENSE)

---

_ukstats is independent and not affiliated with the UK Government, ONS, or any public body._
