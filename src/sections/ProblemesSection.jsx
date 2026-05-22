import { SlideRevealText, FadeUpText } from '../components/TextAnimations'
import ProblemCard from '../components/UI/ProblemCard'
import { IconGear, IconBug, IconClock, IconLock } from '../components/Icons'
import { DotsPattern, FloatingRing } from '../components/Decorations'
import ParallaxLayer from '../components/UI/ParallaxLayer'

export default function ProblemesSection() {
  const problems = [
    { icon: <IconGear className="w-7 h-7" stroke="#6366f1" />, title: "Différences d'environnement",
      description: "Le poste du développeur, le serveur de test et la production ne sont jamais identiques. Une application qui fonctionne parfaitement en local peut échouer en production à cause d'une version de bibliothèque différente, d'une variable d'environnement manquante ou d'une configuration système incompatible." },
    { icon: <IconBug className="w-7 h-7" stroke="#ef4444" />, title: 'Bugs détectés en production',
      description: "Sans suite de tests automatisés, les bugs ne sont découverts qu'une fois le code en production — quand ils impactent directement nos utilisateurs. Ce mode réactif transforme nos clients en testeurs involontaires et multiplie le coût de correction." },
    { icon: <IconClock className="w-7 h-7" stroke="#f59e0b" />, title: "Temps d'intervention excessif",
      description: "Lorsqu'un problème survient, il faut identifier l'origine du bug, reproduire le problème, développer un correctif, et refaire un déploiement manuel — le tout sous pression. L'absence de rollback rapide signifie que chaque incident peut immobiliser l'équipe pendant des heures." },
    { icon: <IconLock className="w-7 h-7" stroke="#8b5cf6" />, title: 'Aucune traçabilité',
      description: "Qui a déployé quoi, quand, et dans quel état ? Il n'existe pas d'historique fiable des déploiements, pas de lien entre un commit Git et sa mise en production, pas d'audit trail exploitable." },
  ]

  return (
    <section id="problemes" className="relative py-32 md:py-40 overflow-hidden">
      <ParallaxLayer speed={0.8}><DotsPattern className="top-20 right-10" rows={6} cols={6} /></ParallaxLayer>
      <ParallaxLayer speed={1.2}><FloatingRing className="bottom-20 -left-10" size={160} color="#ef4444" id="prob1" /></ParallaxLayer>

      <div className="section-container relative z-10">
        <FadeUpText><span className="text-xs font-mono text-accent-indigo/60 tracking-[0.3em] uppercase">02 — Les Problèmes</span></FadeUpText>
        <SlideRevealText text="Ce qui ne fonctionne plus" tag="h2" className="text-3xl md:text-5xl font-display font-semibold text-base-800 mt-4 mb-6" delay={200} />
        <FadeUpText delay={300}>
          <p className="text-base md:text-lg text-base-400 max-w-3xl mb-16 font-body">Notre processus de déploiement actuel accumule des failles structurelles qui transforment chaque mise en production en source de stress et d'incertitude pour toute l'équipe.</p>
        </FadeUpText>
        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((p, i) => (
            <ParallaxLayer key={i} speed={0.15 + i * 0.08}>
              <ProblemCard {...p} delay={i * 150} />
            </ParallaxLayer>
          ))}
        </div>
      </div>
    </section>
  )
}
