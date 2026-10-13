import WhatsAppLink from '../components/WhatsAppLink';
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Heart, Sparkles, Scissors, Star } from 'lucide-react';
import HeroCarousel from '../components/HeroCarousel';
import { galleryItems } from '../data/galleryData';
import { testimonials } from '../data/testimonials';

const Home: React.FC = () => {
  const featured = ['9', '11', '14', '8'].map(id => galleryItems.find(item => item.id === id)).filter(item => item !== undefined);
  const categoryNames: Record<string, string> = { apparel: 'Apparel', caps: 'Caps & branding', custom: 'Custom embroidery', 'bibs/hwBags': 'Bibs & bags' };
  return (
    <div className="studio-home">
      <HeroCarousel />
      <div className="craft-strip"><div className="design-container"><span>For brands with a story</span><span aria-hidden="true">✳︎</span><span>For schools with spirit</span><span aria-hidden="true">✳︎</span><span>For something uniquely yours</span></div></div>
      <section className="design-section design-container" id="our-work">
        <div className="section-heading"><div><p className="eyebrow">THE EFD COLLECTION</p><h2>Small details.<br /><em>Lasting impressions.</em></h2></div><div className="section-heading-aside"><p>A few of the pieces we’ve brought to life. Find a little inspiration for your own.</p><Link to="/gallery" className="text-link">View the full gallery <ArrowUpRight size={18} /></Link></div></div>
        <div className="collection-grid">
          {featured.map((item, index) => <Link to={`/gallery?category=${encodeURIComponent(item.category)}`} key={item.id} className="collection-card"><div className="collection-photo"><img src={`/${item.image}`} alt={item.title} loading="lazy" /><span className="photo-index">0{index + 1}</span><span className="photo-arrow"><ArrowUpRight size={21} /></span></div><div className="collection-caption"><div><p className="eyebrow">{categoryNames[item.category]}</p><h3>{item.category === 'caps' ? 'Wear your brand.' : item.category === 'bibs/hwBags' ? 'Everyday, made personal.' : index === 0 ? 'Your logo, in thread.' : 'School spirit, stitched in.'}</h3></div></div></Link>)}
        </div>
      </section>
      <section className="studio-promise"><div className="design-container promise-grid"><div className="promise-intro"><p className="eyebrow">MORE THAN A FINISHING TOUCH</p><h2>Made with care.<br /><em>Made for you.</em></h2><p>We turn a name, a logo, or a simple idea into something you’ll be proud to wear, share, and keep.</p><Link to="/about" className="text-link">Get to know EFD <ArrowRight size={18} /></Link></div><div className="promise-list">{[{ icon: <Scissors />, title: 'Your idea, our craft', text: 'A personal design, a school crest, or your business logo. We help bring it to life in thread.' }, { icon: <Sparkles />, title: 'Details worth a closer look', text: 'Careful stitching and a considered finish, with attention to the things that make your piece special.' }, { icon: <Heart />, title: 'A personal touch, always', text: 'Talk to us about your colors, your style, and your vision. We’ll work with you on the details.' }].map((item, index) => <div className="promise-item" key={item.title}><span className="promise-icon">{item.icon}</span><div><span className="promise-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></div></div>)}</div></div></section>
      <section className="design-section design-container"><div className="section-heading"><div><p className="eyebrow">FROM IDEA TO EMBROIDERY</p><h2>Let’s make it <em>yours.</em></h2></div><WhatsAppLink className="text-link">Tell us your idea <ArrowUpRight size={18} /></WhatsAppLink></div><div className="process-grid">{[{ title: 'Share your vision', text: 'Send us your logo, inspiration, or a description of what you have in mind.' }, { title: 'Work out the details', text: 'We’ll discuss your design, materials, quantities, and quote with you.' }, { title: 'Bring it to life', text: 'Once the details are agreed, we get to work on your custom embroidery.' }].map((step, index) => <div className="process-step" key={step.title}><span>0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}</div></section>
      {testimonials.length > 0 && <section className="reviews-section"><div className="design-container"><div className="section-heading"><div><p className="eyebrow">WORDS FROM OUR CUSTOMERS</p><h2>A little love for <em>our work.</em></h2></div></div><div className="review-grid">{testimonials.slice(0, 3).map(review => <figure className="review-card" key={review.id}><div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: Math.max(0, Math.min(5, review.rating)) }, (_, index) => <Star size={15} fill="currentColor" key={index} />)}</div><blockquote>“{review.text}”</blockquote><figcaption><span className="review-avatar">{review.name.slice(0, 1)}</span><span>{review.name}<small>{review.location}</small></span></figcaption></figure>)}</div></div></section>}
      <section className="design-container final-cta"><div><p className="eyebrow">SOMETHING SPECIAL STARTS HERE</p><h2>Have an idea?<br /><em>Let’s put a stitch in it.</em></h2></div><div><p>Your next piece deserves a personal touch.<br />Tell us what you’re imagining.</p><WhatsAppLink className="button button-orange">Reach us on WhatsApp <ArrowUpRight size={19} /></WhatsAppLink><Link to="/contact" className="cta-contact">Have a question? Get in touch <ArrowRight size={15} /></Link></div><span className="cta-star" aria-hidden="true">✳︎</span></section>
    </div>
  );
};
export default Home;
