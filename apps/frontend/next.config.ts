import type { NextConfig } from "next";

// Import bundle analyzer
const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? require('@next/bundle-analyzer')({ enabled: true })
  : (config: NextConfig) => config;

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // Reduce unnecessary JavaScript
  productionBrowserSourceMaps: false,
  // Bundle optimization  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimize gzip compression
  compress: true,
  // Configure package optimizations
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      'embla-carousel-react',
      'swiper',
    ],
  },
  // 提高 HTTP/2 效率
  poweredByHeader: false,
};

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})

// Apply all optimizations
export default withBundleAnalyzer(withPWA(nextConfig));