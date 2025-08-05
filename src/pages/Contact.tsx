import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ContactFormData } from '../types';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaInstagram, 
  FaPinterest, 
  FaFacebook,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';

const Contact: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit = (data: ContactFormData) => {
    console.log('Contact form submitted:', data);
    setIsSubmitted(true);
    reset();
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: <FaEnvelope className="text-orange-600" />,
      title: 'Email',
      details: 'efdservices@gmail.com',
      subtitle: 'We respond within 24 hours'
    },
    {
      icon: <FaPhone className="text-orange-600" />,
      title: 'Phone',
      details: '(+233) 543 800 315',
      subtitle: 'Mon-Fri, 9am-6pm GMT'
    },
    {
      icon: <FaMapMarkerAlt className="text-orange-600" />,
      title: 'Address',
      details: 'Community 19, A11 Almond Road',
      subtitle: 'Opposite Beacon College International (Regina Campus)'
    },
    {
      icon: <FaClock className="text-orange-600" />,
      title: 'Hours',
      details: 'Monday - Friday: 9am - 5pm',
      subtitle: 'Weekend consultations available'
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-4"
        >
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Message Sent!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for reaching out! We'll get back to you within 24 hours.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            Send Another Message
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-400 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-serif font-bold mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-light max-w-2xl mx-auto"
          >
            We'd love to hear from you. Get in touch to discuss your embroidery needs or ask any questions
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-800 mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Whether you have questions about our products, need a custom design, or want to 
                discuss a special project, we're here to help. Reach out through any of the 
                methods below, and we'll respond promptly.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="flex items-start space-x-4"
                >
                  <div className="text-2xl mt-1">{info.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{info.title}</h3>
                    <p className="text-gray-700 mb-1">{info.details}</p>
                    <p className="text-sm text-gray-500">{info.subtitle}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-600 text-white rounded-full flex items-center justify-center hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-110"
                >
                  <FaInstagram />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-600 text-white rounded-full flex items-center justify-center hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-110"
                >
                  <FaPinterest />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-600 text-white rounded-full flex items-center justify-center hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-110"
                >
                  <FaFacebook />
                </a>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-lg overflow-hidden">
              <img
                src="https://images.pexels.com/photos/1089455/pexels-photo-1089455.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Studio location"
                className="w-full h-48 object-cover"
              />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-lg"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
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
                    }
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  {...register('subject', { required: 'Subject is required' })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="custom-order">Custom Order</option>
                  <option value="existing-order">Existing Order</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="other">Other</option>
                </select>
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  {...register('message', { required: 'Message is required' })}
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  placeholder="Tell us about your project or ask any questions..."
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
              >
                Send Message
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-4 text-center">
              * Required fields. We typically respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;