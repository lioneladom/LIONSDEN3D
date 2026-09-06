import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Mail, CheckCircle2, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ContactPage: React.FC = () => {
  const { setActivePage } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#E10600', '#FF3B30', '#FFFFFF'],
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-white animate-fade-in space-y-12">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight">
          GET IN <span className="text-brand-red">TOUCH.</span>
        </h1>
        <p className="text-brand-textMuted text-sm sm:text-base leading-relaxed">
          Have a complex industrial project or need technical support? Our team of experts is ready to help you bring your ideas to life.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Card */}
        <div className="lg:col-span-8">
          <div className="bg-[#121212] border border-[#1E1E1E] rounded-3xl p-6 sm:p-10 space-y-6">
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-brand-red/10 border border-brand-red flex items-center justify-center mx-auto text-brand-red">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Message Dispatched!</h3>
                <p className="text-sm text-brand-textMuted max-w-md mx-auto">
                  Thank you, {fullName || 'there'}. Our engineering team has received your project details and will respond within 4 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-[#1C1C1C] hover:bg-[#282828] text-xs font-semibold text-white border border-[#333] transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-[11px] uppercase tracking-wider text-[#777] font-mono font-semibold">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-[#0E0E0E] border border-[#222] focus:border-brand-red rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#555] outline-none transition-colors font-sans"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <label className="block text-[11px] uppercase tracking-wider text-[#777] font-mono font-semibold">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full bg-[#0E0E0E] border border-[#222] focus:border-brand-red rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#555] outline-none transition-colors font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Subject */}
                  <div className="space-y-2">
                    <label className="block text-[11px] uppercase tracking-wider text-[#777] font-mono font-semibold">
                      SUBJECT
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Technical Support"
                      className="w-full bg-[#0E0E0E] border border-[#222] focus:border-brand-red rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#555] outline-none transition-colors font-sans"
                    />
                  </div>

                  {/* Phone (Optional) */}
                  <div className="space-y-2">
                    <label className="block text-[11px] uppercase tracking-wider text-[#777] font-mono font-semibold">
                      PHONE (OPTIONAL)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+233 24 000 0000"
                      className="w-full bg-[#0E0E0E] border border-[#222] focus:border-brand-red rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#555] outline-none transition-colors font-sans"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="block text-[11px] uppercase tracking-wider text-[#777] font-mono font-semibold">
                    MESSAGE / INQUIRY
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your manufacturing project, volume requirements, or technical tolerances..."
                    className="w-full bg-[#0E0E0E] border border-[#222] focus:border-brand-red rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#555] outline-none transition-colors font-sans resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-brand-red hover:bg-brand-redBright text-white font-bold text-xs uppercase tracking-widest transition-all shadow-red-glow flex items-center justify-center gap-2"
                >
                  <span>Transmit Message</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Sidebar Information */}
        <div className="lg:col-span-4 space-y-6">
          {/* Studio Information */}
          <div className="bg-[#121212] border border-[#1E1E1E] rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-extrabold text-white">Studio Information</h3>

            <div className="space-y-6 text-xs sm:text-sm">
              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-brand-red flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h5 className="font-bold text-white">Lion's Den Studio</h5>
                  <p className="text-[#888]">Airport Residential Area</p>
                  <p className="text-[#888]">Accra, Ghana</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-brand-red flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h5 className="font-bold text-white">Direct Engineering Line</h5>
                  <p className="text-[#888]">Mon-Sat, 8am - 6pm GMT</p>
                  <p className="text-[#888] font-mono">+233 24 819 4022</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#262626] flex items-center justify-center text-brand-red flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h5 className="font-bold text-white">Email</h5>
                  <p className="text-[#888]">support@lionsden3d.com</p>
                  <p className="text-[#888]">sales@lionsden3d.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Rapid Access Card */}
          <div className="bg-gradient-to-br from-[#191111] via-[#141212] to-[#121212] border border-[#2A1717] rounded-3xl p-6 sm:p-8 space-y-4">
            <h4 className="text-base font-bold text-white">FAQ Rapid Access</h4>
            <p className="text-xs text-[#888] leading-relaxed">
              Most technical questions regarding materials and layer heights are answered in our support center.
            </p>
            <button
              onClick={() => setActivePage('faq')}
              className="w-full py-3 rounded-xl bg-[#1E1414] hover:bg-[#281818] border border-brand-red/30 text-white text-xs font-semibold tracking-wider transition-colors text-center"
            >
              Visit FAQ Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
