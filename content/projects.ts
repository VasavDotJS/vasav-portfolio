// Every line here was checked against the repo's code (not just its README).
// If you change a claim, check it against the repo first.

export type ProjectId = 'xprso' | 'fintarot' | 'designdump' | 'moodtunes' | 'mediplan'

export type FeaturedProject = {
  id: ProjectId
  index: string
  name: string
  /** label on the desktop icon */
  label: string
  repo: string
  url: string
  language: string
  /** ISO month of the latest push */
  date: string
  dateLabel: string
  oneLiner: string
  body: string
  bullets: string[]
  stack: string[]
  note?: string
}

export const featured: FeaturedProject[] = [
  {
    id: 'xprso',
    index: '01',
    name: 'XPRSO',
    label: 'XPRSO',
    repo: 'VasavDotJS/XPRSO-beta',
    url: 'https://github.com/VasavDotJS/XPRSO-beta',
    language: 'TypeScript',
    date: '2026-10',
    dateLabel: 'oct 2026',
    oneLiner: 'a café point-of-sale built for one hand and a morning rush.',
    body: "money is stored in whole paise so rounding can't drift; GST invoices are numbered without gaps; once a bill is settled, the database refuses to change it. staff sign in with passkeys. the reports are plain SQL.",
    bullets: [
      'money is integer paise, tax is basis points (500 = 5%)',
      'invoice numbers run gapless per indian financial year, behind a row lock: ORD/26-27/000001',
      'triggers reject UPDATE and DELETE on settled orders and their lines',
      'staff sign in with WebAuthn passkeys, with a password fallback; admin screens need a step-up that lasts 10 minutes',
      'analytics are deterministic SQL: gross profit per line, top sellers, items with zero sales. no LLM',
      'exports an A4 GST invoice PDF, an 80mm thermal receipt and a typed .xlsx',
      'deploys to Vercel or Netlify with Neon, or self-hosted with Docker Compose: app, Postgres 17, Caddy for HTTPS, nightly backups',
      'tested with Vitest and Playwright, CI on GitHub Actions',
    ],
    stack: ['Next.js 15', 'React 19', 'TypeScript', 'PostgreSQL', 'Drizzle', 'Tailwind', 'Docker', 'Vitest', 'Playwright'],
    note: 'its own design brief asks for obsidian pills, inset wells and smoked glass. same instinct as this page.',
  },
  {
    id: 'fintarot',
    index: '02',
    name: 'FinTarot',
    label: 'FINTAROT',
    repo: 'VasavDotJS/Fin-Tarot',
    url: 'https://github.com/VasavDotJS/Fin-Tarot',
    language: 'Python',
    date: '2026-07',
    dateLabel: 'jul 2026',
    oneLiner: "tries to guess tomorrow's stock return, then checks its own homework.",
    body: 'walk-forward backtests on past data only, and every model is scored against "tomorrow looks like today". the backtest says so out loud when it loses. predictions come with an 80% interval and an ASCII chart in the terminal.',
    bullets: [
      'forecasts next-day log returns for S&P 500 stocks',
      'yfinance into Parquet, fetching only the missing dates; tickers scraped from Wikipedia with a local fallback',
      'features: SMA, EMA, MACD with signal and histogram, RSI, Bollinger Bands, rolling volatility',
      'OLS and XGBoost, both measured against a naive persistence baseline',
      'walk-forward: retrains every 20 days on prior data only, reports MAE, RMSE, directional accuracy and Sharpe',
      '80% interval from training residuals (z = 1.28)',
      'pytest, with the network mocked',
    ],
    stack: ['Python', 'pandas', 'scikit-learn', 'XGBoost', 'yfinance', 'Parquet', 'Typer', 'Rich', 'pytest'],
    note: 'it does not make money. it measures how wrong it is.',
  },
  {
    id: 'designdump',
    index: '03',
    name: 'designdump',
    label: 'DESIGNDUMP',
    repo: 'VasavDotJS/design-dump',
    url: 'https://github.com/VasavDotJS/design-dump',
    language: 'JavaScript',
    date: '2026-07',
    dateLabel: 'jul 2026',
    oneLiner: "point it at a website; get the website's design system back.",
    body: 'opens the page in a headless browser, reads the computed styles, and writes a plain-english style guide, design tokens as JSON with CSS and Tailwind snippets, a prompt file for AI coding tools, and screenshots at four sizes.',
    bullets: [
      'node CLI: designdump <url>, or run it bare and paste a link',
      'reads colors, type, spacing and component styles from the live page',
      'names the palette and groups it into primary, secondary, neutral and semantic',
      'type scale for h1 to h6, body and small text; spacing scale from real margins and paddings',
      'grabs the logo and favicon',
      'screenshots at 1440×900, 768×1024, 375×667 and full page',
      'Vitest tests',
    ],
    stack: ['JavaScript', 'Node', 'Playwright', 'commander', 'colord', 'Vitest'],
  },
  {
    id: 'moodtunes',
    index: '04',
    name: 'MoodTunes',
    label: 'MOODTUNES',
    repo: 'VasavDotJS/MoodTunes',
    url: 'https://github.com/VasavDotJS/MoodTunes',
    language: 'Python',
    date: '2026-01',
    dateLabel: 'jan 2026',
    oneLiner: 'tell it how you feel. it answers with genres, from bedroom pop to black metal.',
    body: 'TextBlob scores the sentiment of what you type, the score picks one of five moods, and each mood maps to a handful of genres with Spotify links.',
    bullets: [
      'Streamlit app',
      'TextBlob polarity picks happy, energetic, calm, angry or sad',
      'genres include hyperpop, DnB, color bass, IDM, noise, black metal, nu metal, hardstyle, bedroom pop and lo-fi hip hop',
      'every genre links to a Spotify search',
    ],
    stack: ['Python', 'Streamlit', 'TextBlob'],
  },
  {
    id: 'mediplan',
    index: '05',
    name: 'MediPlan',
    label: 'MEDIPLAN',
    repo: 'VasavDotJS/MediPlan',
    url: 'https://github.com/VasavDotJS/MediPlan',
    language: 'TypeScript',
    date: '2026-05',
    dateLabel: 'may 2026',
    oneLiner: 'patients book, doctors decide, admins see all of it. the database lives in a private subnet.',
    body: 'a healthcare appointment booking system, built as a DevSecOps capstone: a React front end, an Express API, and the AWS network it runs in, written as Terraform.',
    bullets: [
      'three roles (patient, doctor, admin), checked by JWT middleware on every route',
      'patients book a doctor, a date and a reason; it starts as pending',
      'doctors and admins move it to confirmed, cancelled or completed, with notes',
      'Express 5, TypeORM and MySQL; argon2 passwords, helmet, rate limiting, express-validator',
      'React 19, Vite and React Router, styled with Tailwind',
      'Terraform: a VPC with public and private subnets, EC2, RDS MySQL in the private subnets, S3',
      'Docker Compose locally, a GitHub Actions build workflow',
    ],
    stack: ['TypeScript', 'React', 'Vite', 'Express', 'TypeORM', 'MySQL', 'Terraform', 'Docker'],
  },
]

export type ArchiveItem = {
  repo: string
  file: string
  language: string
  date: string
  line: string
}

const gh = (repo: string) => `https://github.com/VasavDotJS/${repo}`

export const archive: (ArchiveItem & { url: string })[] = [
  { repo: 'neovimConfig', file: 'neovimConfig.lua', language: 'Lua', date: 'jul 2025', line: 'my neovim config so i dont accidentally lose my shit!!!!' },
  { repo: 'Python-App-Docker-Compose', file: 'todo-compose.py', language: 'Python', date: 'may 2026', line: 'a small flask to-do app, containerized with compose' },
  { repo: 'blog-app', file: 'blog-app.py', language: 'Python', date: 'may 2026', line: 'flask + mysql blog, another devsecops capstone' },
  { repo: 'unitStandardizer', file: 'unitStandardizer.py', language: 'Python', date: 'sep 2025', line: 'a python class that standardizes height units' },
  { repo: 'rockPaperScissors', file: 'rockPaperScissors.c', language: 'C', date: 'mar 2025', line: 'rock, paper, scissors against rand()' },
  { repo: 'deciStack', file: 'deciStack.c', language: 'C', date: 'feb 2025', line: 'decimal to binary, using a stack' },
  { repo: 'binarySearch', file: 'binarySearch.c', language: 'C', date: 'feb 2025', line: 'binary search on an array' },
  { repo: 'randomNumberGuesser', file: 'randomNumberGuesser.c', language: 'C', date: 'feb 2025', line: 'guess a random number from 1 to 10' },
  { repo: 'leetCodeProrgams', file: 'leetCodeProrgams.c', language: 'C', date: 'jan 2025', line: 'leetcode answers, kept as a tracker' },
  { repo: 'recordProjects', file: 'recordProjects.c', language: 'C', date: 'dec 2024', line: 'the record-book programs everyone writes' },
].map((a) => ({ ...a, url: gh(a.repo) }))

export const projectName = (id: ProjectId) => featured.find((p) => p.id === id)?.name ?? id
