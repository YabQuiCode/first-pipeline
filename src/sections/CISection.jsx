import { SlideRevealText, FadeUpText } from '../components/TextAnimations'
import { useInView } from '../hooks/useInView'
import { IconGitCommit, IconHammer, IconFlask, IconSearch, IconCheck } from '../components/Icons'
import { CircleDecoration, GradientOrb } from '../components/Decorations'

const pipelineSteps = [
  { icon: <IconGitCommit />, label: 'Commit', desc: 'Push du code' },
  { icon: <IconHammer />, label: 'Build', desc: 'Compilation' },
  { icon: <IconFlask />, label: 'Test', desc: 'Tests auto' },
  { icon: <IconSearch />, label: 'Analyse', desc: 'Qualité & sécu' },
  { icon: <IconCheck />, label: 'Feedback', desc: 'Résultat' },
]

function PipelineStep({ icon, label, desc, index }) {
  const { ref, hasBeenInView } = useInView({ threshold: 0.5 })
  return (
    <>
      <div ref={ref} className="flex flex-col items-center gap-3 transition-all duration-700"
        style={{ opacity: hasBeenInView ? 1 : 0, transform: hasBeenInView ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)', transitionDelay: `${index * 200}ms` }}>
        <div className="w-14 h-14 rounded-2xl bg-white border border-base-200 shadow-sm flex items-center justify-center text-base-500">{icon}</div>
        <span className="text-sm font-medium text-base-700 font-body">{label}</span>
        <span className="text-xs text-base-400 font-body">{desc}</span>
      </div>
      {index < pipelineSteps.length - 1 && (
        <div className="hidden md:block w-12 h-[1px] mt-7 transition-all duration-500"
          style={{ background: hasBeenInView ? 'linear-gradient(90deg, rgba(99,102,241,0.3), rgba(99,102,241,0.05))' : 'rgba(0,0,0,0.05)', transitionDelay: `${index * 200 + 300}ms` }} />
      )}
    </>
  )
}

export default function CISection() {
  return (
    <section id="ci" className="relative py-32 md:py-40 overflow-hidden">
      <CircleDecoration className="-right-10 top-32" size={220} color="#10b981" />
      <GradientOrb className="bottom-0 -left-20" color="#6366f1" size={250} blur={90} />
      <div className="section-container relative z-10">
        <FadeUpText><span className="text-xs font-mono text-accent-green/60 tracking-[0.3em] uppercase">04 — La Solution</span></FadeUpText>
        <SlideRevealText text="Qu'est-ce que l'Intégration Continue ?" tag="h2" className="text-3xl md:text-5xl font-display font-semibold text-base-800 mt-4 mb-6" delay={200} />
        <FadeUpText delay={300}>
          <p className="text-base md:text-lg text-base-400 max-w-3xl mb-20 font-body">L'intégration continue consiste à intégrer régulièrement les modifications de code dans un dépôt central, déclenchant automatiquement des tests et des vérifications à chaque changement.</p>
        </FadeUpText>
        <div className="flex items-start justify-center gap-4 md:gap-6 flex-wrap mb-20">
          {pipelineSteps.map((step, i) => <PipelineStep key={i} {...step} index={i} />)}
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <FadeUpText>
            <div className="glass-card p-8">
              <h3 className="text-lg font-display font-medium text-base-800 mb-4">Fonctionnement</h3>
              <p className="text-base-500 leading-relaxed text-[15px] font-body">À chaque push sur le dépôt Git, un pipeline se déclenche instantanément : compilation, tests, analyse statique, vérification des dépendances. En quelques minutes, le développeur reçoit un feedback clair.</p>
            </div>
          </FadeUpText>
          <FadeUpText delay={200}>
            <div className="glass-card p-8">
              <h3 className="text-lg font-display font-medium text-base-800 mb-4">Objectifs</h3>
              <p className="text-base-500 leading-relaxed text-[15px] font-body">Détecter les problèmes le plus tôt possible. Les tests systématiques garantissent que la branche principale est toujours déployable. Les conflits sont résolus quotidiennement, les régressions identifiées immédiatement.</p>
            </div>
          </FadeUpText>
        </div>
      </div>
    </section>
  )
}
