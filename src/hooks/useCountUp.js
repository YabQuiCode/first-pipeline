import { useState, useEffect, useRef } from 'react'

export function useCountUp(target, { duration = 2000, startOnView = true } = {}) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!startOnView) {
      setStarted(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started, startOnView])

  useEffect(() => {
    if (!started) return
    const startTime = performance.now()
    const numTarget = typeof target === 'string' ? parseFloat(target) : target

    if (isNaN(numTarget)) {
      setCount(target)
      return
    }

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * numTarget))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [started, target, duration])

  return { count, ref }
}
