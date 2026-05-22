import { SlideRevealText, FadeUpText } from '../components/TextAnimations'
import { useCountUp } from '../hooks/useCountUp'
import { useInView } from '../hooks/useInView'
import { DotsPattern, FloatingRing } from '../components/Decorations'

function KPICard({ label, value, unit, description, color = 'blue', delay = 0 }) {
  const { ref, hasBeenInView } = useInView({ threshold: 0.3 })
  const isNumber = !isNaN(parseFloat(value))
  const { count, ref: countRef } = useCountUp(isNumber ? parseFloat(value) : 0, { duration: 2000 })
  const colors = { blue: 'border-accent-blue/15', green: 'border-accent-green/15', purple: 'border-accent-purple/15', amber: 'border-accent-amber/20' }
  const textColors = { blue: 'text-accent-blue', green: 'text-accent-green', purple: 'text-accent-purple', amber: 'text-accent-amber' }

  return (
    <div ref={ref} className={`glass-card p-8 ${colors[color]} transition-all duration-700`}
      style={{ opacity: hasBeenInView ? 1 : 0, transform: hasBeenInView ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)', transitionDelay: `${delay}ms` }}>
      <span className="text-xs font-mono text-base-400 uppercase tracking-wider">{label}</span>
      <div ref={countRef} className={`text-4xl md:text-5xl font-display font-semibold ${textColors[color]} mt-3 mb-1`}>
        {isNumber ? count : value}{unit && <span className="text-lg ml-1 font-light">{unit}</span>}
      </div>
      <p className="text-sm text-base-400 mt-3 leading-relaxed font-body">{description}</p>
    </div>
  )
}

export default function KPISection() {
  return (
    <section id="kpi" className="relative py-32 md:py-40 overflow-hidden">
      <DotsPattern className="top-10 left-10" rows={5} cols={5} />
      <FloatingRing className="bottom-20 right-10" size={130} color="#f59e0b" id="kpi1" />
      <div className="section-container relative z-10">
        <FadeUpText><span className="text-xs font-mono text-accent-amber/60 tracking-[0.3em] uppercase">09 — Indicateurs Mesurables</span></FadeUpText>
        <SlideRevealText text="Des métriques concrètes pour piloter la performance" tag="h2" className="text-3xl md:text-5xl font-display font-semibold text-base-800 mt-4 mb-6" delay={200} />
        <FadeUpText delay={300}><p className="text-base md:text-lg text-base-400 max-w-3xl mb-16 font-body">La chaîne CI/CD s'accompagne d'indicateurs de performance clés pour mesurer l'efficacité du processus.</p></FadeUpText>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <KPICard label="Taux de réussite" value="95" unit="%" description="Objectif de builds réussis du premier coup." color="green" delay={0} />
          <KPICard label="Temps pipeline" value="8" unit="min" description="Temps cible entre le push et le feedback." color="blue" delay={150} />
          <KPICard label="Fréquence deploy" value="12" unit="/sem" description="Déploiements hebdomadaires visés." color="purple" delay={300} />
          <KPICard label="MTTR" value="15" unit="min" description="Temps moyen de restauration du service." color="amber" delay={450} />
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          <FadeUpText>
            <div className="glass-card p-8">
              <h3 className="text-lg font-display font-medium text-base-800 mb-4">Pourquoi ces indicateurs ?</h3>
              <p className="text-base-500 leading-relaxed text-[15px] font-body">Taux de réussite, temps de pipeline, fréquence de déploiement et MTTR couvrent les dimensions essentielles. Ensemble, ils fournissent un tableau de bord complet pour piloter l'amélioration continue.</p>
            </div>
          </FadeUpText>
        </div>
      </div>
    </section>
  )
}
