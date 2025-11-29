import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getVehicleBySlug, getVehicles } from '@/lib/vehicles'
import { 
  ArrowLeft, 
  Calendar, 
  Car, 
  Fuel, 
  Hash, 
  Heart, 
  Mail, 
  Phone, 
  Settings, 
  Share2, 
  ShieldCheck, 
  Users, 
  Wrench, 
  Tag, 
  MapPin
} from 'lucide-react'

export const revalidate = 10

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const vehicle = await getVehicleBySlug(slug)

  if (!vehicle) {
    return {
      title: 'Vehicle Not Found',
    }
  }

  return {
    title: `${vehicle.name} - Zamto Africa`,
    description: vehicle.description || `View details for ${vehicle.name} at Zamto Africa Company Limited.`,
    openGraph: {
      title: `${vehicle.name} - Zamto Africa`,
      description: vehicle.description || '',
      images: vehicle.image ? [vehicle.image] : [],
    },
  }
}

export default async function VehiclePage({ params }: Props) {
  const { slug } = await params
  const vehicle = await getVehicleBySlug(slug)

  // Add debugging to see if vehicle data is being fetched
  console.log('Vehicle data:', vehicle)

  if (!vehicle) {
    notFound()
  }

  const whatsappNumber = vehicle.whatsappContact?.replace(/[^0-9]/g, '') || '260572213038'
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi Zamto Africa, I'm interested in the ${vehicle.name}.`)}`

  return (
    <main className="min-h-screen bg-zamtoLight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-20 mt-16">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/vehicles" 
            className="inline-flex items-center gap-2 text-zamtoNavy hover:text-zamtoGreen transition-colors font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base font-semibold">Back to Inventory</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="md:flex">
            {/* Image Gallery - Larger and Neater Display */}
            <div className="md:w-1/2">
              {vehicle.image && (
                <div className="relative">
                  <div className="w-full h-96 sm:h-[500px] md:h-[600px] bg-gray-200 overflow-hidden">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="bg-white/80 hover:bg-white backdrop-blur-sm p-2 rounded-full shadow-md transition-all">
                      <Heart className="w-5 h-5 text-zamtoNavy" />
                    </button>
                    <button className="bg-white/80 hover:bg-white backdrop-blur-sm p-2 rounded-full shadow-md transition-all">
                      <Share2 className="w-5 h-5 text-zamtoNavy" />
                    </button>
                  </div>
                </div>
              )}
              
              {vehicle.images && vehicle.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-6 bg-zamtoLight">
                  {vehicle.images.map((img: { label?: string; url: string }, idx: number) => (
                    <div key={`${vehicle.slug}-image-${idx}`} className="relative group cursor-pointer overflow-hidden rounded-xl bg-gray-200 aspect-square">
                      <img
                        src={img.url}
                        alt={img.label || `Image ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Vehicle Details */}
            <div className="md:w-1/2 p-6 sm:p-8 md:p-10">
              <div className="mb-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zamtoNavy tracking-tight mb-2">
                      {vehicle.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2">
                      {vehicle.category && (
                        <span className="inline-block bg-zamtoNavy text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full uppercase">
                          {vehicle.category}
                        </span>
                      )}
                      {vehicle.popular && (
                        <span className="inline-flex items-center gap-1 bg-zamtoOrange text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                          Popular
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="bg-gradient-to-r from-zamtoOrange/10 to-zamtoOrange/5 p-4 rounded-xl border border-zamtoOrange/20">
                      <p className="text-2xl sm:text-3xl font-bold text-zamtoOrange mb-1">
                        {vehicle.price || vehicle.dailyRate || 'Contact for rate'}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {vehicle.price ? 'Sale Price' : vehicle.dailyRate ? 'Daily Rate' : 'Price on Request'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Actions */}
              <div className="mb-8 flex flex-col sm:flex-row gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold p-4 rounded-full text-center transition-all duration-300 ease-in-out transform hover:scale-110 shadow-lg flex items-center justify-center"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
                
                <a
                  href="tel:+260572213038"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-full text-center transition-all duration-300 ease-in-out flex items-center justify-center"
                >
                  <Phone className="w-6 h-6" />
                </a>
              </div>

              {/* Description */}
              {vehicle.description && (
                <div className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-zamtoNavy mb-4 tracking-tight">Description</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {vehicle.description}
                  </p>
                </div>
              )}

              {/* Key Specifications */}
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-zamtoNavy mb-4 tracking-tight">Key Specifications</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {vehicle.year && (
                    <div className="bg-zamtoLight p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-zamtoGreen" />
                        <p className="text-xs text-gray-500">Year</p>
                      </div>
                      <p className="text-sm font-bold text-zamtoNavy">{vehicle.year}</p>
                    </div>
                  )}
                  
                  {vehicle.mileage && (
                    <div className="bg-zamtoLight p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Hash className="w-4 h-4 text-zamtoGreen" />
                        <p className="text-xs text-gray-500">Mileage</p>
                      </div>
                      <p className="text-sm font-bold text-zamtoNavy">{vehicle.mileage}</p>
                    </div>
                  )}
                  
                  {vehicle.transmission && (
                    <div className="bg-zamtoLight p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Settings className="w-4 h-4 text-zamtoGreen" />
                        <p className="text-xs text-gray-500">Transmission</p>
                      </div>
                      <p className="text-sm font-bold text-zamtoNavy">{vehicle.transmission}</p>
                    </div>
                  )}
                  
                  {vehicle.fuelType && (
                    <div className="bg-zamtoLight p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Fuel className="w-4 h-4 text-zamtoGreen" />
                        <p className="text-xs text-gray-500">Fuel Type</p>
                      </div>
                      <p className="text-sm font-bold text-zamtoNavy">{vehicle.fuelType}</p>
                    </div>
                  )}
                  
                  {vehicle.doors && (
                    <div className="bg-zamtoLight p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Car className="w-4 h-4 text-zamtoGreen" />
                        <p className="text-xs text-gray-500">Doors</p>
                      </div>
                      <p className="text-sm font-bold text-zamtoNavy">{vehicle.doors}</p>
                    </div>
                  )}
                  
                  {vehicle.seats && (
                    <div className="bg-zamtoLight p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-zamtoGreen" />
                        <p className="text-xs text-gray-500">Seats</p>
                      </div>
                      <p className="text-sm font-bold text-zamtoNavy">{vehicle.seats}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {vehicle.color && (
                  <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Color</p>
                    <p className="font-semibold text-zamtoNavy">{vehicle.color}</p>
                  </div>
                )}
                
                {vehicle.condition && (
                  <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Condition</p>
                    <p className="font-semibold text-zamtoNavy">{vehicle.condition}</p>
                  </div>
                )}
                
                {vehicle.engineSize && (
                  <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Engine Size</p>
                    <p className="font-semibold text-zamtoNavy">{vehicle.engineSize}</p>
                  </div>
                )}
                
                {vehicle.registrationStatus && (
                  <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Registration</p>
                    <p className="font-semibold text-zamtoNavy">{vehicle.registrationStatus}</p>
                  </div>
                )}
              </div>

              {/* Features */}
              {vehicle.features && vehicle.features.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-zamtoNavy mb-4 tracking-tight">Features</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {vehicle.features.map((feature: string, idx: number) => (
                      <div key={`${vehicle.slug}-feature-${idx}`} className="flex items-center gap-2 bg-zamtoLight p-3 rounded-lg">
                        <svg className="w-5 h-5 text-zamtoGreen flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service History & Warranty */}
              {(vehicle.serviceHistory || vehicle.warranty) && (
                <div className="mb-8 space-y-4">
                  {vehicle.serviceHistory && (
                    <div className="bg-zamtoLight p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Wrench className="w-5 h-5 text-zamtoNavy" />
                        <h3 className="text-lg font-bold text-zamtoNavy">Service History</h3>
                      </div>
                      <p className="text-gray-700">{vehicle.serviceHistory}</p>
                    </div>
                  )}
                  
                  {vehicle.warranty && (
                    <div className="bg-zamtoGreen/5 p-4 rounded-xl border border-zamtoGreen/20">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-5 h-5 text-zamtoGreen" />
                        <h3 className="text-lg font-bold text-zamtoGreen">Warranty</h3>
                      </div>
                      <p className="text-gray-700">{vehicle.warranty}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Final CTA */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold text-zamtoNavy mb-3">Ready to Get This Vehicle?</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Contact us today to schedule a test drive or discuss financing options.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold p-4 rounded-full text-center transition-all duration-300 ease-in-out transform hover:scale-110 shadow-md flex items-center justify-center"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Message on WhatsApp
                  </a>
                  
                  <a
                    href="mailto:zamtoafrica@gmail.com"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-all duration-300 ease-in-out flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}