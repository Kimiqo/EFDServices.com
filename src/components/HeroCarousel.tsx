import WhatsAppLink from './WhatsAppLink';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { heroImages } from '../data/heroImages';
import StitchingHeadline from './StitchingHeadline';

const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(heroImages.length > 1 ? 1 : 0);
  const changeImage = (offset: number) => setCurrentIndex(index => (index + offset + heroImages.length) % heroImages.length);

  return (
    <section className="studio-hero">
      <div className="design-container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> MADE PERSONAL. MADE TO STAND OUT.</p>
          <StitchingHeadline />
          <p className="hero-description">From school uniforms to your next big brand idea, we bring your designs to life with embroidery that makes every detail count.</p>
          <div className="hero-actions">
            <WhatsAppLink className="button button-orange">Chat on WhatsApp <ArrowUpRight size={19} /></WhatsAppLink>
            <Link to="/gallery" className="text-link">Explore our work <ArrowRight size={18} /></Link>
          </div>
          <div className="hero-notes"><span><Check size={15} /> Custom designs</span><span><Check size={15} /> Carefully crafted</span><span><Check size={15} /> Made in Ghana</span></div>
          <a className="discover-link" href="#our-work"><span><ArrowDown size={16} /></span> A little inspiration below</a>
        </div>
        <div className="hero-visual">
          <span className="hero-stitch" aria-hidden="true" />
          <div className="craft-label"><span>Every thread.</span><strong>A little more you.</strong><span className="craft-label-star" aria-hidden="true">✳︎</span></div>
          <div className="hero-image-frame">
            {heroImages.length > 0 ? <img src={`/${heroImages[currentIndex].replace(/^\//, '')}`} alt="A custom embroidery project by EFD Services" className="hero-image" fetchPriority="high" /> : <div className="hero-image-empty">Your next idea starts here.</div>}
          </div>
          <div className="hero-image-caption">
            <div><span className="eyebrow">A CLOSER LOOK</span><p>Real pieces. Our own work.</p></div>
            {heroImages.length > 1 && <div className="carousel-controls"><span className="slide-count" aria-live="polite">{String(currentIndex + 1).padStart(2, '0')} / {String(heroImages.length).padStart(2, '0')}</span><button type="button" onClick={() => changeImage(-1)} aria-label="Previous embroidery photo"><ArrowLeft size={18} /></button><button type="button" onClick={() => changeImage(1)} aria-label="Next embroidery photo"><ArrowRight size={18} /></button></div>}
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroCarousel;
