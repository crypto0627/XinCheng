import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Navbar } from '@/components/common/navbar'
import Footer from '@/components/common/footer'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: true,
  weight: ['400', '500', '600', '700']
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff'
}

export const metadata: Metadata = {
  title: '星橙輕食餐盒',
  description: '享受美味的餐盒,開啟美好的一天',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.webp',
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }]
  },
  openGraph: {
    title: '星橙輕食餐盒',
    description: '享受美味的餐盒,開啟美好的一天',
    type: 'website',
    locale: 'zh_TW'
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '星橙輕食餐盒'
  },
  formatDetection: {
    telephone: true
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className={`${inter.className} bg-background text-foreground`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <GoogleAnalytics gaId="G-FEKDYZSNEC" />
      </body>
    </html>
  )
}
