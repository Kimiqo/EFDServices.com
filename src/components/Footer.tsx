import React from 'react';
import { FaInstagram, FaPinterest, FaHeart } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-serif font-bold">EFD Services</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Handcrafted embroidery designs that tell your story. Each piece is carefully created with 
              passion, precision, and attention to detail.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                <FaPinterest size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/gallery" className="text-gray-300 hover:text-white transition-colors">Gallery</a></li>
              <li><a href="/shop" className="text-gray-300 hover:text-white transition-colors">Shop</a></li>
              <li><a href="/custom-order" className="text-gray-300 hover:text-white transition-colors">Custom Orders</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li>efdservices@gmail.com</li>
              <li>(+233) 543 800 315</li>
              <li>Community 19, A11 Almond Road<br /><br /><i>Opposite Beacon College International (Regina Campus)</i></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-orange-600 mt-8 pt-8 text-center">
          <p className="text-gray-300 flex items-center justify-center">
            © 2025 EFD Services. Made with <FaHeart className="text-orange-500 mx-1" /> for embroidery lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;