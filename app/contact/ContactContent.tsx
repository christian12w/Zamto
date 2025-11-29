'use client'

import { useEffect, useState, FormEvent, ChangeEvent } from 'react'
import emailjs from '@emailjs/browser'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react'
import EmailSetupGuide from '@/app/components/EmailSetupGuide'

const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? 'service_tsgs1az',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? 'template_d03hddw',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? 'gf6jUi7eA0maA9rzH',
}

const isPlaceholder = (value: string) =>
  !value || value.includes('YOUR_') || value === 'template_12yl2zu'

const EMAILJS_ENABLED =
  !isPlaceholder(EMAILJS_CONFIG.serviceId) &&
  !isPlaceholder(EMAILJS_CONFIG.templateId) &&
  !isPlaceholder(EMAILJS_CONFIG.publicKey)

type SubmitState = {
  type: 'success' | 'error' | null
  message: string
}

const defaultForm = {
  name: '',
  email: '',
  phone: '',
  serviceType: 'sales',
  vehiclePreference: '',
  message: '',
}

export default function ContactContent() {
  const [formData, setFormData] = useState(defaultForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitState>({ type: null, message: '' })

  useEffect(() => {
    if (EMAILJS_ENABLED) {
      emailjs.init(EMAILJS_CONFIG.publicKey)
    }
  }, [])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!EMAILJS_ENABLED) {
      setSubmitStatus({
        type: 'error',
        message:
          'EmailJS is not configured yet. Please add your EmailJS keys to the environment variables to enable this form.',
      })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        reply_to: formData.email,
        phone: formData.phone,
        service_type: formData.serviceType,
        vehicle_preference: formData.vehiclePreference || 'Not specified',
        message: formData.message,
        to_email: 'zamtoafrica@gmail.com',
      }

      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams)
      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your message! We will get back to you within 24 hours.',
      })
      setFormData(defaultForm)
    } catch (error: unknown) {
      const fallbackMessage =
        error instanceof Error ? error.message : 'Failed to send message. Please try again later.'
      setSubmitStatus({
        type: 'error',
        message: fallbackMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <section className="bg-[#003366] text-white py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-[0.3em] text-white/70 mb-4">Contact Us</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch with Zamto Africa</h1>
          <p className="text-xl max-w-3xl text-white/90">
            Reach out today to discuss sales, leasing, or rental options. Our team is ready to help you find the perfect
            Japanese imported vehicle.
          </p>
        </div>
      </section>

      {!EMAILJS_ENABLED && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mt-1" />
            <div>
              <p className="text-sm text-yellow-800 font-semibold">EmailJS Not Configured</p>
              <p className="text-sm text-yellow-700">
                The contact form requires EmailJS credentials. Please follow the setup guide below.
              </p>
            </div>
          </div>
          <EmailSetupGuide />
        </section>
      )}

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-[#003366] mb-8">Send Us a Message</h2>

              {!EMAILJS_ENABLED && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 font-medium">EmailJS Not Configured</p>
                    <p className="text-yellow-700 text-sm mt-1">
                      The contact form requires EmailJS setup. Scroll up to see setup instructions.
                    </p>
                  </div>
                </div>
              )}

              {submitStatus.type && (
                <div
                  className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${
                    submitStatus.type === 'success'
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  {submitStatus.type === 'success' ? (
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <p className={`text-sm ${submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                    {submitStatus.message}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting || !EMAILJS_ENABLED}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6600] focus:border-transparent disabled:bg-gray-100"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting || !EMAILJS_ENABLED}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6600] focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isSubmitting || !EMAILJS_ENABLED}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6600] focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type *
                  </label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    required
                    value={formData.serviceType}
                    onChange={handleChange}
                    disabled={isSubmitting || !EMAILJS_ENABLED}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6600] focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="sales">Vehicle Sales</option>
                    <option value="rental">Car Rental</option>
                    <option value="leasing">Leasing</option>
                    <option value="maintenance">Maintenance & Repair</option>
                    <option value="financing">Financing</option>
                    <option value="careers">Careers</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="vehiclePreference" className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Preference (Optional)
                  </label>
                  <input
                    type="text"
                    id="vehiclePreference"
                    name="vehiclePreference"
                    value={formData.vehiclePreference}
                    onChange={handleChange}
                    disabled={isSubmitting || !EMAILJS_ENABLED}
                    placeholder="e.g., SUV, Small Car, Pick-up Truck"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6600] focus:border-transparent disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isSubmitting || !EMAILJS_ENABLED}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6600] focus:border-transparent disabled:bg-gray-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !EMAILJS_ENABLED}
                  className="w-full bg-[#FF6600] hover:bg-[#e55a00] text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center disabled:bg-gray-300"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Direct Contact:</strong> You can also reach us at{' '}
                  <a href="mailto:zamtoafrica@gmail.com" className="underline hover:text-blue-600">
                    zamtoafrica@gmail.com
                  </a>{' '}
                  or call{' '}
                  <a href="tel:+260572213038" className="underline hover:text-blue-600">
                    +260 572 213 038
                  </a>
                  .
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#003366] mb-8">Contact Information</h2>
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-[#FF6600] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#003366] mb-1">Our Location</h3>
                    <p className="text-gray-700">
                      Handyman's Great East Road
                      <br />
                      Plot 1222, Roma Park
                      <br />
                      Lusaka, Zambia
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-[#FF6600] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#003366] mb-1">Phone</h3>
                    <div className="space-y-1">
                      <a href="tel:+260572213038" className="block text-gray-700 hover:text-[#FF6600]">
                        +260 572 213 038
                      </a>
                      <a href="tel:+260770499230" className="block text-gray-700 hover:text-[#FF6600]">
                        +260 770 499 230
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-[#FF6600] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#003366] mb-1">Email</h3>
                    <a href="mailto:zamtoafrica@gmail.com" className="text-gray-700 hover:text-[#FF6600]">
                      zamtoafrica@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-[#FF6600] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#003366] mb-1">Business Hours</h3>
                    <p className="text-gray-700">
                      Monday - Friday: 8:00 AM - 6:00 PM
                      <br />
                      Saturday: 9:00 AM - 4:00 PM
                      <br />
                      Sunday: 9:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="font-semibold text-[#003366] mb-3">Visit Our Showroom</h3>
                <p className="text-gray-700 mb-4">
                  Visit us on Great East Road. Our friendly team is ready to help you find the perfect vehicle.
                </p>
                <div className="aspect-video rounded-lg overflow-hidden shadow-md">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61538.20957847388!2d28.26807293163058!3d-15.42309606027558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19408b007cc35c85%3A0x90468781b4708abf!2sZAMTO%20AFRICA%20CO.LTD!5e0!3m2!1sen!2szm!4v1764447810528!5m2!1sen!2szm"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="ZAMTO AFRICA CO.LTD Location"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
