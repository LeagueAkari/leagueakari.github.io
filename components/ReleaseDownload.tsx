'use client'

import { useEffect, useState } from 'react'
import { Download, ExternalLink, RefreshCw } from 'lucide-react'

import { LATEST_RELEASE_URL } from '@/config/api'
import { GITHUB_RELEASES_URL, LANZOU_DOWNLOAD_URL, LANZOU_PASSWORD } from '@/config/site'

interface ReleaseArtifact {
  platform: 'win32'
  arch: 'x64'
  fileName: string
  downloadUrl: string
}

interface ReleaseDocument {
  version: string
  artifact: ReleaseArtifact
}

type LoadState = { status: 'loading' } | { status: 'ready'; document: ReleaseDocument } | { status: 'error' }

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

const isHttpsUrl = (value: string) => {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

function parseRelease(value: unknown): ReleaseDocument {
  if (!isRecord(value) || typeof value.version !== 'string' || !value.version || !Array.isArray(value.artifacts)) {
    throw new Error('Invalid release document')
  }

  const artifact = value.artifacts.find(
    (candidate) =>
      isRecord(candidate) &&
      candidate.platform === 'win32' &&
      candidate.arch === 'x64' &&
      typeof candidate.fileName === 'string' &&
      candidate.fileName.toLowerCase().endsWith('.7z') &&
      typeof candidate.downloadUrl === 'string' &&
      isHttpsUrl(candidate.downloadUrl)
  )

  if (!artifact) throw new Error('Windows x64 release artifact not found')

  return {
    version: value.version,
    artifact: artifact as unknown as ReleaseArtifact
  }
}

export function ReleaseDownload() {
  const [loadState, setLoadState] = useState<LoadState>({ status: 'loading' })
  const [requestVersion, setRequestVersion] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadRelease() {
      try {
        const response = await fetch(LATEST_RELEASE_URL, {
          headers: { Accept: 'application/json' },
          signal: controller.signal
        })
        if (!response.ok) throw new Error(`Release request failed: ${response.status}`)

        setLoadState({ status: 'ready', document: parseRelease(await response.json()) })
      } catch {
        if (controller.signal.aborted) return
        setLoadState({ status: 'error' })
      }
    }

    void loadRelease()
    return () => controller.abort()
  }, [requestVersion])

  const release = loadState.status === 'ready' ? loadState.document : null

  return (
    <>
      <div className="flex w-full flex-col justify-center gap-4 pt-4 sm:flex-row" id="download">
        <a
          href={GITHUB_RELEASES_URL}
          target="_blank"
          rel="noreferrer"
          className="bg-akari-500 shadow-akari-500/20 hover:bg-akari-600 inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3 font-semibold text-white shadow-lg transition-all"
        >
          GitHub
          <ExternalLink className="size-4 text-white/70" />
        </a>

        <a
          href={LANZOU_DOWNLOAD_URL}
          target="_blank"
          rel="noreferrer"
          className="group hover:border-akari-300 hover:bg-akari-50/50 dark:hover:border-akari-500/50 dark:hover:bg-akari-500/5 inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white/80 px-8 py-3 text-sm font-semibold text-neutral-900 transition-[background-color,border-color,transform] duration-200 dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-50"
        >
          <Download className="h-5 w-5" />
          蓝奏云
          <span className="text-xs text-neutral-500 dark:text-neutral-400">(提取码：{LANZOU_PASSWORD})</span>
          <ExternalLink className="size-4 text-neutral-400" />
        </a>

        {release ? (
          <a
            href={release.artifact.downloadUrl}
            className="group hover:border-akari-300 hover:bg-akari-50/50 dark:hover:border-akari-500/50 dark:hover:bg-akari-500/5 inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white/80 px-8 py-3 text-sm font-semibold text-neutral-900 transition-[background-color,border-color,transform] duration-200 dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-50"
          >
            <Download className="h-5 w-5" />
            备用下载
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="inline-flex cursor-wait items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white/50 px-8 py-3 text-sm font-semibold text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-600"
          >
            <Download className="h-5 w-5" />
            备用下载
          </button>
        )}
      </div>

      {loadState.status === 'ready' ? (
        <p className="pt-2 text-xs text-neutral-500 dark:text-neutral-500">
          最新版本为 {loadState.document.version}，系统最低需求为 Windows 10，仅支持 64 位。
        </p>
      ) : loadState.status === 'error' ? (
        <div className="flex items-center gap-2 pt-2 text-xs text-neutral-500 dark:text-neutral-500">
          <span>暂时无法获取最新版本信息。</span>
          <button
            type="button"
            className="hover:text-akari-600 dark:hover:text-akari-400 inline-flex items-center gap-1 font-semibold transition-colors"
            onClick={() => {
              setLoadState({ status: 'loading' })
              setRequestVersion((current) => current + 1)
            }}
          >
            <RefreshCw className="size-3" />
            重试
          </button>
        </div>
      ) : (
        <p className="pt-2 text-xs text-neutral-500 dark:text-neutral-500">正在获取最新版本信息…</p>
      )}
    </>
  )
}
