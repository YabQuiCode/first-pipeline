import { SlideRevealText, FadeUpText } from '../components/TextAnimations'
import StatCard from '../components/UI/StatCard'
import ParallaxLayer from '../components/UI/ParallaxLayer'

export default function ConstatSection() {
  return (
    <section id="constat" className="relative py-32 md:py-40">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <FadeUpText>
              <span className="text-xs font-mono text-accent-indigo/60 tracking-[0.3em] uppercase">01 — Le Constat</span>
            </FadeUpText>
            <SlideRevealText text="Là où nous en sommes aujourd'hui" tag="h2"
              className="text-3xl md:text-5xl font-display font-semibold text-base-800 mt-4 mb-10" delay={200} />
            <div className="grid grid-cols-2 gap-4">
              <StatCard value="5" label="Développeurs" delay={0} />
              <StatCard value="1" label="Admin Système" delay={100} />
              <StatCard value="2" label="Incidents majeurs / 3 mois" variant="danger" delay={200} />
              <StatCard value="100%" label="Déploiements manuels" variant="warning" delay={300} />
            </div>
          </div>
          <ParallaxLayer speed={0.3}>
            <div className="space-y-6 lg:pt-20">
              {[
                "Aujourd'hui, notre équipe de développement fonctionne sur un modèle traditionnel qui montre clairement ses limites. Chaque fois qu'un développeur termine une fonctionnalité ou corrige un bug, le code est transmis manuellement à l'administrateur système qui se charge de l'installation sur les serveurs. Ce processus introduit une série de risques à chaque itération et repose entièrement sur la disponibilité d'une seule personne.",
                "Les déploiements sont réalisés à la main, sans procédure standardisée ni reproductible. Il n'existe aucun filet de sécurité automatisé : pas de tests systématiques avant la mise en production, pas de vérification de compatibilité des dépendances, pas de contrôle de la configuration réseau. Chaque mise en production est une opération artisanale où l'erreur humaine est statistiquement inévitable.",
                "Le résultat est sans appel : deux incidents majeurs en trois mois. Deux interruptions de service qui ont directement impacté nos utilisateurs, mobilisé l'ensemble de l'équipe en intervention d'urgence, et contribué à éroder la confiance de nos clients dans la fiabilité de TaskFlow.",
                "Lorsqu'un problème survient, les diagnostics sont rendus extrêmement difficiles par l'absence totale de traçabilité. Personne ne peut répondre avec certitude aux questions fondamentales : quel code a été déployé ? Par qui ? À quelle heure exactement ? Chaque incident devient une enquête artisanale qui rallonge considérablement le temps de résolution."
              ].map((text, i) => (
                <FadeUpText key={i} delay={i * 200}>
                  <div className="glass-card p-8">
                    <p className="text-base-500 leading-relaxed text-[15px] font-body">{text}</p>
                  </div>
                </FadeUpText>
              ))}
            </div>
          </ParallaxLayer>
        </div>
      </div>
    </section>
  )
}
