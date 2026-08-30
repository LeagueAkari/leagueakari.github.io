import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: {
    default: '自定义游戏内发送模板',
    template: '%s | League Akari'
  },
  description: 'League Akari 自定义游戏内发送模板的使用说明、AI Skill 与可直接复制的模板。',
  robots: {
    index: false,
    follow: false
  }
}

export default function CustomTemplatesLayout({ children }: { children: ReactNode }) {
  return children
}
