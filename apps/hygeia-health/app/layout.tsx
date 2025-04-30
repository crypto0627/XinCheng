import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hygeia Health",
  description: "Get personalized diet and workout plans tailored to your goals",
  authors: { url: "https://github.com/crypto0627", name : "Jakekuo" }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900`}>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
