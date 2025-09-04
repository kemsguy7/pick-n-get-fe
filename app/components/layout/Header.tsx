'use client';

import React, { useState, useEffect } from 'react';
import { Leaf, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [activeLink, setActiveLink] = useState('Home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    'Home',
    'How It Works',
    'Features',
    'Shop',
    'FAQs',
    'Contact'
  ];

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    const theme = newTheme ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className={`header-gradient  backdrop-blur-custom relative z-50 ${className}`}>
        <div className="  mx-auto   px-4  ">
          <div className="flex space-x-5 items-center  justify-around h-16 lg:h-20">
            
            {/* Left - Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Leaf className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <span className="text-white text-xl lg:text-2xl font-semibold font-space-grotesk">
                Pick-n-get
              </span>
            </div>

            {/* Center - Navigation Links (Desktop) */}
            <nav className="hidden lg:flex gap-3 items-center space-x-2">
              {navLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => handleLinkClick(link)}
                  className={`
                    nav-link px-2 py-2 rounded-lg transition-all duration-200 focus-visible
                    ${activeLink === link 
                      ? 'active-link text-white' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  {link}
                </button>
              ))}
            </nav>

            {/* Right - Theme Toggle & Connect Wallet */}
            <div className="flex items-center gap-2 ">
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className=" rounded-full hover:bg-white/20 transition-colors duration-200 focus-visible"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-white" />
                ) : (
                  <Moon className="w-5 h-5 text-white" />
                )}
              </button>

              {/* Connect Wallet Button */}
              <button className="gradient-button font-semibold px-2   py-1.5 
                rounded-lg  hover:shadow-lg
                transition-all duration-200 focus-visible text-sm lg:text-base md:font-medium
              ">
                Connect Wallet
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 focus-visible"
                aria-label="Toggle menu"
              >
                <div className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
                  <div className="hamburger-line"></div>
                  <div className="hamburger-line"></div>
                  <div className="hamburger-line"></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden">
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-white"
                aria-label="Close menu"
              >
                <div className="hamburger open">
                  <div className="hamburger-line"></div>
                  <div className="hamburger-line"></div>
                  <div className="hamburger-line"></div>
                </div>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      <div className={`
        mobile-menu-container fixed top-16 left-0 right-0 z-50 lg:hidden
        transform transition-all duration-300 ease-in-out
        ${isMobileMenuOpen 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-full opacity-0 pointer-events-none'
        }
      `}>
        <div className="header-gradient backdrop-blur-custom border-t border-white/10">
          <nav className="max-w-[90vw] mx-auto px-10 ml-0 py-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link, index) => (
                <button
                  key={link}
                  onClick={() => handleLinkClick(link)}
                  className={`
                    nav-link px-4 py-3 rounded-lg text-left transition-all duration-200 
                    transform hover:scale-105 focus-visible
                    ${activeLink === link 
                      ? 'active-link text-white' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                    }
                  `}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  {link}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Spacer to prevent content overlap */}
      <div className="h-16 lg:h-20"></div>
    </>
  );
};

export default Header;