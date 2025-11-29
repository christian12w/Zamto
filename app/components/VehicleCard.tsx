import Link from 'next/link'
import Image from 'next/image'
import type { Vehicle } from '@/lib/vehicles'
import { Car, Fuel, Settings, Users, Calendar, Hash } from 'lucide-react'

interface VehicleCardProps {
  vehicle: Vehicle
}

const determineAvailability = (vehicle: Vehicle) => {
  // Use the status field directly if available, otherwise derive from other fields
  if (vehicle.status === 'sold') {
    return { label: 'Sold', tone: 'bg-red-600' }
  }
  
  if (vehicle.status === 'available') {
    if (vehicle.type === 'hire') {
      return { label: 'Available for Hire', tone: 'bg-zamtoGreen' }
    }
    return { label: 'Available', tone: 'bg-zamtoGreen' }
  }

  // Fallback to original logic if status is not set
  const lowerRegistration = vehicle.registrationStatus?.toLowerCase() || ''
  const lowerCondition = vehicle.condition?.toLowerCase() || ''

  if (lowerRegistration.includes('sold') || lowerCondition.includes('sold')) {
    return { label: 'Sold', tone: 'bg-red-600' }
  }

  if (lowerCondition.includes('reserved') || lowerRegistration.includes('reserved')) {
    return { label: 'Reserved', tone: 'bg-zamtoOrange' }
  }

  if (vehicle.type === 'hire') {
    return { label: 'Available for Hire', tone: 'bg-zamtoGreen' }
  }

  return { label: 'Available', tone: 'bg-zamtoGreen' }
}

const formatSeats = (value?: number | null) => {
  if (!value) return undefined
  return `${value} ${value > 1 ? 'Seats' : 'Seat'}`
}

const formatDoors = (value?: number | null) => {
  if (!value) return undefined
  return `${value} ${value > 1 ? 'Doors' : 'Door'}`
}

// Icon mapping for spec items
const getSpecIcon = (label: string) => {
  switch (label.toLowerCase()) {
    case 'mileage':
      return <Hash className="w-4 h-4" />
    case 'fuel':
      return <Fuel className="w-4 h-4" />
    case 'transmission':
      return <Settings className="w-4 h-4" />
    case 'seats':
      return <Users className="w-4 h-4" />
    case 'doors':
      return <Car className="w-4 h-4" />
    case 'year':
      return <Calendar className="w-4 h-4" />
    default:
      return <Car className="w-4 h-4" />
  }
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const availability = determineAvailability(vehicle)
  const whatsappNumber = vehicle.whatsappContact?.replace(/[^\d]/g, '')
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Hi Zamto Africa, I'm interested in the ${vehicle.name}.`
      )}`
    : null

  const heroImage = vehicle.image || vehicle.images?.[0]?.url

  const specItems = [
    { label: 'Mileage', value: vehicle.mileage },
    { label: 'Fuel', value: vehicle.fuelType },
    { label: 'Transmission', value: vehicle.transmission },
    { label: 'Seats', value: formatSeats(vehicle.seats) },
    { label: 'Doors', value: formatDoors(vehicle.doors) },
  ].filter((item) => Boolean(item.value))

  const detailItems = [
    { label: 'Engine', value: vehicle.engineSize },
    { label: 'Condition', value: vehicle.condition },
    { label: 'Registration', value: vehicle.registrationStatus },
    { label: 'Insurance', value: vehicle.insuranceStatus },
  ].filter((item) => Boolean(item.value))

  return (
    <article className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 hover:-translate-y-1 flex flex-col h-full">
      {/* Image Section - Reduced height */}
      <div className="relative aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden" style={{ aspectRatio: '16/9' }}>
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {vehicle.category && (
            <span className="bg-zamtoNavy text-white text-[9px] font-bold px-2 py-1 rounded-full uppercase shadow-sm backdrop-blur-sm">
              {vehicle.category}
            </span>
          )}
          <span className={`${availability.tone} text-white text-[9px] font-semibold px-2 py-1 rounded-full shadow-sm`}>
            {availability.label}
          </span>
        </div>

        {/* Logo Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 px-1.5 py-0.5 rounded-full shadow-sm">
          <Image src="/logo.png" alt="Zamto Africa" width={20} height={20} className="rounded-full object-contain" />
        </div>

        {/* Popular Badge */}
        {vehicle.popular && (
          <div className="absolute bottom-2 left-2 z-10">
            <span className="bg-gradient-to-r from-zamtoOrange to-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              Popular
            </span>
          </div>
        )}

        {/* Image or Placeholder */}
        {heroImage ? (
          <>
            <img
              src={heroImage}
              alt={vehicle.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content Section - More compact */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        {/* Title and Type */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/vehicles/${vehicle.slug}`}>
              <h3 className="text-base font-bold text-zamtoNavy mb-0.5 tracking-tight group-hover:text-zamtoGreen transition-colors break-words leading-tight line-clamp-2">
                {vehicle.name}
              </h3>
            </Link>
            <p className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase truncate">
              {vehicle.type === 'hire' ? 'Hire Fleet' : 'For Sale'}
            </p>
          </div>
          {vehicle.year && (
            <div className="text-right min-w-max">
              <p className="text-[9px] uppercase tracking-wider text-gray-400">Year</p>
              <p className="text-xs font-bold text-zamtoNavy">{vehicle.year}</p>
            </div>
          )}
        </div>

        {/* Specs Grid - Compact */}
        {specItems.length > 0 && (
          <div className="grid grid-cols-2 gap-1.5">
            {specItems.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 p-2 bg-zamtoLight/50 rounded-md border border-gray-100">
                <div className="text-zamtoGreen flex-shrink-0">
                  {getSpecIcon(item.label)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] uppercase tracking-wider text-gray-500 truncate">{item.label}</p>
                  <p className="text-[10px] font-semibold text-zamtoNavy truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Details List - Compact */}
        {detailItems.length > 0 && (
          <div className="space-y-1">
            {detailItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-[10px]">
                <span className="text-gray-500 truncate flex-1 min-w-0">{item.label}</span>
                <span className="font-medium text-zamtoNavy truncate max-w-[50%] pl-1">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Price Section - Compact */}
        <div className="pt-1 border-t border-gray-100">
          <p className="text-lg font-bold text-zamtoOrange leading-tight">
            {vehicle.price || vehicle.dailyRate || 'Contact for rate'}
          </p>
          <p className="text-[9px] text-gray-500 mt-0.5">
            {vehicle.type === 'hire' ? 'Includes driver & insurance' : 'Inclusive of documentation'}
          </p>
        </div>

        {/* Action Buttons - Compact */}
        <div className="flex flex-col gap-1.5 mt-auto">
          <Link
            href={`/vehicles/${vehicle.slug}`}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-md text-center text-xs transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-sm"
          >
            View Details
          </Link>
          <a
            href={whatsappUrl || `https://wa.me/260572213038?text=${encodeURIComponent(`Hi Zamto Africa, I'm interested in the ${vehicle.name}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-md text-center text-xs transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-sm flex items-center justify-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}
