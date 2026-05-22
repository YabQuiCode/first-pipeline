import { useScrollProgress } from '../../hooks/useScrollProgress'

export default function ProgressBar() {
  const progress = useScrollProgress()

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-accent-indigo via-accent-purple to-accent-cyan transition-none"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}
