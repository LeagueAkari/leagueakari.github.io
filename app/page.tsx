import { ModeToggle } from '@/components/ModeToggle'
import { Download, Shield, Globe, Terminal, Cpu, DollarSign, ExternalLink, Book, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { AkariLogo } from '@/components/AkariLogo'
import { DOWNLOAD_URLS, FEEDBACK_LINKS } from '@/config/content'
import { LATEST_TAG_NAME, LANZOU_PASSWORD } from '@/config/content'
import { AkariVoiceButton } from '@/components/AkariVoiceButton'
import { GithubButton } from '@/components/GithubStars'
import { SiTelegram, SiQq } from '@icons-pack/react-simple-icons'
import { FeatureShowcase } from '@/components/FeatureShowcase'
import { FeatureCard } from '@/components/FeatureCard'
import { FeedbackLink } from '@/components/FeedbackLink'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-sm transition-[background-color] duration-300 dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <div className="relative size-6 rounded-lg">
              <AkariLogo />
            </div>
            <span>League Akari</span>
          </div>
          <nav className="flex items-center gap-2">
            <GithubButton />
            <ModeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="relative z-10 container mx-auto max-w-5xl px-4">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="relative size-42 rounded-lg">
                <AkariLogo />
              </div>

              <h1
                className="max-w-3xl text-4xl font-extrabold tracking-tight text-neutral-900 md:text-6xl dark:text-white"
                style={{ fontFamily: 'var(--font-logo)' }}
              >
                League{' '}
                <ruby>
                  Akari
                  <rt className="mb-2 text-xs text-black/40 dark:text-white/40">阿卡林</rt>
                </ruby>
              </h1>

              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-neutral-600 md:text-xl dark:text-neutral-400">
                数据分析、战绩查询以及各种实用工具。驻足片刻，体验一番吧。
              </p>

              <div className="flex w-full flex-col justify-center gap-4 pt-4 sm:flex-row" id="download">
                <a
                  href={DOWNLOAD_URLS.github}
                  className="bg-akari-500 shadow-akari-500/20 hover:bg-akari-600 inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3 font-semibold text-white shadow-lg transition-all"
                >
                  <Download className="h-5 w-5" />
                  GitHub
                </a>

                <a
                  href={DOWNLOAD_URLS.lanzou}
                  target="_blank"
                  rel="noreferrer"
                  className="group hover:border-akari-300 hover:bg-akari-50/50 dark:hover:border-akari-500/50 dark:hover:bg-akari-500/5 inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white/80 px-8 py-3 text-sm font-semibold text-neutral-900 transition-[background-color,border-color,transform] duration-200 dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-50"
                >
                  <Download className="h-5 w-5" />
                  蓝奏云
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">(提取码：{LANZOU_PASSWORD})</span>
                  <ExternalLink className="size-4 text-neutral-400" />
                </a>

                <a
                  href={DOWNLOAD_URLS.backup}
                  className="group hover:border-akari-300 hover:bg-akari-50/50 dark:hover:border-akari-500/50 dark:hover:bg-akari-500/5 inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white/80 px-8 py-3 text-sm font-semibold text-neutral-900 transition-[background-color,border-color,transform] duration-200 dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-50"
                >
                  <Download className="h-5 w-5" />
                  备用下载
                </a>
              </div>

              <p className="pt-2 text-xs text-neutral-500 dark:text-neutral-500">
                最新版本为 {LATEST_TAG_NAME}，系统最低需求为 Windows 10，仅支持 64 位。
              </p>
            </div>
          </div>

          {/* Background decoration */}
          <div className="bg-akari-500/10 dark:bg-akari-500/5 absolute top-1/2 left-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
        </section>

        {/* Features Grid */}
        <section
          id="features"
          className="bg-neutral-50 py-20 transition-[background-color] duration-300 dark:bg-neutral-900/50"
        >
          <div className="container mx-auto max-w-5xl px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight">它，很强</h2>
              <p className="text-neutral-600 dark:text-neutral-400">或许你找不到比它更好的选择了。</p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<DollarSign className="h-6 w-6 text-emerald-500" />}
                title="完全免费"
                description={
                  <>
                    为爱发电，白嫖赛高。不要再去某鱼、某宝、某音等其他平台被赚差价了，算我
                    <span className="text-akari-500 dark:text-akari-400 font-bold">求</span>你
                  </>
                }
              />
              <FeatureCard
                icon={<Shield className="h-6 w-6 text-emerald-500" />}
                title="理论上安全"
                description={
                  <>
                    League Akari 在原理上依赖{' '}
                    <Link
                      href="https://riot-api-libraries.readthedocs.io/en/latest/lcu.html"
                      target="_blank"
                      rel="noreferrer"
                      className="text-akari-500 dark:text-akari-400 text-xs font-bold underline"
                    >
                      LCU API
                    </Link>
                    ，不操作游戏进程。但注意，这并不代表它一定安全
                  </>
                }
              />
              <FeatureCard
                icon={<Cpu className="h-6 w-6 text-blue-500" />}
                title="性能尚可"
                description="使用了极为先进的 Electron 框架，千场战绩，两秒加载。如果你的电脑性能不错，那么体验会很棒"
              />
              <FeatureCard
                icon={<Globe className="h-6 w-6 text-violet-500" />}
                title="多服务器支持"
                description={
                  <>
                    可以在大多数区服上使用
                    <br />
                    <span className="text-xs text-black/40 dark:text-white/40">
                      不支持腾讯服务器，千万不要用在腾讯服务器中
                    </span>
                  </>
                }
              />
              <FeatureCard
                icon={<Terminal className="h-6 w-6 text-amber-500" />}
                title="半开源"
                description={
                  <>
                    部分版本的源代码可以直接查看。但是我们不打算第一时间公布最新版本的源代码
                    <br />
                    <Link href="#note2" className="text-xs text-black/40 hover:underline dark:text-white/40">
                      参考注 2
                    </Link>
                  </>
                }
              />
              <FeatureCard
                icon={<Book className="text-akari-500 h-6 w-6" />}
                title="名字来源"
                description={
                  <>
                    来源于《摇曳百合》中的女主角{' '}
                    <span>
                      {' '}
                      <ruby>
                        赤座
                        <rt>あかざ</rt>
                      </ruby>{' '}
                      <span className="dark:text-akari-400 text-akari-500">あかり</span>
                    </span>
                    <AkariVoiceButton />
                  </>
                }
              />
            </div>
          </div>
        </section>

        {/* Feature Showcase */}
        <section
          id="showcase"
          className="bg-white py-20 transition-[background-color] duration-300 dark:bg-neutral-950"
        >
          <div className="container mx-auto max-w-5xl px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight">哼哼</h2>
              <p className="text-neutral-600 dark:text-neutral-400">有人总说，我不喜欢写文档。其实说的没错。</p>
            </div>

            <div className="space-y-16">
              <FeatureShowcase
                title="玩家页面"
                description="看看这名玩家最近的对局、表现等数据。"
                imgUrl="/images/showcase-1.png"
              />

              <FeatureShowcase
                title="对局面板"
                description="当你在英雄选择阶段或游戏内时，查看成员们的近期表现和组队情况。"
                imgUrl="/images/showcase-2.png"
              />

              <FeatureShowcase
                title="实用工具"
                description="自动 ban / pick，奖励领取，设置生涯背景，或删除过期好友... 各种小功能敬请探索。"
                imgUrl="/images/showcase-3.png"
              />
            </div>
          </div>
        </section>

        {/* Feedback Channels */}
        <section
          id="feedback"
          className="bg-neutral-50 py-20 transition-[background-color] duration-300 dark:bg-neutral-900/50"
        >
          <div className="container mx-auto max-w-5xl px-4">
            <div className="mb-12 flex flex-col items-center text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight">交流渠道</h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                遇到问题或爱好吹水者速加。
                <br />请<span className="text-akari-500 dark:text-akari-400 font-bold">务必</span>
                掌握一定的计算机基础知识，即可以
                <span className="text-akari-500 dark:text-akari-400 font-bold">清晰地描述问题</span>、以及
                <span className="text-akari-500 dark:text-akari-400 font-bold">发送日志</span>。
                <br />
                过于模糊的提问可能会被管理团队忽略。
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {FEEDBACK_LINKS.map((link) => (
                <FeedbackLink
                  key={link.id}
                  href={link.url}
                  icon={
                    link.type === 'telegram' ? (
                      <SiTelegram className="h-5 w-5" />
                    ) : link.type === 'qq' ? (
                      <SiQq className="h-5 w-5" />
                    ) : (
                      <MessageCircle className="h-5 w-5" />
                    )
                  }
                  name={link.name}
                  type={link.type as 'qq' | 'telegram'}
                  id={link.id}
                  password={link.password}
                  color={link.type === 'qq' ? 'text-blue-500' : 'text-blue-400'}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-12 transition-[background-color] duration-300 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="container mx-auto max-w-5xl px-4">
          <p className="text-justify text-xs leading-relaxed text-neutral-400 dark:text-neutral-600 dark:before:bg-neutral-800">
            1. League Akari 没有获得 Riot Games 的认可，也不代表 Riot Games 的观点或意见。 Riot Games
            及其所有相关资源均为 Riot Games, Inc. 的商标或注册商标。
          </p>

          <p id="note2" className="text-justify text-xs leading-relaxed text-neutral-400 dark:text-neutral-600">
            2. 为遏制盈利性软件套壳，我们不提供最新版本的源代码。
          </p>

          <p className="text-justify text-xs leading-relaxed text-neutral-400 dark:text-neutral-600">
            3. 群聊会定期清理潜水人员，并且通常不会事先通知。请保持最低限度的活跃。
          </p>

          <p className="text-justify text-xs leading-relaxed text-neutral-400 dark:text-neutral-600">
            4. 部分网吧系统可能会限制此软件的运行。
          </p>

          <p className="mt-8 text-center text-xs text-neutral-400 dark:text-neutral-600">
            &copy; {new Date().getFullYear()} League Akari Dev Team. 所有权利保留。
          </p>
        </div>
      </footer>
    </div>
  )
}
