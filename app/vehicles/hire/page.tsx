import { getVehiclesByType } from '@/lib/vehicles'
import type { Metadata } from 'next'
import VehicleCard from '@/app/components/VehicleCard'

export const revalidate = 10

export const metadata: Metadata = {
  title: 'Vehicles for Hire - Zamto Africa',
  description: 'Browse our collection of Japanese imported vehicles available for hire.',
}

export default async function VehiclesForHirePage() {
  const vehicles = await getVehiclesByType('hire')

  return (
    <main className="min-h-screen bg-zamtoLight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-zamtoNavy mb-4 tracking-tight">
            Vehicles for Hire
          </h1>
          <p className="text-gray-700 text-lg">
            Browse our collection of Japanese imported vehicles available for rental
          </p>
        </div>
        
        {vehicles.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-600 text-xl">No vehicles for hire at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle, idx) => (
              <div key={vehicle.slug} className="animate-fadeInUp" style={{ animationDelay: `${idx * 0.05}s` }}>
                <VehicleCard key={vehicle.slug} vehicle={vehicle} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
