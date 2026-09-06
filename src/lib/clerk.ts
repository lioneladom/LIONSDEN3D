import { dark } from '@clerk/themes';

export const CLERK_PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  'pk_test_Y2FwaXRhbC1waXJhbmhhLTM4MzIuY2xlcmsuYWNjb3VudHMuZGV2JA';

export const clerkTheme = {
  baseTheme: dark,
  variables: {
    colorPrimary: '#E10600',
    colorBackground: '#0F0F0F',
    colorInputBackground: '#181818',
    colorInputText: '#FFFFFF',
    colorText: '#FFFFFF',
    colorTextSecondary: '#8E8E93',
    borderRadius: '0.75rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  layout: {
    socialButtonsPlacement: 'top' as const,
    socialButtonsVariant: 'blockButton' as const,
    showOptionalFields: false,
  },
  elements: {
    card: 'border border-[#262626] bg-[#0F0F0F] shadow-2xl shadow-black/90',
    formButtonPrimary:
      'bg-[#E10600] hover:bg-[#FF1A1A] text-white font-semibold shadow-lg shadow-red-950/40 transition-all',
    socialButtonsBlockButton:
      'border border-neutral-700 bg-[#161616] hover:bg-neutral-800 text-white font-medium transition-colors hover:border-neutral-500',
    socialButtonsBlockButtonText: 'text-white font-medium text-xs',
    dividerLine: 'bg-neutral-800',
    dividerText: 'text-neutral-500 text-xs font-mono uppercase tracking-wider',
    footerActionLink: 'text-[#E10600] hover:text-[#FF1A1A] font-semibold',
    identityPreviewText: 'text-white',
    identityPreviewEditButtonIcon: 'text-[#E10600]',
    organizationSwitcherTrigger: 'border border-neutral-800 bg-[#141414] text-white hover:border-[#E10600]/50 rounded-lg px-2 py-1',
  },
};
