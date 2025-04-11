import { AboutCommitment } from '@/components/about/about-commitment'
import { AboutFeatures } from '@/components/about/about-features'
import { AboutIntro } from '@/components/about/about-intro'

export default function AboutPage() {
  return (
    <main className="pt-24 bg-[#FFF8E7]">
      <div className="container mx-auto px-4">
        <AboutIntro />
        <AboutFeatures />
        <AboutCommitment />
      </div>
    </main>
  )
}
