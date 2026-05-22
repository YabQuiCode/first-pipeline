export default function ScrollIndicator() {
  return (
    <div className="flex flex-col items-center gap-3 animate-bounce">
      <span className="text-xs font-mono text-base-400 tracking-[0.3em] uppercase">Scroll</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-base-300">
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    </div>
  )
}
