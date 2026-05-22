import { SlideRevealText, FadeUpText } from '../components/TextAnimations'
import ParallaxLayer from '../components/UI/ParallaxLayer'
import { useInView } from '../hooks/useInView'
import { IconCode, IconWrench, IconTrendingUp } from '../components/Icons'

function BenefitColumn({ icon, title, items, color, delay = 0 }) {
  const { ref, hasBeenInView } = useInView({ threshold: 0.2 })
  const colorMap = {
    blue: { border: 'border-accent-blue/15', text: 'text-accent-blue' },
    green: { border: 'border-accent-green/15', text: 'text-accent-green' },
    purple: { border: 'border-accent-purple/15', text: 'text-accent-purple' },
  }
  const c = colorMap[color]
  return (
    <div ref={ref} className={`glass-card p-8 ${c.border} transition-all duration-700`}
      style={{ opacity: hasBeenInView ? 1 : 0, transform: hasBeenInView ? 'translateY(0)' : 'translateY(50px)', transitionDelay: `${delay}ms` }}>
      <div className="w-12 h-12 rounded-xl bg-base-100 border border-base-200 flex items-center justify-center mb-5">{icon}</div>
      <h3 className={`text-xl font-display font-medium ${c.text} mb-5`}>{title}</h3>
      {items.map((item, i) => <p key={i} className="text-base-500 leading-relaxed text-[15px] mb-4 last:mb-0 font-body">{item}</p>)}
    </div>
  )
}

export default function BeneficesSection() {
  return (
    <section id="benefices" className="relative py-32 md:py-40">
      <div className="section-container">
        <FadeUpText><span className="text-xs font-mono text-accent-green/60 tracking-[0.3em] uppercase">08 — Les Benefices</span></FadeUpText>
        <SlideRevealText text="Ce que la CI/CD apporte à chaque rôle" tag="h2" className="text-3xl md:text-5xl font-display font-semibold text-base-800 mt-4 mb-6" delay={200} />
        <FadeUpText delay={300}><p className="text-base md:text-lg text-base-400 max-w-3xl mb-16 font-body">L'intégration et le déploiement continus créent de la valeur à chaque niveau de l'organisation.</p></FadeUpText>
        <ParallaxLayer speed={0.2}>
          <div className="grid md:grid-cols-3 gap-6">
            <BenefitColumn icon={<IconCode className="w-6 h-6" stroke="#3b82f6" />} title="Pour les développeurs" color="blue" delay={0}
              items={["Feedback immédiat : chaque push déclenche des tests qui valident le code en quelques minutes.",
                "Réduction du stress : le rollback en un clic rend les déploiements routiniers.",
                "Gain de productivité : plus de temps pour coder, moins pour diagnostiquer."]} />
            <BenefitColumn icon={<IconWrench className="w-6 h-6" stroke="#10b981" />} title="Pour les administrateurs" color="green" delay={200}
              items={["Fin des interventions d'urgence nocturnes. L'admin passe de pompier à architecte.",
                "Traçabilité complète : qui a déployé quoi, quand, avec quelle version.",
                "Infrastructure reproductible grâce aux conteneurs Docker et à l'IaC."]} />
            <BenefitColumn icon={<IconTrendingUp className="w-6 h-6" stroke="#8b5cf6" />} title="Pour la direction" color="purple" delay={400}
              items={["Réduction mesurable du Time To Market. La capacité à itérer rapidement devient un avantage compétitif.",
                "Indicateurs de performance objectifs : taux de réussite, fréquence de déploiement, MTTR.",
                "Diminution significative des coûts opérationnels liés aux incidents."]} />
          </div>
        </ParallaxLayer>
      </div>
    </section>
  )
}
