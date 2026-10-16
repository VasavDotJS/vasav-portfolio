# CLAUDE.md — Vasav P Ramesh portfolio

Single-page, scroll-driven portfolio. Soft neomorphic UI × riso/halftone/collage print culture, held
together by Swiss type. Two themes: warm paper (light) and true-black OLED (dark).
Read `AGENTS.md`: this is Next.js 16; check `node_modules/next/dist/docs/` before using an API.

## Stack
- Next.js 16 (App Router, Turbopack) · React 19.3 · TypeScript 6 (strict; typescript-eslint does not support TS 7 yet) · Tailwind v4 (layout utilities only)
- GSAP 3.15 + ScrollTrigger + SplitText (owns scroll). Always import from `@/lib/gsap` (plugins registered at module scope; registering in an effect is too late for child effects) · Lenis (smooth scroll, synced to `gsap.ticker`)
- Motion (`motion/react`, `LazyMotion` + `m.*`) only for component state (press, toggle, drag). Never on an element GSAP animates.
- React Three Fiber 9 + drei + @react-three/postprocessing, custom GLSL in `/shaders`
- Zod (shared client/server schema) · Resend (contact) · pnpm via `corepack pnpm`
- No UI kits, no icon packs. Icons are hand-drawn in `components/icons.tsx`.

## Commands
- `corepack pnpm dev` / `build` / `start`
- `corepack pnpm lint` (ESLint + banned-copy check) · `typecheck` · `test` (Vitest)
- Screenshots: `PLAYWRIGHT_BROWSERS_PATH=/tmp/claude-1000/ms-playwright node scripts/shoot.mjs / <outDir>`
  (`--full`, `--scroll=0,900`, `--sizes=desktop,tablet,mobile`, `--themes=light,dark`, `--loader`)
- Disk on /home is tight: keep Playwright browsers, Lighthouse and npm cache under /tmp.

## Files
- `/content` — ALL copy and facts (`profile.ts`, `projects.ts`, `stack.ts`, `copy.ts`). Components never hard-code copy.
- `/styles` — `tokens.css` (theme tokens), `soft.css` (neomorphic primitives), `chrome.css`, section CSS.
- `/lib` — client stores: `theme-store`, `light-store` (global light), `section-store`, `scroll` (Lenis), `sound`, `seeded-random`, `github`.
- `/components/{chrome,soft,hero,loader,work,stack,contact,three,fx}`
- `app/lab` — hidden playground for every primitive in every state (noindex).

## Facts and copy rules
- Never invent facts about Vasav. Every claim traces to `content/` and to code read in his repos.
  The repo wins over any brief: XPRSO hashes passwords with scrypt (not Argon2id); designdump is not on npm.
- No metrics, users, clients, outcomes, testimonials, "years of experience", skill bars or percentages.
- FinTarot never "makes money" or "beats the market".
- Voice: dry, short, specific, deadpan. Lowercase microcopy; proper case for names/titles where it looks better.
  Show the technical decision instead of praising it.
- Banned (enforced by `scripts/check-copy.mjs`): passionate, passion, innovative, cutting-edge, state-of-the-art,
  leverage, seamless(ly), journey, craft/crafting (code), elevate, unlock, empower, delve, tapestry, realm,
  landscape, synergy, robust, dynamic, transformative, game-changer, next-level, world-class, pixel-perfect,
  "turning ideas into reality", "bringing ideas to life", "I'm a X who loves to Y", "let's build something",
  "let's connect", "hi there", "welcome to my portfolio", "thanks for stopping by", "in today's fast-paced world",
  "hire me". No emoji in copy. No exclamation marks except his own quoted lines.
  Also avoid: rhetorical-question intros, three-adjective lists, em-dash chains, fake modesty or confidence.

## Design tokens (styles/tokens.css)
- Light: bg `#E8E5DF`, ink `#0E0E0E`, muted `#5B5852`, coral `#EB6461`, yellow `#FCE244` (sampled from inspo A).
- Dark: bg `#000000` exactly (never grey panels, never full-screen blur), surfaces `#0A0A0B`/`#111113`,
  ink `#EDEBE6` (never #FFF for large text), coral `#F07A70`, yellow `#FFE14A` (sparingly).
- Coral is never body text on paper (fails AA). Text on coral/yellow is always `#0E0E0E`.
- Grain uses `multiply` in both themes so dark-mode black stays `#000`.
- Radii: pills 999px, cards 28px, keycaps 14px, collage pieces 0. 8px spacing scale, 12-col grid, 24/16px gutters, max 1600px.
- Type: system SF/Helvetica stack; fallbacks via next/font: Inter (text), Inter Tight (display only — its space is too narrow for body); mono = SF Mono → JetBrains Mono.
  Display tracking −0.04 to −0.06em, body −0.01em, tabular nums for counters/dates.

## Neomorphism
- One global light: `lib/light-store.ts` writes `--lx/--ly` (−1..1) on `:root`; `--sx/--sy` derive shadow direction.
  Every soft surface computes shadows/speculars from these. The 3D scene reads `getLight()`.
- Light theme = dual shadow. Dark theme = 1px top rim + specular gradient + glow only when pressed.
- States: rest raised · hover higher (+magnetic ≤8px) · press inset (90ms) · focus-visible = high-contrast ring · disabled flat.
- Primitives in `components/soft`: SoftButton, SoftToggle, SoftInput, SoftCard, Keycap, Dock. Compose from these.

## Motion
- Easings `--ease-out` (.16,1,.3,1), `--ease-in-out` (.65,0,.35,1). Micro 120–180ms, UI 320–480ms,
  reveals 700–1000ms, theme 900ms.
- Collage/paper motion is stepped (`steps()`, 8–12fps). Neomorphic motion is smooth. That contrast is the signature.
- `prefers-reduced-motion`: no Lenis, no jitter, no parallax, crossfades only; the site must stay complete.
- Never break native behaviour: anchors, back button, find-in-page, keyboard scroll.

## Accessibility
- Hero name is a real `<h1>`; collage pieces are `aria-hidden`. Everything readable is DOM text, never WebGL-only.
- Visible focus ring on every interactive element. Custom cursor only on `(pointer: fine)`, never on text inputs.
- AA contrast for every text/background pair. No autoplaying sound.

## Performance budgets
- Initial JS ≤ ~200KB gzipped excluding the lazy 3D chunk (three.js loads after the loader starts).
- Lighthouse mobile: Perf ≥ 85, A11y ≥ 95, BP ≥ 95, SEO ≥ 95. Desktop Perf ≥ 95.
- LCP < 2.5s, CLS < 0.05, INP < 200ms. Canvas DPR clamped [1, 1.75]; pause 3D off-screen and in hidden tabs.

## Conventions
- Prettier: no semicolons, single quotes, width 100. Client components start with `'use client'`.
- CSS custom properties for anything themeable; Tailwind classes for layout/spacing only.
- Commit at the end of each build phase; push to `origin main`.
