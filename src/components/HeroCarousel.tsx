import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { heroImages } from '../data/galleryData';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HeroCarousel: React.FC = () => {
  return (
    <div className="relative h-[600px] overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        effect="fade"
        loop
        className="h-full"
      >
        {heroImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full">
              <img
                src={image}
                alt={`Embroidery showcase ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white max-w-4xl px-4">
                  <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
                    EFD Embroidery Services
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 font-light">
                    Handcrafted embroidery that tells your story
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105">
                      Shop Now
                    </button>
                    <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-white hover:text-gray-800 transition-all duration-200 transform hover:scale-105">
                      Request Custom Design
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroCarousel;