import { useInView } from '../../hooks/useInView'

export default function ProblemCard({ icon, title, description, delay = 0 }) {
  const { ref, hasBeenInView } = useInView({ threshold: 0.2 })

  return (
    <div
      ref={ref}
      className="glass-card-hover p-8 flex flex-col gap-5 transition-all duration-700 ease-out"
      style={{
        opacity: hasBeenInView ? 1 : 0,
        transform: hasBeenInView ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.95)',
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="w-12 h-12 rounded-xl bg-base-100 border border-base-200 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-display font-medium text-base-800">{title}</h3>
      <p className="text-base-500 leading-relaxed text-[15px] font-body">{description}</p>
    </div>
  )
}
