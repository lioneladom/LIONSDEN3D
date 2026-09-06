import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LionLogo } from './LionLogo';
import { Shield, User, X, LogOut, Building2, Sparkles } from 'lucide-react';
import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  UserButton,
  OrganizationSwitcher,
  useUser,
  useClerk,
  useOrganization,
} from '@clerk/clerk-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, switchUserRole } = useApp();
  const [authMode, setAuthMode] = useState<'clerk-signin' | 'clerk-signup' | 'demo'>('clerk-signin');
  const { user: clerkUser, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { organization } = useOrganization();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setIsAuthModalOpen(false)}
        className="fixed inset-0 bg-black/85 backdrop-blur-md animate-fade-in"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#0F0F0F] border border-neutral-800 rounded-2xl p-5 sm:p-7 shadow-2xl z-10 animate-slide-up space-y-5 my-8">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo & Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-block">
            <LionLogo size="lg" />
          </div>
          <h2 className="text-lg font-bold font-display tracking-tight text-white pt-1">
            Lion&apos;s Den 3D Authentication
          </h2>
          <p className="text-xs text-neutral-400">
            Sign in with your username, email, or team organization.
          </p>
        </div>

        {/* Signed In State View */}
        <SignedIn>
          <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                Active Session
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>

            <div className="flex items-center gap-3 pt-1">
              {clerkUser?.imageUrl ? (
                <img
                  src={clerkUser.imageUrl}
                  alt={clerkUser.fullName || 'User'}
                  className="w-10 h-10 rounded-full border border-brand-red/50 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-brand-red/20 border border-brand-red/40 flex items-center justify-center text-brand-red font-bold">
                  {clerkUser?.firstName?.[0] || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">
                  {clerkUser?.fullName || clerkUser?.username || 'Authenticated Member'}
                </div>
                <div className="text-xs text-neutral-400 font-mono truncate">
                  {clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.username}
                </div>
              </div>
            </div>

            {/* Organization Switcher if present */}
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-brand-red" />
                <span>Organization:</span>
              </span>
              <OrganizationSwitcher
                hidePersonal={false}
                afterCreateOrganizationUrl="/"
                afterLeaveOrganizationUrl="/"
                afterSelectOrganizationUrl="/"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAuthModalOpen(false);
                }}
                className="flex-1 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  setIsAuthModalOpen(false);
                }}
                className="px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-brand-red/30 text-xs text-red-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </SignedIn>

        {/* Signed Out Auth Tabs */}
        <SignedOut>
          <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-900 rounded-xl border border-neutral-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setAuthMode('clerk-signin')}
              className={`py-2 rounded-lg transition-colors ${
                authMode === 'clerk-signin'
                  ? 'bg-brand-red text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('clerk-signup')}
              className={`py-2 rounded-lg transition-colors ${
                authMode === 'clerk-signup'
                  ? 'bg-brand-red text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('demo')}
              className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                authMode === 'demo'
                  ? 'bg-neutral-700 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Demo</span>
            </button>
          </div>

          {/* Clerk Sign In / Sign Up Forms */}
          {authMode === 'clerk-signin' && (
            <div className="flex justify-center">
              <SignIn
                routing="hash"
                afterSignInUrl="/"
                signUpUrl="#sign-up"
              />
            </div>
          )}

          {authMode === 'clerk-signup' && (
            <div className="flex justify-center">
              <SignUp
                routing="hash"
                afterSignUpUrl="/"
                signInUrl="#sign-in"
              />
            </div>
          )}

          {/* Quick Demo Switcher View */}
          {authMode === 'demo' && (
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  ⚡ 1-Click Instant Demo Role:
                </span>
                <span>Pre-filled</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    switchUserRole('CUSTOMER');
                    setIsAuthModalOpen(false);
                  }}
                  className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-brand-red/60 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-brand-red">
                    <User className="w-3.5 h-3.5 text-brand-red" />
                    <span>Kwame Mensah</span>
                  </div>
                  <div className="text-[11px] font-mono text-neutral-500 pt-0.5">
                    Customer Account
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    switchUserRole('ADMIN');
                    setIsAuthModalOpen(false);
                  }}
                  className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-brand-red/60 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-brand-red">
                    <Shield className="w-3.5 h-3.5 text-brand-red" />
                    <span>Chief Engineer</span>
                  </div>
                  <div className="text-[11px] font-mono text-neutral-500 pt-0.5">
                    Shop Owner Admin
                  </div>
                </button>
              </div>
            </div>
          )}
        </SignedOut>
      </div>
    </div>
  );
};
