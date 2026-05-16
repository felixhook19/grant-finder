import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Grant Finder — Funding found.',
  description: 'AI-powered grant discovery for UK founders and growing businesses. Find, match and win grants you actually qualify for.',
  openGraph: {
    title: 'Grant Finder — Funding found.',
    description: 'AI-powered grant discovery for UK founders and growing businesses.',
    url: 'https://grant-finder.co.uk',
    siteName: 'Grant Finder',
    locale: 'en_GB',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-midnight text-chalk antialiased">
        {children}
      </body>
    </html>
  )
}
