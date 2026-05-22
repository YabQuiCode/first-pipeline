import { SlideRevealText, FadeUpText } from '../components/TextAnimations'
import CostBar from '../components/UI/CostBar'
import { BlobDecoration } from '../components/Decorations'

export default function CoutSection() {
  const stages = [
    { label: 'Dev', multiplier: '1x', heightPercent: 12, isDanger: false },
    { label: 'Intégration', multiplier: '5x', heightPercent: 28, isDanger: false },
    { label: 'Test', multiplier: '15x', heightPercent: 48, isDanger: false },
    { label: 'Staging', multiplier: '50x', heightPercent: 72, isDanger: false },
    { label: 'Production', multiplier: '150x', heightPercent: 100, isDanger: true },
  ]

  return (
    <section id="cout" className="relative py-32 md:py-40 overflow-hidden">
      <BlobDecoration className="-right-40 top-20" color1="#fecaca" color2="#fee2e2" size={350} />
      <div className="section-container relative z-10">
        <FadeUpText><span className="text-xs font-mono text-accent-red/60 tracking-[0.3em] uppercase">03 — Le Coût Réel</span></FadeUpText>
        <SlideRevealText text="Le prix de l'inaction" tag="h2" className="text-3xl md:text-5xl font-display font-semibold text-base-800 mt-4 mb-16" delay={200} />
        <div className="flex items-end justify-center gap-6 md:gap-10 mb-16">
          {stages.map((s, i) => <CostBar key={i} label={s.label} multiplier={s.multiplier} heightPercent={s.heightPercent} isDanger={s.isDanger} delay={i * 200} />)}
        </div>
        <div className="max-w-3xl mx-auto space-y-6">
          <FadeUpText>
            <div className="glass-card p-8">
              <p className="text-base-500 leading-relaxed text-[15px] font-body">Le coût de correction d'un bug suit une courbe exponentielle en fonction du moment de sa détection. Un défaut identifié durant la phase de développement coûte un effort unitaire. Le même défaut en production peut coûter jusqu'à 150 fois plus cher.</p>
            </div>
          </FadeUpText>
          <FadeUpText delay={200}>
            <div className="glass-card p-8">
              <p className="text-base-500 leading-relaxed text-[15px] font-body">Au-delà du coût financier, chaque incident entraîne une cascade de conséquences : interruption de service, perte de données, atteinte à l'image de marque, stress de l'équipe. L'intégration continue déplace la majorité des corrections vers les phases amont.</p>
            </div>
          </FadeUpText>
        </div>
      </div>
    </section>
  )
}
