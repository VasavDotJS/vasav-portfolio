import { featured } from '@/content/projects'

// Build-time / ISR data from the public GitHub API, with a static fallback.
// Never fakes numbers: if the API fails, the fallback is the last verified snapshot.

export type GitHubSnapshot = {
  repo: string
  pushedAt: string
  publicRepos: number | null
  languages: string[]
  live: boolean
}

const USER = 'VasavDotJS'
const FALLBACK: GitHubSnapshot = {
  repo: 'XPRSO-beta',
  pushedAt: '2026-10-12T19:19:10Z',
  publicRepos: 19,
  languages: ['TypeScript', 'Python', 'JavaScript'],
  live: false,
}

async function gh<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      accept: 'application/vnd.github+json',
      ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
    next: { revalidate: 21600 },
  })
  if (!res.ok) throw new Error(`github ${res.status}`)
  return res.json() as Promise<T>
}

export async function getGitHubSnapshot(): Promise<GitHubSnapshot> {
  try {
    const [repos, user] = await Promise.all([
      gh<{ name: string; pushed_at: string; private: boolean }[]>(`/users/${USER}/repos?sort=pushed&per_page=1`),
      gh<{ public_repos: number }>(`/users/${USER}`),
    ])
    const latest = repos[0]
    // language bytes across the featured repos, ordered (no percentages shown)
    const langs = await Promise.all(
      featured.map((p) => gh<Record<string, number>>(`/repos/${p.repo}/languages`).catch(() => ({}))),
    )
    const total: Record<string, number> = {}
    for (const l of langs) for (const [k, v] of Object.entries(l)) total[k] = (total[k] ?? 0) + v
    const languages = Object.entries(total)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([k]) => k)
    if (!latest) return FALLBACK
    return {
      repo: latest.name,
      pushedAt: latest.pushed_at,
      publicRepos: user.public_repos,
      languages: languages.length ? languages : FALLBACK.languages,
      live: true,
    }
  } catch {
    return FALLBACK
  }
}
