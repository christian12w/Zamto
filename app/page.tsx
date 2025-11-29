import Link from 'next/link'
import type { Metadata } from 'next'
import { getVehicles } from '@/lib/vehicles'
import VehicleCard from '@/app/components/VehicleCard'
import VehicleSearch from '@/app/components/VehicleSearch'
import {
  Car,
  Users,
  ShieldCheck,
  Wrench,
  DollarSign,
  MapPin,
  Clock,
  Tag,
} from 'lucide-react'

export const revalidate = 10

export const metadata: Metadata = {
  title: 'Zamto Africa – Japanese Imported Vehicles for Sale & Hire in Lusaka',
  description:
    'Zamto Africa Company Limited - Specializing in Sales, Leasing & Rental of Japanese Imported Vehicles. Drive your dreams with quality, reliability, and exceptional service.',
}

export default async function Home() {
  const vehicles = await getVehicles()
  const heroVehicle = vehicles.find((v) => v.image) || vehicles[0]
  const popularVehicles = vehicles.filter((v) => v.popular)
  const featuredVehicles = (popularVehicles.length ? popularVehicles : vehicles).slice(0, 6)

  const vehicleCounts = {
    all: vehicles.length,
    sale: vehicles.filter((v) => v.type === 'sale').length,
    hire: vehicles.filter((v) => v.type === 'hire').length,
    popular: vehicles.filter((v) => v.popular).length,
    suv: vehicles.filter((v) => v.category?.toUpperCase().includes('SUV')).length,
    pickupTrucks: vehicles.filter((v) => v.category?.toUpperCase().includes('PICKUP')).length,
  }

  const categories = [
    { name: 'ALL VEHICLES', count: vehicleCounts.all, href: '/vehicles' },
    { name: 'FOR SALE', count: vehicleCounts.sale, href: '/vehicles/sale' },
    { name: 'FOR HIRE', count: vehicleCounts.hire, href: '/vehicles/hire' },
    { name: 'POPULAR', count: vehicleCounts.popular, href: '/vehicles' },
    { name: 'SUV', count: vehicleCounts.suv, href: '/vehicles' },
    { name: 'PICKUP TRUCKS', count: vehicleCounts.pickupTrucks, href: '/vehicles' },
  ]

  const features = [
    {
      icon: Car,
      title: 'Extensive Vehicle Selection',
      description: 'A wide array of new and pre-owned vehicles to suit every preference and budget.',
    },
    {
      icon: Users,
      title: 'Customer-Centric Approach',
      description: 'We prioritize your needs and ensure a personalized and transparent buying process.',
    },
    {
      icon: ShieldCheck,
      title: 'Quality Assurance',
      description: 'All pre-owned vehicles are thoroughly inspected for your peace of mind.',
    },
    {
      icon: Wrench,
      title: 'Expert Service',
      description: 'Our certified technicians provide reliable and efficient maintenance and repair services.',
    },
    {
      icon: DollarSign,
      title: 'Competitive Pricing & Financing',
      description: 'We offer attractive prices and flexible financing solutions.',
    },
    {
      icon: MapPin,
      title: 'Convenient Location',
      description: "Strategically located at Handyman's Great East Road, Lusaka, Zambia for easy access.",
    },
  ]

  const saleVehicles = vehicles.filter((v) => v.type === 'sale')
  const hireVehicles = vehicles.filter((v) => v.type === 'hire')

  return (
    <main className="min-h-screen bg-white">
      <section
        className="relative h-[400px] sm:h-[500px] md:h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.7), rgba(0, 51, 102, 0.7)), url('/about us image replacement .jpg')`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              ZAMTO AFRICA COMPANY LTD
            </h1>
            <p className="text-base sm:text-xl md:text-2xl mb-4 sm:mb-6">Your Trusted Partner in Automotive Freedom</p>
            <p className="text-sm sm:text-base mb-6">
              Specializing in sales and leasing of Japanese imported vehicles. Drive your dreams with quality,
              reliability, and exceptional service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/vehicles"
                className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-6 py-3 rounded-md font-semibold transition-colors text-center"
              >
                Browse Inventory
              </Link>
              <Link
                href="/contact"
                className="bg-white hover:bg-gray-100 text-[#003366] px-6 py-3 rounded-md font-semibold transition-colors text-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Video Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#003366] mb-3 sm:mb-4">Welcome to Zamto Africa</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Discover why we're Zambia's premier destination for quality vehicles
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-5xl">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
                <video className="w-full h-full object-contain" controls poster="/logo.png" playsInline>
                  <source src="/zamto welcoming video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 text-center max-w-3xl mx-auto text-gray-700">
            At Zamto Africa, we are committed to providing you with the best vehicle purchasing and rental experience in Zambia.
            Our team carefully selects each vehicle to ensure quality, reliability, and value.
          </div>
        </div>
      </section>

      {/* Vehicle Search Section */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#003366] mb-3">Find Your Perfect Vehicle</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Search our inventory to find the vehicle that matches your needs
            </p>
          </div>
          <VehicleSearch vehicles={vehicles} />
        </div>
      </section>

      {/* Sale / Hire */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-gradient-to-br from-[#003366] to-[#004080] p-6 sm:p-8 rounded-lg text-white shadow-xl">
              <div className="flex items-center mb-3 sm:mb-4">
                <Tag className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3" />
                <h3 className="text-xl sm:text-2xl font-bold">Vehicles For Sale</h3>
              </div>
              <p className="mb-4 text-sm sm:text-base">
                Browse our extensive collection of quality Japanese imported vehicles. All vehicles are thoroughly inspected and come with
                competitive financing options.
              </p>
              <p className="text-2xl sm:text-3xl font-bold mb-4">{vehicleCounts.sale} Vehicles Available</p>
              <Link
                href="/vehicles/sale"
                className="inline-block bg-[#FF6600] hover:bg-[#e55a00] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base text-center"
              >
                View Vehicles For Sale
              </Link>
            </div>

            <div className="bg-gradient-to-br from-[#FF6600] to-[#e55a00] p-6 sm:p-8 rounded-lg text-white shadow-xl">
              <div className="flex items-center mb-3 sm:mb-4">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3" />
                <h3 className="text-xl sm:text-2xl font-bold">Vehicles For Hire</h3>
              </div>
              <p className="mb-4 text-sm sm:text-base">
                Need a vehicle for a short period? Rent from our fleet of well-maintained vehicles suitable for business trips, family outings,
                or special occasions.
              </p>
              <p className="text-2xl sm:text-3xl font-bold mb-4">{vehicleCounts.hire} Vehicles Available</p>
              <Link
                href="/vehicles/hire"
                className="inline-block bg-[#003366] hover:bg-[#002244] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base text-center"
              >
                View Vehicles For Hire
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#003366] mb-3 sm:mb-4">Why Choose Zamto Africa?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              We're committed to providing you with an exceptional automotive experience
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="text-[#FF6600] mb-4">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#003366] mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-[#003366]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Find Your Perfect Vehicle?
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base">
            Whether you're looking to buy or rent, our team is ready to help you drive away in the vehicle of your dreams.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/vehicles"
              className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-md font-semibold transition-colors text-sm sm:text-base"
            >
              Browse Our Inventory
            </Link>
            <Link
              href="/contact"
              className="bg-white hover:bg-gray-100 text-[#003366] px-6 py-3 sm:px-8 sm:py-4 rounded-md font-semibold transition-colors text-sm sm:text-base"
            >
              Schedule a Test Drive
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
