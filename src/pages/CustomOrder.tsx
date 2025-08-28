/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { CustomOrderData } from '../types';
import { FaUpload, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const CustomOrder: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomOrderData>();

  const onSubmit = async (data: CustomOrderData) => {
    try {
      // Common template parameters
      const templateParams = {
        to_email: 'your-email@gmail.com', // Replace with your company's Gmail address
        from_name: data.name,
        reply_to: data.email,
        name: data.name,
        email: data.email,
        number: data.number,
        designDetails: data.designDetails,
        file_name: selectedFile ? selectedFile.name : 'None',
      };

      // Send email to company
      const companyResponse = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_COMPANY_TEMPLATE_ID, // Company template ID
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // Send email to user
      const userResponse = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_USER_TEMPLATE_ID, // User template ID
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      console.log('Company email response:', companyResponse);
      console.log('User email response:', userResponse);
      console.log('Custom order submitted:', data);
      setIsSubmitted(true);
      setSubmissionError(null);
      reset();
      setSelectedFile(null);
      setTimeout(() => setIsSubmitted(false), 7000);
    } catch (error: any) {
      console.error('EmailJS error:', error.text || error);
      setSubmissionError(`Failed to submit order: ${error.text || 'Unknown error'}. Please try again later.`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-4"
        >
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your custom order request. We've received your details and will get back to you 
            within 24 hours with a quote and timeline. A confirmation email has been sent to your email address.
            {selectedFile && (
              <>
                <br />
                Please send your reference image ({selectedFile.name}) to{' '}
                <a
                  href="mailto:your-email@gmail.com"
                  className="text-orange-500 hover:underline"
                >
                  your-email@gmail.com
                </a>{' '}
                or via WhatsApp to your provided number.
              </>
            )}
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            Submit Another Order
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-400 to-red-600 rounding text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-serif font-bold mb-4"
          >
            Custom Orders
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-light max-w-2xl mx-auto"
          >
            Bring your vision to life with personalized embroidery designed just for you
          </motion.p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Process Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-800 mb-6">Our Process</h2>
              <div className="space-y-6">
                {[
                  {
                    step: '1',
                    title: 'Submit Your Request',
                    description: 'Fill out the form with your design ideas and requirements'
                  },
                  {
                    step: '2',
                    title: 'Design Consultation',
                    description: 'We\'ll discuss your vision and provide a detailed quote'
                  },
                  {
                    step: '3',
                    title: 'Creation Process',
                    description: 'Our artisans carefully craft your unique piece'
                  },
                  {
                    step: '4',
                    title: 'Quality Review',
                    description: 'We ensure every detail meets our high standards'
                  },
                  {
                    step: '5',
                    title: 'Delivery',
                    description: 'Your custom embroidery is carefully packaged and shipped'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">What to Expect</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Response within 24 hours</li>
                <li>• Free design consultation</li>
                <li>• Detailed quote with timeline</li>
                <li>• Regular progress updates</li>
                <li>• 100% satisfaction guarantee</li>
              </ul>
            </div>
          </motion.div>

          {/* Order Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Request Custom Design</h2>
            
            {submissionError && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
                <FaExclamationCircle className="mr-2" />
                {submissionError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required', maxLength: { value: 100, message: 'Name must be 100 characters or less' } })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    },
                    maxLength: { value: 100, message: 'Email must be 100 characters or less' }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Preferably WhatsApp Line) *
                </label>
                <input
                  type="tel"
                  {...register('number', { 
                    required: 'Phone number is required',
                    maxLength: { value: 20, message: 'Phone number must be 20 characters or less' }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your phone number"
                />
                {errors.number && (
                  <p className="text-red-500 text-sm mt-1">{errors.number.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Design Details * (max 2000 characters)
                </label>
                <textarea
                  {...register('designDetails', { 
                    required: 'Design details are required',
                    maxLength: { value: 2000, message: 'Design details must be 2000 characters or less' }
                  })}
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Describe your vision in detail. Include colors, size, placement, style preferences, and any specific requirements..."
                />
                {errors.designDetails && (
                  <p className="text-red-500 text-sm mt-1">{errors.designDetails.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Images (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                  <input
                    type="file"
                    {...register('file')}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FaUpload className="text-gray-400 text-3xl mx-auto mb-2" />
                    <p className="text-gray-600">
                      {selectedFile ? selectedFile.name : 'Click to upload reference images'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG. After submission, please send images to your-email@gmail.com or WhatsApp.
                    </p>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-400 to-red-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-500 hover:to-purple-600 transition-all duration-200 transform hover:scale-105"
              >
                Submit Custom Order Request
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-4 text-center">
              * Required fields. We'll respond within 24 hours with a detailed quote.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CustomOrder;