import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'Safety', path: '/safety' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black tracking-tighter text-gray-900">
          BONDEE
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className={`font-medium transition-colors ${
                location.pathname === item.path 
                  ? 'text-black font-bold' 
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <button className="bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition-transform hover:scale-105 active:scale-95">
          Download App
        </button>
      </div>
    </header>
  );
};
