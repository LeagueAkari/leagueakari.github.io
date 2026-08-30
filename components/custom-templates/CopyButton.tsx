'use client'

import { Check, Copy } from 'lucide-react'
import { useEffect, useState, type MouseEvent } from 'react'

interface CopyButtonProps {
  text: string
  label?: string
  copiedLabel?: string
  className?: string
}

export function CopyButton({ text, label = '复制', copiedLabel = '已复制', className = '' }: CopyButtonProps) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')

  useEffect(() => {
    if (state === 'idle') return

    const timer = window.setTimeout(() => setState('idle'), 1800)
    return () => window.clearTimeout(timer)
  }, [state])

  async function handleCopy(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()

    try {
      if (window.navigator.clipboard?.writeText) {
        await window.navigator.clipboard.writeText(text)
        setState('copied')
        return
      }

      if (typeof document.execCommand === 'function') {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        const copied = document.execCommand('copy')
        textarea.remove()
        setState(copied ? 'copied' : 'failed')
        return
      }

      setState('failed')
    } catch {
      setState('failed')
    }
  }

  const buttonLabel = state === 'copied' ? copiedLabel : state === 'failed' ? '复制失败' : label

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`focus-visible:ring-akari-500 inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:focus-visible:ring-offset-neutral-950 ${className}`}
      aria-live="polite"
    >
      {state === 'copied' ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {buttonLabel}
    </button>
  )
}
