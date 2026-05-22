export function BlobDecoration({ className = '', color1 = '#c7d2fe', color2 = '#e0e7ff', size = 400 }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <div className="animate-blob opacity-30"
        style={{ width: size, height: size, background: `linear-gradient(135deg, ${color1}, ${color2})`, filter: 'blur(60px)' }} />
    </div>
  )
}

export function GradientOrb({ className = '', color = '#818cf8', size = 300, blur = 80 }) {
  return (
    <div className={`absolute rounded-full pointer-events-none ${className}`}
      style={{ width: size, height: size, background: `radial-gradient(circle at 30% 30%, ${color}22, ${color}08, transparent 70%)`, filter: `blur(${blur}px)` }} />
  )
}

export function GridPattern({ className = '' }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <svg width="100%" height="100%" className="opacity-[0.03]">
        <defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  )
}

export function CircleDecoration({ className = '', size = 200, color = '#6366f1' }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <svg width={size} height={size} viewBox="0 0 200 200" className="animate-spin-slow">
        <circle cx="100" cy="100" r="90" fill="none" stroke={color} strokeWidth="0.5" opacity="0.15" />
        <circle cx="100" cy="100" r="70" fill="none" stroke={color} strokeWidth="0.3" opacity="0.1" strokeDasharray="8 12" />
        <circle cx="100" cy="100" r="50" fill="none" stroke={color} strokeWidth="0.5" opacity="0.08" />
      </svg>
    </div>
  )
}

export function DotsPattern({ className = '', rows = 8, cols = 8 }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <svg width={cols * 24} height={rows * 24} className="opacity-[0.06]">
        {Array.from({ length: rows * cols }, (_, i) => (
          <circle key={i} cx={(i % cols) * 24 + 12} cy={Math.floor(i / cols) * 24 + 12} r="1.5" fill="#6366f1" />
        ))}
      </svg>
    </div>
  )
}

export function FloatingRing({ className = '', size = 120, color = '#6366f1', id = '0' }) {
  return (
    <div className={`absolute pointer-events-none animate-float-slow ${className}`}>
      <svg width={size} height={size} viewBox="0 0 120 120">
        <defs>
          <linearGradient id={`ring-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="50" fill="none" stroke={`url(#ring-${id})`} strokeWidth="1.5" />
      </svg>
    </div>
  )
}

export function CrossDecoration({ className = '', size = 20, color = '#6366f1' }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <svg width={size} height={size} viewBox="0 0 20 20" className="opacity-20">
        <line x1="10" y1="2" x2="10" y2="18" stroke={color} strokeWidth="1" />
        <line x1="2" y1="10" x2="18" y2="10" stroke={color} strokeWidth="1" />
      </svg>
    </div>
  )
}
