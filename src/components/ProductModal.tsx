import React from 'react';
import { Product } from '../types';
import { FaTimes, FaStar, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
              >
                <FaTimes className="text-gray-600" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                {/* Image */}
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                    {product.bestseller && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Bestseller
                      </div>
                    )}
                  </div>
                  
                  {/* Additional images */}
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((i) => (
                      <img
                        key={i}
                        src={product.image}
                        alt={`${product.name} view ${i}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-transparent hover:border-purple-300 cursor-pointer"
                      />
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-gray-500">(4.8 stars, 24 reviews)</span>
                    </div>
                    <p className="text-4xl font-bold text-black">₵ {product.price}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Details</h3>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Handcrafted with premium materials</li>
                      <li>• Available in multiple sizes</li>
                      <li>• Care instructions included</li>
                      <li>• 30-day return policy</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option>Small</option>
                        <option>Medium</option>
                        <option>Large</option>
                        <option>Extra Large</option>
                      </select>
                    </div>

                    <div className="flex space-x-4">
                      <button className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2">
                        <FaShoppingCart />
                        <span>Add to Cart</span>
                      </button>
                      <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <FaHeart className="text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;