import { useState, useRef } from 'react'

const TYPING_SPEED = 30
const LINE_PAUSE = 350

const failLines = [
  { type: 'input', text: 'git add .' },
  { type: 'input', text: 'git commit -m "fix: update auth module"' },
  { type: 'input', text: 'git push origin main' },
  { type: 'output', text: 'Enumerating objects: 7, done.' },
  { type: 'output', text: 'Counting objects: 100% (7/7), done.' },
  { type: 'output', text: 'remote: Resolving deltas: 100% (3/3)' },
  { type: 'output', text: '' },
  { type: 'header', text: '══════ Pipeline CI triggered ══════' },
  { type: 'success', text: '✓  Checkout .................. OK' },
  { type: 'success', text: '✓  npm install ............... OK (12.3s)' },
  { type: 'running', text: '⠋  npm test .................. Running' },
  { type: 'output', text: '' },
  { type: 'error', text: '  FAIL  src/tests/auth.test.js' },
  { type: 'error', text: '    ✕ validate token expiration (24ms)' },
  { type: 'error', text: '    ✕ reject malformed JWT (8ms)' },
  { type: 'output', text: '' },
  { type: 'error', text: '  Tests: 2 failed, 40 passed' },
  { type: 'error', text: '  Time:  4.821s' },
  { type: 'output', text: '' },
  { type: 'error-bold', text: '✗  npm test .................. FAILED' },
  { type: 'error-bold', text: '⛔ Pipeline aborted.' },
  { type: 'error', text: '   → Fix tests before merging.' },
]

const successLines = [
  { type: 'input', text: 'git add .' },
  { type: 'input', text: 'git commit -m "fix: resolve auth validation"' },
  { type: 'input', text: 'git push origin main' },
  { type: 'output', text: 'Enumerating objects: 9, done.' },
  { type: 'output', text: 'Counting objects: 100% (9/9), done.' },
  { type: 'output', text: 'remote: Resolving deltas: 100% (5/5)' },
  { type: 'output', text: '' },
  { type: 'header', text: '══════ Pipeline CI triggered ══════' },
  { type: 'success', text: '✓  Checkout .................. OK' },
  { type: 'success', text: '✓  npm install ............... OK (11.7s)' },
  { type: 'success', text: '✓  npm test .................. PASSED (42/42)' },
  { type: 'success', text: '✓  Docker build .............. OK (28.4s)' },
  { type: 'output', text: '   → taskflow:1.1.0-a3f8c2d' },
  { type: 'success', text: '✓  Push registry ............. OK' },
  { type: 'output', text: '' },
  { type: 'header', text: '══════ Deployment CD ══════' },
  { type: 'success', text: '✓  Pull image ................ OK' },
  { type: 'success', text: '✓  Health check .............. 200 OK' },
  { type: 'success', text: '✓  Rolling update ............ OK (0 downtime)' },
  { type: 'output', text: '' },
  { type: 'deploy', text: '● TaskFlow v1.1.0 deployed to production' },
  { type: 'deploy', text: '  Commit: a3f8c2d' },
  { type: 'deploy', text: '  Time:   53.2s' },
  { type: 'deploy', text: '  Status: LIVE' },
]

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

const getLineColor = (type) => {
  switch (type) {
    case 'input': return 'text-white/85'
    case 'success': return 'text-emerald-400'
    case 'error': return 'text-red-400'
    case 'error-bold': return 'text-red-400 font-semibold'
    case 'header': return 'text-indigo-400 font-semibold'
    case 'running': return 'text-amber-400'
    case 'deploy': return 'text-emerald-300'
    default: return 'text-white/30'
  }
}

function SingleTerminal({ title, lines, variant = 'fail', onComplete }) {
  const [displayedLines, setDisplayedLines] = useState([])
  const [currentLineText, setCurrentLineText] = useState('')
  const [phase, setPhase] = useState('idle')
  const terminalRef = useRef(null)

  const run = async () => {
    if (phase !== 'idle') return
    setPhase('typing')
    setDisplayedLines([])

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.type === 'input') {
        for (let c = 0; c <= line.text.length; c++) {
          setCurrentLineText(line.text.slice(0, c))
          await sleep(TYPING_SPEED)
        }
        setDisplayedLines(prev => [...prev, line])
        setCurrentLineText('')
        await sleep(LINE_PAUSE)
      } else {
        setDisplayedLines(prev => [...prev, line])
        await sleep(line.text === '' ? 80 : 60)
      }
      if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
    setPhase('done')
    if (onComplete) onComplete()
  }

  const borderColor = phase === 'done'
    ? variant === 'fail' ? 'border-red-400/30' : 'border-emerald-400/30'
    : 'border-base-200'

  const glowStyle = phase === 'done'
    ? variant === 'fail'
      ? { boxShadow: '0 8px 40px rgba(239,68,68,0.08)' }
      : { boxShadow: '0 8px 40px rgba(16,185,129,0.08)' }
    : { boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }

  const Prompt = () => (
    <>
      <span className="text-emerald-400">taskflow</span>
      <span className="text-indigo-400"> ~/projects/taskflow</span>
      <span className="text-white/25"> $</span>
    </>
  )

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-mono tracking-wider uppercase ${
          variant === 'fail' ? 'text-accent-red/60' : 'text-accent-green/60'
        }`}>{title}</span>
        {phase === 'done' && (
          <span className={`text-xs font-mono ${variant === 'fail' ? 'text-accent-red' : 'text-accent-green'}`}>
            {variant === 'fail' ? '● FAILED' : '● SUCCESS'}
          </span>
        )}
      </div>

      <div className={`rounded-2xl overflow-hidden border transition-all duration-700 ${borderColor}`} style={glowStyle}>
        {/* macOS title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1e1e2e] border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[11px] text-white/25 font-mono">taskflow — zsh</span>
          </div>
        </div>

        {/* Terminal body */}
        <div ref={terminalRef} className="bg-[#1a1a2e] p-4 font-mono text-[13px] leading-[1.7] h-[360px] overflow-y-auto">
          {phase === 'idle' && (
            <div className="text-white/20">
              <p className="text-[11px]">Last login: {new Date().toLocaleDateString('fr-FR')} on ttys001</p>
              <p className="mt-3">
                <Prompt />
                <span className="inline-block w-1.5 h-3.5 bg-white/50 ml-1.5 animate-pulse" />
              </p>
            </div>
          )}

          {displayedLines.map((line, i) => (
            <div key={i} className={getLineColor(line.type)}>
              {line.type === 'input' ? (
                <p><Prompt /><span className="text-white/80 ml-2">{line.text}</span></p>
              ) : (
                <p className={line.text === '' ? 'h-2' : ''}>{line.text}</p>
              )}
            </div>
          ))}

          {phase === 'typing' && (
            <p>
              <Prompt />
              <span className="text-white/80 ml-2">{currentLineText}</span>
              <span className="inline-block w-1.5 h-3.5 bg-white/50 ml-0.5 animate-pulse" />
            </p>
          )}

          {phase === 'done' && (
            <p className="mt-1">
              <Prompt />
              <span className="inline-block w-1.5 h-3.5 bg-white/50 ml-2 animate-pulse" />
            </p>
          )}
        </div>
      </div>

      {phase === 'idle' && (
        <div className="mt-4 text-center">
          <button onClick={run} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium font-body transition-all duration-300 cursor-pointer shadow-sm ${
            variant === 'fail'
              ? 'bg-white border border-red-200 text-accent-red hover:bg-red-50 hover:border-red-300'
              : 'bg-white border border-emerald-200 text-accent-green hover:bg-emerald-50 hover:border-emerald-300'
          }`}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Lancer
          </button>
        </div>
      )}
    </div>
  )
}

export default function TerminalDual({ onDeploySuccess }) {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        <SingleTerminal title="Scénario 1 — Push échoué" lines={failLines} variant="fail" />
        <SingleTerminal title="Scénario 2 — Push réussi" lines={successLines} variant="success" onComplete={onDeploySuccess} />
      </div>
    </div>
  )
}
