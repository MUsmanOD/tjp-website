# TJP client

## Membership and administration

The functional membership form is `/membership`. It supports English/Urdu, gender and age groups (under 18, 18–29, 30–49 and 50+), contact alternatives, optional CNIC/NICOP numbers based on residence, overseas residence plus Pakistani home area, searchable location/constituency catalogues, and manual entries. New applications require an age group and gender; older records remain editable and any previously recorded exact age is retained. Submissions await administrator approval. No personal drafts are stored in localStorage. The page layout remains left-to-right when Urdu is selected, with Urdu text and fonts applied separately.

`/tjp-portal-pubjab-0001-login` uses email and password, asking for an authenticator/recovery code only when 2FA is enabled. Optional 2FA is managed from the admin **Security** page; setup, verification, one-time recovery-code display, cancellation, and disabling are supported. `/tjp-portal-pubjab-0001-login/dashboard` provides live totals/charts, geographic drill-down, filtered/paginated membership listings, protected exact search, full profiles, corrections, review actions, audit history, step-up protected ID reveal/removal, and session revocation. Former admin paths return 404; the API continues to enforce session authorization. An icon button in the sidebar footer opens the shadcn-style theme menu (light, dark, system); the sign-out action also remains in the footer. A top-bar dropdown selects English or Urdu using the existing language provider. Member account login/signup remain outside this release.

Run `npm ci`, `npm run dev`, `npm test`, and `npm run build` here using Node 24. Start the TypeScript API separately as described in [the server README](../server/README.md). `API_INTERNAL_URL` defaults to `http://127.0.0.1:5027`; browser requests go to same-origin `/api`. No server encryption/signing key belongs in frontend environment variables.

Admin responses are never stored in Next shared caches or persistent browser storage. Refresh is serialized within a tab and across tabs using Web Locks. Private state clears on session expiry/logout, including a BroadcastChannel logout notification. The API is the authorization boundary; the admin route initially renders only a loading shell.

The admin sidebar includes Site settings, Contact details, Leadership, Gallery, and Inbox. Site settings controls the visible brand and social links. Contact details controls the public address, phone, and email. Leadership and Gallery start with the existing website content and support image uploads, display order, and a Published switch. The contact form sends messages to the private Inbox. The Memberships view also accepts manual applications with applicant consent and keeps them pending for review.

The membership/admin pages render at request time with nonce-based script CSP, no framing, no referrer, and no-store responses. CSS inline styles are allowed for Radix positioning and chart bars. Cache Components and partial prefetching are disabled because nonce CSP requires complete per-request rendering. Public content retains normal static rendering. The existing language, animation and query providers remain in place.

Place labels use the versioned backend catalogue. Proper names without a reviewed Urdu equivalent retain source spelling. Form labels, help, validation, feedback, menus and accessibility controls have matching English/Urdu translation keys in `src/i18n/messages.js`.

## Frontend pages and interactions

- `/gallery`: local TJP archive and licensed heritage photographs, category filters,
  and a keyboard-accessible lightbox with captions and original source links.
- `/leadership`: leadership information and imagery, also featured on the homepage.
- `/contact`: published contact details, FAQs, and a validated form that sends
  messages to the administrator inbox.
- `/membership`: live application submission; see the flow above.
- The homepage manifesto section uses `manifestoEntries` in `src/config/content.js`. Each verified entry has `title` and `name` objects with `en` and `ur` values; cards appear in two columns. An empty state is shown until entries are supplied.
- `/signup`: themed layout. Credential fields remain disabled
  until an authorized authentication integration is provided.
  Header plus authentication content fits one viewport (`100svh`), with local
  scrolling on short screens. Authentication forms show only a title, fields,
  button; the availability description is screen-reader
  text. Authentication routes omit the footer and keep image credits beside the photo.
- Former admin pages return the branded 404 page.

Content pages use a compact two-column footer. The header and mobile drawer omit
the Login link. Contact fields use a single 1px border, including keyboard focus,
without a focus ring; contact icons have no background badge.

All pages, labels, validation messages, filters, and dialogs support English and
Urdu through the existing language provider. The membership and admin features require the API.

`SmoothScroll` initializes Lenis with automatic frame updates, anchor support,
native touch scrolling, built-in live reduced-motion support, and cleanup on
navigation. Sheets and dialogs opt out with `data-lenis-prevent`. The hero keeps
its existing horizontal gestures and four-second slideshow.

`ScrollReveals` adds a fade and 20px rise once per element to content marked with
`data-scroll-reveal`, using one IntersectionObserver per page. Optional
`data-scroll-delay` staggers card rows by up to 240ms. No wrappers or layout styles
are added, and content stays visible in static HTML and without JavaScript.
Filtered cards are observed automatically. Reduced motion, keyboard focus, print,
and navigation cleanup keep content immediately accessible.

The compact main header sits below an announcement/social bar. `SocialLinks` uses
brand icons from `react-icons/fa6`. Facebook and X URLs were checked against
https://tjp.org.pk/contactus/; Instagram and YouTube show a translated availability
dialog until confirmed URLs are added to `src/config/site.js`. The homepage
Facebook card loads the real timeline on request and includes a direct-link fallback.

Section headings, article cards, page introductions, join banners, and form fields
are shared under `components/content/` and `components/forms/`. Central styles and
print rules remain in `src/app/globals.css`.
`PageIntro compact` uses smaller headings and spacing; other page intros retain
their existing layout. `FormField selectVariant="custom"` uses shadcn Select;
`optionValues` supplies stable values alongside translated `options`. Other fields
retain the native dropdown. The reusable primitive lives in `components/ui/select.jsx`.

Next.js App Router, React, Tailwind CSS v4, shadcn/ui (Radix), Motion, and
TanStack Query. A responsive English/Urdu homepage uses the shared Header,
Footer, and brand design system. Read the root [AI_INSTRUCTIONS.md](../AI_INSTRUCTIONS.md)
before making changes. Frontend development does not require the API to run.

## Run and validate

```powershell
npm ci
npm run dev
npm run lint
npm test
npm run build
npm start
```

The development server uses http://localhost:3000. Set `API_INTERNAL_URL` for the internal API destination. The browser uses same-origin `/api` routes; configure the API's `CLIENT_ORIGIN` to match this frontend origin.

## Component architecture

- `src/config/site.js`: shared navigation with translation keys and implemented
  homepage anchors and Gallery, Leadership, and Contact routes. New items need a `key` translated under `navigation` in both dictionaries.
- `src/components/layout/`: reusable `Header`, `Footer`, `Brand`, `Container`,
  `LanguageSwitcher`, `SkipLink`, shared links, and mobile navigation.
  `Header` and `Footer` accept `name`, `navigation`, and `className` overrides;
  omit `name` for translated branding. `Container` accepts `as`, `narrow`, and `className`.
- `src/components/home/`: `HeroSlider`, `AboutSection` with the founder portrait,
  and translated homepage composition.
- `src/config/hero-slides.js`: four hero selections from the central media registry.
- `src/config/media.js`: local image paths, originals, source pages, credit types,
  and crop positions, shared by the hero, gallery, articles, and footer credits.
- `src/config/content.js`: article slugs, media keys, categories, content kinds, and
  original publication dates. Article entries correspond to the same index in both
  `journal.articles` translation arrays. Gallery entries use translated media keys.
- `src/components/content/article-meta.jsx`: shared translated article type,
  publication date, and reading-time display.
- `src/lib/slider.js`: shared slide wrapping and horizontal wheel normalization.
- `src/components/auth/`: the public signup layout at `/signup` with disabled credential fields. No
  credentials are collected and no authentication integration is implemented.
- `src/components/ui/`: shadcn Button, Sheet, Separator, and Card source files.
  Pass a translated `closeLabel` to `SheetContent`.
- `src/components/providers/app-providers.jsx`: existing query cache and animation
  providers plus the shared `LanguageProvider`.
- `src/i18n/messages.js`: centralized English/Urdu copy, supported locales, and fallback policy.
- `src/components/motion/interactive-text.jsx`: reusable, subtle brand interactions.
- `src/components/providers/scroll-reveals.jsx`: shared scroll entry animations for
  annotated content, with reduced-motion support and no persistent hidden state.
- `src/lib/`: the shared `cn` helper, query policy, API query factory, and deferred
  Motion features.

Keep pages and static composition as Server Components. Add `"use client"` only
to interactive components. New pages should have one `<main id="main-content"
tabIndex={-1}>` landmark so the shared keyboard skip link keeps working.

The mobile Sheet includes a title, description, focus trapping, Escape dismissal,
focus restoration, and 44px open/close controls. It closes after choosing a link
or crossing the desktop breakpoint (1024px). The drawer opens on the left for
Urdu and the right for English. Header and footer links share one renderer.

## Languages

Call `useLanguage()` in client components to access `{ messages, locale, direction,
setLocale }`. Add every visitor-facing string, including accessibility labels,
to both dictionaries in `src/i18n/messages.js`. Keep their key shapes identical.
Do not create an additional language store or hardcode text in JSX.

The provider updates HTML `lang` and `dir`, configures Radix direction, and saves
the language under `tjp-language` in localStorage. Browser storage events synchronize
open tabs. If storage is unavailable, switching still works in memory. Static HTML
renders English; a saved Urdu preference applies after hydration. This foundation
does not provide separate locale URLs or locale-specific SEO metadata.

Urdu uses bundled-at-build `next/font` Noto Nastaliq Urdu with script-specific
line heights. Use logical spacing and positioning, and mirror directional arrows.
`LanguageSwitcher` works in the header, mobile drawer, and footer from one source.
It displays Urdu when English is selected and English when Urdu is selected.

## Homepage interactions

The compact main header is 60px above the phone breakpoint and 56px on phones,
below the announcement bar. It displays the emblem and wordmark, navigation,
and Join TJP. Below 640px the main header hides its language switch and Join TJP.
Language
switching remains available in the mobile drawer and footer. The hero fills
`calc(100svh - var(--header-height))`, so header and hero occupy one viewport.
`Brand compact` hides adjacent brand text without removing its accessible label.
The header opts into `showWordmark` to display the small English wordmark
"Tehreek Jawanan Pakistan" beside the emblem. Its letters reveal once in sequence,
wrap at spaces on narrow screens, and remain immediately visible with reduced motion.
Other Brand instances retain their existing presentation.

The mobile drawer uses one compact branded header, 44px navigation rows, and a
two-column row of matching signup/language buttons. Navigation scrolls independently
on short screens while the header and actions remain visible. `Brand` accepts an
optional `onClick` for drawer dismissal; `LanguageSwitcher` accepts a Button `variant`
and defaults to its existing plain appearance outside the drawer.

The four slides use a smooth 1.4-second crossfade and gentle zoom, with autoplay every 4 seconds. Inactive image zooms pause in place so outgoing images do not snap back during a fade.
They feature the founder banner, the chairman's meeting with China's defence
attaché, a school prize ceremony, and Islamabad heritage photography.
Hero text is centered at 640px and above. On phones, smaller titles,
body copy, and spacing form a compact block at the bottom, centered horizontally.
The primary Join TJP button links to membership and shares one centered row with the
secondary Discover TJP action on every screen size, with compact padding on phones.
The hero does not include an Our focus button.
The Make a Connection section uses one shared panel with three adjoining columns,
plain icons, compact vertical padding, and dividers. Columns stack without gaps on phones.
No section/location labels or bottom controls are visible. Horizontal trackpad gestures, touch swipes, and keyboard
Left/Right/Home/End navigate slides. Vertical scrolling and pinch-to-zoom stay
available. Manual navigation restarts the four-second interval; pointer hover
does not stop it. Keyboard focus pauses autoplay, and a keyboard-accessible
pause/resume control is visually hidden until focused. Reduced motion disables
autoplay and minimizes animation. The shared Button's primary
variant implements the requested shine and four animated corner borders; reuse
its `inverse` / `inverse-ghost` variants for controls on dark backgrounds.

Body copy uses 1.5 line-height in English, with Urdu-specific spacing. The TJP emblem,
founder and chairman portraits, meeting photos, and engagement photos were sourced
from TJP's published website on 20 October 2026. The emblem also supplies the favicon.
See `public/images/CREDITS.md` for originals, source pages, and rights distinctions;
`public/images/home/CREDITS.md` retains the four landscape photographers' attribution.
The footer credits all registered assets without applying a CC license to TJP images.

Leadership profiles and four archived reports summarise linked TJP sources. Archive
dates are publication dates, not newly announced events. The three original demo
articles retain their existing URLs and are labelled "Editorial example" in both
languages. Do not invent quotations, meetings, statistics, endorsements, or programmes.
Membership, contact forms, and authentication keep their existing availability states.

## UI and styles

`components.json` configures JavaScript, Server Component compatibility, the
`new-york` style, Tailwind v4, and `@/` aliases. Add only components a feature uses:

```powershell
npx shadcn@latest add input
```

`src/app/globals.css` is the single source of design tokens and reusable styles.
Semantic Tailwind colors such as `text-foreground`, `text-muted-foreground`,
`bg-background`, `bg-surface`, and `border-border` derive from CSS variables.
The site uses light mode regardless of the operating system preference. Primary
green is `#0C6D3A`, with white and black; secondary surfaces and neutrals derive
from these tokens with `color-mix`. Do not add unrelated colors or local type scales.

| Primitive                                | Purpose                                 |
| ---------------------------------------- | --------------------------------------- |
| `heading-page` / `heading-hero` / `heading-section` / `heading-card` | Page titles, hero, sections, and cards |
| `text-eyebrow`                          | Small section labels                    |
| `text-lead` / `text-body` / `text-small` | Introductory, body, and supporting text |
| `text-link` / `nav-link` / `brand-link`  | Inline links, navigation, and branding  |
| `container-page` / `container-content`   | Shared wide and narrow content widths   |
| `section-space` / `stack-content`        | Consistent vertical spacing             |
| `button-base` / `card-panel`             | Shared shadcn Button and Card treatments |

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

`npm test` verifies translation completeness, matching dictionary keys, locale
fallbacks, translated navigation, slide wrapping, horizontal gesture handling,
local media references, bilingual article bodies, content kinds, archive dates,
and all four local slide assets, alongside freshness, deduplication,
invalidation, isolation, cancellation, retry limits, error recovery, and request
encoding using mocked transport. `npm run build` validates the production bundle.

## Dependency audit

The production dependency audit is clean (`npm audit --omit=dev`). The full audit
currently reports five high-severity findings in the pre-existing
`eslint-config-next → fast-glob → micromatch → braces` development tooling chain.
The registry's newest braces release is still 3.0.3; the suggested automatic fix
downgrades Next's ESLint configuration to 14.x. Retain the matching 16.4.0 tooling
and revisit this audit when a compatible upstream patch is available.


The admin workspace uses shared shadcn primitives for navigation actions, selects, cards, dialogs, sheets, tables and status badges. The overview charts use live API aggregates and show empty states when no data exists. Membership geography is presented before collapsible refinements. Admin and sign-in dark mode use neutral charcoal surfaces with green accents; light/dark/system selection remains in the admin workspace.

The About Us page presents the movement’s existing story, manifesto, priorities and leadership. The home archive scrolls horizontally, pauses on pointer or keyboard focus and respects reduced motion; selecting a photograph opens a full-screen view. Education and profession are optional membership dropdowns with server-validated stable values; older records remain editable.

Founder and chairman portraits use the shared `PortraitBadge` component: provide a transparent portrait, localized name and alt text to reuse the gradient circle and ribbon.
