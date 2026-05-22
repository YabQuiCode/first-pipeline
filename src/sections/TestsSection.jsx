import { SlideRevealText, FadeUpText } from '../components/TextAnimations'
import InteractiveTerminal from '../components/Terminal/InteractiveTerminal'

export default function TestsSection() {
  return (
    <section id="tests" className="relative py-32 md:py-40">
      <div className="section-container">
        <FadeUpText>
          <span className="text-xs font-mono text-accent-indigo/60 tracking-[0.3em] uppercase">
            06 — Pipeline en action
          </span>
        </FadeUpText>
        <SlideRevealText
          text="Du git push au deploiement"
          tag="h2"
          className="text-3xl md:text-5xl font-display font-semibold text-base-800 mt-4 mb-6"
          delay={200}
        />
        <FadeUpText delay={300}>
          <p className="text-base md:text-lg text-base-400 max-w-3xl mb-12 font-body">
            Tapez chaque commande dans le terminal pour executer le pipeline
            etape par etape. Observez le processus complet, du push au deploiement.
          </p>
        </FadeUpText>
        <FadeUpText delay={400}>
          <InteractiveTerminal />
        </FadeUpText>
      </div>
    </section>
  )
}
