import { FooterLink } from '../../types/footerTypes';

const platformLinks : FooterLink[] = [
  { title: "Start Recycling", href: "/start-recycling" },
  { title: "Pick Shop ", href: "/pick-shop" },
  { title: "Wallet", href: "/wallet" },
  { title: "Rewards", href: "/rewards" },
];

const supportLinks : FooterLink[] = [
  { title: "Help Center", href: "/help-center" },
  { title: "Contact Us", href: "/contact-us" },
  { title: "Agent Portal", href: "/agent-portal" },
  { title: "Vendor Program", href: "/vendor-program" },
];

const communityLinks : FooterLink[] = [
  { title: "Blog", href: "/blog" },
  { title: "Impact Stories", href: "/impact-stories" },
  { title: "Sustainability Report", href: "/sustainaibility report" },
  { title: "Carbon Credits", href: "/carbon-credits" },
];  

const Footer = () => {

  function getYear() {
    const date = new Date();
    return date.getFullYear();
  }
  getYear();

  return (
    <footer className="bg-footer-gradient text-white">
      <div className="h-4 bg-[#142f2c]">

      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {/* Dummy Logo Icon */}
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-400">Pick-n-get</h3>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Transforming waste into wealth through Web3 technology. Join the circular economy revolution.
            </p>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-300">125,420kg recycled</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-300">89,340kg CO₂ saved</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Start Recycling
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Pick Shop
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Wallet
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Rewards
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Agent Portal
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Vendor Program
                </a>
              </li>
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Community</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Impact Stories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Sustainability Report
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">
                  Carbon Credits
                </a>
              </li>
            </ul>
          </div>
        </div>

        
      </div>

      {/* Bottom Section */}
        <div className="mt-12 pt-8 flex flex-col lg:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {getYear()}  Pick-n-get • All Rights Reserved • Built for sustainable, tokenized recycling
          </p>

          {/* Badges */}
          <div className="flex gap-3">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
              Carbon Neutral Platform
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full border border-blue-500/30">
              Web3 Verified
            </span>
          </div>
        </div>
    </footer>
  )
}

export default Footer 