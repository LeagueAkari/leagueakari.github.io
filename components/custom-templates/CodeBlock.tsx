import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import markdown from 'highlight.js/lib/languages/markdown'

import { CopyButton } from './CopyButton'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('markdown', markdown)

interface CodeBlockProps {
  code: string
  language?: 'javascript' | 'markdown'
  label: string
  copyLabel?: string
  className?: string
}

export function CodeBlock({
  code,
  language = 'javascript',
  label,
  copyLabel = '复制代码',
  className = ''
}: CodeBlockProps) {
  const highlighted = hljs.highlight(code, { language }).value

  return (
    <div
      className={`overflow-hidden rounded-xl border border-neutral-200 bg-neutral-950 shadow-sm dark:border-neutral-800 ${className}`}
    >
      <div className="flex min-h-11 items-center justify-between gap-3 border-b border-white/10 bg-neutral-900 px-3 py-2 sm:px-4">
        <span className="min-w-0 truncate font-mono text-xs text-neutral-400">{label}</span>
        <CopyButton
          text={code}
          label={copyLabel}
          className="shrink-0 border-white/15 bg-white/5 text-neutral-200 hover:bg-white/10"
        />
      </div>
      <pre className="max-h-[38rem] overflow-auto p-4 text-[13px] leading-6 sm:p-5">
        <code className={`hljs language-${language} font-mono`} dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  )
}
