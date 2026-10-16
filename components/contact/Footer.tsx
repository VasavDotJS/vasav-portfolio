import { footer } from '@/content/copy'
import { getGitHubSnapshot } from '@/lib/github'
import { RelTime } from './RelTime'

export async function Footer() {
  const gh = await getGitHubSnapshot()
  return (
    <footer className="wrap site-footer">
      <div className="metabar meta flex-wrap">
        <span>{footer.copyright}</span>
        <span>{footer.built}</span>
        <span>
          {footer.lastPush}:{' '}
          <a href={`https://github.com/VasavDotJS/${gh.repo}`} target="_blank" rel="noreferrer">
            {gh.repo}
          </a>{' '}
          <RelTime iso={gh.pushedAt} />
        </span>
      </div>
      <div className="metabar meta flex-wrap border-t-0 text-ink-muted">
        {gh.publicRepos != null && (
          <span>
            {gh.publicRepos} {footer.repos}
          </span>
        )}
        <span>
          {footer.writes}: {gh.languages.join(' > ').toLowerCase()}
        </span>
      </div>
    </footer>
  )
}
