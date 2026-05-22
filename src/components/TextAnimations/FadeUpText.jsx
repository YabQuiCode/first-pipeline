import { useInView } from '../../hooks/useInView'

export default function FadeUpText({ children, className = '', delay = 0, tag: Tag = 'div' }) {
  const { ref, hasBeenInView } = useInView({ threshold: 0.15 })

  return (
    <Tag
      ref={ref}
      className={`${className} transition-all duration-700 ease-out`}
      style={{
        opacity: hasBeenInView ? 1 : 0,
        transform: hasBeenInView ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Tag>
  )
}
