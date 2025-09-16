
'use client';

import React, { useState, useEffect } from 'react';
import { Leaf, Sun, Moon, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLayout } from './LayoutProvider';
import Link from 'next/link';

interface HeaderProps {
  className?: string;
  showSidebarToggle?: boolean;
}

const Header: React.FC<HeaderProps> = ({ className = '', showSidebarToggle = false }) => {
  const [activeLink, setActiveLink] = useState('Home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { toggleSidebar } = useLayout();

  const navLinks = [
    'Home',
    'Recycle',
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

    switch (link) {
      case 'Home':
        router.push('/');
        break;
      case 'How It Works':
        router.push('/how-it-works');
        break;
      case 'Features':
        router.push('/features');
        break;
      case 'Shop':
        router.push('/shop');
        break;
      case 'FAQs':
        router.push('/faqs');
        break;
      case 'Contact':
        router.push('/contact');
        break;
      case 'Recycle':
        router.push('/recycle');
        break;
      default:
        router.push('/');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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
      <header className={`header-gradient backdrop-blur-custom relative z-50 ${className}`}>
        <div className="mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            
            {/* Left Section */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Sidebar Toggle (only show when sidebar is enabled) */}
              {showSidebarToggle && (
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-1.5 sm:p-2 text-white hover:bg-white/20 rounded-lg transition-colors duration-200 menu-button"
                  aria-label="Toggle sidebar"
                >
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
              
              {/* Logo */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-500 rounded-lg flex items-center justify-center">

                  <Link href="/" passHref>
                    <Leaf className="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                  </Link>
                </div>
                <span className="text-white text-lg sm:text-xl lg:text-2xl font-semibold font-space-grotesk">
                  Pick-n-get
                </span>
              </div>
            </div>

            {/* Center - Navigation Links (Desktop - always show, but hide on mobile when sidebar is present) */}
            <nav className={`
              hidden lg:flex gap-1 xl:gap-3 items-center space-x-2
              ${showSidebarToggle ? 'lg:flex' : 'lg:flex'}
            `}>
              {navLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => handleLinkClick(link)}
                  className={`
                    nav-link px-2 xl:px-3 py-2 rounded-lg transition-all duration-200 focus-visible text-sm xl:text-base
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

            {/* Right Section */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-full hover:bg-white/20 transition-colors duration-200 focus-visible"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                )}
              </button>

              {/* Connect Wallet Button */}
              <button className="gradient-button font-semibold px-2 sm:px-3 py-1 sm:py-1.5 
                rounded-lg hover:shadow-lg transition-all duration-200 focus-visible 
                text-xs sm:text-sm lg:text-base  whitespace-nowrap"
              >
                Connect Wallet
              </button>

              {/* Mobile Menu Toggle (only show when no sidebar) */}
              {!showSidebarToggle && (
                <button
                  onClick={toggleMobileMenu}
                  className="lg:hidden p-1.5 sm:p-2 focus-visible menu-button"
                  aria-label="Toggle menu"
                >
                  <div className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay (only show when no sidebar) */}
        {!showSidebarToggle && isMobileMenuOpen && (
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

      {/* Mobile Menu (only show when no sidebar) */}
      {!showSidebarToggle && (
        <div className={`
          mobile-menu-container fixed top-14 sm:top-16 left-0 right-0 z-50 lg:hidden
          transform transition-all duration-300 ease-in-out
          ${isMobileMenuOpen 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-full opacity-0 pointer-events-none'
          }
        `}>
          <div className="header-gradient backdrop-blur-custom border-t border-white/10">
            <nav className="max-w-[90vw] mx-auto px-4 py-4">
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
      )}

      {/* Spacer to prevent content overlap */}
      <div className="h-14 sm:h-16 lg:h-20"></div>
    </>
  );
};

export default Header;