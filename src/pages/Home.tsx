import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { products } from '../data/productData';
import { Product } from '../types';
import { FaLeaf, FaHeart, FaGem, FaStar } from 'react-icons/fa';

const Home: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const featuredProducts = products.filter(p => p.featured);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

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
              Our handcrafted pieces celebrate the art of storytelling through thread, creating 
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
            <h2 className="text-4xl font-serif font-bold text-gray-800 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular pieces, carefully selected for their exceptional quality and design
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProductCard product={product} onViewDetails={handleViewDetails} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 inline-flex items-center space-x-2"
            >
              <span>View All Products</span>
            </Link>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah M.',
                text: 'Absolutely beautiful work! The attention to detail is incredible.',
                rating: 5
              },
              {
                name: 'David L.',
                text: 'Perfect custom embroidery for our wedding. Highly recommend!',
                rating: 5
              },
              {
                name: 'Emma R.',
                text: 'Fast shipping and amazing quality. Will definitely order again!',
                rating: 5
              }
            ].map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <div className="flex items-center mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{review.text}"</p>
                <p className="font-semibold text-gray-800">- {review.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Home;