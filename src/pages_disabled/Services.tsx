import React from 'react';
import { CarIcon, WrenchIcon, DollarSignIcon, KeyIcon, TruckIcon, SparklesIcon, GlobeIcon } from 'lucide-react';

export function Services() {
  const services = [{
    icon: <CarIcon className="h-12 w-12" />,
    title: 'Vehicle Sales',
    description: 'Extensive selection of new and pre-owned Japanese imported vehicles. All our vehicles undergo thorough inspections to ensure quality and reliability. From compact cars to spacious SUVs, we have something for everyone.',
    features: ['Wide range of models and makes', 'Comprehensive vehicle inspection', 'Transparent pricing', 'Complete documentation support'],
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
    color: 'from-blue-500 to-blue-600'
  }, {
    icon: <GlobeIcon className="h-12 w-12" />,
    title: 'Vehicle Import Services',
    description: 'We specialize in importing vehicles directly from Japan to meet your specific requirements. Our streamlined import process ensures you get the exact vehicle you want at competitive prices with full documentation and compliance.',
    features: ['Direct import from Japan', 'Custom vehicle sourcing', 'Full import documentation', 'Compliance with Zambian regulations'],
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', // Updated image for import services
    color: 'from-indigo-500 to-indigo-600'
  }, {
    icon: <KeyIcon className="h-12 w-12" />,
    title: 'Car Rentals & Leasing',
    description: 'Flexible rental and leasing options for individuals and businesses. Whether you need a vehicle for a day, a month, or longer, we have solutions that fit your needs and budget.',
    features: ['Daily, weekly, and monthly rentals', 'Long-term leasing options', 'Fleet solutions for businesses', 'Flexible terms and conditions'],
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80',
    color: 'from-green-500 to-green-600'
  }, {
    icon: <WrenchIcon className="h-12 w-12" />,
    title: 'Maintenance & Repair',
    description: 'Expert maintenance and repair services provided by certified technicians. We use genuine parts and follow manufacturer specifications to keep your vehicle running smoothly.',
    features: ['Certified technicians', 'Genuine parts and accessories', 'Regular maintenance packages', 'Emergency repair services'],
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80',
    color: 'from-orange-500 to-orange-600'
  }, {
    icon: <DollarSignIcon className="h-12 w-12" />,
    title: 'Financing Solutions',
    description: 'Competitive financing options to make your dream car affordable. We work with trusted financial partners to offer flexible payment plans tailored to your budget.',
    features: ['Competitive interest rates', 'Flexible payment terms', 'Quick approval process', 'Personalized financing plans'],
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
    color: 'from-purple-500 to-purple-600'
  }, {
    icon: <TruckIcon className="h-12 w-12" />,
    title: 'Commercial Vehicles',
    description: 'Specialized solutions for businesses requiring commercial vehicles. From delivery vans to pick-up trucks, we provide reliable vehicles for your business operations.',
    features: ['Wide range of commercial vehicles', 'Fleet management support', 'Bulk purchase discounts', 'After-sales support'],
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80',
    color: 'from-red-500 to-red-600'
  }, {
    icon: <SparklesIcon className="h-12 w-12" />,
    title: 'Car Washing & Detailing',
    description: 'Professional car washing and detailing services to keep your vehicle looking pristine. Our expert team uses premium products and techniques to restore your car\'s shine and protect its finish.',
    features: ['Exterior washing and waxing', 'Interior vacuuming and cleaning', 'Engine bay cleaning', 'Premium detailing packages'],
    image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&q=80',
    color: 'from-cyan-500 to-cyan-600'
  }];
  
  return <div className="w-full">
      <section className="bg-[#003366] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl max-w-3xl">
            Comprehensive automotive solutions designed to meet all your vehicle
            needs in Zambia. We specialize in importing vehicles directly from Japan.
          </p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {services.map((service, index) => <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="mb-6">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.color} text-white shadow-lg`}>
                      {service.icon}
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-[#003366] mb-4">
                    {service.title}
                  </h2>
                  <p className="text-gray-700 mb-6 text-lg">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => <li key={idx} className="flex items-start">
                        <span className="text-[#228B22] mr-3 text-xl">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>)}
                  </ul>
                </div>
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="rounded-2xl overflow-hidden shadow-xl transform transition-transform hover:scale-105">
                    <img src={service.image} alt={service.title} className="w-full h-80 object-cover" />
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </section>
      <section className="py-16 bg-[#228B22] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Need a Custom Solution?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            We understand that every customer has unique needs. Contact us to
            discuss how we can tailor our services to meet your specific
            requirements, including importing vehicles from Japan.
          </p>
          <a href="/contact" className="inline-block bg-white text-[#228B22] px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
            Contact Us Today
          </a>
        </div>
      </section>
    </div>;
}

export default Services;