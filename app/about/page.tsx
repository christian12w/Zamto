import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About Zamto Africa | Premium Japanese Vehicle Importer – Lusaka, Zambia',
  description: 'Established 2025 | Direct Japanese imports | Transparent pricing | Exceptional service',
}

export default function AboutPage() {
  return (
    <>
      {/* Never-lose-colors guarantee */}
      <div className="hidden bg-zamtoNavy bg-zamtoOrange hover:bg-zamtoNavy/90 hover:bg-zamtoOrange/90 text-zamtoNavy text-zamtoOrange" />

      <main className="bg-white">
        {/* Test colors - temporary */}
        <div className="hidden">
          <div className="bg-[#003366] w-10 h-10"></div>
          <div className="bg-[#FF6B35] w-10 h-10"></div>
        </div>
        
        {/* HERO – Clean & Authoritative */}
        <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-50">
          <div className="absolute inset-0 bg-gradient-to-r from-zamtoNavy/5 to-zamtoOrange/5"></div>
          <div className="absolute top-20 right-0 w-64 h-64 bg-zamtoOrange/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-0 w-96 h-96 bg-zamtoNavy/10 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-zamtoNavy/10 mb-6">
              <span className="w-2 h-2 bg-zamtoOrange rounded-full animate-pulse"></span>
              <span className="text-zamtoNavy font-medium">Established 2025</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-zamtoNavy mb-6">
              About <span className="text-zamtoOrange">Zamto Africa</span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              Zamto Africa Company Limited is a trusted name in direct Japanese vehicle importation. 
              We specialize in sourcing, clearing, and delivering high-quality, verified vehicles to clients across Zambia.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section id="story" className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <div className="bg-gradient-to-br from-zamtoOrange/10 to-zamtoNavy/10 rounded-2xl p-8 transform rotate-3"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-zamtoNavy/10 to-zamtoOrange/10 rounded-2xl transform -rotate-3 translate-x-2 translate-y-2"></div>
                  <div className="relative bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <img 
                      src="/logo.png" 
                      alt="Zamto Africa Logo" 
                      className="h-24 w-auto mx-auto mb-6"
                    />
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-zamtoNavy mb-4">Established 2025</h3>
                      <p className="text-gray-600 italic">
                        "Connecting people with quality vehicles and unforgettable experiences."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <div className="mb-8">
                  <span className="text-zamtoOrange font-bold text-sm uppercase tracking-wider">Our Journey</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-zamtoNavy mt-2 mb-6">
                    From Vision to Reality
                  </h2>
                </div>
                
                <div className="space-y-6">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Founded in 2025, Zamto Africa was created with a clear mission: to provide Zambian buyers direct access to Japan's finest vehicles — without the complexity, hidden costs, or uncertainty that often comes with importation.
                  </p>
                  
                  <p className="text-gray-700 text-lg leading-relaxed">
                    From Tokyo auctions to our showroom on Great East Road, Lusaka, every vehicle passes through a rigorous selection and verification process. We believe transparency and quality are non-negotiable.
                  </p>
                  
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Today, we are proud to serve private buyers, businesses, and government clients with the same dedication that built our reputation.
                  </p>
                  
                  <div className="mt-8 p-6 bg-gradient-to-r from-zamtoOrange/5 to-zamtoNavy/5 rounded-xl border border-zamtoOrange/20">
                    <h4 className="font-bold text-zamtoNavy text-lg mb-2">Our Mission</h4>
                    <p className="text-gray-700">
                      To empower individuals and businesses in Zambia with reliable transportation solutions through quality vehicles and exceptional service.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section id="values" className="py-20 md:py-28 bg-gradient-to-b from-white to-zamtoLight">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <span className="text-zamtoOrange font-bold text-sm uppercase tracking-wider">What Drives Us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-zamtoNavy mt-2 mb-6">
                Our Core Values
              </h2>
              <p className="text-gray-700 max-w-2xl mx-auto text-lg">
                The principles that guide everything we do at Zamto Africa
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Quality Vehicles",
                  description: "We source only the finest Japanese imported vehicles, ensuring reliability and performance.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: "Expert Service",
                  description: "Our team of automotive experts is here to help you find the perfect vehicle for your needs.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )
                },
                {
                  title: "Flexible Options",
                  description: "Whether you're looking to buy, lease, or hire, we have flexible solutions to meet your requirements.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: "Customer Focus",
                  description: "Your satisfaction is our priority. We're committed to providing exceptional service at every step.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )
                }
              ].map((value, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover-lift group text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-zamtoOrange to-zamtoNavy rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300 mx-auto">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-zamtoNavy mb-4">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-gradient-to-r from-zamtoNavy to-zamtoOrange">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-lg">
              Ready to Find Your Perfect Vehicle?
            </h2>
            <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto drop-shadow-md">
              Join hundreds of satisfied customers who have found their dream vehicle with Zamto Africa.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}
