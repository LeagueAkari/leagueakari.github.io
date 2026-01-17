import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SITE_URL } from '@/config/site'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: {
    default: 'League Akari - 联盟阿卡林',
    template: '%s | League Akari'
  },
  description: 'League Akari (联盟阿卡林) - 免费的英雄联盟助手工具，提供战绩查询、数据分析等实用功能。',
  keywords: [
    'League Akari',
    '联盟阿卡丽',
    '联盟阿卡林',
    '英雄联盟助手',
    '英雄联盟工具',
    '英雄联盟客户端工具',
    'LOL助手',
    'LOL工具',
    '战绩查询',
    '数据分析',
    '隐藏战绩查询',
    'League Akari下载'
  ],
  authors: [{ name: 'League Akari' }],
  creator: 'League Akari',

  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: SITE_URL,
    siteName: 'League Akari',
    title: 'League Akari - 联盟阿卡林',
    description: 'League Akari (联盟阿卡林) - 英雄联盟助手，提供战绩查询、数据分析等实用功能。',
    images: [
      {
        url: `${SITE_URL}/images/logo-dark.png`,
        width: 512,
        height: 512,
        alt: 'League Akari Logo'
      }
    ]
  },

  twitter: {
    card: 'summary',
    title: 'League Akari - 联盟阿卡林',
    description: 'League Akari (联盟阿卡林) - 英雄联盟助手，提供战绩查询、数据分析等实用功能。',
    images: [`${SITE_URL}/images/logo-dark.png`]
  },

  robots: {
    index: true,
    follow: true
  },

  icons: {
    icon: '/svg/favicon.svg'
  },

  metadataBase: new URL(SITE_URL)
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-white text-neutral-900 antialiased transition-[background-color] duration-300 dark:bg-neutral-950 dark:text-neutral-50`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
