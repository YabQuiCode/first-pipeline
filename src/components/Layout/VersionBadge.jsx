import { useEffect, useState, useRef } from 'react'
import useStore from '../../store/useStore'

export default function VersionBadge() {
  const { version, isDeployed, darkMode } = useStore()
  const [animate, setAnimate] = useState(false)
  const [prevVersion, setPrevVersion] = useState(version)
  const [showFlip, setShowFlip] = useState(false)
  const prevRef = useRef(version)

  useEffect(() => {
    if (version !== prevRef.current) {
      setPrevVersion(prevRef.current)
      setShowFlip(true)
      setAnimate(true)

      const t1 = setTimeout(() => setShowFlip(false), 800)
      const t2 = setTimeout(() => setAnimate(false), 2000)
      prevRef.current = version
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
  }, [version])

  return (
    <div className={`fixed top-5 right-5 z-[60] flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-700 ${
      isDeployed
        ? 'bg-accent-green/10 border-accent-green/25'
        : darkMode
          ? 'bg-white/[0.04] border-white/[0.08]'
          : 'bg-white/60 border-base-200 backdrop-blur-sm'
    } ${animate ? 'scale-110' : 'scale-100'}`}>
      <span className={`w-2 h-2 rounded-full ${isDeployed ? 'bg-accent-green animate-pulse' : darkMode ? 'bg-white/20' : 'bg-base-300'}`} />
      <span className={`text-xs font-mono font-medium transition-colors duration-500 relative overflow-hidden ${
        isDeployed ? 'text-accent-green' : darkMode ? 'text-white/40' : 'text-base-400'
      }`}>
        {showFlip ? (
          <span className="inline-flex flex-col items-center">
            <span className="animate-version-out absolute">{prevVersion}</span>
            <span className="animate-version-in">{version}</span>
          </span>
        ) : (
          version
        )}
      </span>
    </div>
  )
}
