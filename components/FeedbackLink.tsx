import { ReactNode } from 'react'
import { ExternalLink } from 'lucide-react'

interface FeedbackLinkProps {
  href: string
  icon: ReactNode
  name: string
  type: 'qq' | 'telegram'
  id: string
  password: string | null
  color: string
}

export function FeedbackLink({ href, icon, name, type, id, password, color }: FeedbackLinkProps) {
  const platformName = type === 'qq' ? 'QQ' : 'Telegram'

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group hover:border-akari-300 hover:bg-akari-50/50 dark:hover:border-akari-500/50 dark:hover:bg-akari-500/5 relative flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-4 transition-[background-color,border-color,transform] duration-200 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 transition-[background-color] duration-200 group-hover:bg-white dark:bg-neutral-800 dark:group-hover:bg-neutral-700 ${color}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold text-neutral-900 dark:text-neutral-100">{name}</div>
        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span>{platformName}</span>
          <span className="text-neutral-400 dark:text-neutral-500">•</span>
          <span className="truncate">{id}</span>
          {password && (
            <>
              <span className="text-neutral-400 dark:text-neutral-500">•</span>
              <span>密码 {password}</span>
            </>
          )}
        </div>
      </div>
      <ExternalLink className="group-hover:text-akari-500 h-4 w-4 shrink-0 text-neutral-400 transition-colors" />
    </a>
  )
}
