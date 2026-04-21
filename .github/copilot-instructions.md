```md
You are assisting on a Next.js App Router TypeScript project called **ukstats**.

## Product goal
ukstats displays clear, unbiased statistics about the United Kingdom, including topics such as GDP, unemployment, inflation, NHS waiting times, and life expectancy.

## Product principles
- Be neutral, factual, and easy to understand.
- Prefer primary and authoritative sources such as ONS, NHS, GOV.UK, Bank of England, and other official UK public bodies.
- Never invent real-world statistics, sources, or methodology.
- If real data is not yet wired in, use clearly labelled mock data.
- Every statistic page should show source name, source URL, and last updated date where available.
- Prioritize trust, clarity, accessibility, and SEO.

## Technical rules
- Use TypeScript everywhere.
- Use the Next.js App Router.
- Prefer Server Components unless client-side interactivity is required.
- Keep components small, reusable, and easy to read.
- Use semantic HTML and accessible labels.
- Add loading and error states where appropriate.
- Avoid overengineering and unnecessary abstractions.
- Keep styling clean, neutral, and content-focused.
- Do not add libraries unless there is a clear reason.
- Reuse existing components before creating new ones.
- Keep imports tidy and avoid duplicate logic.

## Expected structure
- `app/` for routes and layouts
- `components/` for reusable UI
- `lib/` for utilities and data access
- `types/` for shared types
- `docs/` for project planning and content docs

## Data and content rules
- Statistic entries should include: slug, title, category, summary, value, unit if relevant, source information, last updated, and optional chart/history data.
- Prefer explicit naming over clever abstractions.
- Keep data models simple and strongly typed.
- Preserve source transparency in the UI.

## When generating code
- State assumptions briefly.
- Explain which files were changed.
- Implement only the requested scope.
- Where relevant, suggest a smaller or cleaner version after the first pass.
- When using mock data, make that explicit in comments or labels.

## Quality bar
- Accessible
- SEO-friendly
- Maintainable
- Neutral in tone
- Mobile-first responsive
- No fabricated facts
```