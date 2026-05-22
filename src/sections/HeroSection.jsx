import { ShuffleText, BlurText, FadeUpText, SlideRevealText } from '../components/TextAnimations'
import ScrollIndicator from '../components/UI/ScrollIndicator'
import { BlobDecoration, GradientOrb, GridPattern, FloatingRing, CrossDecoration, DotsPattern } from '../components/Decorations'
import { useEffect, useRef, useState } from 'react'

export default function HeroSection() {
  const sectionRef = useRef(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      if (rect.bottom > 0) setScrollY(-rect.top)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const progress = Math.min(Math.max(scrollY / (window.innerHeight || 1), 0), 1)
  // Fade starts after 20% scroll, finishes at 90%
  const fadeProgress = Math.max((progress - 0.2) / 0.7, 0)
  const scale = 1 + fadeProgress * 0.12
  const opacity = 1 - fadeProgress
  const yOffset = fadeProgress * -50
  const blur = fadeProgress * 4

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-[150vh] overflow-hidden bg-gradient-to-b from-white via-surface-secondary to-surface-tertiary">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <GridPattern />
        <BlobDecoration className="top-20 -left-40" color1="#fed7aa" color2="#ffedd5" size={500} />
        <BlobDecoration className="bottom-20 -right-32 animation-delay-2000" color1="#e0e7ff" color2="#c7d2fe" size={400} />
        <GradientOrb className="-top-20 right-1/4" color="#818cf8" size={350} blur={100} />

        <div style={{ transform: `translateY(${progress * -30}px)` }}>
          <FloatingRing className="top-32 right-20" size={140} color="#f97316" id="hero1" />
        </div>
        <div style={{ transform: `translateY(${progress * -50}px)` }}>
          <FloatingRing className="bottom-40 left-16 animation-delay-2000" size={100} color="#8b5cf6" id="hero2" />
        </div>
        <div style={{ transform: `translateY(${progress * -20}px)` }}>
          <DotsPattern className="top-1/4 left-10" rows={6} cols={6} />
        </div>
        <div style={{ transform: `translateY(${progress * -40}px)` }}>
          <DotsPattern className="bottom-1/4 right-10" rows={4} cols={4} />
        </div>

        <CrossDecoration className="top-40 right-1/3" size={16} color="#f97316" />
        <CrossDecoration className="bottom-1/3 left-1/4" size={12} color="#8b5cf6" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6"
          style={{
            transform: `scale(${scale}) translateY(${yOffset}px)`,
            opacity: Math.max(opacity, 0),
            filter: `blur(${blur}px)`,
            willChange: 'transform, opacity, filter',
          }}>
          <FadeUpText delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-base-200 backdrop-blur-sm mb-8 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
              <span className="text-xs font-mono text-base-500 tracking-wide">Présentation Direction Technique</span>
            </div>
          </FadeUpText>

          <SlideRevealText text="TaskFlow" tag="h1"
            className="text-7xl md:text-9xl font-display font-semibold text-base-900 tracking-tight mb-6" delay={300} />

          <SlideRevealText text="Vers l'Intégration Continue" tag="h2"
            className="text-2xl md:text-4xl font-display font-light text-base-400 mb-10" delay={600} />

          <FadeUpText delay={1000}>
            <p className="text-base md:text-lg text-base-400 max-w-2xl mx-auto leading-relaxed mb-20 font-body">
              Comment automatiser notre chaîne de production logicielle pour éliminer les erreurs,
              accélérer les livraisons et garantir la stabilité de notre plateforme.
            </p>
          </FadeUpText>

          <FadeUpText delay={1400}>
            <ScrollIndicator />
          </FadeUpText>
        </div>
      </div>
    </section>
  )
}
