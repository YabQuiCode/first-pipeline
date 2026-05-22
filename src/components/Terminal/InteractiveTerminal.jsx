import { useState, useRef, useEffect, useCallback } from 'react'
import useStore from '../../store/useStore'

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

// ============================================
// Commandes reconnues
// ============================================
const COMMANDS = {
  'git push': {
    stage: 'push',
    lines: [
      { type: 'dim', text: 'Enumerating objects: 9, done.' },
      { type: 'dim', text: 'Counting objects: 100% (9/9), done.' },
      { type: 'dim', text: 'Delta compression using up to 8 threads' },
      { type: 'dim', text: 'Writing objects: 100% (5/5), 1.24 KiB' },
      { type: 'dim', text: 'remote: Resolving deltas: 100% (3/3)' },
      { type: 'dim', text: '' },
      { type: 'success', text: '   a1b2c3d..e4f5g6h  main -> main' },
      { type: 'dim', text: '' },
      { type: 'header', text: '>> Pipeline CI/CD declenche...' },
    ],
  },
  'npm install': {
    stage: 'install',
    lines: [
      { type: 'dim', text: '' },
      { type: 'info', text: '[1/6] Installation des dependances' },
      { type: 'dim', text: '' },
      { type: 'dim', text: '> npm ci' },
      { type: 'dim', text: 'added 304 packages in 4.2s' },
      { type: 'dim', text: '' },
      { type: 'success', text: '✓ Dependances installees (4.2s)' },
    ],
  },
  'npm test': {
    stage: 'test',
    lines: [
      { type: 'dim', text: '' },
      { type: 'info', text: '[2/6] Tests unitaires' },
      { type: 'dim', text: '' },
      { type: 'dim', text: '> vitest run' },
      { type: 'dim', text: '' },
      { type: 'suite', text: ' PASS  src/test/store.test.js' },
      { type: 'test-pass', text: '   ✓ should have correct initial state (2ms)' },
      { type: 'test-pass', text: '   ✓ should update version (1ms)' },
      { type: 'test-pass', text: '   ✓ should update deployed status (1ms)' },
      { type: 'test-pass', text: '   ✓ should update deploy success (1ms)' },
      { type: 'test-pass', text: '   ✓ should trigger deploy correctly (3ms)' },
      { type: 'dim', text: '' },
      { type: 'suite', text: ' PASS  src/test/hooks.test.js' },
      { type: 'test-pass', text: '   ✓ should parse numeric string targets (1ms)' },
      { type: 'test-pass', text: '   ✓ should handle NaN targets gracefully (1ms)' },
      { type: 'test-pass', text: '   ✓ should calculate easing correctly (2ms)' },
      { type: 'test-pass', text: '   ✓ should round count values correctly (1ms)' },
      { type: 'dim', text: '' },
      { type: 'suite', text: ' PASS  src/test/App.test.jsx' },
      { type: 'test-pass', text: '   ✓ should render without crashing (12ms)' },
      { type: 'test-pass', text: '   ✓ should contain main element (4ms)' },
      { type: 'test-pass', text: '   ✓ should apply dark-mode class (6ms)' },
      { type: 'test-pass', text: '   ✓ should not have dark-mode when false (3ms)' },
      { type: 'dim', text: '' },
      { type: 'success-bold', text: ' Test Files  3 passed (3)' },
      { type: 'success-bold', text: '      Tests  13 passed (13)' },
      { type: 'dim', text: '   Duration  1.63s' },
      { type: 'dim', text: '' },
      { type: 'success', text: '✓ Tous les tests passent' },
    ],
  },
  'npm run build': {
    stage: 'build',
    lines: [
      { type: 'dim', text: '' },
      { type: 'info', text: '[3/6] Build de production' },
      { type: 'dim', text: '' },
      { type: 'dim', text: '> vite build' },
      { type: 'dim', text: 'vite v6.0.0 building for production...' },
      { type: 'dim', text: '✓ 48 modules transformed.' },
      { type: 'dim', text: '' },
      { type: 'dim', text: 'dist/index.html                  0.46 kB  gzip:  0.30 kB' },
      { type: 'dim', text: 'dist/assets/index-Dk3f.css      12.84 kB  gzip:  3.21 kB' },
      { type: 'dim', text: 'dist/assets/index-Ha8x.js      187.32 kB  gzip: 61.04 kB' },
      { type: 'dim', text: '' },
      { type: 'success', text: '✓ Build reussi (2.84s)' },
    ],
  },
  'docker build': {
    stage: 'docker',
    lines: [
      { type: 'dim', text: '' },
      { type: 'info', text: '[4/6] Construction image Docker' },
      { type: 'dim', text: '' },
      { type: 'dim', text: '> docker build -t taskflow:1.1.0-e4f5g6h .' },
      { type: 'dim', text: '' },
      { type: 'dim', text: '[+] Building 28.4s (12/12) FINISHED' },
      { type: 'dim', text: ' => [build 1/5] FROM node:20-alpine           0.0s' },
      { type: 'dim', text: ' => [build 2/5] COPY package*.json ./         0.1s' },
      { type: 'dim', text: ' => [build 3/5] RUN npm ci                   18.2s' },
      { type: 'dim', text: ' => [build 4/5] COPY . .                      0.3s' },
      { type: 'dim', text: ' => [build 5/5] RUN npm run build             4.1s' },
      { type: 'dim', text: ' => [prod  1/2] COPY nginx.conf               0.0s' },
      { type: 'dim', text: ' => [prod  2/2] COPY --from=build /app/dist   0.1s' },
      { type: 'dim', text: '' },
      { type: 'success', text: '✓ Image: taskflow:1.1.0-e4f5g6h (28.4s)' },
    ],
  },
  'docker push': {
    stage: 'push-registry',
    lines: [
      { type: 'dim', text: '' },
      { type: 'info', text: '[5/6] Push vers le registry' },
      { type: 'dim', text: '' },
      { type: 'dim', text: '> docker push ghcr.io/taskflow/taskflow:1.1.0' },
      { type: 'dim', text: '' },
      { type: 'dim', text: 'e4f5g6h: Preparing' },
      { type: 'dim', text: 'e4f5g6h: Pushing  [=========>]  4.2MB/4.2MB' },
      { type: 'dim', text: 'e4f5g6h: Pushed' },
      { type: 'dim', text: 'latest: digest: sha256:9f2c3a8b... size: 1572' },
      { type: 'dim', text: '' },
      { type: 'success', text: '✓ Image poussee (6.1s)' },
    ],
  },
  'deploy': {
    stage: 'deploy',
    lines: [
      { type: 'dim', text: '' },
      { type: 'info', text: '[6/6] Deploiement production' },
      { type: 'dim', text: '' },
      { type: 'dim', text: '> ./scripts/deploy.sh --env prod' },
      { type: 'dim', text: '' },
      { type: 'dim', text: 'Version actuelle : taskflow:1.0.0' },
      { type: 'dim', text: 'Nouvelle version : taskflow:1.1.0-e4f5g6h' },
      { type: 'dim', text: '' },
      { type: 'success', text: '✓ Pull image ................. OK' },
      { type: 'success', text: '✓ Nouveau conteneur demarre .. OK' },
      { type: 'success', text: '✓ Health check ............... 200 OK' },
      { type: 'success', text: '✓ Rolling update ............. OK (0 downtime)' },
      { type: 'dim', text: '' },
      { type: 'deploy', text: '══════════════════════════════════' },
      { type: 'deploy', text: '  TaskFlow v1.1.0 is now LIVE' },
      { type: 'deploy', text: '  Commit:   e4f5g6h' },
      { type: 'deploy', text: '  Duration: 53.2s' },
      { type: 'deploy', text: '══════════════════════════════════' },
    ],
  },
}

// Pipeline stages (ordre à droite)
const PIPELINE_STAGES = [
  { id: 'push', label: 'git push', desc: 'Le code est pousse sur main. Ca declenche le pipeline.' },
  { id: 'install', label: 'npm install', desc: 'Le serveur CI installe les dependances du projet.' },
  { id: 'test', label: 'npm test', desc: 'Les tests verifient le code. Si un echoue, le pipeline bloque.' },
  { id: 'build', label: 'npm run build', desc: 'Le code est compile et optimise pour la production.' },
  { id: 'docker', label: 'docker build', desc: 'L\'app est empaquetee dans un conteneur Docker.' },
  { id: 'push-registry', label: 'docker push', desc: 'L\'image est envoyee vers le registry.' },
  { id: 'deploy', label: 'deploy', desc: 'Mise en production sans coupure (rolling update).' },
]

// ============================================
// Pipeline Stage Visual
// ============================================
function PipelineStage({ label, status, desc, showDesc }) {
  const colors = {
    idle: 'border-white/[0.06] bg-[#1e1e2e]',
    running: 'border-amber-500/40 bg-amber-500/10',
    success: 'border-emerald-500/30 bg-emerald-500/[0.07]',
  }
  const textColors = {
    idle: 'text-white/25',
    running: 'text-amber-400',
    success: 'text-emerald-400',
  }
  const icons = { idle: '○', running: '◌', success: '✓' }

  return (
    <div className={`rounded-lg border px-3 py-2.5 transition-all duration-500 ${colors[status]}`}>
      <div className="flex items-center gap-2.5">
        <span className={`text-sm font-mono w-4 text-center ${textColors[status]}`}>{icons[status]}</span>
        <span className={`text-xs font-mono flex-1 ${textColors[status]}`}>{label}</span>
        {status === 'running' && (
          <div className="w-3 h-3 border-[1.5px] border-amber-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>
      {showDesc && desc && (
        <p className="text-[10px] leading-relaxed text-white/30 mt-2 ml-7 font-body">{desc}</p>
      )}
    </div>
  )
}

function PipelineConnector({ active }) {
  return (
    <div className="flex justify-center">
      <div className={`w-px h-2 transition-colors duration-500 ${active ? 'bg-emerald-500/30' : 'bg-white/[0.04]'}`} />
    </div>
  )
}

// ============================================
// Main
// ============================================
export default function InteractiveTerminal({ onDeploySuccess }) {
  const setVersion = useStore(s => s.setVersion)
  const triggerDeploy = useStore(s => s.triggerDeploy)

  const [lines, setLines] = useState([
    { type: 'dim', text: 'TaskFlow CI/CD — Terminal' },
    { type: 'dim', text: '' },
    { type: 'dim', text: 'Commandes :  git push  >  npm install  >  npm test' },
    { type: 'dim', text: '             npm run build  >  docker build' },
    { type: 'dim', text: '             docker push  >  deploy' },
    { type: 'dim', text: '' },
  ])
  const [input, setInput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [stages, setStages] = useState({})
  const [lastStage, setLastStage] = useState(null)
  const [history, setHistory] = useState([])
  const [historyIdx, setHistoryIdx] = useState(-1)

  const terminalRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const init = {}
    PIPELINE_STAGES.forEach(s => { init[s.id] = 'idle' })
    setStages(init)
  }, [])

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    })
  }, [])

  useEffect(scrollToBottom, [lines, scrollToBottom])

  const focusInput = useCallback(() => {
    setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true })
    }, 0)
  }, [])

  const executeCommand = async (raw) => {
    if (isRunning) return
    const cmd = raw.trim().toLowerCase()

    if (cmd) {
      setHistory(prev => [...prev, raw.trim()])
      setHistoryIdx(-1)
    }

    setLines(prev => [...prev, { type: 'command', text: `$ ${raw.trim()}` }])

    if (!cmd) { focusInput(); return }

    if (cmd === 'clear') {
      setLines([])
      focusInput()
      return
    }

    const command = COMMANDS[cmd]
    if (!command) {
      setLines(prev => [...prev,
        { type: 'error', text: `commande introuvable: ${cmd}` },
        { type: 'dim', text: '' },
      ])
      focusInput()
      return
    }

    setIsRunning(true)
    setStages(prev => ({ ...prev, [command.stage]: 'running' }))
    setLastStage(command.stage)

    // Version bump on git push
    if (command.stage === 'push') {
      setVersion('v1.1.0')
    }

    await sleep(200)

    for (const line of command.lines) {
      setLines(prev => [...prev, line])
      if (line.type === 'test-pass') await sleep(60)
      else if (line.type === 'suite') await sleep(150)
      else if (line.type === 'command') await sleep(250)
      else if (line.type === 'deploy') await sleep(180)
      else await sleep(line.text === '' ? 40 : 90)
    }

    setStages(prev => ({ ...prev, [command.stage]: 'success' }))

    // Deploy triggers dark mode + production state
    if (command.stage === 'deploy') {
      triggerDeploy()
    }

    setIsRunning(false)
    focusInput()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isRunning) {
      executeCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length > 0) {
        const idx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1)
        setHistoryIdx(idx)
        setInput(history[idx])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIdx !== -1) {
        const idx = historyIdx + 1
        if (idx >= history.length) { setHistoryIdx(-1); setInput('') }
        else { setHistoryIdx(idx); setInput(history[idx]) }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const cmds = Object.keys(COMMANDS)
      const match = cmds.find(c => c.startsWith(input.toLowerCase()))
      if (match) setInput(match)
    }
  }

  const getLineClass = (type) => {
    switch (type) {
      case 'command': return 'text-white font-semibold'
      case 'header': return 'text-indigo-400 font-semibold'
      case 'info': return 'text-cyan-400 font-semibold'
      case 'success': return 'text-emerald-400'
      case 'success-bold': return 'text-emerald-400 font-semibold'
      case 'error': return 'text-red-400'
      case 'suite': return 'text-indigo-300'
      case 'test-pass': return 'text-emerald-400/80'
      case 'deploy': return 'text-emerald-300 font-semibold'
      default: return 'text-white/40'
    }
  }

  const doneCount = Object.values(stages).filter(s => s === 'success').length
  const allDone = doneCount === PIPELINE_STAGES.length

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-[1fr,280px] gap-4">

        {/* ===== LEFT: Terminal ===== */}
        <div className={`rounded-2xl overflow-hidden border transition-all duration-700 ${
          allDone ? 'border-emerald-500/30' : 'border-white/[0.08]'
        }`} style={allDone ? { boxShadow: '0 0 60px rgba(16,185,129,0.06)' } : {}}>

          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1e1e2e] border-b border-white/[0.08]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-[11px] text-white/25 font-mono">taskflow — zsh</span>
            </div>
            {allDone && <span className="text-[11px] text-emerald-400 font-mono">DEPLOYED</span>}
          </div>

          {/* Terminal body */}
          <div
            ref={terminalRef}
            className="bg-[#1a1a2e] p-4 font-mono text-[12px] leading-[1.9] h-[480px] overflow-y-auto cursor-text"
            onClick={focusInput}
          >
            {lines.map((line, i) => (
              <div key={i} className={getLineClass(line.type)}>
                <span>{line.text}</span>
              </div>
            ))}

            {/* Input line — always visible */}
            <div className="flex items-center mt-0.5">
              <span className="text-emerald-400 select-none">taskflow</span>
              <span className="text-indigo-400 select-none ml-1">~</span>
              <span className="text-white/25 select-none ml-1">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isRunning}
                className="flex-1 ml-2 bg-transparent text-white/90 outline-none font-mono text-[12px] caret-emerald-400 disabled:opacity-30"
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-[2px] bg-white/[0.06]">
            <div
              className="h-full bg-emerald-500 transition-all duration-700 ease-out"
              style={{ width: `${(doneCount / PIPELINE_STAGES.length) * 100}%` }}
            />
          </div>
        </div>

        {/* ===== RIGHT: Pipeline ===== */}
        <div className="bg-[#1a1a2e] rounded-2xl border border-white/[0.08] p-4">
          <p className="text-[10px] font-mono text-white/25 tracking-wider uppercase mb-3">Pipeline CI/CD</p>

          <div className="space-y-0">
            {PIPELINE_STAGES.map((stage, i) => (
              <div key={stage.id}>
                <PipelineStage
                  label={stage.label}
                  status={stages[stage.id] || 'idle'}
                  desc={stage.desc}
                  showDesc={stages[stage.id] === 'running' || lastStage === stage.id}
                />
                {i < PIPELINE_STAGES.length - 1 && (
                  <PipelineConnector active={stages[stage.id] === 'success'} />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06]">
            <p className="text-[10px] text-white/20 font-mono">
              {doneCount}/{PIPELINE_STAGES.length} etapes
            </p>
            {allDone && (
              <p className="text-[10px] text-emerald-400/50 font-body mt-1">
                Pipeline termine. App en production.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
