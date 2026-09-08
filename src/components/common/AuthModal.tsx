import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LionLogo } from './LionLogo';
import { X, LogOut, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, currentUser, logout } = useApp();
  
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(() => {
    return window.location.hash.includes('sign-up') ? 'signup' : 'signin';
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (authMode === 'signup') {
        if (!name.trim()) throw new Error('Please enter your full name.');
        
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              username: email.split('@')[0],
              role: 'CUSTOMER',
            }
          }
        });

        if (signUpError) throw signUpError;
        
        if (data.session) {
          // Auto signed in
          setIsAuthModalOpen(false);
        } else {
          // Requires email confirmation
          setSuccessMsg('Registration successful! Please check your email to confirm your account before logging in.');
          setAuthMode('signin');
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) throw signInError;
        setIsAuthModalOpen(false);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

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
            Sign in with your email and password.
          </p>
        </div>

        {/* Signed In State View */}
        {currentUser ? (
          <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                Active Session
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full border border-brand-red/50 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-brand-red/20 border border-brand-red/40 flex items-center justify-center text-brand-red font-bold">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white truncate">
                  {currentUser.name}
                </div>
                <div className="text-xs text-neutral-400 font-mono truncate">
                  {currentUser.email}
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="flex-1 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  setIsAuthModalOpen(false);
                }}
                className="px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-brand-red/30 text-xs text-red-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Signed Out Auth Tabs */
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-900 rounded-xl border border-neutral-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 rounded-lg transition-colors ${
                  authMode === 'signin'
                    ? 'bg-brand-red text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 rounded-lg transition-colors ${
                  authMode === 'signup'
                    ? 'bg-brand-red text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-950/50 border border-brand-red/50 text-xs text-red-200">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-lg bg-green-950/50 border border-green-500/50 text-xs text-green-200">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-3">
              {authMode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 rounded-xl bg-brand-red hover:bg-red-600 text-sm font-bold text-white shadow-lg shadow-brand-red/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {authMode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
