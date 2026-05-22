import { SlideRevealText, FadeUpText } from '../components/TextAnimations'
import useStore from '../store/useStore'
import { IconShield, IconZap, IconChart } from '../components/Icons'
import { BlobDecoration, FloatingRing, CrossDecoration } from '../components/Decorations'

export default function ConclusionSection() {
  const { isDeployed } = useStore()

  return (
    <section id="conclusion" className="relative py-32 md:py-48 bg-gradient-to-b from-transparent to-white overflow-hidden">
      <BlobDecoration className="top-10 left-1/4" color1="#c7d2fe" color2="#ddd6fe" size={400} />
      <BlobDecoration className="bottom-20 right-1/4 animation-delay-4000" color1="#a7f3d0" color2="#c7d2fe" size={300} />
      <FloatingRing className="top-20 right-20" size={120} color="#6366f1" id="conc1" />
      <CrossDecoration className="top-1/3 left-16" size={16} />

      <div className="section-container text-center relative z-10">
        <FadeUpText><span className="text-xs font-mono text-base-400 tracking-[0.3em] uppercase">Conclusion</span></FadeUpText>
        <SlideRevealText text="Passons à l'action" tag="h2" className="text-4xl md:text-6xl font-display font-semibold text-base-900 mt-6 mb-10" delay={200} />
        <FadeUpText delay={400}>
          <div className="max-w-3xl mx-auto">
            <p className="text-base md:text-lg text-base-500 leading-relaxed mb-8 font-body">L'intégration et le déploiement continus sont devenus un standard industriel indispensable. Les bénéfices sont immédiats : moins d'erreurs, des déploiements plus rapides, une meilleure traçabilité.</p>
            <p className="text-base md:text-lg text-base-500 leading-relaxed mb-12 font-body">Avec 5 développeurs et un administrateur système, TaskFlow est à la taille idéale pour adopter ces pratiques. Nous recommandons de commencer par un pipeline CI minimal puis d'itérer progressivement.</p>
          </div>
        </FadeUpText>
        <FadeUpText delay={600}>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-16">
            {[
              { icon: <IconShield className="w-5 h-5" stroke="#6366f1" />, title: 'Stabilité', desc: 'Tests systématiques, déploiements reproductibles' },
              { icon: <IconZap className="w-5 h-5" stroke="#6366f1" />, title: 'Rapidité', desc: 'Du commit à la production en minutes' },
              { icon: <IconChart className="w-5 h-5" stroke="#6366f1" />, title: 'Traçabilité', desc: 'Chaque déploiement versionné et auditable' },
            ].map((item, i) => (
              <div key={i} className="glass-card p-6 text-center">
                <div className="w-10 h-10 rounded-lg bg-base-100 border border-base-200 flex items-center justify-center mx-auto mb-3">{item.icon}</div>
                <span className="text-sm font-medium text-base-700 font-body">{item.title}</span>
                <p className="text-xs text-base-400 mt-1.5 font-body">{item.desc}</p>
              </div>
            ))}
          </div>
        </FadeUpText>
        {isDeployed && (
          <FadeUpText delay={800}>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-accent-green/10 border border-accent-green/20">
              <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              <span className="text-sm font-mono text-accent-green">TaskFlow v1.1.0 — Pipeline opérationnel</span>
            </div>
          </FadeUpText>
        )}
        <FadeUpText delay={1000}><p className="text-xs text-base-300 mt-20 font-mono">Présentation CI/CD — TaskFlow — {new Date().getFullYear()}</p></FadeUpText>
      </div>
    </section>
  )
}
