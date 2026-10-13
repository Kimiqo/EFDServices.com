import StitchingHeadline from '../components/StitchingHeadline';
import { contactHeadlineLines } from '../data/headlineGlyphs';
import React from 'react';
import { ArrowUpRight, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import WhatsAppLink from '../components/WhatsAppLink';
import { contactDetails } from '../data/contactDetails';

const Contact: React.FC = () => (
  <div className="studio-contact">
    <section className="design-container contact-intro">
      <p className="eyebrow">A CONVERSATION STARTS SOMETHING SPECIAL</p>
      <StitchingHeadline lines={contactHeadlineLines} />
      <p>Have a logo, a design, or a little inspiration? Reach us on WhatsApp and let’s bring it to life in thread.</p>
    </section>

    <section className="design-container contact-reach-grid" aria-label="Contact EFD Services">
      <div className="whatsapp-contact-card">
        <span className="whatsapp-contact-icon"><FaWhatsapp aria-hidden="true" /></span>
        <p className="eyebrow">LET’S MAKE IT PERSONAL</p>
        <h2>Reach us on WhatsApp.</h2>
        <p>Share your design ideas, send reference photos, or ask about quantities and pricing. We’ll work out the details with you in chat.</p>
        <WhatsAppLink className="whatsapp-number">{contactDetails.phone}</WhatsAppLink>
        <WhatsAppLink className="button button-orange"><FaWhatsapp size={21} aria-hidden="true" /> Chat on WhatsApp <ArrowUpRight size={19} /></WhatsAppLink>
      </div>
      <div className="contact-other-details">
        <p className="eyebrow">A FEW HELPFUL DETAILS</p>
        <div><Mail size={22} aria-hidden="true" /><div><h2>Email us</h2><a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a></div></div>
        <div><Phone size={22} aria-hidden="true" /><div><h2>Give us a call</h2><a href={contactDetails.phoneUrl}>{contactDetails.phone}</a></div></div>
        <div><MapPin size={22} aria-hidden="true" /><div><h2>Find our studio</h2><p>{contactDetails.address}</p><p className="contact-landmark">Opposite Beacon College International (Regina Campus)</p><a href={contactDetails.directionsUrl} target="_blank" rel="noopener noreferrer" className="text-link">Get directions <ArrowRight size={16} /></a></div></div>
        <p className="contact-chat-note">For your embroidery inquiry, a design reference, quantity, and preferred timeline are a great place to start.</p>
      </div>
    </section>

    <section className="design-container contact-map-section" aria-label="EFD Services studio location">
      <div className="section-heading"><div><p className="eyebrow">COME SAY HELLO</p><h2>Find us at <em>EFD Services.</em></h2></div><a href={contactDetails.directionsUrl} target="_blank" rel="noopener noreferrer" className="text-link">Open in Google Maps <ArrowUpRight size={18} /></a></div>
      <div className="contact-map-frame">
        <iframe src={contactDetails.mapEmbedUrl} title="EFD Services location in Lashibi, Community 19, Tema" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
      </div>
      <div className="contact-map-caption"><p><MapPin size={17} aria-hidden="true" /> {contactDetails.address}</p><WhatsAppLink className="text-link">Ask us on WhatsApp <ArrowUpRight size={17} /></WhatsAppLink></div>
    </section>
  </div>
);
export default Contact;
