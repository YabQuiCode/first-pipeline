import { useEffect, useState, useRef } from 'react'
import { useInView } from '../../hooks/useInView'

const glitchChars = '█▓▒░╔╗╚╝═║╠╣╩╦01'

export default function DecryptText({ text, className = '', tag: Tag = 'h2', delay = 0 }) {
  const { ref, hasBeenInView } = useInView({ threshold: 0.3 })
  const [displayText, setDisplayText] = useState('')
  const [isDecrypting, setIsDecrypting] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!hasBeenInView) return

    const timeout = setTimeout(() => {
      setIsDecrypting(true)
      let frame = 0
      const totalFrames = text.length * 3

      intervalRef.current = setInterval(() => {
        const progress = frame / totalFrames

        setDisplayText(
          text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' '
              const charProgress = index / text.length
              if (progress > charProgress + 0.3) return char
              if (progress > charProgress) {
                return glitchChars[Math.floor(Math.random() * glitchChars.length)]
              }
              return glitchChars[Math.floor(Math.random() * glitchChars.length)]
            })
            .join('')
        )

        frame++
        if (frame >= totalFrames) {
          clearInterval(intervalRef.current)
          setDisplayText(text)
          setIsDecrypting(false)
        }
      }, 25)
    }, delay)

    return () => {
      clearTimeout(timeout)
      clearInterval(intervalRef.current)
    }
  }, [hasBeenInView, text, delay])

  return (
    <Tag
      ref={ref}
      className={`${className} font-mono transition-opacity duration-300 ${hasBeenInView ? 'opacity-100' : 'opacity-0'}`}
      style={{
        textShadow: isDecrypting ? '0 0 8px rgba(79, 143, 255, 0.5)' : 'none',
      }}
    >
      {displayText || (hasBeenInView ? '' : text)}
    </Tag>
  )
}
