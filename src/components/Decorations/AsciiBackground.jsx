import { useEffect, useRef } from 'react'

const chars = '01.:+*#@%&=$!?/\\|()[]{}<>~^;,`\'"abcdefghijklmnopqrstuvwxyz'

export default function AsciiBackground({ className = '' }) {
  const canvasRef = useRef(null)
  const mouse = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId
    let grid = []
    let cols = 0
    let rows = 0

    const fontSize = 14
    const cellW = fontSize * 0.75
    const cellH = fontSize * 1.1

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight

      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      cols = Math.ceil(w / cellW) + 1
      rows = Math.ceil(h / cellH) + 1

      // Build grid of random characters
      grid = []
      for (let r = 0; r < rows; r++) {
        const row = []
        for (let c = 0; c < cols; c++) {
          row.push({
            char: chars[Math.floor(Math.random() * chars.length)],
            baseOpacity: 0.03 + Math.random() * 0.05,
            noiseOffset: Math.random() * Math.PI * 2,
            noiseSpeed: 0.3 + Math.random() * 0.7,
          })
        }
        grid.push(row)
      }
    }

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current.x = e.clientX - rect.left
      mouse.current.y = e.clientY - rect.top
    }

    const onMouseLeave = () => {
      mouse.current.x = -9999
      mouse.current.y = -9999
    }

    let time = 0

    const draw = () => {
      time += 0.016
      const w = parseInt(canvas.style.width)
      const h = parseInt(canvas.style.height)

      ctx.clearRect(0, 0, w, h)
      ctx.font = `${fontSize}px "JetBrains Mono", "SF Mono", "Courier New", monospace`
      ctx.textBaseline = 'top'

      const mx = mouse.current.x
      const my = mouse.current.y
      const pushRadius = 120
      const pushStrength = 30

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = grid[r][c]
          let x = c * cellW
          let y = r * cellH

          // Noise wave
          const noise = Math.sin(time * cell.noiseSpeed + cell.noiseOffset + c * 0.1) *
                        Math.cos(time * cell.noiseSpeed * 0.7 + r * 0.08) * 0.5 + 0.5

          // Mouse push
          let dx = 0, dy = 0
          const distX = x - mx
          const distY = y - my
          const dist = Math.sqrt(distX * distX + distY * distY)

          if (dist < pushRadius && dist > 0) {
            const force = (1 - dist / pushRadius) * pushStrength
            dx = (distX / dist) * force
            dy = (distY / dist) * force
          }

          // Final position
          const fx = x + dx
          const fy = y + dy

          // Skip if off screen
          if (fx < -cellW || fx > w + cellW || fy < -cellH || fy > h + cellH) continue

          // Opacity: base + noise modulation + mouse proximity glow
          let opacity = cell.baseOpacity * (0.4 + noise * 0.6)

          // Brighter near mouse
          if (dist < pushRadius * 1.5 && dist > 0) {
            const glow = (1 - dist / (pushRadius * 1.5))
            opacity += glow * 0.12
          }

          // Clamp
          opacity = Math.min(opacity, 0.18)

          // Orange color
          const r255 = 251
          const g255 = 146
          const b255 = 60

          ctx.fillStyle = `rgba(${r255}, ${g255}, ${b255}, ${opacity})`

          // Occasionally swap character for variety
          if (Math.random() < 0.0003) {
            cell.char = chars[Math.floor(Math.random() * chars.length)]
          }

          ctx.fillText(cell.char, fx, fy)
        }
      }

      animationId = requestAnimationFrame(draw)
    }

    resize()
    draw()

    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 z-[1] ${className}`}
      style={{
        maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 70%)',
      }}
    />
  )
}
