import { SlideRevealText, FadeUpText } from '../components/TextAnimations'
import TerminalDual from '../components/Terminal/TerminalWindow'
import useStore from '../store/useStore'

export default function DemoSection() {
  const { isDeployed, triggerDeploy } = useStore()

  return (
    <section id="demo" className="relative py-32 md:py-40 transition-colors duration-[1500ms]">
      <div className="section-container">
        <FadeUpText><span className="text-xs font-mono text-accent-indigo/60 tracking-[0.3em] uppercase">08 — Démonstration Live</span></FadeUpText>
        <SlideRevealText text="Voyez la CI/CD en action" tag="h2" className="text-3xl md:text-5xl font-display font-semibold text-base-800 mt-4 mb-6" delay={200} />
        <FadeUpText delay={300}>
          <p className="text-base md:text-lg text-base-400 max-w-3xl mb-12 font-body">Deux scénarios côte à côte. À gauche, un push échoué. À droite, le même code corrigé. Observez le changement qui se produit sur cette page après un déploiement réussi.</p>
        </FadeUpText>
        <FadeUpText delay={400}>
          <TerminalDual onDeploySuccess={triggerDeploy} />
        </FadeUpText>
        {isDeployed && (
          <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
            <div className="rounded-2xl border border-accent-green/20 bg-white/80 backdrop-blur-xl px-6 py-4 flex items-center gap-4 shadow-lg shadow-accent-green/5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-green animate-pulse" />
              <div>
                <p className="text-sm font-medium text-accent-green font-body">Déploiement réussi — Mode production activé</p>
                <p className="text-xs text-base-400 font-body">TaskFlow v1.1.0 est maintenant en production</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
