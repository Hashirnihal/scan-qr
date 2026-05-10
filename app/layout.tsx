import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'Scan QR - Product Information',
  description: 'Scan QR codes to access detailed product information instantly',
  openGraph: {
    title: 'Scan QR - Product Information',
    description: 'Scan QR codes to access detailed product information instantly',
    type: 'website',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
