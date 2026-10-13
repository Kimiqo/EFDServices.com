import StitchingHeadline from '../components/StitchingHeadline';
import { galleryHeadlineLines, galleryMobileHeadlineLines } from '../data/headlineGlyphs';
import WhatsAppLink from '../components/WhatsAppLink';
import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpRight, X, Plus } from 'lucide-react';
import { galleryItems } from '../data/galleryData';
import { GalleryItem } from '../types';

const categories = [
  { id: 'all', name: 'All work' },
  { id: 'apparel', name: 'Apparel' },
  { id: 'caps', name: 'Caps' },
  { id: 'custom', name: 'Custom pieces' },
  { id: 'bibs/hwBags', name: 'Bibs & bags' },
];
const Gallery: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const requestedCategory = params.get('category') || 'all';
  const selectedCategory = categories.some(category => category.id === requestedCategory) ? requestedCategory : 'all';
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const filteredItems = selectedCategory === 'all' ? galleryItems : galleryItems.filter(item => item.category === selectedCategory);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!selectedItem) { dialog?.close(); return; }
    dialog?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [selectedItem]);

  return (
    <div className="studio-gallery">
      <section className="gallery-intro design-container"><p className="eyebrow">THE EFD PORTFOLIO</p><StitchingHeadline lines={galleryHeadlineLines} mobileLines={galleryMobileHeadlineLines} /><div className="gallery-intro-bottom"><p>Real embroidery, made for real people. Take a closer look at the details and imagine what we could create for you.</p><WhatsAppLink className="text-link">Chat about your idea <ArrowUpRight size={18} /></WhatsAppLink></div></section>
      <section className="design-container gallery-section" aria-label="Embroidery portfolio">
        <div className="gallery-toolbar"><div className="gallery-filters" aria-label="Filter work by category">{categories.map(category => <button key={category.id} type="button" aria-pressed={category.id === selectedCategory} onClick={() => { const next = new URLSearchParams(params); if (category.id === 'all') next.delete('category'); else next.set('category', category.id); setParams(next); }}>{category.name}</button>)}</div><span className="gallery-count" aria-live="polite">{filteredItems.length} {filteredItems.length === 1 ? 'piece' : 'pieces'}</span></div>
        <div className="portfolio-grid">{filteredItems.map(item => <button type="button" className="portfolio-card" key={item.id} onClick={() => setSelectedItem(item)} aria-label={`View ${item.title}`}><div className="portfolio-photo"><img src={`/${item.image.replace(/^\//, '')}`} alt={item.title} loading="lazy" /><span className="photo-arrow"><Plus size={21} /></span></div><div className="portfolio-caption"><p className="eyebrow">{categories.find(category => category.id === item.category)?.name}</p><h2>{item.title}</h2><p>{item.description}</p></div></button>)}</div>
        {filteredItems.length === 0 && <p className="gallery-empty">New pieces are on the way. Explore another category or tell us your idea.</p>}
      </section>
      <section className="design-container gallery-cta"><h2>Inspired? <em>Make it personal.</em></h2><WhatsAppLink className="button button-orange">Chat on WhatsApp <ArrowUpRight size={18} /></WhatsAppLink></section>
      <dialog ref={dialogRef} className="portfolio-dialog" aria-labelledby="piece-title" onCancel={() => setSelectedItem(null)} onClick={event => { if (event.target === event.currentTarget) setSelectedItem(null); }}>
        {selectedItem && <div className="piece-detail"><button type="button" className="dialog-close" onClick={() => setSelectedItem(null)} aria-label="Close piece details" autoFocus><X size={21} /></button><div className="piece-photo"><img src={`/${selectedItem.image.replace(/^\//, '')}`} alt={selectedItem.title} /></div><div className="piece-copy"><p className="eyebrow">{categories.find(category => category.id === selectedItem.category)?.name}</p><h2 id="piece-title">{selectedItem.title}</h2><p>{selectedItem.description}</p><div className="piece-note">Love this style? Tell us how you’d like to make it your own.</div><WhatsAppLink className="button button-orange" onClick={() => setSelectedItem(null)}>Discuss this on WhatsApp <ArrowUpRight size={18} /></WhatsAppLink></div></div>}
      </dialog>
    </div>
  );
};
export default Gallery;
