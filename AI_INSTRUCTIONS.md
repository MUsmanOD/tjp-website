# AI development instructions

Read this file before every change. These rules apply to all future development.

## Inspect before editing

- Inspect the project structure, applicable `AGENTS.md`, dependencies, and existing reusable components before creating or modifying anything.
- Verify that files, components, libraries, APIs, and functionality exist. Never invent or assume them.
- The frontend is `client/`, using Next.js App Router, JavaScript, JSX, Tailwind v4, and shadcn/ui. Read relevant installed Next.js documentation in `client/node_modules/next/dist/docs/` before changing framework behavior.
- Use JavaScript (`.js`) and JSX (`.jsx`) only for new application code. Do not introduce TypeScript or TSX.
- Keep work frontend-focused unless backend development is explicitly requested. Do not change `server/` for frontend tasks.
- Preserve unrelated files, functionality, and user edits. Do not install unnecessary dependencies.

## UI components and reuse

- Always use shadcn/ui wherever suitable. Check `client/src/components/ui/` before adding a primitive.
- Reuse existing UI components before creating new ones. Do not duplicate components or create unnecessary custom UI elements.
- Reuse `Header`, `Footer`, `Container`, `Brand`, `NavigationLinks`, `SiteLink`, `LanguageSwitcher`, and the shared shadcn `Button`.
- Keep components modular, maintainable, and focused. Avoid duplicated markup, layouts, CSS classes, and behavior.
- Follow existing conventions: shared layout in `components/layout/`, page composition in `components/home/`, primitives in `components/ui/`, providers in `components/providers/`, translations in `i18n/`, and site configuration in `config/site.js`.
- `components.json` configures shadcn for JavaScript and the `@/` alias. Only add components actually needed by the feature.

## Brand and design

- Always use primary green `#0C6D3A`, white `#FFFFFF`, and black `#000000`. Neutral and green tints must derive from existing design tokens.
- Use CSS variables and reusable utility classes in `client/src/app/globals.css`. Do not introduce random colors, font sizes, or inconsistent patterns.
- Use predefined `heading-page`, `heading-hero`, `heading-section`, `heading-card`, `text-eyebrow`, `text-lead`, `text-body`, `text-small`, `text-link`, and `nav-link` classes.
- Use `Container` (`container-page` / `container-content`), `section-space`, `stack-content`, shadcn `Card` (`card-panel`), and shadcn `Button` (`button-base`). Extend tokens or variants centrally when needed.
- Keep spacing, typography, padding, margins, card treatments, and buttons consistent across pages.
- Use responsive layouts, logical properties (`start`, `end`, `ms`, `me`, `ps`, `pe`), and RTL-aware directional icons.
- Preserve keyboard focus, accessible labels, semantic landmarks, adequate contrast, touch targets, and reduced-motion support.
- Use the downloaded TJP emblem from the media registry; its source and original rights are recorded in `public/images/CREDITS.md`. Do not invent official policies, leadership, endorsements, statistics, contact details, or membership functionality.
- Keep the header compact and use `Brand compact showWordmark` with the small, responsive “Tehreek Jawanan Pakistan” wordmark and its letter reveal. Respect reduced motion. Other compact Brand instances remain logo-only. The language switch displays only the other available language; hide it and the Join TJP button in the main header below 640px. Retain language switching in the mobile drawer and footer. Keep the mobile drawer compact, with a branded header, scrollable navigation, and aligned signup/language actions.
- Primary buttons use the shared animated shine and corner borders. Reuse the existing Button; do not create a second animated button. Use `inverse` and `inverse-ghost` on image backgrounds.
- Keep homepage copy concise. English body text uses 1.5 line-height; Urdu has script-specific spacing for legibility.
- Membership uses a compact PageIntro with a short heading and concise guidance. Use shared shadcn Select fields for province and interest, retaining required validation, keyboard/RTL support, stable values across languages, reset-on-navigation, and print styling. Other forms retain their existing dropdowns.
- Keep the Make a Connection section in one shared bordered panel with three adjoining columns, no gaps, plain icons without background badges, and compact vertical padding. Stack its columns with horizontal dividers on phones; use logical vertical dividers on wider screens.
- The homepage hero and header together fill 100svh. Center hero text at 640px and above. Below 640px, use smaller, compact copy positioned at the bottom and centered horizontally. Keep the hero's Join TJP and secondary Discover TJP actions centered in one row in both languages, with compact padding on phones; do not add an Our focus hero button. Keep section/location labels and bottom slider controls hidden. Images change automatically every 4 seconds, including on pointer hover. Preserve horizontal trackpad/swipe and keyboard navigation without intercepting vertical page scroll or pinch-to-zoom. Respect reduced motion, pause on keyboard focus, and retain a keyboard-accessible pause/resume control that is visually hidden until focused.
- Keep image credits accessible in the Footer. Use `config/media.js` for shared local images and their provenance. TJP archive photos retain their original rights; only the four landscape/heritage photos carry the existing CC BY-SA 4.0 license. Preserve those photographers' credits in `public/images/home/CREDITS.md` and all source records in `public/images/CREDITS.md`.
- Login currently leads to an explicit unavailable state. Do not add fake authentication or collect credentials without an authorized authentication integration.

## English and Urdu

- Every new page and component must support both English and Urdu, including accessibility labels, empty states, tooltips, errors, and mobile controls.
- Put all visitor-facing copy in `client/src/i18n/messages.js`; never hardcode interface text in components.
- Use `useLanguage()` inside client components to access `messages`, `locale`, `direction`, and `setLocale`.
- Maintain identical translation keys and value shapes in both dictionaries. Missing translations must be fixed before delivery.
- The shared `LanguageProvider` handles saved browser preferences, cross-tab changes, HTML `lang`/`dir`, and Radix direction. Do not add a second language store or provider.
- English uses LTR and Urdu uses RTL. Test both, including Sheet side, close controls, arrows, navigation, and typography. Urdu uses the shared Urdu font stack.
- English is the default for new visitors and initial static HTML. Honor a visitor's explicitly saved language preference after hydration. Language switching is client-side and does not create separate indexable locale routes.

## Validation and maintenance

- Keep static route composition as Server Components; use client boundaries when context or interaction is needed.
- Preserve existing query-cache and animation providers. Add no backend calls for placeholder features.
- Use the shared `ScrollReveals` provider and `data-scroll-reveal` attributes for subtle scroll entry animations. Animate each block once without adding wrappers or changing layout, honor reduced motion and focus, and leave server-rendered content visible.
- Link only to implemented destinations. Do not add fake forms or nonfunctional calls to action.
- Run relevant tests and a production build after functional changes. Check desktop/mobile layouts, both languages, keyboard navigation, and language persistence where browser verification is available.
- Update `client/README.md` when architecture, commands, or component contracts change.
- Follow these instructions for every future change and maintain consistency with this architecture and design system.
