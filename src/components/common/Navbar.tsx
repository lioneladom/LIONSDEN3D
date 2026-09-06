import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LionLogo } from './LionLogo';
import {
  Lock,
  Menu,
  Search,
  ShoppingCart,
  User as UserIcon,
  X,
  Clock,
  LayoutDashboard,
  Shield,
  Upload,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    currentUser,
    switchUserRole,
    cartCount,
    setIsSearchModalOpen,
    setIsAuthModalOpen,
    logout,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'configurator', label: '3D Printing' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'materials', label: 'Materials' },
    { id: 'shop', label: 'Shop' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId, 'push-down');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0A0A]/95 backdrop-blur-md border-b border-neutral-900">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="cursor-pointer" onClick={() => handleNavClick('home')}>
            <LionLogo size="md" />
          </div>

          {/* Center Main Nav */}
          {activePage === 'cart' || activePage === 'checkout' ? (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
              <span>Secure Checkout</span>
              <Lock className="w-3.5 h-3.5 text-neutral-500" />
            </div>
          ) : (
            <nav className="hidden md:flex items-center space-x-7">
              {navLinks.map((link) => {
                const isActive = activePage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`text-xs font-semibold tracking-wide transition-colors relative py-1 ${
                      isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-red rounded-full shadow-red-glow" />
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Icons & CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Global Search Button with ⌘K */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-all group"
              title="Search Models, Materials & Orders (Cmd+K / Ctrl+K)"
            >
              <Search className="w-4 h-4 group-hover:text-brand-red transition-colors" />
              <span className="hidden xl:inline text-[11px] text-neutral-500 font-mono">
                Search <kbd className="text-[9px] bg-neutral-800 px-1 py-0.5 rounded text-neutral-400 ml-1">⌘K</kbd>
              </span>
            </button>

            {/* Cart Icon with count */}
            <button
              onClick={() => setActivePage('cart', 'push-down')}
              className="relative text-neutral-400 hover:text-white transition-colors p-1"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-brand-red text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Profile Icon */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="text-neutral-400 hover:text-white transition-colors p-1"
                title="Account"
              >
                <UserIcon className="w-4 h-4" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#121212] border border-neutral-800 shadow-2xl p-2 z-50 animate-slide-up">
                  <div className="px-3 py-2 border-b border-neutral-800 mb-1">
                    <div className="text-xs font-bold text-white">{currentUser?.name || 'My Account'}</div>
                    <div className="text-[10px] text-neutral-500 font-mono truncate">{currentUser?.email || 'Active Session'}</div>
                  </div>

                  <button
                    onClick={() => {
                      setActivePage('dashboard', 'push-down');
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 flex items-center gap-2 transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Customer Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      setActivePage('tracker', 'push-down');
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 flex items-center gap-2 transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Track Order</span>
                  </button>

                  {currentUser?.role === 'ADMIN' && (
                    <button
                      onClick={() => {
                        setActivePage('admin-orders', 'push-down');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-brand-red hover:text-brand-redBright hover:bg-neutral-800 flex items-center gap-2 transition-colors font-semibold"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Admin Fulfillment</span>
                    </button>
                  )}

                  {/* Role Switcher */}
                  <div className="border-t border-neutral-800 mt-1 pt-2 px-3 pb-1">
                    <span className="text-[10px] text-neutral-500 block mb-1 font-mono uppercase">Role:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          switchUserRole('CUSTOMER');
                          setUserMenuOpen(false);
                        }}
                        className={`flex-1 py-1 rounded text-[10px] font-semibold text-center transition-colors ${
                          currentUser?.role === 'CUSTOMER'
                            ? 'bg-brand-red text-white'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Client
                      </button>
                      <button
                        onClick={() => {
                          switchUserRole('ADMIN');
                          setUserMenuOpen(false);
                        }}
                        className={`flex-1 py-1 rounded text-[10px] font-semibold text-center transition-colors ${
                          currentUser?.role === 'ADMIN'
                            ? 'bg-brand-red text-white'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Admin
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-neutral-800 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-brand-red hover:text-brand-redBright hover:bg-neutral-800/80 transition-colors font-semibold"
                    >
                      Auth & Organizations
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Red "Start a Print" Button */}
            {activePage !== 'configurator' && (
              <button
                onClick={() => setActivePage('configurator', 'push-down')}
                className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-brand-red hover:bg-brand-redBright text-white font-bold text-xs tracking-wider transition-colors shadow-red-glow"
              >
                <span>Start a Print</span>
              </button>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-neutral-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#121212] border-b border-neutral-800 px-4 py-4 space-y-3 animate-slide-up">
          {/* Mobile Search Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIsSearchModalOpen(true);
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-brand-red" />
              <span>Search models, materials, orders...</span>
            </span>
            <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded">
              ⌘K
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                  activePage === link.id
                    ? 'bg-brand-red text-white'
                    : 'text-neutral-400 bg-neutral-900 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
            <button
              onClick={() => {
                setActivePage('dashboard', 'push-down');
                setMobileMenuOpen(false);
              }}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-brand-red" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => {
                setActivePage('configurator', 'push-down');
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-brand-red hover:text-white flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Start a Print</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

