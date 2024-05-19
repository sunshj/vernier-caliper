import { Inter } from 'next/font/google'
import Link from 'next/link'
import type { Metadata } from 'next'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Playground',
  description: 'vernier caliper playground'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="flex justify-center gap-4 text-xl underline">
          <Link className="active:text-blue-300 visited:text-blue-900" href="/">
            Default
          </Link>
          <Link className="active:text-blue-300 visited:text-blue-900" href="/vc">
            VC
          </Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
