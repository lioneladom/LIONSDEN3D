import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LionLogo } from '../../components/common/LionLogo';
import { ArrowLeft, Lock, Shield, Mail, Loader2, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const AdminLoginPage: React.FC = () => {
  const { setActivePage, currentUser, logout, switchUserRole } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;
      
      // Assume admin based on email or backend role handling.
      // For immediate preview, we forcefully set role to ADMIN if they sign in here.
      switchUserRole('ADMIN');
      setActivePage('admin', 'push-down');
    } catch (err: any) {
      setError(err.message || 'Access Denied. Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden text-white">
      {/* Stealth Grid & Red Laser Ambience */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 space-y-6 animate-slide-up">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActivePage('home', 'push-down')}
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-brand-red" />
            <span>Customer Store</span>
          </button>
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1">
            <Lock className="w-3 h-3 text-brand-red" />
            <span>Staff Portal</span>
          </span>
        </div>

        {/* Admin Card */}
        <div className="bg-[#0E0E0E] border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Top Edge Red Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent" />

          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <LionLogo size="lg" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-950/60 border border-brand-red/40 text-brand-red text-[11px] font-mono font-bold tracking-wider uppercase">
              <Shield className="w-3 h-3" />
              <span>Staff Clearance</span>
            </div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-white pt-1">
              Chief Engineer Control Portal
            </h1>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Authorized admin access. Live fleet telemetry, queue management, and filament pricing engines.
            </p>
          </div>

          {/* Signed In as Admin */}
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
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    switchUserRole('ADMIN');
                    setActivePage('admin');
                  }}
                  className="w-full py-2.5 rounded-xl bg-brand-red hover:bg-red-600 text-sm font-bold text-white shadow-lg shadow-brand-red/20 transition-all flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Enter Dashboard
                </button>
                <button
                  onClick={logout}
                  className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-sm font-bold text-neutral-300 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            /* Admin Login Form */
            <div className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-red-950/50 border border-brand-red/50 text-xs text-red-200 text-center font-mono">
                  {error}
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider ml-1">
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all font-mono"
                      placeholder="admin@lionsden3d.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider ml-1">
                    Passcode
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all font-mono"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 py-3 rounded-xl bg-brand-red hover:bg-red-600 text-sm font-bold text-white shadow-lg shadow-brand-red/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoading ? 'Authenticating...' : 'Authorize Access'}
                </button>
              </form>
            </div>
          )}
        </div>
        
        {/* Footer info */}
        <p className="text-center text-[10px] font-mono text-neutral-600">
          This system is restricted to Lion's Den 3D engineering staff only.
          <br />Unauthorized access is strictly prohibited and logged.
        </p>
      </div>
    </div>
  );
};
