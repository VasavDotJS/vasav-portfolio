# vasav p ramesh — portfolio

Single-page portfolio. Paper and OLED themes, riso halftone, neomorphic controls, a collage
hero, a loader that prints the page. Next.js 16, React 19, GSAP + Lenis, React Three Fiber.

## run it

```bash
corepack pnpm install
corepack pnpm dev          # http://localhost:3000
corepack pnpm build && corepack pnpm start
corepack pnpm lint         # eslint + banned-copy check
corepack pnpm typecheck
corepack pnpm test         # vitest: contact handler + demo math
```

Useful URL switches: `?no3d` (static print instead of WebGL), `?force3d` (WebGL even on a
software renderer), `/lab` (every UI primitive in every state, both themes; not indexed).

## contact form (Resend)

1. Copy `.env.example` to `.env.local`.
2. Create an API key at <https://resend.com/api-keys> and set `RESEND_API_KEY`.
3. `CONTACT_TO_EMAIL` is where messages land (defaults to the address in `content/profile.ts`).
4. `CONTACT_FROM_EMAIL`: until you verify a domain in Resend, keep
   `portfolio <onboarding@resend.dev>`. That sender **only delivers to the email that owns the
   Resend account**, so sign up for Resend with the same address as `CONTACT_TO_EMAIL`.
   After verifying a domain, change it to something like `portfolio <hi@yourdomain.com>`.
5. On Vercel, add the same variables under Project → Settings → Environment Variables.

Replies work directly: every message sets `reply-to` to the sender's address.

Spam handling: hidden honeypot field, 3-second minimum fill time, 5 messages per IP per
10 minutes (in memory, per server instance). If it ever gets real traffic, swap the limiter in
`lib/contact.ts` for `@upstash/ratelimit`.

No backend wanted? Set `CONTACT_PROVIDER=web3forms` and `WEB3FORMS_ACCESS_KEY` (free key from
<https://web3forms.com>). The form component doesn't change. The copy button and `mailto:` link
always work, with or without JavaScript.

## edit copy

Everything you read on the page lives in `/content`:

- `profile.ts` — name, links, email, your own quoted lines, the portrait slot
- `projects.ts` — featured projects and the archive
- `stack.ts` — keycaps and which repos use each one
- `copy.ts` — every other line of UI text

`corepack pnpm lint` fails if any copy uses the banned words listed in `CLAUDE.md`.

### add a project

1. Add an entry to `featured` in `content/projects.ts` (check every bullet against the repo).
2. Give it a cover in `components/work/Thumb.tsx` and a spot in `FEATURED_POS` in
   `components/work/Desktop.tsx`.
3. Optional: a demo block in `components/work/WindowContent.tsx`.
4. Add its tools to `content/stack.ts` `usedIn` lists.

Archive repos only need a line in `archive` (same file).

### add your photo

Put it in `public/portrait/` and set `portrait: { src: '/portrait/you.jpg', alt: '…' }` in
`content/profile.ts`. It shows blurred behind the desktop icons, like the inspo.

## static fallback

`public/halftone-{light,dark}.webp` are renders of the 3D object, shown when WebGL is missing,
software-rendered, too slow, or the visitor prefers reduced motion. Regenerate after changing
the scene: run the dev server, then `node scripts/capture-fallback.mjs`.
