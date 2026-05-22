import { useCountUp } from '../../hooks/useCountUp'

export default function StatCard({ value, label, variant = 'default', delay = 0 }) {
  const isNumber = !isNaN(parseInt(value))
  const { count, ref } = useCountUp(isNumber ? parseInt(value) : 0, { duration: 1500 })

  const variants = {
    default: 'border-base-200 hover:border-accent-indigo/20',
    danger: 'border-accent-red/15 hover:border-accent-red/30',
    warning: 'border-accent-amber/20 hover:border-accent-amber/35',
  }

  const numberColors = {
    default: 'text-base-800',
    danger: 'text-accent-red',
    warning: 'text-accent-amber',
  }

  return (
    <div
      ref={ref}
      className={`glass-card-hover p-6 flex flex-col gap-2 ${variants[variant]}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className={`text-4xl font-display font-semibold ${numberColors[variant]}`}>
        {isNumber ? count : value}
      </span>
      <span className="text-sm text-base-400 font-medium font-body">{label}</span>
    </div>
  )
}
