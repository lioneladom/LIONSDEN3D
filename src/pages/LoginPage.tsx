import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LionLogo } from '../components/common/LionLogo';
import { ArrowLeft, CheckCircle2, Shield, Sparkles, User } from 'lucide-react';
import { SignIn, SignUp, SignedIn, UserButton, OrganizationSwitcher, useUser } from '@clerk/clerk-react';

export const LoginPage: React.FC = () => {
  const { setActivePage, switchUserRole } = useApp();
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'demo'>('signin');
  const { user: clerkUser } = useUser();

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#0A0A0A]">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Side: Brand Value & Features */}
        <div className="lg:col-span-5 space-y-6 text-left hidden lg:block">
          <button
            onClick={() => setActivePage('home', 'push-down')}
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-brand-red" />
            <span>Return to Store</span>
          </button>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/10 border border-brand-red/30 text-brand-red text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lion&apos;s Den 3D Platform</span>
            </div>
            <h1 className="text-3xl font-display font-extrabold text-white tracking-tight leading-tight">
              Industrial Grade 3D Printing at Your Fingertips.
            </h1>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Sign in with your username or company organization to upload CAD models, track real-time printer telemetry, and order custom prints.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              'Real-time automated STL slicer & pricing engine',
              'Multi-tenant team & organization order sharing',
              'Sub-second order tracking & live printer telemetry',
              'Carbon fiber, PETG, ASA, and engineering resin options',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-brand-red shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs">
            <span className="text-neutral-500">Need staff control center?</span>
            <button
              onClick={() => setActivePage('admin-login', 'push-down')}
              className="text-brand-red hover:text-brand-redBright font-mono font-semibold flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Staff Portal &rarr;</span>
            </button>
          </div>
        </div>

        {/* Right Side: Auth Box */}
        <div className="lg:col-span-7 max-w-md mx-auto w-full">
          <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-block cursor-pointer" onClick={() => setActivePage('home')}>
                <LionLogo size="lg" />
              </div>
              <h2 className="text-xl font-bold font-display text-white">
                {authMode === 'signin' ? 'Sign In to Your Account' : authMode === 'signup' ? 'Create Your Account' : 'Instant Demo Access'}
              </h2>
              <p className="text-xs text-neutral-400">
                Use your username, email, or team credentials to continue.
              </p>
            </div>

            {/* Signed In View */}
            <SignedIn>
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4 text-center">
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
                    className="flex-1 py-2.5 rounded-lg bg-brand-red hover:bg-brand-redBright text-white text-xs font-bold font-display uppercase tracking-wider transition-all"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => setActivePage('home', 'push-down')}
                    className="px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors"
                  >
                    Store
                  </button>
                </div>
              </div>
            </SignedIn>

            {/* Tabs */}
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

            {/* Sign In Component */}
            {authMode === 'signin' && (
              <div className="flex justify-center">
                <SignIn routing="hash" afterSignInUrl="/" signUpUrl="#sign-up" />
              </div>
            )}

            {/* Sign Up Component */}
            {authMode === 'signup' && (
              <div className="flex justify-center">
                <SignUp routing="hash" afterSignUpUrl="/" signInUrl="#sign-in" />
              </div>
            )}

            {/* Demo Switcher */}
            {authMode === 'demo' && (
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
                <div className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1">
                  <span>⚡ Instant 1-Click Role Testing</span>
                </div>
                <p className="text-xs text-neutral-400">
                  Select a preconfigured profile to test the application immediately without entering credentials.
                </p>

                <div className="grid grid-cols-1 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      switchUserRole('CUSTOMER');
                      setActivePage('dashboard', 'push-down');
                    }}
                    className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-brand-red/60 text-left transition-all group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
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
                    className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-brand-red/60 text-left transition-all group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-brand-red" />
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-brand-red">Chief Engineer Kofi</div>
                        <div className="text-[10px] text-neutral-500 font-mono">Shop Owner Admin</div>
                      </div>
                    </div>
                    <span className="text-xs text-neutral-400 group-hover:text-white">&rarr;</span>
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Link to Admin */}
            <div className="lg:hidden text-center pt-2 text-xs">
              <button
                onClick={() => setActivePage('admin-login', 'push-down')}
                className="text-neutral-400 hover:text-brand-red flex items-center justify-center gap-1.5 mx-auto"
              >
                <Shield className="w-3.5 h-3.5 text-brand-red" />
                <span>Admin Staff Portal</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
