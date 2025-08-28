import React from 'react';
import { Product } from '../types';
import { FaStar, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      viewport={{ once: true, amount: 0.2 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden group cursor-pointer futuristic-accent"
      onClick={() => onViewDetails(product)}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.bestseller && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-400 to-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Bestseller
          </div>
        )}
        {product.featured && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50">
          <FaHeart className="text-gray-400 hover:text-red-500" />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-black">₵ {product.price}</span>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-yellow-400 text-sm" />
            ))}
            <span className="text-gray-500 text-sm ml-1">(4.8)</span>
          </div>
        </div>
        
        <button className="w-full mt-4 bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium">
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;