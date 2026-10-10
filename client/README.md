# TJP client

Next.js App Router, React, Tailwind CSS v4, shadcn/ui (Radix), Motion, and
TanStack Query. The existing starter page, content, and destinations remain in
place; the root layout now supplies shared site navigation and a footer.

## Run and validate

```powershell
npm ci
npm run dev
npm run lint
npm test
npm run build
npm start
```

The development server uses http://localhost:3000. Copy `.env.example` to
`.env.local` when configuring the API. `NEXT_PUBLIC_API_URL` defaults to
`http://localhost:5000`; set the production API origin before building because
Next.js embeds public environment variables in the browser bundle. Configure
the Express server's `CLIENT_ORIGIN` to allow the client origin.

## Component architecture

- `src/config/site.js`: shared branding and navigation. Only existing routes and
  resources are linked; replace these items as real pages are added.
- `src/components/layout/`: `Header`, `Footer`, shared links, and mobile navigation.
  `Header` and `Footer` accept `name`, `navigation`, and `className` overrides.
- `src/components/ui/`: shadcn Button, Sheet, and Separator source files.
- `src/components/providers/app-providers.jsx`: query cache and animation providers.
- `src/components/motion/interactive-text.jsx`: reusable, subtle brand interactions.
- `src/lib/`: the shared `cn` helper, query policy, API query factory, and deferred
  Motion features.

Keep pages and static composition as Server Components. Add `"use client"` only
to interactive components. New pages should have one `<main id="main-content"
tabIndex={-1}>` landmark so the shared keyboard skip link keeps working.

The mobile Sheet includes a title, description, focus trapping, Escape dismissal,
focus restoration, and 44px open/close controls. It closes after choosing a link
or crossing the desktop breakpoint. Header and footer links share one renderer.

## UI and styles

`components.json` configures JavaScript, Server Component compatibility, the
`new-york` style, Tailwind v4, and `@/` aliases. Add only components a feature uses:

```powershell
npx shadcn@latest add input
```

`src/app/globals.css` is the single source of design tokens and reusable styles.
Semantic Tailwind colors such as `text-foreground`, `text-muted-foreground`,
`bg-background`, `bg-surface`, and `border-border` derive from CSS variables.
Light/dark appearance continues to follow the operating system preference.

| Primitive                                            | Purpose                                 |
| ---------------------------------------------------- | --------------------------------------- |
| `heading-page` / `heading-section`                   | Page titles and subheadings             |
| `text-lead` / `text-body` / `text-small`             | Introductory, body, and supporting text |
| `text-link` / `nav-link` / `brand-link`              | Inline links, navigation, and branding  |
| `container-page` / `container-content`               | Shared wide and narrow content widths   |
| `section-space` / `stack-content`                    | Consistent vertical spacing             |
| `action-link` with primary or outline `data-variant` | Existing page CTA styles                |

Use shared primitives for recurring styling and Tailwind utilities for local
layout differences. Do not copy full typography or container class lists between
pages. Route-specific content stays in its page; site chrome stays in the layout.

Motion uses `LazyMotion` with an asynchronously loaded `domAnimation` feature
bundle, following the [Motion documentation](https://motion.dev/docs/react-lazy-motion).
Use `motion/react-m` components under `AppProviders`; strict mode catches
accidental full `motion` imports. Prefer short transform/opacity animations to
animating dimensions. `MotionConfig` respects reduced-motion preferences, and a
global CSS rule also reduces Sheet and Tailwind animation/transition durations.
No page content is hidden pending JavaScript or animation initialization.

## Caching

Three independent layers serve different resources:

1. **Pages:** existing Next.js Cache Components and Partial Prefetching remain
   enabled. The current homepage is prerendered as static content. For future
   public server data, follow the installed Next.js docs in
   `node_modules/next/dist/docs/`: async `"use cache"` functions with explicit
   `cacheLife`, `cacheTag`, and server-side invalidation. Keep authenticated data
   out of globally shared public caches.
2. **Client API data:** one provider-owned QueryClient per mounted application,
   with isolated SSR instances, 60-second freshness, five-minute inactive cache
   retention, in-flight request deduplication, stale refetch on focus/reconnect,
   and explicit invalidation. Network/5xx failures retry at most twice with
   bounded exponential backoff; 4xx responses, aborted requests, and malformed
   JSON do not retry. Mutations do not retry automatically. See
   [TanStack's cache defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults).
3. **Assets:** Next.js manages immutable caching for hashed JS/CSS/fonts. The five
   existing public SVGs use a one-hour HTTP cache and a 60-second revalidation
   window. Page HTML and API responses do not receive blanket immutable headers.

The existing page does not fetch API data, so it makes no new network requests to
the Express API. Use the shared factory when adding a real client data consumer:

```jsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { apiQueryOptions } from "@/lib/api-client.mjs";

export function ApiStatus() {
  const query = useQuery(apiQueryOptions("/api/health"));
  if (query.isPending) return <p className="text-body">Loading status...</p>;
  if (query.isError)
    return (
      <p role="alert" className="text-body">
        Status unavailable.
      </p>
    );
  return <p className="text-body">{query.data.status}</p>;
}
```

`apiQueryOptions(path, { params, scope, ...queryOptions })` keys entries by API
origin, identity scope, path, and parameters. Parameters are scalar query-string
values; query-specific settings can override defaults. `requestJson` checks HTTP
status, supports empty 204 responses, and passes cancellation signals to fetch.
It uses `cache: "no-store"` so HTTP caching cannot defeat query invalidation.

After a successful mutation, invalidate the affected resource using
`useQueryClient()`:

```js
await queryClient.invalidateQueries({
  queryKey: apiQueryOptions("/api/health").queryKey,
});
```

When adding authenticated requests, provide a user/session identifier in `scope`,
configure the appropriate credentials in the transport, and call
`queryClient.clear()` on logout or identity change. Never use raw tokens as keys.
The cache is intentionally in memory; it is cleared on reload and does not store
private API data in localStorage. Use ordinary `useQuery` for this provider; a
future Suspense-based data flow needs an appropriate hydration/Suspense boundary.

`npm test` verifies freshness, deduplication, invalidation, isolation, cancellation,
retry limits, error recovery, and request encoding using mocked transport.

## Dependency audit

The production dependency audit is clean (`npm audit --omit=dev`). The full audit
currently reports five high-severity findings in the pre-existing
`eslint-config-next → fast-glob → micromatch → braces` development tooling chain.
The registry's newest braces release is still 3.0.3; the suggested automatic fix
downgrades Next's ESLint configuration to 14.x. Retain the matching 16.4.0 tooling
and revisit this audit when a compatible upstream patch is available.
