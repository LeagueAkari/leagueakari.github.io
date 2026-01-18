'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface FeatureShowcaseProps {
  title: string
  description: string
  imgUrl?: string
}

export function FeatureShowcase({ title, description, imgUrl }: FeatureShowcaseProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1]
        }}
      >
        <h3 className="mb-2 text-2xl font-bold tracking-tight">{title}</h3>
        <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">{description}</p>
      </motion.div>

      {/* Image */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{
          duration: 0.5,
          delay: 0.1,
          ease: [0.25, 0.1, 0.25, 1]
        }}
        className="w-full"
      >
        {imgUrl ? (
          <div className="relative w-full overflow-hidden rounded-xl">
            <Image src={imgUrl} alt={title} width={100} height={100} className="h-auto w-full" />
          </div>
        ) : (
          <div className="aspect-video w-full rounded-xl bg-neutral-200 transition-[background-color] duration-300 dark:bg-neutral-800" />
        )}
      </motion.div>
    </div>
  )
}
