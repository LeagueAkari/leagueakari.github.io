'use client'

import { useEffect, useState } from 'react'
import { Globe2, Mail, MessageCircle, RefreshCw } from 'lucide-react'
import { SiQq, SiTelegram } from '@icons-pack/react-simple-icons'

import { FeedbackLink } from '@/components/FeedbackLink'
import { CONTACT_CHANNELS_URL } from '@/config/api'

type ContactChannelPlatform = 'qq' | 'telegram' | 'discord' | 'email' | 'website' | 'other'

interface ContactChannel {
  id: string
  platform: ContactChannelPlatform
  name: string
  identifier: string
  url: string
  password: string | null
}

interface ContactChannelsDocument {
  channels: ContactChannel[]
  updatedAt: string
}

type LoadState = { status: 'loading' } | { status: 'ready'; document: ContactChannelsDocument } | { status: 'error' }

const platforms = new Set<ContactChannelPlatform>(['qq', 'telegram', 'discord', 'email', 'website', 'other'])

const platformLabels: Record<ContactChannelPlatform, string> = {
  qq: 'QQ',
  telegram: 'Telegram',
  discord: 'Discord',
  email: '邮箱',
  website: '网站',
  other: '其他'
}

const platformColors: Record<ContactChannelPlatform, string> = {
  qq: 'text-blue-500',
  telegram: 'text-blue-400',
  discord: 'text-indigo-500',
  email: 'text-emerald-500',
  website: 'text-violet-500',
  other: 'text-neutral-500'
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

const isSupportedUrl = (value: string) => {
  try {
    const protocol = new URL(value).protocol
    return protocol === 'https:' || protocol === 'mailto:'
  } catch {
    return false
  }
}

function parseContactChannels(value: unknown): ContactChannelsDocument {
  if (!isRecord(value) || typeof value.updatedAt !== 'string' || !Array.isArray(value.channels)) {
    throw new Error('Invalid contact channels document')
  }

  const channels = value.channels.map((channel) => {
    if (
      !isRecord(channel) ||
      typeof channel.id !== 'string' ||
      typeof channel.platform !== 'string' ||
      !platforms.has(channel.platform as ContactChannelPlatform) ||
      typeof channel.name !== 'string' ||
      typeof channel.identifier !== 'string' ||
      typeof channel.url !== 'string' ||
      !isSupportedUrl(channel.url) ||
      (channel.password !== null && typeof channel.password !== 'string')
    ) {
      throw new Error('Invalid contact channel')
    }

    return channel as unknown as ContactChannel
  })

  return { channels, updatedAt: value.updatedAt }
}

function ChannelIcon({ platform }: { platform: ContactChannelPlatform }) {
  if (platform === 'qq') return <SiQq className="size-5" />
  if (platform === 'telegram') return <SiTelegram className="size-5" />
  if (platform === 'email') return <Mail className="size-5" />
  if (platform === 'website') return <Globe2 className="size-5" />
  return <MessageCircle className="size-5" />
}

export function FeedbackChannels() {
  const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' })
  const [requestVersion, setRequestVersion] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadContactChannels() {
      try {
        const response = await fetch(CONTACT_CHANNELS_URL, {
          headers: { Accept: 'application/json' },
          signal: controller.signal
        })
        if (!response.ok) throw new Error(`Contact channels request failed: ${response.status}`)

        const document = parseContactChannels(await response.json())
        setLoadState({ status: 'ready', document })
      } catch {
        if (controller.signal.aborted) return
        setLoadState({ status: 'error' })
      }
    }

    void loadContactChannels()
    return () => controller.abort()
  }, [requestVersion])

  if (loadState.status === 'loading') {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3" role="status" aria-label="正在加载交流渠道">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="h-[74px] animate-pulse rounded-lg border border-neutral-200 bg-white/70 dark:border-neutral-800 dark:bg-neutral-900/70"
          />
        ))}
      </div>
    )
  }

  if (loadState.status === 'error') {
    return (
      <div className="rounded-lg border border-dashed border-neutral-300 bg-white/60 px-6 py-8 text-center dark:border-neutral-700 dark:bg-neutral-900/60">
        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">交流渠道暂时加载失败</p>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">请稍后重试，或前往 GitHub 联系我们。</p>
        <button
          type="button"
          className="hover:border-akari-300 hover:text-akari-600 dark:hover:border-akari-500/60 dark:hover:text-akari-400 mt-4 inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 transition-colors dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
          onClick={() => {
            setLoadState({ status: 'loading' })
            setRequestVersion((current) => current + 1)
          }}
        >
          <RefreshCw className="size-3.5" />
          重新加载
        </button>
      </div>
    )
  }

  if (!loadState.document.channels.length) {
    return (
      <p className="rounded-lg border border-dashed border-neutral-300 px-6 py-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
        暂无可用的交流渠道。
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {loadState.document.channels.map((channel) => (
        <FeedbackLink
          key={channel.id}
          href={channel.url}
          icon={<ChannelIcon platform={channel.platform} />}
          name={channel.name}
          platformLabel={platformLabels[channel.platform]}
          identifier={channel.identifier}
          password={channel.password}
          color={platformColors[channel.platform]}
        />
      ))}
    </div>
  )
}
