import { useState, useRef } from 'react'

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

const testSuites = [
  {
    file: 'src/test/store.test.js',
    name: 'useStore',
    tests: [
      { name: 'should have correct initial state', duration: 2 },
      { name: 'should update version', duration: 1 },
      { name: 'should update deployed status', duration: 1 },
      { name: 'should update deploy success', duration: 1 },
      { name: 'should trigger deploy correctly', duration: 3 },
    ]
  },
  {
    file: 'src/test/hooks.test.js',
    name: 'useCountUp logic',
    tests: [
      { name: 'should parse numeric string targets', duration: 1 },
      { name: 'should handle NaN targets gracefully', duration: 1 },
      { name: 'should calculate easing correctly at progress boundaries', duration: 2 },
      { name: 'should round count values correctly', duration: 1 },
    ]
  },
  {
    file: 'src/test/App.test.jsx',
    name: 'App',
    tests: [
      { name: 'should render without crashing', duration: 12 },
      { name: 'should contain main element', duration: 4 },
      { name: 'should apply dark-mode class when darkMode is true', duration: 6 },
      { name: 'should not have dark-mode class when darkMode is false', duration: 3 },
    ]
  }
]

export default function TestRunner() {
  const [phase, setPhase] = useState('idle') // idle | running | done
  const [output, setOutput] = useState([])
  const [stats, setStats] = useState(null)
  const terminalRef = useRef(null)

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }

  const addLine = (line) => {
    setOutput(prev => [...prev, line])
    setTimeout(scrollToBottom, 10)
  }

  const runTests = async () => {
    if (phase === 'running') return
    setPhase('running')
    setOutput([])
    setStats(null)

    // Header
    addLine({ type: 'dim', text: '' })
    addLine({ type: 'command', text: '$ npm test' })
    addLine({ type: 'dim', text: '' })
    await sleep(400)

    addLine({ type: 'dim', text: '> taskflow-cicd-presentation@1.0.0 test' })
    addLine({ type: 'dim', text: '> vitest run' })
    addLine({ type: 'dim', text: '' })
    await sleep(600)

    addLine({ type: 'header', text: ' RUN  v2.0.0 /projects/taskflow' })
    addLine({ type: 'dim', text: '' })
    await sleep(300)

    let totalPassed = 0
    let totalDuration = 0

    for (const suite of testSuites) {
      addLine({ type: 'suite-header', text: `  ● ${suite.name}`, file: suite.file })
      await sleep(200)

      for (const test of suite.tests) {
        await sleep(80 + Math.random() * 120)
        totalPassed++
        totalDuration += test.duration
        addLine({
          type: 'test-pass',
          text: `    ✓ ${test.name}`,
          duration: `${test.duration}ms`
        })
      }

      addLine({ type: 'dim', text: '' })
      await sleep(150)
    }

    await sleep(300)

    // Summary
    addLine({ type: 'dim', text: '⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯' })
    addLine({ type: 'dim', text: '' })
    addLine({ type: 'summary-files', text: ` Test Files  ${testSuites.length} passed (${testSuites.length})` })
    addLine({ type: 'summary-tests', text: `      Tests  ${totalPassed} passed (${totalPassed})` })
    addLine({ type: 'dim', text: `   Start at  ${new Date().toLocaleTimeString('fr-FR')}` })
    addLine({ type: 'dim', text: `   Duration  ${(totalDuration / 1000).toFixed(2)}s` })
    addLine({ type: 'dim', text: '' })

    setStats({ files: testSuites.length, tests: totalPassed, duration: totalDuration })
    setPhase('done')
  }

  const getLineClass = (type) => {
    switch (type) {
      case 'command': return 'text-white font-semibold'
      case 'header': return 'text-emerald-400 font-semibold'
      case 'suite-header': return 'text-indigo-400 font-medium'
      case 'test-pass': return 'text-emerald-400'
      case 'test-fail': return 'text-red-400'
      case 'summary-files': return 'text-emerald-400 font-semibold'
      case 'summary-tests': return 'text-emerald-400 font-semibold'
      default: return 'text-white/30'
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6 animate-fade-in">
          <div className="rounded-2xl border border-emerald-200 bg-white/80 backdrop-blur-xl p-4 text-center shadow-sm">
            <p className="text-3xl font-display font-bold text-accent-green">{stats.files}</p>
            <p className="text-xs text-base-400 font-body mt-1">Test Suites</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-white/80 backdrop-blur-xl p-4 text-center shadow-sm">
            <p className="text-3xl font-display font-bold text-accent-green">{stats.tests}</p>
            <p className="text-xs text-base-400 font-body mt-1">Tests Passed</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-white/80 backdrop-blur-xl p-4 text-center shadow-sm">
            <p className="text-3xl font-display font-bold text-accent-green">{stats.duration}ms</p>
            <p className="text-xs text-base-400 font-body mt-1">Duration</p>
          </div>
        </div>
      )}

      {/* Terminal */}
      <div className={`rounded-2xl overflow-hidden border transition-all duration-700 ${
        phase === 'done' ? 'border-emerald-400/30' : 'border-base-200'
      }`} style={phase === 'done' ? { boxShadow: '0 8px 40px rgba(16,185,129,0.08)' } : {}}>
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1e1e2e] border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[11px] text-white/25 font-mono">vitest — tests unitaires</span>
          </div>
          {phase === 'done' && (
            <span className="text-[11px] text-emerald-400 font-mono">ALL PASSED ✓</span>
          )}
        </div>

        {/* Body */}
        <div ref={terminalRef} className="bg-[#1a1a2e] p-4 font-mono text-[12px] leading-[1.8] h-[380px] overflow-y-auto">
          {phase === 'idle' && (
            <div className="text-white/20">
              <p className="text-[11px]">Ready to run tests...</p>
              <p className="mt-3">
                <span className="text-emerald-400">taskflow</span>
                <span className="text-indigo-400"> ~/projects/taskflow</span>
                <span className="text-white/25"> $</span>
                <span className="inline-block w-1.5 h-3.5 bg-white/50 ml-1.5 animate-pulse" />
              </p>
            </div>
          )}

          {output.map((line, i) => (
            <div key={i} className={`${getLineClass(line.type)} flex justify-between`}>
              <span>{line.text}</span>
              {line.duration && <span className="text-white/20 text-[11px]">{line.duration}</span>}
            </div>
          ))}

          {phase === 'running' && (
            <span className="inline-block w-1.5 h-3.5 bg-emerald-400/70 ml-1 animate-pulse" />
          )}
        </div>
      </div>

      {/* Button */}
      {phase !== 'running' && (
        <div className="mt-5 text-center">
          <button
            onClick={runTests}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-medium font-body transition-all duration-300 cursor-pointer shadow-sm bg-white border border-emerald-200 text-accent-green hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-md"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            {phase === 'done' ? 'Relancer les tests' : 'Lancer npm test'}
          </button>
        </div>
      )}
    </div>
  )
}
