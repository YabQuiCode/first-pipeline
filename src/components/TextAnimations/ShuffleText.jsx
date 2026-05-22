import { useEffect, useState, useRef } from 'react'
import { useInView } from '../../hooks/useInView'

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'

export default function ShuffleText({ text, className = '', tag: Tag = 'h2', delay = 0 }) {
  const { ref, hasBeenInView } = useInView({ threshold: 0.3 })
  const [displayText, setDisplayText] = useState(text)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!hasBeenInView) return

    const timeout = setTimeout(() => {
      let iteration = 0
      const finalText = text

      intervalRef.current = setInterval(() => {
        setDisplayText(
          finalText
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' '
              if (index < iteration) return finalText[index]
              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join('')
        )

        iteration += 1 / 2

        if (iteration >= finalText.length) {
          clearInterval(intervalRef.current)
          setDisplayText(finalText)
        }
      }, 30)
    }, delay)

    return () => {
      clearTimeout(timeout)
      clearInterval(intervalRef.current)
    }
  }, [hasBeenInView, text, delay])

  return (
    <Tag
      ref={ref}
      className={`${className} transition-opacity duration-500 ${hasBeenInView ? 'opacity-100' : 'opacity-0'}`}
    >
      {displayText}
    </Tag>
  )
}
