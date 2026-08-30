import { CodeBlock } from '@/components/custom-templates/CodeBlock'
import { CopyButton } from '@/components/custom-templates/CopyButton'
import { DocsShell } from '@/components/custom-templates/DocsShell'
import { CUSTOM_TEMPLATE_EXAMPLES } from '@/content/custom-templates'
import { readCustomTemplateCode, readCustomTemplateSkill } from '@/lib/custom-template-content'
import { ArrowRight, Bot, Code2, Download, FileCode2, ShieldAlert, Sparkles } from 'lucide-react'
import Link from 'next/link'

const templateSkeleton = `function getMessages(ctx) {
  const { target } = ctx.options
  const { manager } = ctx.runtime

  return []
}`

export default function CustomTemplatesPage() {
  const skill = readCustomTemplateSkill()
  const examples = CUSTOM_TEMPLATE_EXAMPLES.map((template) => ({
    ...template,
    code: readCustomTemplateCode(template.fileName)
  }))

  return (
    <DocsShell>
      <div className="space-y-16">
        <section className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white px-6 py-10 shadow-sm sm:px-10 sm:py-14 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="relative z-10 max-w-3xl">
            <div className="bg-akari-50 text-akari-700 dark:bg-akari-950/70 dark:text-akari-300 mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold">
              <Sparkles className="size-3.5" />
              League Akari 1.5.2
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-950 sm:text-5xl dark:text-white">
              自定义游戏内发送模板
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-600 sm:text-lg dark:text-neutral-300">
              用同步 JavaScript 读取 League Akari 已经加载的状态，生成本次要发送的文本。这里提供当前契约、用于指导 AI 的
              Skill，以及经过迁移的可复制模板。
            </p>
          </div>
          <div className="bg-akari-500/10 dark:bg-akari-500/5 absolute -right-20 -bottom-32 size-80 rounded-full blur-3xl" />
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/60 dark:bg-amber-950/30">
            <div className="flex gap-3">
              <ShieldAlert className="mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-400" />
              <div>
                <h2 className="font-semibold text-amber-950 dark:text-amber-100">这是高级功能</h2>
                <p className="mt-2 text-sm leading-6 text-amber-900/80 dark:text-amber-200/80">
                  模板能够读取和修改应用内的信息。来源不明、未经审查或有缺陷的代码可能导致信息泄露、数据损坏或应用崩溃。AI
                  生成的代码也必须先审阅，并在保存后先使用“试运行”。
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="font-semibold">开始使用</h2>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              <li>1. 打开游戏内发送 → 自定义模板。</li>
              <li>2. 新增模板并粘贴完整代码。</li>
              <li>3. 保存后分别试运行需要的目标。</li>
              <li>4. 确认输出正确，再手动发送或设置快捷键。</li>
            </ol>
          </div>
        </section>

        <section className="space-y-6">
          <div className="max-w-3xl">
            <div className="text-akari-600 dark:text-akari-400 mb-3 flex items-center gap-2 text-sm font-semibold">
              <Code2 className="size-4" />
              当前模板契约
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">只有一个同步入口</h2>
            <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-400">
              顶层定义{' '}
              <code className="rounded bg-neutral-200 px-1.5 py-0.5 text-sm dark:bg-neutral-800">getMessages(ctx)</code>
              ，同步返回字符串数组。
              <code className="rounded bg-neutral-200 px-1.5 py-0.5 text-sm dark:bg-neutral-800">target</code>
              只决定模板选择哪些数据，不会自动切换聊天频道。
            </p>
          </div>
          <CodeBlock code={templateSkeleton} label="最小可用模板" />
        </section>

        <section className="space-y-7" id="templates">
          <div className="max-w-3xl">
            <div className="text-akari-600 dark:text-akari-400 mb-3 flex items-center gap-2 text-sm font-semibold">
              <FileCode2 className="size-4" />
              直接可用
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">现成模板</h2>
            <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-400">
              每份模板均为独立文件，标记支持 League Akari 1.5.2。先阅读适用模式与限制，再复制到应用中。
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {examples.map((template) => (
              <article
                key={template.slug}
                className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="bg-akari-50 text-akari-700 dark:bg-akari-950/70 dark:text-akari-300 rounded-full px-2.5 py-1 font-medium">
                    {template.mode}
                  </span>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                    支持 {template.supportedVersion}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold">{template.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                  {template.summary}
                </p>

                <div className="mt-5 rounded-lg bg-neutral-100 p-3 font-mono text-xs leading-5 text-neutral-600 dark:bg-neutral-950 dark:text-neutral-300">
                  <span className="mr-2 text-neutral-400 select-none">预期</span>
                  {template.expectedOutput[0]}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <CopyButton text={template.code} label="复制模板" copiedLabel="模板已复制" />
                  <Link
                    href={`/custom-templates/${template.slug}`}
                    className="text-akari-600 hover:bg-akari-50 dark:text-akari-400 dark:hover:bg-akari-950/50 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
                  >
                    查看说明与完整代码
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-7" id="skill">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-3xl">
              <div className="text-akari-600 dark:text-akari-400 mb-3 flex items-center gap-2 text-sm font-semibold">
                <Bot className="size-4" />给 AI 的说明书
              </div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">League Akari 模板 Skill</h2>
              <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-400">
                将下面的 Skill 提供给能够读取目标版本 League Akari 源码的 AI。它会要求 AI
                先核实当前契约和运行时状态，再生成或重写模板。
              </p>
            </div>
            <a
              href="/custom-templates/league-akari-custom-template.skill.md"
              download
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <Download className="size-4" />
              下载 Skill
            </a>
          </div>

          <details className="group rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-2 py-1 font-medium">
              <span>查看完整 SKILL.md</span>
              <CopyButton text={skill} label="复制完整 Skill" copiedLabel="Skill 已复制" />
            </summary>
            <div className="mt-4">
              <CodeBlock
                code={skill}
                language="markdown"
                label="league-akari-custom-template/SKILL.md"
                copyLabel="复制完整 Skill"
                className="shadow-none"
              />
            </div>
          </details>
        </section>
      </div>
    </DocsShell>
  )
}
