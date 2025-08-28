import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroCarousel from '../components/HeroCarousel';
// ProductModal removed from Home: gallery items are shown instead of shop products
import { galleryItems } from '../data/galleryData';
import { testimonials as siteTestimonials } from '../data/testimonials';
import { FaLeaf, FaHeart, FaGem, FaStar } from 'react-icons/fa';

const Home: React.FC = () => {
  const featuredGallery = galleryItems.slice(0, 6);

  const features = [
    {
      icon: <FaLeaf className="text-green-500" />,
      title: 'Sustainable Materials',
      description: 'We use only eco-friendly, high-quality threads and fabrics'
    },
    {
      icon: <FaHeart className="text-red-500" />,
      title: 'Made with Love',
      description: 'Each piece is carefully handcrafted with passion and attention to detail'
    },
    {
      icon: <FaGem className="text-blue-500" />,
      title: 'Premium Quality',
      description: 'Our embroidery is built to last, using traditional techniques and modern design'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <HeroCarousel />

      {/* Introduction Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-serif font-bold text-gray-800 mb-6">
              Crafting Beauty, One Stitch at a Time
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Welcome to EFD services, where traditional embroidery meets contemporary design. 
              Our embroidered pieces celebrate the art of storytelling through thread, creating 
              unique treasures that reflect your personal style and cherished memories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/gallery"
                className="bg-white text-orange-600 px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 border border-purple-200"
              >
                View Gallery
              </Link>
              <Link
                to="/custom-order"
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Start Custom Order
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-4xl mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">Gallery Highlights</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A selection of our recent gallery work.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGallery.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-white rounded shadow p-4">
                  <div className="h-56 overflow-hidden mb-4">
                    <img src={item.image ? `/${item.image}` : ''} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

  {/* Customer Reviews */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <div className="flex justify-center items-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 text-xl" />
              ))}
              <span className="text-gray-600 ml-2">4.9/5 from 200+ reviews</span>
            </div>
          </motion.div>

          <div className="overflow-x-auto py-4 hide-scrollbar">
            <div className="flex gap-4 px-4">
              {siteTestimonials.map((review, index) => (
                <div key={review.id || index} className="min-w-[300px] bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{review.text}"</p>
                  <p className="font-semibold text-gray-800">- {review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

  {/* ProductModal intentionally removed from Home */}
    </div>
  );
};

export default Home;