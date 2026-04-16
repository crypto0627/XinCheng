import type { Metadata } from 'next'
import { AboutIntro } from '@/components/about/about-intro'
import { AboutFeatures } from '@/components/about/about-features'
import { AboutCommitment } from '@/components/about/about-commitment'

export const metadata: Metadata = {
  title: '關於我們 | 星橙輕食餐盒',
  description: '認識星橙，健康美味、用心服務的輕食餐盒'
}

export default function AboutPage() {
  return (
    <section className="pt-24 bg-[#FFF8E7]">
      <div className="container mx-auto px-4">
        <AboutIntro />
        <AboutFeatures />
        <AboutCommitment />
      </div>
    </section>
  )
}
