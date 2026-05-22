import { SlideRevealText, FadeUpText } from '../components/TextAnimations'
import { useInView } from '../hooks/useInView'
import { IconGitCommit, IconBox, IconFlask, IconHammer, IconDatabase, IconRocket, IconShield } from '../components/Icons'
import { GradientOrb, DotsPattern } from '../components/Decorations'

const stages = [
  {
    icon: <IconGitCommit className="w-6 h-6" />,
    color: 'indigo',
    label: 'git push',
    title: 'Declenchement du pipeline',
    desc: 'Un push sur la branche main declenche automatiquement le pipeline CI/CD. Le webhook GitHub notifie le serveur Jenkins ou GitHub Actions qui clone le depot et demarre l\'execution.',
    tools: ['Git', 'GitHub Webhooks', 'Jenkins / GitHub Actions'],
    files: ['.github/workflows/ci-cd.yml', 'Jenkinsfile'],
    details: 'Le pipeline est configure en mode declaratif. Chaque etape est independante et echoue rapidement (fail-fast) pour un feedback immediat au developpeur.',
  },
  {
    icon: <IconBox className="w-6 h-6" />,
    color: 'blue',
    label: 'npm install',
    title: 'Installation des dependances',
    desc: 'Le serveur CI installe les dependances exactes du projet via npm ci. Cette commande garantit une installation reproductible en se basant strictement sur le package-lock.json.',
    tools: ['npm ci', 'Node.js 20', 'package-lock.json'],
    files: ['package.json', 'package-lock.json'],
    details: 'npm ci est prefere a npm install car il supprime node_modules avant installation, garantissant un environnement propre identique a chaque execution.',
  },
  {
    icon: <IconFlask className="w-6 h-6" />,
    color: 'cyan',
    label: 'npm test',
    title: 'Tests unitaires automatises',
    desc: 'Vitest execute les 13 tests unitaires du projet : tests du store Zustand (5), tests des hooks (4), tests du composant App (4). Un seul echec bloque le pipeline.',
    tools: ['Vitest', '@testing-library/react', 'jsdom'],
    files: ['src/test/store.test.js', 'src/test/hooks.test.js', 'src/test/App.test.jsx'],
    details: 'Les tests couvrent la logique metier (store), le comportement des hooks personnalises et le rendu des composants React. L\'environnement jsdom simule un navigateur.',
  },
  {
    icon: <IconHammer className="w-6 h-6" />,
    color: 'amber',
    label: 'npm run build',
    title: 'Build de production',
    desc: 'Vite compile et optimise l\'application React pour la production : tree-shaking, minification, code-splitting. Le resultat est un bundle statique pret a etre servi.',
    tools: ['Vite 6', 'Rollup', 'Tailwind CSS 3'],
    files: ['vite.config.js', 'dist/'],
    details: 'Le build produit des fichiers hashes (index-Ha8x.js) permettant un cache agressif cote navigateur. La taille finale est d\'environ 61 KB gzip.',
  },
  {
    icon: <IconShield className="w-6 h-6" />,
    color: 'purple',
    label: 'docker build',
    title: 'Construction de l\'image Docker',
    desc: 'Un Dockerfile multi-stage construit l\'image en deux phases : build dans Node.js, puis copie du resultat dans une image Nginx legere pour la production.',
    tools: ['Docker', 'Multi-stage build', 'Nginx Alpine'],
    files: ['Dockerfile', 'nginx.conf', '.dockerignore'],
    details: 'Le multi-stage build reduit la taille de l\'image finale (~25 MB vs ~1 GB avec node_modules). Nginx sert les fichiers statiques avec des headers de cache et de securite.',
  },
  {
    icon: <IconDatabase className="w-6 h-6" />,
    color: 'pink',
    label: 'docker push',
    title: 'Push vers le registry',
    desc: 'L\'image Docker est taguee avec la version et le hash du commit, puis poussee vers le GitHub Container Registry (ghcr.io) pour etre disponible au deploiement.',
    tools: ['Docker Registry', 'ghcr.io', 'Semantic Versioning'],
    files: ['docker-compose.yml'],
    details: 'Le tag combine version semantique et hash git (ex: 1.1.0-e4f5g6h). Cela permet d\'identifier precisement quel code tourne en production et de rollback si necessaire.',
  },
  {
    icon: <IconRocket className="w-6 h-6" />,
    color: 'green',
    label: 'deploy',
    title: 'Deploiement en production',
    desc: 'Le script de deploiement execute un rolling update : le nouveau conteneur demarre, un health check valide la sante, puis l\'ancien conteneur est retire. Zero downtime.',
    tools: ['Docker Compose', 'SSH', 'Rolling Update'],
    files: ['scripts/deploy.sh', 'docker-compose.yml', '.env.prod'],
    details: 'En cas d\'echec du health check, le script effectue un rollback automatique vers la version precedente. Chaque deploiement est auditable avec timestamp et version.',
  },
]

const colorMap = {
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', accent: 'text-indigo-500', tag: 'bg-indigo-500/10 text-indigo-600', tagDot: 'bg-indigo-500' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', accent: 'text-blue-500', tag: 'bg-blue-500/10 text-blue-600', tagDot: 'bg-blue-500' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', accent: 'text-cyan-500', tag: 'bg-cyan-500/10 text-cyan-600', tagDot: 'bg-cyan-500' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', accent: 'text-amber-500', tag: 'bg-amber-500/10 text-amber-600', tagDot: 'bg-amber-500' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', accent: 'text-purple-500', tag: 'bg-purple-500/10 text-purple-600', tagDot: 'bg-purple-500' },
  pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/20', text: 'text-pink-400', accent: 'text-pink-500', tag: 'bg-pink-500/10 text-pink-600', tagDot: 'bg-pink-500' },
  green: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', accent: 'text-emerald-500', tag: 'bg-emerald-500/10 text-emerald-600', tagDot: 'bg-emerald-500' },
}

function StageCard({ stage, index }) {
  const { ref, hasBeenInView } = useInView({ threshold: 0.15 })
  const c = colorMap[stage.color]
  const isEven = index % 2 === 0

  return (
    <div ref={ref} className="relative">
      {/* Timeline connector */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-base-200 hidden lg:block" />

      <div
        className="transition-all duration-700"
        style={{
          opacity: hasBeenInView ? 1 : 0,
          transform: hasBeenInView ? 'translateY(0)' : 'translateY(40px)',
          transitionDelay: `${index * 80}ms`,
        }}
      >
        {/* Step number + icon */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`relative z-10 w-12 h-12 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center ${c.text} shrink-0`}>
            {stage.icon}
          </div>
          <div>
            <span className="text-xs font-mono text-base-400 tracking-wide">Etape {index + 1}/7</span>
            <h3 className="text-lg md:text-xl font-display font-medium text-base-800">{stage.title}</h3>
          </div>
        </div>

        {/* Content card */}
        <div className="glass-card p-6 md:p-8 ml-0 lg:ml-16">
          {/* Command badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a1a2e] mb-5">
            <span className="text-emerald-400 text-xs font-mono">$</span>
            <code className="text-white/80 text-sm font-mono">{stage.label}</code>
          </div>

          {/* Description */}
          <p className="text-base-500 leading-relaxed text-[15px] font-body mb-5">
            {stage.desc}
          </p>

          {/* Details */}
          <p className="text-base-400 leading-relaxed text-[13px] font-body mb-6 pl-4 border-l-2 border-base-200 italic">
            {stage.details}
          </p>

          {/* Tools & Files grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-mono text-base-400 tracking-wider uppercase mb-2">Outils</p>
              <div className="flex flex-wrap gap-1.5">
                {stage.tools.map((tool, i) => (
                  <span key={i} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono ${c.tag}`}>
                    <span className={`w-1 h-1 rounded-full ${c.tagDot}`} />
                    {tool}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-mono text-base-400 tracking-wider uppercase mb-2">Fichiers</p>
              <div className="flex flex-wrap gap-1.5">
                {stage.files.map((file, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-base-100 text-base-500">
                    {file}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PipelineDetailSection() {
  return (
    <section id="pipeline-detail" className="relative py-32 md:py-40 overflow-hidden">
      <GradientOrb className="top-40 -right-20" color="#8b5cf6" size={300} blur={100} />
      <GradientOrb className="bottom-40 -left-20" color="#10b981" size={250} blur={90} />
      <DotsPattern className="top-20 left-10" rows={5} cols={5} />
      <DotsPattern className="bottom-20 right-10" rows={4} cols={4} />

      <div className="section-container relative z-10">
        <FadeUpText>
          <span className="text-xs font-mono text-accent-indigo/60 tracking-[0.3em] uppercase">
            07 — En detail
          </span>
        </FadeUpText>
        <SlideRevealText
          text="Anatomie du pipeline"
          tag="h2"
          className="text-3xl md:text-5xl font-display font-semibold text-base-800 mt-4 mb-6"
          delay={200}
        />
        <FadeUpText delay={300}>
          <p className="text-base md:text-lg text-base-400 max-w-3xl mb-16 font-body">
            Chaque commande du terminal correspond a une etape concrete du pipeline.
            Voici ce qui se passe a chaque phase, les outils utilises et les fichiers impliques.
          </p>
        </FadeUpText>

        {/* Summary bar */}
        <FadeUpText delay={400}>
          <div className="glass-card p-5 mb-12 flex flex-wrap items-center justify-center gap-3">
            {stages.map((stage, i) => {
              const c = colorMap[stage.color]
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg ${c.bg} ${c.text} flex items-center justify-center`}>
                    <span className="text-xs font-mono font-bold">{i + 1}</span>
                  </div>
                  <span className="text-xs font-mono text-base-500">{stage.label}</span>
                  {i < stages.length - 1 && (
                    <svg className="w-4 h-4 text-base-300 ml-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 3l5 5-5 5" />
                    </svg>
                  )}
                </div>
              )
            })}
          </div>
        </FadeUpText>

        {/* Stage cards */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {stages.map((stage, i) => (
            <StageCard key={i} stage={stage} index={i} />
          ))}
        </div>

        {/* Bottom summary */}
        <FadeUpText delay={200}>
          <div className="glass-card p-8 max-w-4xl mx-auto mt-12 text-center">
            <p className="text-base-500 leading-relaxed text-[15px] font-body">
              Ces 7 etapes s'executent automatiquement a chaque push.
              Le developpeur n'intervient qu'au debut (git push) — le reste est entierement automatise.
              En cas d'echec a n'importe quelle etape, le pipeline s'arrete et notifie l'equipe.
            </p>
          </div>
        </FadeUpText>
      </div>
    </section>
  )
}
