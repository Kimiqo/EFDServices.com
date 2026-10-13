import WhatsAppLink from './WhatsAppLink';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Our work', path: '/gallery' },
  { name: 'Our story', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setIsOpen(false); toggleRef.current?.focus(); }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="header-inner design-container">
        <Link to="/" className="brand" aria-label="EFD Services home">
          <span className="brand-mark">E<span>.</span></span>
          <span className="brand-name">EFD Services<small>THE ART OF EMBROIDERY</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map(item => (
            <Link key={item.path} to={item.path} aria-current={location.pathname === item.path ? 'page' : undefined}>
              {item.name}
            </Link>
          ))}
        </nav>
        <WhatsAppLink className="button button-orange header-cta">WhatsApp us <ArrowUpRight size={17} /></WhatsAppLink>
        <button ref={toggleRef} type="button" className="menu-toggle" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={isOpen} aria-controls="mobile-navigation">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
      {isOpen && (
        <nav id="mobile-navigation" className="mobile-nav design-container" aria-label="Mobile navigation">
          {navItems.map(item => <Link key={item.path} to={item.path} aria-current={location.pathname === item.path ? 'page' : undefined}>{item.name}</Link>)}
          <WhatsAppLink className="button button-orange">Reach us on WhatsApp <ArrowUpRight size={18} /></WhatsAppLink>
        </nav>
      )}
    </header>
  );
};
export default Navbar;
