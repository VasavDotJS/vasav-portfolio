// One keycap per language/tool. `usedIn` only lists pairings verified in the repos.
// No levels, no percentages.

export type StackKey = {
  id: string
  label: string
  /** shorter legend for small keycaps */
  legend?: string
  kind: 'language' | 'tool'
  usedIn: string[]
  /** relative keycap width (1 = square) */
  w?: number
}

export const stack: StackKey[][] = [
  [
    { id: 'c', label: 'C', kind: 'language', usedIn: ['deciStack', 'binarySearch', 'randomNumberGuesser', 'rockPaperScissors', 'recordProjects', 'leetCodeProrgams'] },
    { id: 'python', label: 'Python', kind: 'language', usedIn: ['FinTarot', 'MoodTunes', 'unitStandardizer', 'blog-app', 'Python-App-Docker-Compose'], w: 1.5 },
    { id: 'typescript', label: 'TypeScript', legend: 'TS', kind: 'language', usedIn: ['XPRSO', 'MediPlan'] },
    { id: 'javascript', label: 'JavaScript', legend: 'JS', kind: 'language', usedIn: ['designdump'] },
    { id: 'lua', label: 'Lua', kind: 'language', usedIn: ['neovimConfig'] },
    { id: 'html', label: 'HTML', kind: 'language', usedIn: ['blog-app', 'Python-App-Docker-Compose'] },
  ],
  [
    { id: 'nextjs', label: 'Next.js', kind: 'tool', usedIn: ['XPRSO'], w: 1.25 },
    { id: 'react', label: 'React', kind: 'tool', usedIn: ['XPRSO', 'MediPlan'] },
    { id: 'tailwind', label: 'Tailwind', kind: 'tool', usedIn: ['XPRSO', 'MediPlan'], w: 1.25 },
    { id: 'postgres', label: 'PostgreSQL', legend: 'Postgres', kind: 'tool', usedIn: ['XPRSO'], w: 1.25 },
    { id: 'drizzle', label: 'Drizzle', kind: 'tool', usedIn: ['XPRSO'] },
    { id: 'mysql', label: 'MySQL', kind: 'tool', usedIn: ['MediPlan', 'blog-app'] },
  ],
  [
    { id: 'docker', label: 'Docker', kind: 'tool', usedIn: ['XPRSO', 'MediPlan', 'blog-app', 'Python-App-Docker-Compose'], w: 1.25 },
    { id: 'terraform', label: 'Terraform', kind: 'tool', usedIn: ['MediPlan'], w: 1.25 },
    { id: 'streamlit', label: 'Streamlit', kind: 'tool', usedIn: ['MoodTunes'], w: 1.25 },
    { id: 'xgboost', label: 'XGBoost', kind: 'tool', usedIn: ['FinTarot'], w: 1.25 },
    { id: 'pytest', label: 'pytest', kind: 'tool', usedIn: ['FinTarot'] },
  ],
  [
    { id: 'vitest', label: 'Vitest', kind: 'tool', usedIn: ['XPRSO', 'designdump'] },
    { id: 'playwright', label: 'Playwright', kind: 'tool', usedIn: ['XPRSO', 'designdump'], w: 1.5 },
    { id: 'git', label: 'Git', kind: 'tool', usedIn: ['all of it'] },
    { id: 'neovim', label: 'Neovim', kind: 'tool', usedIn: ['neovimConfig'], w: 2.25 },
  ],
]

export const stackFlat = stack.flat()
