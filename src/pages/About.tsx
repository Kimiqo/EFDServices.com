import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Heart, Scissors, Sparkles, Star } from 'lucide-react';
import StitchingHeadline from '../components/StitchingHeadline';
import WhatsAppLink from '../components/WhatsAppLink';
import { storyHeadlineLines } from '../data/headlineGlyphs';
import { testimonials } from '../data/testimonials';
import { contactDetails } from '../data/contactDetails';

const values = [
  { icon: <Scissors />, title: 'Care in the craft', description: 'Considered designs, careful stitching, and a finish that brings your idea to life.' },
  { icon: <Sparkles />, title: 'Details with personality', description: 'Your colors, your logo, your identity. The little things that make a piece yours.' },
  { icon: <Heart />, title: 'A personal conversation', description: 'From your first reference photo to the final details, we work through your ideas with you.' },
];

const About: React.FC = () => (
  <div className="studio-story">
    <section className="design-container story-hero">
      <div>
        <p className="eyebrow">GET TO KNOW EFD SERVICES</p>
        <StitchingHeadline lines={storyHeadlineLines} />
        <p className="story-hero-description">We bring a personal touch to the things you wear, share, and carry. A name, a crest, a logo—each one has a story worth stitching.</p>
        <WhatsAppLink className="button button-orange">Let’s talk about your idea <ArrowUpRight size={19} /></WhatsAppLink>
      </div>
      <figure className="story-hero-photo">
        <img src="/45.jpeg" alt="Detailed custom embroidered Tema West Municipal Assembly badge by EFD Services" />
        <figcaption><span className="eyebrow">OUR OWN WORK, UP CLOSE</span><span>The details tell the story.</span></figcaption>
      </figure>
    </section>

    <section className="story-introduction">
      <div className="design-container story-introduction-grid">
        <div><p className="eyebrow">A LITTLE THREAD. A LOT OF PURPOSE.</p><h2>Something familiar.<br /><em>Something uniquely you.</em></h2></div>
        <div className="story-copy"><p>At EFD Services, embroidery is a way to make an everyday piece feel personal. A school crest brings a uniform together. A business logo gives a team its identity. A name turns a simple bag into someone’s own.</p><p>Based in Lashibi, Community 19, we create embroidery for apparel, caps, school pieces, and bags. We start with your idea and work with you on the details that make it stand out.</p><Link to="/gallery" className="text-link">Take a look at our work <ArrowRight size={18} /></Link></div>
      </div>
    </section>

    <section className="design-container design-section story-values">
      <div className="section-heading"><div><p className="eyebrow">WHAT GOES INTO EVERY PIECE</p><h2>Made with care.<br /><em>Made with you in mind.</em></h2></div></div>
      <div className="story-value-grid">{values.map((value, index) => <article className="story-value-card" key={value.title}><div><span className="promise-icon">{value.icon}</span><span className="eyebrow">0{index + 1}</span></div><h3>{value.title}</h3><p>{value.description}</p></article>)}</div>
    </section>

    <section className="design-container story-work-grid">
      <figure><img src="/29.jpeg" alt="Blue cap embroidered with a company logo by EFD Services" loading="lazy" /><figcaption><span className="eyebrow">FOR A BRAND WITH A STORY</span><h3>A little more identity.</h3></figcaption></figure>
      <figure><img src="/35.jpeg" alt="Custom school homework bags embroidered with school names and crests" loading="lazy" /><figcaption><span className="eyebrow">FOR THE EVERYDAY DETAILS</span><h3>A little more personality.</h3></figcaption></figure>
    </section>

    {testimonials.length > 0 && <section className="reviews-section"><div className="design-container"><div className="section-heading"><div><p className="eyebrow">WORDS FROM OUR CUSTOMERS</p><h2>A little love for <em>our work.</em></h2></div></div><div className="review-grid">{testimonials.slice(0, 3).map(review => <figure className="review-card" key={review.id}><div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: Math.max(0, Math.min(5, review.rating)) }, (_, index) => <Star size={15} fill="currentColor" key={index} />)}</div><blockquote>“{review.text}”</blockquote><figcaption><span className="review-avatar">{review.name.slice(0, 1)}</span><span>{review.name}<small>{review.location}</small></span></figcaption></figure>)}</div></div></section>}

    <section className="design-container final-cta"><div><p className="eyebrow">LET’S WRITE THE NEXT CHAPTER</p><h2>Your idea.<br /><em>Our next piece.</em></h2></div><div><p>Send us your inspiration on WhatsApp.<br />We’ll work out the details together.</p><WhatsAppLink className="button button-orange">Reach us on WhatsApp <ArrowUpRight size={19} /></WhatsAppLink><a href={contactDetails.directionsUrl} target="_blank" rel="noopener noreferrer" className="cta-contact">Come find us in Lashibi <ArrowRight size={15} /></a></div><span className="cta-star" aria-hidden="true">✳︎</span></section>
  </div>
);
export default About;
