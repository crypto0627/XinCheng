import type { NextConfig } from 'next'
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp']
  },
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      'embla-carousel-react',
      'swiper'
    ]
  }
}

export default withBundleAnalyzer(nextConfig)
