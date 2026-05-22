import { SlideRevealText, FadeUpText } from '../components/TextAnimations'
import { useInView } from '../hooks/useInView'
import { useState, useEffect } from 'react'
import { IconTerminal, IconHammer, IconFlask, IconShield, IconBox, IconDatabase, IconRocket, IconChart } from '../components/Icons'
import { GradientOrb, DotsPattern } from '../components/Decorations'

const stages = [
  { id: 'code', label: 'Code', icon: <IconTerminal className="w-5 h-5" /> },
  { id: 'build', label: 'Build', icon: <IconHammer className="w-5 h-5" /> },
  { id: 'test', label: 'Tests', icon: <IconFlask className="w-5 h-5" /> },
  { id: 'security', label: 'Sécurité', icon: <IconShield className="w-5 h-5" /> },
  { id: 'package', label: 'Packaging', icon: <IconBox className="w-5 h-5" /> },
  { id: 'publish', label: 'Registry', icon: <IconDatabase className="w-5 h-5" /> },
  { id: 'deploy', label: 'Deploy', icon: <IconRocket className="w-5 h-5" /> },
  { id: 'monitor', label: 'Monitor', icon: <IconChart className="w-5 h-5" /> },
]

function AnimatedPipeline() {
  const { ref, hasBeenInView } = useInView({ threshold: 0.3 })
  const [activeIndex, setActiveIndex] = useState(-1)
  useEffect(() => {
    if (!hasBeenInView) return
    let i = 0
    const interval = setInterval(() => { setActiveIndex(i); i++; if (i >= stages.length) clearInterval(interval) }, 400)
    return () => clearInterval(interval)
  }, [hasBeenInView])

  return (
    <div ref={ref} className="relative py-8">
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-base-200 hidden md:block" />
      <div className="absolute top-1/2 left-0 h-[1px] bg-gradient-to-r from-accent-indigo to-accent-green hidden md:block transition-all duration-500"
        style={{ width: activeIndex >= 0 ? `${((activeIndex + 1) / stages.length) * 100}%` : '0%' }} />
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4 relative z-10">
        {stages.map((stage, i) => (
          <div key={stage.id} className={`flex flex-col items-center gap-3 transition-all duration-500 ${i <= activeIndex ? 'opacity-100 scale-100' : 'opacity-25 scale-90'}`}
            style={{ transitionDelay: `${i * 100}ms` }}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
              i <= activeIndex ? 'bg-white border border-accent-indigo/20 shadow-md shadow-indigo-100 text-accent-indigo' : 'bg-base-100 border border-base-200 text-base-300'
            }`}>{stage.icon}</div>
            <span className="text-xs font-medium text-base-500 text-center font-body">{stage.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PipelineSection() {
  return (
    <section id="pipeline" className="relative py-32 md:py-40 overflow-hidden">
      <GradientOrb className="top-10 -right-20" color="#8b5cf6" size={280} blur={90} />
      <DotsPattern className="bottom-20 left-10" rows={4} cols={4} />
      <div className="section-container relative z-10">
        <FadeUpText><span className="text-xs font-mono text-accent-purple/60 tracking-[0.3em] uppercase">05 — Le Pipeline</span></FadeUpText>
        <SlideRevealText text="Vision globale d'un pipeline CI/CD" tag="h2" className="text-3xl md:text-5xl font-display font-semibold text-base-800 mt-4 mb-6" delay={200} />
        <FadeUpText delay={300}>
          <p className="text-base md:text-lg text-base-400 max-w-3xl mb-16 font-body">Un pipeline est un graphe orienté d'exécution automatisé, déclenché par un événement, garantissant une transformation contrôlée d'un état logiciel vers un autre.</p>
        </FadeUpText>
        <div className="glass-card p-8 md:p-12 mb-16"><AnimatedPipeline /></div>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
          <FadeUpText>
            <div className="glass-card p-8 border-accent-indigo/10">
              <h3 className="text-lg font-display font-medium text-accent-indigo mb-4">Entrée du pipeline</h3>
              <p className="text-base-500 leading-relaxed text-[15px] font-body">Code source, fichiers de configuration, dépendances. Un simple push sur la branche principale lance l'intégralité du processus automatiquement.</p>
            </div>
          </FadeUpText>
          <FadeUpText delay={200}>
            <div className="glass-card p-8 border-accent-green/10">
              <h3 className="text-lg font-display font-medium text-accent-green mb-4">Sortie du pipeline</h3>
              <p className="text-base-500 leading-relaxed text-[15px] font-body">Un artefact versionné prêt au déploiement — image Docker taguée, accompagnée de rapports d'analyse constituant une preuve auditable.</p>
            </div>
          </FadeUpText>
        </div>
        <FadeUpText delay={300}>
          <div className="glass-card p-8 max-w-3xl mx-auto">
            <h3 className="text-lg font-display font-medium text-base-800 mb-4">Qu'est-ce qu'un artefact ?</h3>
            <p className="text-base-500 leading-relaxed text-[15px] font-body">Le résultat compilé, testé et packagé du pipeline. Il doit être versionné, stocké dans un registry sécurisé et parfaitement reproductible.</p>
          </div>
        </FadeUpText>
      </div>
    </section>
  )
}
