import { contactDetails } from '../data/contactDetails';
import WhatsAppLink from './WhatsAppLink';
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => (
  <footer className="studio-footer">
    <div className="design-container footer-grid">
      <div><Link to="/" className="brand"><span className="brand-mark">E<span>.</span></span><span className="brand-name">EFD Services<small>THE ART OF EMBROIDERY</small></span></Link><p className="footer-intro">A little thread. A lot of personality.<br />Custom embroidery that tells your story.</p><WhatsAppLink className="footer-order">Make something yours <ArrowUpRight size={17} /></WhatsAppLink></div>
      <div className="footer-links"><h2>Explore</h2><Link to="/gallery">Our work</Link><WhatsAppLink>WhatsApp us</WhatsAppLink><Link to="/about">Our story</Link><Link to="/contact">Contact us</Link></div>
      <div className="footer-contact"><h2>Let’s talk</h2><a href="mailto:efdservices@gmail.com"><Mail size={16} /> efdservices@gmail.com</a><a href={contactDetails.phoneUrl}><Phone size={16} /> {contactDetails.phone}</a><p><MapPin size={17} /><span>Lashibi, Community 19, A11 Almond Road<small>Opposite Beacon College International<br />(Regina Campus)</small></span></p></div>
    </div>
    <div className="design-container footer-bottom"><p>© {new Date().getFullYear()} EFD Services. All rights reserved.</p><span>Made with care, in Ghana.</span></div>
  </footer>
);
export default Footer;
