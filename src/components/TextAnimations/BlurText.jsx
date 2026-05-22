import { useEffect, useState } from 'react'
import { useInView } from '../../hooks/useInView'

export default function BlurText({ text, className = '', tag: Tag = 'h2', delay = 0 }) {
  const { ref, hasBeenInView } = useInView({ threshold: 0.3 })
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!hasBeenInView) return
    const timeout = setTimeout(() => setRevealed(true), delay)
    return () => clearTimeout(timeout)
  }, [hasBeenInView, delay])

  const words = text.split(' ')

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block transition-all duration-700 ease-out"
          style={{
            filter: revealed ? 'blur(0px)' : 'blur(12px)',
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(8px)',
            transitionDelay: `${i * 60}ms`,
          }}
        >
          {word}{i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Tag>
  )
}
