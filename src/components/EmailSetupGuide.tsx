import React from 'react';
import { CheckCircleIcon } from 'lucide-react';
export function EmailSetupGuide() {
  return <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-[#003366] mb-6">
        EmailJS Setup Guide
      </h2>
      <div className="space-y-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-sm text-blue-800">
            Follow these steps to enable email functionality for your contact
            form. All messages will be sent to zamtoafrica@gmail.com
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-[#FF6600] text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Create EmailJS Account
              </h3>
              <p className="text-gray-700 mb-2">
                Go to{' '}
                <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="text-[#FF6600] underline">
                  https://www.emailjs.com/
                </a>{' '}
                and sign up for a free account.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-[#FF6600] text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Add Email Service
              </h3>
              <p className="text-gray-700 mb-2">
                In EmailJS dashboard, go to "Email Services" and click "Add New
                Service"
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Choose "Gmail" as your email service</li>
                <li>Connect your zamtoafrica@gmail.com account</li>
                <li>Note down the Service ID (e.g., "service_abc123")</li>
              </ul>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-[#FF6600] text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Create Email Template
              </h3>
              <p className="text-gray-700 mb-2">
                Go to "Email Templates" and create a new template with these
                variables:
              </p>
              <div className="bg-gray-50 p-4 rounded-md font-mono text-sm">
                <p>Subject: New Contact Form Submission from Zamto Africa</p>
                <br />
                <p>From: {'{{from_name}}'}</p>
                <p>Email: {'{{from_email}}'}</p>
                <p>Phone: {'{{phone}}'}</p>
                <p>Service Type: {'{{service_type}}'}</p>
                <p>Vehicle Preference: {'{{vehicle_preference}}'}</p>
                <br />
                <p>Message:</p>
                <p>{'{{message}}'}</p>
              </div>
              <p className="text-gray-700 mt-2">
                Note down the Template ID (e.g., "template_xyz789")
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-[#FF6600] text-white rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Get Public Key
              </h3>
              <p className="text-gray-700 mb-2">
                Go to "Account" → "General" → "API Keys"
              </p>
              <p className="text-gray-700">
                Copy your Public Key (e.g., "user_abcdefghijk123456")
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-[#FF6600] text-white rounded-full flex items-center justify-center font-bold">
              5
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Update Configuration
              </h3>
              <p className="text-gray-700 mb-2">
                In the Contact.tsx file, replace the placeholder values in
                EMAILJS_CONFIG:
              </p>
              <div className="bg-gray-50 p-4 rounded-md font-mono text-sm">
                <p>serviceId: 'service_tsgs1az'</p>
                <p>templateId: 'template_yyfkois'</p>
                <p>publicKey: 'gf6jUi7eA0maA9rzH'</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mt-6">
          <div className="flex items-start space-x-2">
            <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">
              Once configured, all form submissions will be automatically sent
              to zamtoafrica@gmail.com!
            </p>
          </div>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> EmailJS free tier includes 200 emails
            per month. For higher volume, consider upgrading or using a backend
            solution.
          </p>
        </div>
      </div>
    </div>;
}