import { CodeBlock } from '@/components/custom-templates/CodeBlock'
import { CopyButton } from '@/components/custom-templates/CopyButton'
import { DocsShell } from '@/components/custom-templates/DocsShell'
import { CUSTOM_TEMPLATE_EXAMPLES, getCustomTemplateExample } from '@/content/custom-templates'
import { readCustomTemplateCode } from '@/lib/custom-template-content'
import { AlertTriangle, CheckCircle2, Download, ExternalLink, Info, MessageSquareText } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface TemplatePageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return CUSTOM_TEMPLATE_EXAMPLES.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: TemplatePageProps): Promise<Metadata> {
  const { slug } = await params
  const template = getCustomTemplateExample(slug)
  if (!template) return {}

  return {
    title: template.title,
    description: template.summary
  }
}

export default async function CustomTemplateDetailPage({ params }: TemplatePageProps) {
  const { slug } = await params
  const template = getCustomTemplateExample(slug)
  if (!template) notFound()

  const code = readCustomTemplateCode(template.fileName)

  return (
    <DocsShell backHref="/custom-templates" backLabel="返回模板合集">
      <article className="space-y-12">
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-akari-50 text-akari-700 dark:bg-akari-950/70 dark:text-akari-300 rounded-full px-2.5 py-1 font-semibold">
                {template.mode}
              </span>
              <span className="rounded-full bg-neutral-200 px-2.5 py-1 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                支持 League Akari {template.supportedVersion}
              </span>
              <span className="rounded-full bg-neutral-200 px-2.5 py-1 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                {template.difficulty}
              </span>
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">{template.title}</h1>
            <p className="mt-5 text-base leading-8 text-neutral-600 sm:text-lg dark:text-neutral-300">
              {template.summary}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton text={code} label="复制完整模板" copiedLabel="模板已复制" />
            <a
              href={`/custom-templates/templates/${template.fileName}`}
              download
              className="inline-flex items-center justify-center gap-1.5 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <Download className="size-3.5" />
              下载 .js
            </a>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="size-4 text-emerald-500" />
              它会做什么
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {template.behavior.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/60 dark:bg-amber-950/30">
            <h2 className="flex items-center gap-2 font-semibold text-amber-950 dark:text-amber-100">
              <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
              使用限制
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-amber-900/80 dark:text-amber-200/80">
              {template.limitations.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <MessageSquareText className="text-akari-500 size-5" />
            可能看到的试运行结果
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            以下名称和数值仅用于展示排版；实际结果取决于当前对局和已加载的数据。
          </p>
          <div className="mt-5 max-w-3xl space-y-2 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            {template.expectedOutput.map((line) => (
              <div
                key={line}
                className="bg-akari-50 text-akari-950 dark:bg-akari-950/60 dark:text-akari-100 w-fit max-w-full rounded-xl rounded-bl-sm px-4 py-2.5 font-mono text-sm leading-6"
              >
                {line}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold">完整模板</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
              复制全部内容，粘贴到自定义模板编辑器并保存。不要只复制函数内部片段。
            </p>
          </div>
          <CodeBlock code={code} label={template.fileName} copyLabel="复制完整模板" />
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="flex items-center gap-2 font-semibold">
            <Info className="size-4 text-blue-500" />
            来源与适配说明
          </h2>
          {template.sources.length ? (
            <div className="mt-4 space-y-4">
              {template.sources.map((source) => (
                <div key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-akari-600 dark:text-akari-400 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                  >
                    {source.label}
                    <ExternalLink className="size-3.5" />
                  </a>
                  <p className="mt-1 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{source.detail}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
              这是为当前模板系统编写的示例，没有移植第三方算法。数据路径已按 League Akari 1.5.2 源码核对。
            </p>
          )}
        </section>

        <div className="border-t border-neutral-200 pt-8 dark:border-neutral-800">
          <Link
            href="/custom-templates#templates"
            className="text-akari-600 dark:text-akari-400 text-sm font-medium hover:underline"
          >
            查看其他现成模板
          </Link>
        </div>
      </article>
    </DocsShell>
  )
}
