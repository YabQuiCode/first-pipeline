import { useEffect, useState } from 'react'
import { useInView } from '../../hooks/useInView'

export default function SlideRevealText({ text, className = '', tag: Tag = 'h2', delay = 0 }) {
  const { ref, hasBeenInView } = useInView({ threshold: 0.3 })
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!hasBeenInView) return
    const timeout = setTimeout(() => setRevealed(true), delay)
    return () => clearTimeout(timeout)
  }, [hasBeenInView, delay])

  return (
    <Tag ref={ref} className={`${className} overflow-hidden`}>
      <span
        className="inline-block transition-all duration-1000 ease-out"
        style={{
          transform: revealed ? 'translateY(0)' : 'translateY(110%)',
          opacity: revealed ? 1 : 0,
        }}
      >
        {text}
      </span>
    </Tag>
  )
}
