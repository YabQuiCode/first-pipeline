import { SlideRevealText, FadeUpText } from '../components/TextAnimations'
import { useInView } from '../hooks/useInView'
import { DotsPattern, FloatingRing } from '../components/Decorations'

const tools = [
  {
    name: 'Git',
    category: 'Versioning',
    color: 'indigo',
    desc: 'Systeme de controle de version distribue. Permet de suivre chaque modification du code, de travailler en branches paralleles et de fusionner les contributions de plusieurs developpeurs.',
    usage: 'Versionner le code source et declencher le pipeline CI/CD a chaque push.',
  },
  {
    name: 'GitHub',
    category: 'Plateforme',
    color: 'blue',
    desc: 'Plateforme d\'hebergement de depots Git avec interface web. Fournit aussi GitHub Actions pour l\'automatisation CI/CD et GitHub Container Registry pour stocker des images Docker.',
    usage: 'Heberger le depot distant, collaborer en equipe et fournir les webhooks pour Jenkins.',
  },
  {
    name: 'Node.js',
    category: 'Runtime',
    color: 'green',
    desc: 'Environnement d\'execution JavaScript cote serveur, base sur le moteur V8 de Chrome. Permet d\'executer du JavaScript en dehors du navigateur.',
    usage: 'Executer les outils de build (Vite), les tests (Vitest) et le gestionnaire de paquets npm.',
  },
  {
    name: 'React',
    category: 'Framework',
    color: 'cyan',
    desc: 'Bibliotheque JavaScript pour construire des interfaces utilisateur. Utilise un DOM virtuel et une architecture par composants reutilisables.',
    usage: 'Construire l\'interface de la presentation TaskFlow avec des composants interactifs.',
  },
  {
    name: 'Vite',
    category: 'Build Tool',
    color: 'purple',
    desc: 'Outil de build ultra-rapide pour le developpement web. Utilise le bundler Rollup en production pour generer des fichiers optimises (tree-shaking, minification, code-splitting).',
    usage: 'Serveur de developpement avec Hot Module Replacement et build de production optimise.',
  },
  {
    name: 'Vitest',
    category: 'Testing',
    color: 'amber',
    desc: 'Framework de tests unitaires natif pour Vite. Compatible avec l\'API de Jest, il execute les tests dans un environnement jsdom qui simule un navigateur.',
    usage: 'Executer les 13 tests unitaires du projet (store, hooks, composants) dans le pipeline.',
  },
  {
    name: 'Tailwind CSS',
    category: 'Styling',
    color: 'cyan',
    desc: 'Framework CSS utilitaire qui fournit des classes predefinies pour styliser directement dans le HTML. Genere uniquement le CSS utilise en production.',
    usage: 'Styliser tous les composants de la presentation avec des classes utilitaires.',
  },
  {
    name: 'Docker',
    category: 'Conteneurisation',
    color: 'blue',
    desc: 'Plateforme de conteneurisation qui empaquette une application et ses dependances dans un conteneur isole. Garantit que l\'app fonctionne de maniere identique partout.',
    usage: 'Build multi-stage (Node.js puis Nginx), registry local et deploiement du conteneur final.',
  },
  {
    name: 'Nginx',
    category: 'Serveur Web',
    color: 'green',
    desc: 'Serveur web haute performance et reverse proxy. Utilise en version Alpine (legere, ~5 MB) pour servir les fichiers statiques en production.',
    usage: 'Servir le build React en production avec cache, compression et headers de securite.',
  },
  {
    name: 'Jenkins',
    category: 'CI/CD',
    color: 'indigo',
    desc: 'Serveur d\'automatisation open-source. Execute des pipelines definis dans un Jenkinsfile a chaque changement de code. Supporte des centaines de plugins.',
    usage: 'Orchestrer le pipeline complet : checkout, install, tests, build, docker, deploy.',
  },
  {
    name: 'GitHub Actions',
    category: 'CI/CD',
    color: 'purple',
    desc: 'Service d\'automatisation CI/CD integre a GitHub. Les workflows sont definis en YAML et s\'executent sur des runners cloud a chaque evenement (push, PR, etc.).',
    usage: 'Alternative cloud a Jenkins pour executer le pipeline sans infrastructure locale.',
  },
  {
    name: 'Zustand',
    category: 'State Management',
    color: 'amber',
    desc: 'Bibliotheque de gestion d\'etat minimaliste pour React. Plus simple que Redux, elle utilise des hooks et ne necessite aucun provider ou boilerplate.',
    usage: 'Gerer l\'etat global de la presentation (version, dark mode, statut de deploiement).',
  },
]

const colorMap = {
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/15', text: 'text-indigo-500', tag: 'bg-indigo-500/10 text-indigo-600' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/15', text: 'text-blue-500', tag: 'bg-blue-500/10 text-blue-600' },
  green: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/15', text: 'text-emerald-500', tag: 'bg-emerald-500/10 text-emerald-600' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/15', text: 'text-cyan-500', tag: 'bg-cyan-500/10 text-cyan-600' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/15', text: 'text-purple-500', tag: 'bg-purple-500/10 text-purple-600' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/15', text: 'text-amber-500', tag: 'bg-amber-500/10 text-amber-600' },
}

function ToolCard({ tool, index }) {
  const { ref, hasBeenInView } = useInView({ threshold: 0.1 })
  const c = colorMap[tool.color]

  return (
    <div
      ref={ref}
      className={`glass-card p-6 ${c.border} transition-all duration-700`}
      style={{
        opacity: hasBeenInView ? 1 : 0,
        transform: hasBeenInView ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${(index % 6) * 80}ms`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-lg font-display font-medium ${c.text}`}>{tool.name}</h3>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${c.tag}`}>{tool.category}</span>
      </div>
      <p className="text-base-500 text-[14px] leading-relaxed font-body mb-3">{tool.desc}</p>
      <div className="pt-3 border-t border-base-200">
        <p className="text-[11px] font-mono text-base-400 uppercase tracking-wider mb-1">Usage dans le projet</p>
        <p className="text-base-500 text-[13px] leading-relaxed font-body">{tool.usage}</p>
      </div>
    </div>
  )
}

export default function AnnexesSection() {
  return (
    <section id="annexes" className="relative py-32 md:py-40 overflow-hidden">
      <DotsPattern className="top-10 right-10" rows={4} cols={4} />
      <FloatingRing className="bottom-20 left-10" size={100} color="#6366f1" id="annexe1" />

      <div className="section-container relative z-10">
        <FadeUpText>
          <span className="text-xs font-mono text-accent-indigo/60 tracking-[0.3em] uppercase">
            10 — Annexes
          </span>
        </FadeUpText>
        <SlideRevealText
          text="Glossaire des outils"
          tag="h2"
          className="text-3xl md:text-5xl font-display font-semibold text-base-800 mt-4 mb-6"
          delay={200}
        />
        <FadeUpText delay={300}>
          <p className="text-base md:text-lg text-base-400 max-w-3xl mb-16 font-body">
            Chaque outil utilise dans ce projet a un role precis dans la chaine CI/CD.
            Voici une description de chacun et son usage concret dans TaskFlow.
          </p>
        </FadeUpText>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, i) => (
            <ToolCard key={tool.name} tool={tool} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
