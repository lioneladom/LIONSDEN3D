import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LionLogo } from './LionLogo';
import { Lock, Mail, Shield, User, X } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, switchUserRole } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email, 'CUSTOMER');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsAuthModalOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-brand-surface border border-brand-border rounded-2xl p-6 sm:p-8 shadow-2xl z-10 animate-slide-up space-y-6">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-brand-card text-brand-textMuted hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo & Heading */}
        <div className="text-center space-y-2">
          <div className="inline-block">
            <LionLogo size="lg" />
          </div>
          <h2 className="text-xl font-bold font-display tracking-tight text-white pt-2">
            {tab === 'login' ? 'Access Your 3D Studio Account' : 'Create Customer Account'}
          </h2>
          <p className="text-xs text-brand-textDim">
            Save models, track real-time printer telemetry, and manage quotes.
          </p>
        </div>

        {/* 1-Click Quick Demo Switcher */}
        <div className="p-3.5 rounded-xl bg-brand-card border border-brand-red/30 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-brand-textMuted">
            <span className="text-brand-redBright font-semibold flex items-center gap-1">
              ⚡ Quick Demo Switcher:
            </span>
            <span>Instant Role Access</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                switchUserRole('CUSTOMER');
                setIsAuthModalOpen(false);
              }}
              className="px-3 py-2 rounded-lg bg-brand-surface border border-brand-border hover:border-brand-red/50 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-brand-red">
                <User className="w-3.5 h-3.5 text-brand-red" />
                <span>Kwame Mensah</span>
              </div>
              <div className="text-[10px] font-mono text-brand-textDim">Customer Account</div>
            </button>

            <button
              type="button"
              onClick={() => {
                switchUserRole('ADMIN');
                setIsAuthModalOpen(false);
              }}
              className="px-3 py-2 rounded-lg bg-brand-surface border border-brand-border hover:border-brand-red/50 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-brand-red">
                <Shield className="w-3.5 h-3.5 text-brand-red" />
                <span>Chief Engineer</span>
              </div>
              <div className="text-[10px] font-mono text-brand-textDim">Shop Owner Admin</div>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-brand-card rounded-lg border border-brand-border text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`py-2 rounded-md transition-colors ${
              tab === 'login' ? 'bg-brand-red text-white' : 'text-brand-textDim hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`py-2 rounded-md transition-colors ${
              tab === 'register' ? 'bg-brand-red text-white' : 'text-brand-textDim hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-brand-textMuted">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-brand-textDim" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kwame Mensah"
                  className="w-full bg-brand-card border border-brand-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red font-sans"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-brand-textMuted">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-brand-textDim" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-brand-card border border-brand-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red font-sans"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-brand-textMuted">Password</label>
              {tab === 'login' && (
                <a href="#forgot" className="text-[11px] text-brand-red hover:underline">
                  Forgot Password?
                </a>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-brand-textDim" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-card border border-brand-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-brand-red hover:bg-brand-redBright text-white font-display font-bold text-xs uppercase tracking-wider shadow-red-glow transition-all"
          >
            {tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
