```md
# ukstats Plan

## Overview
ukstats is a Next.js website that presents unbiased UK public statistics in a clear, trustworthy, and accessible way.

The aim is to make important national statistics easy to browse and understand, while clearly showing the original source behind every number.

## Goals
- Present UK statistics clearly and neutrally.
- Make it easy to browse by category.
- Show the source and freshness of every statistic.
- Build trust through transparency and simplicity.
- Ensure the site is responsive, accessible, and SEO-friendly.

## Non-goals
- Opinion pieces or commentary.
- Politically biased framing.
- Complex user accounts or dashboards in the MVP.
- Real-time analytics infrastructure in the MVP unless needed.

## MVP pages
- Home page
- Category page
- Statistic detail page
- Methodology / how we stay unbiased page
- About page

## Example categories
- Economy
- Employment
- Health
- Population
- Housing
- Education

## Example statistics for MVP
- GDP
- Unemployment rate
- Inflation
- NHS waiting times
- Life expectancy
- Average house price

## Core user stories
- As a visitor, I can quickly understand what ukstats is and why I should trust it.
- As a visitor, I can browse statistics by category.
- As a visitor, I can open a statistic and see its value, explanation, source, and trend.
- As a visitor, I can understand when the statistic was last updated.
- As a visitor, I can understand how the site aims to stay unbiased.

## Content model
Each statistic should include:
- Title
- Slug
- Category
- Short summary
- Current value
- Unit if relevant
- Source name
- Source URL
- Last updated date
- Methodology notes if available
- Optional historical/chart data

## UX principles
- Simple, trustworthy design
- Neutral tone
- Minimal clutter
- Strong typography and spacing
- Source transparency on every stat page
- Mobile-first layout

## Technical approach
- Next.js App Router
- TypeScript
- Server Components by default
- Static or server-loaded content depending on data source strategy
- Reusable components for stat cards, source panels, charts, and layout

## Suggested folder structure
```txt
app/
  layout.tsx
  page.tsx
  about/page.tsx
  methodology/page.tsx
  categories/[category]/page.tsx
  stats/[slug]/page.tsx

components/
  layout/
  stats/
  charts/
  ui/

lib/
  data/
  utils/

types/

docs/
```

## Delivery phases
### Phase 1: Setup and structure
- Create base route structure
- Add global layout and navigation
- Define stat types and sample data

### Phase 2: Core pages
- Build home page
- Build category page
- Build stat detail page

### Phase 3: Trust and usability
- Add source transparency component
- Add methodology page
- Improve metadata and SEO
- Improve accessibility

### Phase 4: Data maturity
- Replace mock data with real sourced data
- Add update process for content
- Improve charts and trend views

## Acceptance criteria for MVP
- User can browse headline statistics from the homepage.
- User can navigate to category pages.
- User can open a stat detail page.
- Each stat page shows source and update date.
- Site works well on mobile and desktop.
- Site has clear metadata and basic SEO.
- Mock data is clearly labelled until real data is integrated.
```