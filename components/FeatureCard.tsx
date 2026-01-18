import { ReactNode } from 'react'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: ReactNode
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 transition-[background-color,box-shadow] duration-300 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 transition-[background-color] duration-300 dark:bg-neutral-800">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{description}</p>
    </div>
  )
}
