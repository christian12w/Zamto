import React, { useState } from 'react';
import { AlertCircleIcon, CheckCircleIcon, ExternalLinkIcon, CopyIcon, FileTextIcon, DownloadIcon, ImageIcon } from 'lucide-react';

export function EmailSetupGuide() {
  const [copied, setCopied] = useState<string | null>(null);
  
  const steps = [
    {
      id: 1,
      title: "Create EmailJS Account",
      description: "Sign up at emailjs.com if you haven't already",
      action: "Visit EmailJS Dashboard",
      link: "https://dashboard.emailjs.com/"
    },
    {
      id: 2,
      title: "Create Email Service",
      description: "Set up an email service (Gmail, Outlook, etc.)",
      action: "Go to Email Services",
      link: "https://dashboard.emailjs.com/admin"
    },
    {
      id: 3,
      title: "Create Email Template",
      description: "Create a new template for your contact form",
      action: "Go to Templates",
      link: "https://dashboard.emailjs.com/admin/templates"
    },
    {
      id: 4,
      title: "Get Your Keys",
      description: "Copy your Service ID, Template ID, and Public Key",
      action: "Go to Account Settings",
      link: "https://dashboard.emailjs.com/admin/account"
    }
  ];
  
  const templateExample = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; margin: 20px auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <!-- Header with Logo -->
        <tr>
            <td align="center" bgcolor="#003366" style="padding: 20px;">
                <!-- Company Logo -->
                <img src="https://your-domain.com/logo.png" alt="Zamto Africa Logo" width="150" style="display: block; margin: 0 auto 15px auto;" />
                <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: bold;">Zamto Africa</h1>
                <p style="color: #ffffff; font-size: 18px; margin: 10px 0 0; opacity: 0.9;">New Contact Form Submission</p>
            </td>
        </tr>
        
        <!-- Content -->
        <tr>
            <td style="padding: 30px;">
                <p style="font-size: 16px; color: #333333; margin: 0 0 20px;">
                    You have received a new message from your website contact form:
                </p>
                
                <!-- Contact Information -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8f9fa; border-radius: 6px; overflow: hidden; border: 1px solid #e9ecef;">
                    <tr>
                        <td style="padding: 20px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td width="30%" style="padding: 8px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #003366;">Full Name:</td>
                                    <td width="70%" style="padding: 8px 0; border-bottom: 1px solid #e9ecef; color: #333333;">{{from_name}}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #003366;">Email Address:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; color: #333333;">{{from_email}}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #003366;">Phone Number:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; color: #333333;">{{phone}}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #003366;">Service Type:</td>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; color: #333333;">{{service_type}}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #003366;">Vehicle Preference:</td>
                                    <td style="padding: 8px 0; color: #333333;">{{vehicle_preference}}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                
                <!-- Message Section -->
                <div style="margin: 25px 0;">
                    <h3 style="color: #003366; font-size: 18px; margin: 0 0 15px; font-weight: bold;">Message:</h3>
                    <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; border: 1px solid #e9ecef;">
                        <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0; white-space: pre-wrap;">{{message}}</p>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                    <p style="color: #666666; font-size: 14px; margin: 0 0 10px;">
                        This message was sent from your website contact form.
                    </p>
                    <p style="color: #666666; font-size: 14px; margin: 0;">
                        Please respond to <strong>{{from_name}}</strong> at 
                        <a href="mailto:{{from_email}}" style="color: #FF6600; text-decoration: none;">{{from_email}}</a> 
                        or call them at {{phone}}.
                    </p>
                </div>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td align="center" bgcolor="#f8f9fa" style="padding: 20px; border-top: 1px solid #e9ecef;">
                <p style="color: #666666; font-size: 12px; margin: 0;">
                    &copy; 2025 Zamto Africa. All rights reserved.
                </p>
                <p style="color: #666666; font-size: 12px; margin: 5px 0 0;">
                    Handyman's Great East Road, Plot 1222, Roma Park, Lusaka, Zambia
                </p>
            </td>
        </tr>
    </table>
</body>
</html>`;
  
  const templateParams = `{
  from_name: "John Doe",
  from_email: "john.doe@example.com",
  phone: "+1234567890",
  service_type: "sales",
  vehicle_preference: "SUV",
  message: "I'm interested in purchasing a vehicle.",
  to_email: "zamtoafrica@gmail.com"
}`;
  
  const logoInstructions = `
To use your existing logo in the emails:

1. Replace the placeholder URL in the template:
   FROM: https://your-domain.com/logo.png
   TO: https://your-actual-domain.com/logo.png

For example, if your website is hosted at https://zamtoafrica.com, change it to:
   https://zamtoafrica.com/logo.png

Important considerations:
- Make sure your website is deployed and accessible publicly
- The logo file must be accessible at the URL you specify
- Test by sending a test email to verify the logo appears correctly
`;
  
  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopied(identifier);
    setTimeout(() => setCopied(null), 2000);
  };
  
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([templateExample], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = 'emailjs_template.html';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center mb-4">
        <AlertCircleIcon className="h-6 w-6 text-yellow-500 mr-2" />
        <h3 className="text-xl font-bold text-gray-900">EmailJS Setup Required</h3>
      </div>
      
      <p className="text-gray-700 mb-6">
        To enable the contact form functionality, you need to set up EmailJS with your own account credentials.
        Follow these steps to get your form working:
      </p>
      
      <div className="space-y-4 mb-6">
        {steps.map((step) => (
          <div key={step.id} className="flex items-start">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#003366] flex items-center justify-center text-white font-bold mr-3">
              {step.id}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{step.title}</h4>
              <p className="text-gray-600 text-sm mb-2">{step.description}</p>
              <a 
                href={step.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-[#FF6600] hover:text-[#e55a00]"
              >
                {step.action}
                <ExternalLinkIcon className="h-4 w-4 ml-1" />
              </a>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <ImageIcon className="h-5 w-5 mr-2" />
          Adding Your Logo to Emails
        </h4>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800 text-sm">
            <strong>Good news:</strong> You already have a logo file in your project! 
            The logo is located at <code className="bg-blue-100 px-1 rounded">public/logo.png</code>.
          </p>
        </div>
        <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto mb-3">
{`<!-- Company Logo -->
<img src="https://your-domain.com/logo.png" alt="Zamto Africa Logo" width="150" style="display: block; margin: 0 auto 15px auto;" />`}
        </pre>
        <div className="bg-gray-50 p-4 rounded-lg text-sm">
          <h5 className="font-semibold text-gray-900 mb-2">How to use your logo:</h5>
          <ol className="list-decimal pl-5 space-y-1 text-gray-700">
            <li>Deploy your website to a public domain (e.g., zamtoafrica.com)</li>
            <li>Replace <code className="bg-gray-200 px-1 rounded">https://your-domain.com/logo.png</code> with your actual domain</li>
            <li>Test by sending a test email to verify the logo appears correctly</li>
          </ol>
        </div>
      </div>
      
      <div className="border-t pt-6 mt-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <FileTextIcon className="h-5 w-5 mr-2" />
          EmailJS Template Content (Gmail Compatible)
        </h4>
        <p className="text-gray-600 text-sm mb-3">
          Copy and paste this HTML content into your EmailJS template. This template is designed to display properly in Gmail and other email clients:
        </p>
        <div className="relative">
          <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto max-h-60">
            {templateExample}
          </pre>
          <div className="flex space-x-2 absolute top-2 right-2">
            <button
              onClick={handleDownload}
              className="p-2 bg-white rounded-md shadow-sm hover:bg-gray-100"
              title="Download template"
            >
              <DownloadIcon className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={() => handleCopy(templateExample, 'template')}
              className="p-2 bg-white rounded-md shadow-sm hover:bg-gray-100"
              title="Copy to clipboard"
            >
              <CopyIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          {copied === 'template' && (
            <div className="absolute top-2 right-24 bg-gray-800 text-white text-xs px-2 py-1 rounded">
              Copied!
            </div>
          )}
        </div>
        <p className="text-gray-600 text-sm mt-2">
          <strong>Important:</strong> The parameter names must exactly match those shown above:
          <code className="bg-gray-100 px-1 rounded ml-1">from_name</code>, 
          <code className="bg-gray-100 px-1 rounded ml-1">from_email</code>, 
          <code className="bg-gray-100 px-1 rounded ml-1">phone</code>, 
          <code className="bg-gray-100 px-1 rounded ml-1">service_type</code>, 
          <code className="bg-gray-100 px-1 rounded ml-1">vehicle_preference</code>, and
          <code className="bg-gray-100 px-1 rounded ml-1">message</code>.
        </p>
      </div>
      
      <div className="border-t pt-6 mt-6">
        <h4 className="font-semibold text-gray-900 mb-3">Expected Template Parameters</h4>
        <p className="text-gray-600 text-sm mb-3">
          Here's what the data looks like when sent from the form:
        </p>
        <div className="relative">
          <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
{templateParams}
          </pre>
          <button
            onClick={() => handleCopy(templateParams, 'params')}
            className="absolute top-2 right-2 p-2 bg-white rounded-md shadow-sm hover:bg-gray-100"
            title="Copy to clipboard"
          >
            <CopyIcon className="h-4 w-4 text-gray-600" />
          </button>
          {copied === 'params' && (
            <div className="absolute top-2 right-12 bg-gray-800 text-white text-xs px-2 py-1 rounded">
              Copied!
            </div>
          )}
        </div>
      </div>
      
      <div className="border-t pt-6 mt-6">
        <h4 className="font-semibold text-gray-900 mb-3">Update Configuration</h4>
        <p className="text-gray-600 text-sm mb-3">
          Once you have your EmailJS credentials, update the configuration in <code className="bg-gray-100 px-1 rounded">src/pages/Contact.tsx</code>:
        </p>
        <div className="relative">
          <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
{`// EmailJS Configuration
const EMAILJS_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID',
  templateId: 'YOUR_TEMPLATE_ID',
  publicKey: 'YOUR_PUBLIC_KEY'
};`}
          </pre>
          <button
            onClick={() => handleCopy(`const EMAILJS_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID',
  templateId: 'YOUR_TEMPLATE_ID',
  publicKey: 'YOUR_PUBLIC_KEY'
};`, 'config')}
            className="absolute top-2 right-2 p-2 bg-white rounded-md shadow-sm hover:bg-gray-100"
            title="Copy to clipboard"
          >
            <CopyIcon className="h-4 w-4 text-gray-600" />
          </button>
          {copied === 'config' && (
            <div className="absolute top-2 right-12 bg-gray-800 text-white text-xs px-2 py-1 rounded">
              Copied!
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex items-start">
          <AlertCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800">Need Help?</h4>
            <p className="text-blue-700 text-sm mt-1">
              If you need assistance setting up EmailJS, contact us at{' '}
              <a href="mailto:zamtoafrica@gmail.com" className="underline hover:text-blue-900">
                zamtoafrica@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}