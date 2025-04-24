import Footer from '@/components/common/footer'
import { Navbar } from '@/components/common/navbar'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import type React from 'react'
import './globals.css'
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'

// 優化字體載入
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Optimize font loading
  preload: true,
  fallback: ['system-ui', 'sans-serif'], // 字體後備方案
  adjustFontFallback: true,
  weight: ['400', '500', '600', '700'], // 只載入需要的字重，減少檔案大小
})

// 分離視口設定以提高性能
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  title: '星橙輕食餐盒',
  description: '享受美味的餐盒,開啟美好的一天',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ],
  },
  openGraph: {
    title: '星橙輕食餐盒',
    description: '享受美味的餐盒,開啟美好的一天',
    type: 'website',
    locale: 'zh_TW',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '星橙輕食餐盒',
  },
  formatDetection: {
    telephone: true,
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no',
  },
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <head>
        {/* Preconnect to essential domains - HTTP/2 優化 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* 預加載關鍵資源 */}
        <link rel="preload" as="image" href="/image.webp" />

        {/* 指示瀏覽器開始建立與所需資源的連接 */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <GoogleAnalytics gaId='G-FEKDYZSNEC' />
        
        {/* 延遲加載非關鍵JS */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FEKDYZSNEC"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
