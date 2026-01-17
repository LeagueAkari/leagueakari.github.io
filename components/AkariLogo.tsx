'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useIsClient } from '../hooks/use-is-client'

export function AkariLogo({ invert = true }: { invert?: boolean }) {
  const { resolvedTheme } = useTheme()
  const isClient = useIsClient()

  if (!isClient) {
    return null
  }

  return (
    <Image
      src={
        invert
          ? resolvedTheme === 'dark'
            ? '/images/logo-light.png'
            : '/images/logo-dark.png'
          : resolvedTheme === 'dark'
            ? '/images/logo-dark.png'
            : '/images/logo-light.png'
      }
      alt="League Akari"
      fill
    />
  )
}
