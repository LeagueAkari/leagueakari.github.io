import { AkariLogo } from '@/components/AkariLogo'
import { ModeToggle } from '@/components/ModeToggle'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

interface DocsShellProps {
  children: ReactNode
  backHref?: string
  backLabel?: string
}

export function DocsShell({ children, backHref = '/', backLabel = '返回主站' }: DocsShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 dark:bg-neutral-950">
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/90">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href={backHref}
              aria-label={backLabel}
              className="inline-flex shrink-0 items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">{backLabel}</span>
            </Link>
            <div className="h-5 w-px bg-neutral-200 dark:bg-neutral-800" />
            <Link href="/custom-templates" className="flex min-w-0 items-center gap-2 font-semibold">
              <span className="relative size-6 shrink-0 rounded-lg">
                <AkariLogo />
              </span>
              <span className="truncate">自定义游戏内发送模板</span>
            </Link>
          </div>
          <ModeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">{children}</main>

      <footer className="border-t border-neutral-200 bg-white py-8 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-neutral-400 sm:px-6 dark:text-neutral-600">
          League Akari 高级功能文档 · 使用模板前请先审阅代码并试运行
        </div>
      </footer>
    </div>
  )
}
