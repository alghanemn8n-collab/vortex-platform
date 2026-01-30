import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import VortexLogo from './VortexLogo';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="navbar-logo">
        <VortexLogo size={36} />
        <span style={{ marginRight: '10px' }}>VORTEX</span>
      </Link>

      <div className="menu-toggle" onClick={toggleMenu}>
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </div>

      <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
        <li><Link to="/" className="nav-link">الرئيسية</Link></li>
        <li><Link to="/solutions" className="nav-link">مختبر الابتكار</Link></li>
        <li><Link to="/agents" className="nav-link">وكلاء فورتكس</Link></li>
        <li><Link to="/image-generator" className="nav-link">مولد الصور AI</Link></li>
        <li><Link to="/about" className="nav-link">فلسفة العمل</Link></li>
        <li><Link to="/contact" className="nav-link">تواصل معنا</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
