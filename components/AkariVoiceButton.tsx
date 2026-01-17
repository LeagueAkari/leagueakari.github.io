'use client'

import { useRef, useState } from 'react'
import { Volume2 } from 'lucide-react'

export function AkariVoiceButton() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false)
        })
    } else {
      audio.pause()
      audio.currentTime = 0
      setIsPlaying(false)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
  }

  return (
    <span className="ml-2 inline-flex items-center gap-1">
      <button
        type="button"
        onClick={togglePlay}
        className="border-akari-500 bg-akari-500 hover:border-akari-600 hover:bg-akari-600 active:bg-akari-700 dark:border-akari-400 dark:bg-akari-400 dark:hover:border-akari-300 dark:hover:bg-akari-300 inline-flex size-5 cursor-pointer items-center justify-center rounded-full border text-white transition-[background-color,border-color,color]"
        aria-label={isPlaying ? '停止播放 Akari 语音' : '播放 Akari 语音'}
      >
        <Volume2 className="h-3 w-3" />
      </button>
      <audio ref={audioRef} src="/audio/akari_zephyr.wav" onEnded={handleEnded} />
    </span>
  )
}
