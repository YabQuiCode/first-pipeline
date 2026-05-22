import { useEffect, useRef, useState } from 'react'

export default function ParallaxLayer({ children, speed = 0.5, className = '' }) {
  const ref = useRef(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (ticking) return
      ticking = true

      requestAnimationFrame(() => {
        if (!ref.current) { ticking = false; return }
        const rect = ref.current.getBoundingClientRect()
        const viewH = window.innerHeight
        const center = rect.top + rect.height / 2
        const viewCenter = viewH / 2
        const distance = center - viewCenter
        setOffset(distance * speed * -0.12)
        ticking = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${offset}px)`,
        willChange: 'transform',
        transition: 'transform 0.1s linear',
      }}
    >
      {children}
    </div>
  )
}
