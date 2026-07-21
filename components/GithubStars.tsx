'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SiGithub } from '@icons-pack/react-simple-icons'

import { GITHUB_REPOSITORY_STATS_URL } from '@/config/api'
import { GITHUB_REPOSITORY_URL } from '@/config/site'

export function GithubButton() {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    let canceled = false

    async function fetchStars() {
      try {
        const res = await fetch(GITHUB_REPOSITORY_STATS_URL, {
          headers: {
            Accept: 'application/json'
          }
        })

        if (!res.ok) return

        const data = (await res.json()) as { stargazersCount?: unknown }
        if (!canceled && typeof data.stargazersCount === 'number') {
          setStars(data.stargazersCount)
        }
      } catch {
        // ignore network errors, keep stars as null
      }
    }

    fetchStars()

    return () => {
      canceled = true
    }
  }, [])

  const baseClass =
    'inline-flex items-center gap-1 rounded-md p-2 text-xs font-medium text-neutral-800 transition-colors hover:bg-neutral-200 dark:text-neutral-100 dark:hover:bg-neutral-800'

  if (stars === null) {
    return (
      <Link href={GITHUB_REPOSITORY_URL} target="_blank" className={baseClass}>
        <SiGithub className="size-4" />
      </Link>
    )
  }

  return (
    <Link href={GITHUB_REPOSITORY_URL} target="_blank" className={baseClass}>
      <SiGithub className="size-4" />
      <span className="rounded py-0.5 pr-2 pl-1 text-sm leading-none font-bold text-neutral-700 dark:text-neutral-300">
        {stars.toLocaleString('en-US', {
          notation: 'compact',
          compactDisplay: 'short',
          maximumFractionDigits: 1,
          minimumFractionDigits: 1
        })}
      </span>
    </Link>
  )
}
