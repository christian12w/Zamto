import React, { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon, SendIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon, FileTextIcon } from 'lucide-react';
import { EmailSetupGuide } from '../components/EmailSetupGuide';

// EmailJS Configuration
const EMAILJS_CONFIG = {
  serviceId: 'service_tsgs1az',
  templateId: 'template_yyfkois',
  publicKey: 'gf6jUi7eA0maA9rzH'
};

// Flag to indicate if EmailJS is properly configured
const EMAILJS_ENABLED = EMAILJS_CONFIG.serviceId !== 'YOUR_SERVICE_ID' && 
                      EMAILJS_CONFIG.templateId !== 'YOUR_TEMPLATE_ID' && 
                      EMAILJS_CONFIG.templateId !== 'template_12yl2zu' && 
                      EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'sales',
    vehiclePreference: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: ''
  });

  // Initialize EmailJS on component mount
  useEffect(() => {
    if (EMAILJS_ENABLED) {
      emailjs.init(EMAILJS_CONFIG.publicKey);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If EmailJS is not properly configured, show setup guide
    if (!EMAILJS_ENABLED) {
      setSubmitStatus({
        type: 'error',
        message: 'EmailJS is not properly configured. Please set up your EmailJS account and update the configuration in the code.'
      });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus({
      type: null,
      message: ''
    });

    try {
      // Prepare template parameters - using standard EmailJS parameter names
      const templateParams = {
        from_name: formData.name,
        reply_to: formData.email,
        from_email: formData.email,
        phone: formData.phone,
        service_type: formData.serviceType,
        vehicle_preference: formData.vehiclePreference || 'Not specified',
        message: formData.message,
        to_email: 'zamtoafrica@gmail.com'
      };

      console.log('Sending email with params:', templateParams);

      // Send email using EmailJS
      const response = await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams);
      console.log('Email sent successfully:', response);
      
      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your message! We will get back to you within 24 hours.'
      });

      // Clear form
      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceType: 'sales',
        vehiclePreference: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Email send error:', error);
      let errorMessage = 'Failed to send message. ';
      
      if (error.text) {
        errorMessage += error.text;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please try again or contact us directly at zamtoafrica@gmail.com';
      }
      
      setSubmitStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return <div className="w-full">
      <section className="bg-[#003366] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl max-w-3xl">
            Get in touch with us today. We're here to help you find your perfect
            vehicle.
          </p>
        </div>
      </section>
      
      {/* EmailJS Setup Guide - Only show if not properly configured */}
      {!EMAILJS_ENABLED && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangleIcon className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>EmailJS Not Configured:</strong> The contact form requires EmailJS setup to function. 
                  Please follow the setup guide below to configure your EmailJS account.
                </p>
              </div>
            </div>
          </div>
          <EmailSetupGuide />
        </div>
      )}
      
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-[#003366] mb-8">
                Send Us a Message
              </h2>
              
              {/* Warning if EmailJS is not configured */}
              {!EMAILJS_ENABLED && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3">
                  <AlertTriangleIcon className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 font-medium">EmailJS Not Configured</p>
                    <p className="text-yellow-700 text-sm mt-1">
                      The contact form requires EmailJS setup to function. Scroll up to see setup instructions.
                    </p>
                  </div>
                </div>
              )}
              
              {submitStatus.type && <div className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${submitStatus.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  {submitStatus.type === 'success' ? <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" /> : <XCircleIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />}
                  <p className={`text-sm ${submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                    {submitStatus.message}
                  </p>
                </div>}
                
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed" 
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed" 
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed" 
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed" 
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF6600] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed" 
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting || !EMAILJS_ENABLED}
                  className="w-full bg-[#FF6600] hover:bg-[#e55a00] text-white px-6 py-3 rounded-md font-semibold transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <SendIcon className="h-5 w-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Direct Contact:</strong> You can also reach us
                  directly at{' '}
                  <a href="mailto:zamtoafrica@gmail.com" className="underline hover:text-blue-600">
                    zamtoafrica@gmail.com
                  </a>{' '}
                  or call{' '}
                  <a href="tel:+260572213038" className="underline hover:text-blue-600">
                    +260 572 213 038
                  </a>
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-[#003366] mb-8">
                Contact Information
              </h2>
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <MapPinIcon className="h-6 w-6 text-[#FF6600] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#003366] mb-1">
                      Our Location
                    </h3>
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
                  <PhoneIcon className="h-6 w-6 text-[#FF6600] flex-shrink-0 mt-1" />
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
                  <MailIcon className="h-6 w-6 text-[#FF6600] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#003366] mb-1">Email</h3>
                    <a href="mailto:zamtoafrica@gmail.com" className="text-gray-700 hover:text-[#FF6600]">
                      zamtoafrica@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <ClockIcon className="h-6 w-6 text-[#FF6600] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-[#003366] mb-1">
                      Business Hours
                    </h3>
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
                <h3 className="font-semibold text-[#003366] mb-3">
                  Visit Our Showroom
                </h3>
                <p className="text-gray-700 mb-4">
                  Come visit us at our convenient location on Great East Road.
                  Our friendly team is ready to help you find the perfect
                  vehicle.
                </p>
                <div className="aspect-video rounded-lg overflow-hidden shadow-md">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3846.3376!2d28.306470268929996!3d-15.397964582006253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x194083a5a5a5a5a5%3A0x1234567890abcdef!2sH8X3%2B7R%20Lusaka%2C%20Zambia!5e0!3m2!1sen!2szm!4v1234567890" 
                    width="100%" 
                    height="100%" 
                    style={{
                      border: 0
                    }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade" 
                    title="Handyman's Location" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>;
}

export default Contact;