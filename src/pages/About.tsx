import React from 'react';
import { CheckCircleIcon } from 'lucide-react';
export function About() {
  return <div className="w-full">
      <section className="bg-[#003366] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
          <p className="text-xl max-w-3xl">
            Learn more about Zamto Africa Company Ltd and our commitment to
            providing exceptional automotive solutions.
          </p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800" alt="Zamto Africa Vehicles" className="rounded-lg shadow-xl w-full" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#003366] mb-6">
                Our Story
              </h2>
              <div className="mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800" 
                  alt="Zamto Africa Vehicle" 
                  className="rounded-lg shadow-xl w-full max-w-2xl mx-auto"
                />
              </div>
              <p className="text-gray-700 mb-4">
                At Zamto Africa Company Limited, we are more than just car
                sellers; we are automotive enthusiasts passionate about
                connecting people with quality vehicles.
              </p>
              <p className="text-gray-700 mb-4">
                Our journey began with a simple vision: to create a car buying
                experience that is transparent, enjoyable, and stress-free. We
                have grown steadily by focusing on customer satisfaction,
                offering a curated selection of vehicles, and fostering
                long-term relationships with our clients.
              </p>
              <p className="text-gray-700 mb-6">
                Located at Handyman's Great East Road in Lusaka, Zambia, we
                specialize in sales and leasing of Japanese imported vehicles,
                offering a wide selection of models including pick-up trucks,
                commercial vehicles, SUVs, and family cars.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-[#003366] mb-6">
                Our Vision
              </h2>
              <p className="text-gray-700 mb-4">
                To create a car buying experience that is transparent,
                enjoyable, and stress-free for every customer in Zambia and
                beyond.
              </p>
              <p className="text-gray-700">
                We aim to be the most trusted automotive partner in the region,
                known for our quality vehicles, exceptional service, and
                unwavering commitment to customer satisfaction.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#003366] mb-6">
                Our Mission
              </h2>
              <p className="text-gray-700 mb-4">
                To provide high-quality Japanese imported vehicles and
                comprehensive automotive services that exceed customer
                expectations.
              </p>
              <p className="text-gray-700">
                We are committed to offering competitive pricing, flexible
                financing solutions, and expert maintenance services while
                maintaining the highest standards of integrity and
                professionalism.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#003366] mb-8 text-center">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{
            title: 'Quality',
            description: 'We never compromise on the quality of our vehicles and services.'
          }, {
            title: 'Transparency',
            description: 'Honest and open communication with every customer.'
          }, {
            title: 'Reliability',
            description: 'Dependable vehicles and consistent service you can trust.'
          }, {
            title: 'Customer Focus',
            description: 'Your satisfaction is our top priority in everything we do.'
          }].map((value, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <CheckCircleIcon className="h-10 w-10 text-[#228B22] mb-4" />
                <h3 className="text-xl font-semibold text-[#003366] mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>)}
          </div>
        </div>
      </section>
    </div>;
}