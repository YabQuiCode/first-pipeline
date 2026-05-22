import { useState, useEffect } from 'react'
import useStore from '../../store/useStore'

const navLinks = [
  { id: 'constat', label: 'Constat' },
  { id: 'problemes', label: 'Problèmes' },
  { id: 'cout', label: 'Coût' },
  { id: 'ci', label: 'CI' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'tests', label: 'Tests' },
  { id: 'pipeline-detail', label: 'Détails' },
  { id: 'benefices', label: 'Bénéfices' },
  { id: 'kpi', label: 'KPI' },
  { id: 'annexes', label: 'Annexes' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const darkMode = useStore((s) => s.darkMode)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      const sections = navLinks.map(link => ({
        id: link.id,
        el: document.getElementById(link.id),
      })).filter(s => s.el)
      const scrollPos = window.scrollY + window.innerHeight / 3
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].el.offsetTop <= scrollPos) {
          setActiveSection(sections[i].id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? darkMode
            ? 'bg-[#0c0c14]/80 backdrop-blur-xl border-b border-white/[0.06] py-3'
            : 'bg-white/70 backdrop-blur-xl border-b border-base-200 py-3 shadow-sm'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`font-display font-semibold text-xl tracking-tight transition-colors duration-700 hover:text-accent-indigo ${
            darkMode ? 'text-white' : 'text-base-900'
          }`}
        >
          TaskFlow
        </button>
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`px-3 py-1.5 text-sm font-body rounded-full transition-all duration-300 ${
                activeSection === link.id
                  ? 'bg-accent-indigo/10 text-accent-indigo font-medium'
                  : darkMode
                    ? 'text-white/40 hover:text-white/70'
                    : 'text-base-500 hover:text-base-700'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
