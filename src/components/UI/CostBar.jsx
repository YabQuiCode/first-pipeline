import { useEffect, useRef, useState } from 'react'

export default function CostBar({ label, multiplier, heightPercent, isDanger = false, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Use a simple scroll listener as fallback + IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0, rootMargin: '0px' }
    )

    observer.observe(el)

    // Fallback: check if already in viewport
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true)
    }

    return () => observer.disconnect()
  }, [])

  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => setAnimating(true), delay)
    return () => clearTimeout(timer)
  }, [visible, delay])

  const barColor = isDanger
    ? 'linear-gradient(to top, #dc2626, #f87171, #fecaca)'
    : 'linear-gradient(to top, #4338ca, #818cf8, #c7d2fe)'

  const bgColor = isDanger
    ? 'rgba(239, 68, 68, 0.07)'
    : 'rgba(99, 102, 241, 0.07)'

  const borderColor = isDanger
    ? 'rgba(239, 68, 68, 0.15)'
    : 'rgba(99, 102, 241, 0.15)'

  const glowColor = isDanger
    ? '0 -4px 15px rgba(239, 68, 68, 0.25)'
    : '0 -4px 15px rgba(67, 56, 202, 0.2)'

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <span
        style={{
          fontSize: '14px',
          fontFamily: '"JetBrains Mono", monospace',
          fontWeight: 700,
          color: isDanger ? '#ef4444' : '#6366f1',
        }}
      >
        {multiplier}
      </span>

      <div
        style={{
          position: 'relative',
          width: '72px',
          height: '200px',
          borderRadius: '12px',
          overflow: 'hidden',
          background: bgColor,
          border: `1px solid ${borderColor}`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: animating ? `${heightPercent}%` : '0%',
            background: barColor,
            borderRadius: '0 0 11px 11px',
            transition: 'height 1.4s cubic-bezier(0.22, 1, 0.36, 1)',
            boxShadow: animating ? glowColor : 'none',
          }}
        />
      </div>

      <span
        style={{
          fontSize: '12px',
          color: '#71717a',
          fontWeight: 500,
          fontFamily: 'Satoshi, sans-serif',
        }}
      >
        {label}
      </span>
    </div>
  )
}
