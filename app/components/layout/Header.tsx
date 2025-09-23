'use client';

import React, { useState, useEffect } from 'react';
import { Leaf, Sun, Moon, Menu, Bell, Wallet, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLayout } from './LayoutProvider';
import { useWallets, WalletType } from '../../hooks/useWallets';
import Link from 'next/link';

interface HeaderProps {
  className?: string;
  showSidebarToggle?: boolean;
}

const Header: React.FC<HeaderProps> = ({ className = '', showSidebarToggle = false }) => {
  const [activeLink, setActiveLink] = useState('Home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const router = useRouter();
  const { toggleSidebar } = useLayout();
  const {
    isAnyWalletConnected,
    getCurrentAccount,
    getConnectedWalletType,
    connectWallet,
    disconnectAllWallets,
    metamask,
    walletConnect
  } = useWallets();

  // Mock data for demo - replace with real data later
  const walletData = {
    balance: '2,450',
    co2Saved: '23.4kg',
    notifications: 2,
    userName: 'User',
    userAvatar: '/api/placeholder/32/32'
  };

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

  const handleConnectWallet = (walletType?: WalletType) => {
    if (walletType) {
      connectWallet(walletType);
      setShowWalletModal(false);
    } else {
      setShowWalletModal(true);
    }
  };

  const handleDisconnectWallet = () => {
    disconnectAllWallets();
  };

  const getDisplayAddress = () => {
    const account = getCurrentAccount();
    if (!account) return '';
    
    // Shorten the address for display
    if (account.length > 10) {
      return `${account.slice(0, 6)}...${account.slice(-4)}`;
    }
    return account;
  };

  const getWalletTypeDisplay = () => {
    const walletType = getConnectedWalletType();
    if (walletType === WalletType.METAMASK) return 'MetaMask';
    if (walletType === WalletType.WALLETCONNECT) return 'WalletConnect';
    return '';
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
      if (showWalletModal && !target.closest('.wallet-modal-container')) {
        setShowWalletModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen, showWalletModal]);

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
                  Pick'n'Get
                </span>
              </div>
            </div>

            {/* Center - Navigation Links */}
            <nav className={`hidden lg:flex gap-1 xl:gap-3 items-center space-x-2`}>
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
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-full hover:bg-white/20 transition-colors duration-200 focus-visible flex-shrink-0"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                )}
              </button>

              {/* Wallet Connected State */}
              {isAnyWalletConnected ? (
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  {/* Token Balance */}
                  <div className="hidden sm:flex items-center gap-1 bg-green-500/20 border border-green-500/30 rounded-lg px-2 py-1 flex-shrink-0">
                    <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                    <span className="text-green-400 text-xs font-medium whitespace-nowrap">
                      {walletData.balance}ECO
                    </span>
                  </div>

                  {/* CO2 Saved */}
                  <div className="hidden lg:flex items-center gap-1 bg-blue-500/20 border border-blue-500/30 rounded-lg px-2 py-1 flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                    <span className="text-blue-400 text-xs font-medium whitespace-nowrap">
                      {walletData.co2Saved}CO₂
                    </span>
                  </div>

                  {/* Notification Bell */}
                  <button className="relative p-1.5 sm:p-2 rounded-full hover:bg-white/20 transition-colors duration-200 flex-shrink-0">
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    {walletData.notifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {walletData.notifications}
                      </span>
                    )}
                  </button>

                  {/* User Profile / Wallet Info */}
                  <div className="relative group">
                    <div className="flex items-center gap-1 sm:gap-2 cursor-pointer hover:bg-white/10 rounded-lg p-1 transition-colors duration-200 flex-shrink-0 max-w-[120px]">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-white" />
                      </div>
                      <div className="hidden sm:block text-left">
                        <div className="text-white text-xs font-medium truncate">
                          {getWalletTypeDisplay()}
                        </div>
                        <div className="text-white/70 text-xs truncate">
                          {getDisplayAddress()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Disconnect Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <button
                        onClick={handleDisconnectWallet}
                        className="w-full flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-lg text-sm transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        Disconnect
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Connect Wallet Button */
                <button 
                  onClick={() => handleConnectWallet()}
                  className="gradient-button font-semibold px-2 sm:px-3 py-1 sm:py-1.5 
                    rounded-lg hover:shadow-lg transition-all duration-200 focus-visible 
                    text-xs sm:text-sm lg:text-base whitespace-nowrap flex-shrink-0"
                >
                  Connect Wallet
                </button>
              )}

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

        {/* Mobile Menu Overlay */}
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

      {/* Wallet Selection Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="wallet-modal-container bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-white text-xl font-semibold mb-4 text-center">Connect Wallet</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleConnectWallet(WalletType.METAMASK)}
                className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 text-white"
              >
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <div className="text-left">
                  <div className="font-medium">MetaMask</div>
                  <div className="text-sm text-white/70">Connect using browser extension</div>
                </div>
              </button>
              
              <button
                onClick={() => handleConnectWallet(WalletType.WALLETCONNECT)}
                className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 text-white"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                <div className="text-left">
                  <div className="font-medium">WalletConnect</div>
                  <div className="text-sm text-white/70">Scan with mobile wallet</div>
                </div>
              </button>
            </div>
            
            <button
              onClick={() => setShowWalletModal(false)}
              className="mt-4 w-full py-2 text-white/70 hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
                {/* Mobile Wallet Info (when connected) */}
                {isAnyWalletConnected && (
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{getWalletTypeDisplay()}</p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-green-400">{walletData.balance}ECO</span>
                          <span className="text-blue-400">{walletData.co2Saved}CO₂</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={handleDisconnectWallet} className="text-red-400 text-xs">
                      Disconnect
                    </button>
                  </div>
                )}

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
    </>
  );
};

export default Header;