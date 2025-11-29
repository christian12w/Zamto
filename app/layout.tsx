import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import { AuthProvider } from '../src/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Zamto Africa – Japanese Imported Vehicles for Sale & Hire in Lusaka',
  description: 'Zamto Africa Company Limited - Specializing in Sales, Leasing & Rental of Japanese Imported Vehicles. Located at Handyman\'s Great East Road, Lusaka, Zambia.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navigation />
          <main className="pt-24">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
