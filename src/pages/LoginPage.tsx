import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LionLogo } from '../components/common/LionLogo';
import { ArrowLeft, Shield, Sparkles, User } from 'lucide-react';
import { SignIn, SignUp, SignedIn, UserButton, OrganizationSwitcher, useUser } from '@clerk/clerk-react';

export const LoginPage: React.FC = () => {
  const { setActivePage, switchUserRole } = useApp();
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'demo'>('signin');
  const { user: clerkUser } = useUser();

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-10 px-4 relative overflow-hidden bg-[#0A0A0A]">
      {/* Subtle Crimson Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-brand-red/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-4 animate-slide-up">
        {/* Back Link */}
        <div className="flex items-center justify-between px-1">
          <button
            onClick={() => setActivePage('home', 'push-down')}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-brand-red" />
            <span>Store</span>
          </button>
          <button
            onClick={() => setActivePage('admin-login', 'push-down')}
            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 hover:text-brand-red transition-colors"
          >
            <Shield className="w-3 h-3" />
            <span>Staff Portal</span>
          </button>
        </div>

        {/* Minimal Auth Card */}
        <div className="bg-[#121212] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          {/* Logo */}
          <div className="flex justify-center cursor-pointer" onClick={() => setActivePage('home')}>
            <LionLogo size="lg" />
          </div>

          {/* Signed In View */}
          <SignedIn>
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 text-center">
              <div className="flex justify-center">
                <UserButton afterSignOutUrl="/" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  {clerkUser?.fullName || clerkUser?.username || 'Active Member'}
                </div>
                <div className="text-xs text-neutral-400 font-mono">
                  {clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.username}
                </div>
              </div>

              <div className="flex justify-center py-1">
                <OrganizationSwitcher hidePersonal={false} />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActivePage('dashboard', 'push-down')}
                  className="flex-1 py-2.5 rounded-xl bg-brand-red hover:bg-brand-redBright text-white text-xs font-bold font-display uppercase tracking-wider transition-all"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActivePage('home', 'push-down')}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors"
                >
                  Store
                </button>
              </div>
            </div>
          </SignedIn>

          {/* Minimal Mode Switcher */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-900 rounded-xl border border-neutral-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              className={`py-2 rounded-lg transition-colors ${
                authMode === 'signin' ? 'bg-brand-red text-white shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`py-2 rounded-lg transition-colors ${
                authMode === 'signup' ? 'bg-brand-red text-white shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('demo')}
              className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                authMode === 'demo' ? 'bg-neutral-700 text-white shadow-md' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Demo</span>
            </button>
          </div>

          {/* Minimal Form Embeds */}
          {authMode === 'signin' && (
            <div className="flex justify-center">
              <SignIn routing="hash" afterSignInUrl="/" signUpUrl="#sign-up" />
            </div>
          )}

          {authMode === 'signup' && (
            <div className="flex justify-center">
              <SignUp routing="hash" afterSignUpUrl="/" signInUrl="#sign-in" />
            </div>
          )}

          {/* Minimal Demo Option */}
          {authMode === 'demo' && (
            <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
              <button
                type="button"
                onClick={() => {
                  switchUserRole('CUSTOMER');
                  setActivePage('dashboard', 'push-down');
                }}
                className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-brand-red/60 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-brand-red" />
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-brand-red">Kwame Mensah</div>
                    <div className="text-[10px] text-neutral-500 font-mono">Customer Account</div>
                  </div>
                </div>
                <span className="text-xs text-neutral-400 group-hover:text-white">&rarr;</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  switchUserRole('ADMIN');
                  setActivePage('admin', 'push-down');
                }}
                className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-brand-red/60 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-brand-red" />
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-brand-red">Chief Engineer Kofi</div>
                    <div className="text-[10px] text-neutral-500 font-mono">Shop Owner Admin</div>
                  </div>
                </div>
                <span className="text-xs text-neutral-400 group-hover:text-white">&rarr;</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
