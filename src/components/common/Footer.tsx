import React from 'react';
import { LionLogo } from './LionLogo';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActivePage } = useApp();

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#181818] text-[#777] pt-14 pb-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#181818]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <LionLogo size="md" />
            <p className="text-xs text-[#777] max-w-sm leading-relaxed">
              Industrial-grade on-demand additive manufacturing. Automated quoting, 20+ production materials, and rapid turnaround for engineers and creators.
            </p>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActivePage('configurator')}
                  className="hover:text-white transition-colors text-left"
                >
                  3D Printing & Quote
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('shop')}
                  className="hover:text-white transition-colors text-left"
                >
                  Precision Shop
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('materials')}
                  className="hover:text-white transition-colors text-left"
                >
                  Engineered Materials
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('how-it-works')}
                  className="hover:text-white transition-colors text-left"
                >
                  How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActivePage('about')}
                  className="hover:text-white transition-colors text-left"
                >
                  About Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('contact')}
                  className="hover:text-white transition-colors text-left"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('faq')}
                  className="hover:text-white transition-colors text-left"
                >
                  Help & FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('dashboard')}
                  className="hover:text-white transition-colors text-left"
                >
                  Customer Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('login')}
                  className="hover:text-white transition-colors text-left text-brand-red font-medium"
                >
                  Customer Sign In
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('admin-login')}
                  className="hover:text-white transition-colors text-left text-neutral-400 hover:text-brand-red font-mono text-[11px]"
                >
                  Admin Staff Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Security
            </h4>
            <div className="space-y-2 text-xs text-[#666]">
              <p>256-bit SSL Encrypted</p>
              <p>Automated 30-Day CAD Deletion</p>
              <p>Strict Non-Disclosure Guarantee</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#555]">
          <div>
            © 2026 Lion’s Den 3D. All rights reserved.
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="px-2 py-0.5 rounded bg-[#121212] border border-[#222] text-neutral-400">MTN MoMo</span>
            <span className="px-2 py-0.5 rounded bg-[#121212] border border-[#222] text-neutral-400">Telecel Cash</span>
            <span className="px-2 py-0.5 rounded bg-[#121212] border border-[#222] text-neutral-400">VISA</span>
            <span className="px-2 py-0.5 rounded bg-[#121212] border border-[#222] text-neutral-400">Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
