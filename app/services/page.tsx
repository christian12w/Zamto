import type { Metadata } from 'next'

export const revalidate = 10

export const metadata: Metadata = {
  title: 'Services - Zamto Africa',
  description: 'Zamto Africa offers vehicle sales, leasing, and rental services for Japanese imported vehicles in Lusaka, Zambia.',
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-zamtoLight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-16">
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-block mb-4">
            <span className="bg-zamtoGreen/10 text-zamtoGreen px-4 py-2 rounded-full text-sm font-semibold">
              What We Offer
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-zamtoNavy mb-4 tracking-tight">
            Our Services
          </h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Comprehensive automotive solutions for all your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Vehicle Sales */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover-lift group">
            <div className="bg-gradient-to-br from-zamtoNavy to-zamtoNavy/80 text-white w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform shadow-xl">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-zamtoNavy mb-4 text-center tracking-tight group-hover:text-zamtoGreen transition-colors">
              Vehicle Sales
            </h3>
            <p className="text-gray-700 text-center leading-relaxed">
              Browse our extensive inventory of quality Japanese imported vehicles. From compact cars to luxury SUVs, we have the perfect vehicle for you.
            </p>
            <div className="mt-8 text-center">
              <a
                href="/vehicles/sale"
                className="inline-block bg-black text-white px-8 py-3 rounded-xl font-bold shadow-lg transform transition-all"
              >
                View Vehicles
              </a>
            </div>
          </div>

          {/* Vehicle Hire */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover-lift group">
            <div className="bg-gradient-to-br from-zamtoGreen to-zamtoGreen/80 text-white w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform shadow-xl">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-zamtoNavy mb-4 text-center tracking-tight group-hover:text-zamtoGreen transition-colors">
              Vehicle Hire
            </h3>
            <p className="text-gray-700 text-center leading-relaxed">
              Need a vehicle for a short period? Our flexible hire options make it easy to get the vehicle you need, when you need it.
            </p>
            <div className="mt-8 text-center">
              <a
                href="/vehicles/hire"
                className="inline-block bg-black text-white px-8 py-3 rounded-xl font-bold shadow-lg transform transition-all"
              >
                View Hire Options
              </a>
            </div>
          </div>

          {/* Leasing */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover-lift group">
            <div className="bg-gradient-to-br from-zamtoOrange to-zamtoOrange/80 text-white w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform shadow-xl">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-zamtoNavy mb-4 text-center tracking-tight group-hover:text-zamtoGreen transition-colors">
              Vehicle Leasing
            </h3>
            <p className="text-gray-700 text-center leading-relaxed">
              Long-term leasing solutions for businesses and individuals. Get the vehicle you need with flexible payment terms.
            </p>
            <div className="mt-8 text-center">
              <a
                href="/contact"
                className="inline-block bg-black text-white px-8 py-3 rounded-xl font-bold shadow-lg transform transition-all"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}