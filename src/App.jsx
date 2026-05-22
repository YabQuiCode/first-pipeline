import { useEffect } from 'react'
import Navbar from './components/Layout/Navbar'
import ProgressBar from './components/Layout/ProgressBar'
import VersionBadge from './components/Layout/VersionBadge'
import CursorTrail from './components/UI/CursorTrail'
import HeroSection from './sections/HeroSection'
import ConstatSection from './sections/ConstatSection'
import ProblemesSection from './sections/ProblemesSection'
import CoutSection from './sections/CoutSection'
import CISection from './sections/CISection'
import PipelineSection from './sections/PipelineSection'
import TestsSection from './sections/TestsSection'
import PipelineDetailSection from './sections/PipelineDetailSection'
import BeneficesSection from './sections/BeneficesSection'
import KPISection from './sections/KPISection'
import AnnexesSection from './sections/AnnexesSection'
import ConclusionSection from './sections/ConclusionSection'
import useStore from './store/useStore'

export default function App() {
  const darkMode = useStore((s) => s.darkMode)

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])

  return (
    <>
      <CursorTrail />
      <ProgressBar />
      <Navbar />
      <VersionBadge />

      <main>
        <HeroSection />
        <ConstatSection />
        <ProblemesSection />
        <CoutSection />
        <CISection />
        <PipelineSection />
        <TestsSection />
        <PipelineDetailSection />
        <BeneficesSection />
        <KPISection />
        <AnnexesSection />
        <ConclusionSection />
      </main>
    </>
  )
}
