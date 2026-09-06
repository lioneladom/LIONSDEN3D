import React from 'react';
import { useApp } from '../../context/AppContext';
import { LionLogo } from '../../components/common/LionLogo';
import { ArrowLeft, Cpu, KeyRound, Lock, Shield, Sparkles } from 'lucide-react';
import { SignIn, SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';

export const AdminLoginPage: React.FC = () => {
  const { setActivePage, switchUserRole } = useApp();
  const { user: clerkUser } = useUser();

  const handleDemoAdminLogin = () => {
    switchUserRole('ADMIN');
    setActivePage('admin', 'push-down');
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
            <span>Level 3 Clearance</span>
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
              <span>Restricted Terminal</span>
            </div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-white pt-1">
              Chief Engineer Control Portal
            </h1>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Authorized access only. Controls live printer nodes, filament pricing engines, and queue telemetry.
            </p>
          </div>

          {/* Signed In as Admin */}
          <SignedIn>
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 text-center">
              <div className="flex justify-center">
                <UserButton afterSignOutUrl="/admin/login" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  {clerkUser?.fullName || clerkUser?.username || 'Authenticated Staff'}
                </div>
                <div className="text-xs text-neutral-400 font-mono">
                  {clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.username}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    switchUserRole('ADMIN');
                    setActivePage('admin', 'push-down');
                  }}
                  className="flex-1 py-3 rounded-xl bg-brand-red hover:bg-brand-redBright text-white text-xs font-bold font-display uppercase tracking-wider shadow-lg shadow-red-950/40 transition-all"
                >
                  Enter Control Center
                </button>
              </div>
            </div>
          </SignedIn>

          {/* Signed Out: Sign In or 1-Click Chief Engineer Bypass */}
          <SignedOut>
            <div className="space-y-4">
              {/* Clerk Sign In Box */}
              <div className="flex justify-center">
                <SignIn routing="hash" afterSignInUrl="/" />
              </div>

              {/* Instant 1-Click Chief Engineer Testing Bypass */}
              <div className="pt-3 border-t border-neutral-800/80">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2.5">
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Instant Demo Access:</span>
                  </span>
                  <span>1-Click Bypass</span>
                </div>

                <button
                  type="button"
                  onClick={handleDemoAdminLogin}
                  className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-brand-red/40 hover:border-brand-red text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-red/20 border border-brand-red/40 flex items-center justify-center text-brand-red">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-brand-red transition-colors">
                        Chief Engineer Kofi
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        Instant Shop Owner Authorization
                      </div>
                    </div>
                  </div>
                  <KeyRound className="w-4 h-4 text-neutral-500 group-hover:text-brand-red transition-colors" />
                </button>
              </div>
            </div>
          </SignedOut>

          {/* Footer note */}
          <div className="pt-2 text-center text-[11px] text-neutral-500 font-mono flex items-center justify-center gap-2">
            <span>Client customer?</span>
            <button
              onClick={() => setActivePage('login', 'push-down')}
              className="text-neutral-300 hover:text-white underline underline-offset-2"
            >
              Customer Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
