import type { Metadata } from 'next'
import ContactContent from './ContactContent'

export const revalidate = 10

export const metadata: Metadata = {
  title: 'Contact Us - Zamto Africa',
  description: 'Contact Zamto Africa for vehicle sales, leasing, and rental services. Located in Lusaka, Zambia.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <ContactContent />
    </main>
  )
}