import { useEffect, useRef } from 'react'
import useStore from '../../store/useStore'

export default function CursorTrail() {
  const canvasRef = useRef(null)
  const darkMode = useStore((s) => s.darkMode)
  const darkModeRef = useRef(darkMode)

  useEffect(() => {
    darkModeRef.current = darkMode
  }, [darkMode])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId
    const trail = []
    const maxTrail = 25
    const mouse = { x: -100, y: -100 }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const onMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      trail.push({ x: e.clientX, y: e.clientY, life: 1 })
      if (trail.length > maxTrail) trail.shift()
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < trail.length; i++) {
        const point = trail[i]
        point.life -= 0.025

        if (point.life <= 0) {
          trail.splice(i, 1)
          i--
          continue
        }

        const size = point.life * 6
        const alpha = point.life * 0.35

        const isDark = darkModeRef.current
        const r = isDark ? 16 : 99
        const g = isDark ? 185 : 102
        const b = isDark ? 129 : 241

        // Glow
        ctx.beginPath()
        ctx.arc(point.x, point.y, size * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.15})`
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        ctx.fill()
      }

      animationId = requestAnimationFrame(draw)
    }

    resize()
    draw()

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9998] pointer-events-none"
    />
  )
}
