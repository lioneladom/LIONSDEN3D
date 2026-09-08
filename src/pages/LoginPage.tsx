import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LionLogo } from '../components/common/LionLogo';
import { ArrowLeft, Shield, Mail, Lock, User as UserIcon, Loader2, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const LoginPage: React.FC = () => {
  const { activePage, setActivePage, currentUser, logout } = useApp();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Smooth auto-navigation once authenticated
  useEffect(() => {
    if (currentUser && activePage === 'login') {
      const timer = setTimeout(() => {
        setActivePage('dashboard', 'push-down');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentUser, activePage, setActivePage]);

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
        
        if (!data.session) {
          setSuccessMsg('Registration successful! Please check your email to confirm your account.');
          setAuthMode('signin');
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

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
          {currentUser ? (
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 text-center">
              <div className="flex justify-center">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-16 h-16 rounded-full border-2 border-brand-red/50 object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 mx-auto rounded-full bg-brand-red/20 border-2 border-brand-red/40 flex items-center justify-center text-brand-red text-2xl font-bold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  {currentUser.name}
                </div>
                <div className="text-xs text-neutral-400 font-mono mt-0.5">
                  {currentUser.email}
                </div>
              </div>
              <button
                onClick={logout}
                className="mx-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-brand-red/30 text-xs text-red-400 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
              <div className="pt-2 text-xs text-brand-red animate-pulse font-medium">
                Redirecting to your dashboard...
              </div>
            </div>
          ) : (
            /* Signed Out View */
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h1 className="text-xl font-bold font-display tracking-tight text-white">
                  Welcome to the Den
                </h1>
                <p className="text-sm text-neutral-400">
                  {authMode === 'signin' ? 'Sign in to your account' : 'Create a new account'}
                </p>
              </div>

              {/* Tabs */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-900 rounded-xl border border-neutral-800 text-sm font-medium">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setError(null); setSuccessMsg(null); }}
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
                  onClick={() => { setAuthMode('signup'); setError(null); setSuccessMsg(null); }}
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

              <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider ml-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all"
                        placeholder="Lionel Eyram Adom"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all"
                      placeholder="lionel@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 py-3 rounded-xl bg-brand-red hover:bg-red-600 text-sm font-bold text-white shadow-lg shadow-brand-red/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
