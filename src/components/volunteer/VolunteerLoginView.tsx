import React, { useState, useEffect } from 'react';
import { useSeva } from '../../context/SevaContext';
import {
  User,
  Phone,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Heart,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

interface VolunteerLoginViewProps {
  onLoginSuccess: () => void;
  onBackHome?: () => void;
}

export const VolunteerLoginView: React.FC<VolunteerLoginViewProps> = ({
  onLoginSuccess,
  onBackHome,
}) => {
  const { registerOrLoginVolunteerAccount } = useSeva();

  // All inputs strictly start blank every time the login screen opens
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setName('');
    setPhone('');
    setEmail('');
    setPin('');
    setConfirmPin('');
    setShowPin(false);
    setShowConfirmPin(false);
    setError(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
      setError('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    const cleanPin = pin.trim().replace(/\D/g, '');
    if (!/^(\d{4}|\d{6})$/.test(cleanPin)) {
      setError('Security PIN must be exactly 4 or 6 digits.');
      return;
    }

    const cleanConfirmPin = confirmPin.trim().replace(/\D/g, '');
    if (cleanPin !== cleanConfirmPin) {
      setError('PIN not correct: The re-entered confirmation PIN does not match the Security PIN you set.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await registerOrLoginVolunteerAccount({
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        pin: cleanPin,
        confirmPin: cleanConfirmPin,
      });

      if (res.success) {
        setName('');
        setPhone('');
        setEmail('');
        setPin('');
        setConfirmPin('');
        onLoginSuccess();
      } else {
        setError(res.error || 'Please verify your details and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Info Panel */}
        <div className="lg:col-span-5 bg-[#45382F] text-[#FFFDF7] rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-xl">
          <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-[#C49A45]/15 blur-2xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white p-0.5 border border-[#C49A45]/50 shrink-0 shadow-xs overflow-hidden flex items-center justify-center">
                <img
                  src="/assets/aistudio/image_81b81f34.png"
                  alt="NNS Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C49A45] block">
                  Nitya Narayana Seva
                </span>
                <span className="font-serif text-lg font-bold text-white">
                  Volunteer Portal
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-white">
                Serve with Love. <span className="text-[#C49A45]">Join the Seva.</span>
              </h1>
              <p className="text-sm text-white/80 leading-relaxed">
                Sign in to explore upcoming food distribution shifts at Kidwai Memorial Institute of Oncology, manage your Seva passes, and keep your volunteer account updated.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs text-white/85">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#819B82] shrink-0 mt-0.5" />
                <span>Access live daily volunteer slots & instant Seva pass confirmation</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#819B82] shrink-0 mt-0.5" />
                <span>Manage your profile, contact number, and attendance history in My Account</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#819B82] shrink-0 mt-0.5" />
                <span>Your volunteer profile & Seva passes are securely saved across sessions</span>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-white/15 flex items-center justify-between text-xs text-white/70 relative z-10">
            <span className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#C49A45] fill-current" />
              <span>A Little Help. A Lot of Humanity.</span>
            </span>
            {onBackHome && (
              <button
                type="button"
                onClick={onBackHome}
                className="inline-flex items-center gap-1 text-[#C49A45] hover:underline font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Login / Account Form Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#45382F]/15 shadow-xl">
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EEDC] text-[#C49A45] text-[11px] font-semibold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Volunteer Sign In</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#45382F]">
                Volunteer Login & Profile Access
              </h2>
              <p className="text-xs text-[#45382F]/70 mt-1">
                Enter your full name, mobile number, email address, and a 4 or 6-digit Security PIN.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#45382F]/80 mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#45382F]/40 absolute left-4 top-3.5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoComplete="off"
                      placeholder="Enter full name"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FFFDF7] border border-[#45382F]/20 text-[#45382F] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#C49A45] placeholder:text-[#45382F]/35"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#45382F]/80 mb-1.5">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#45382F]/40 absolute left-4 top-3.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      required
                      maxLength={10}
                      autoComplete="off"
                      placeholder="10-digit mobile"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FFFDF7] border border-[#45382F]/20 text-[#45382F] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#C49A45] placeholder:text-[#45382F]/35"
                    />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#45382F]/80 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#45382F]/40 absolute left-4 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="off"
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FFFDF7] border border-[#45382F]/20 text-[#45382F] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#C49A45] placeholder:text-[#45382F]/35"
                  />
                </div>
              </div>

              {/* Security PIN (4 or 6 digits) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#45382F]/80 mb-1.5">
                  Set Security PIN (4 or 6 Digits) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#45382F]/40 absolute left-4 top-3.5" />
                  <input
                    type={showPin ? 'text' : 'password'}
                    inputMode="numeric"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    autoComplete="new-password"
                    placeholder="Enter 4-digit or 6-digit PIN"
                    className="w-full pl-11 pr-11 py-3 rounded-2xl bg-[#FFFDF7] border border-[#45382F]/20 text-[#45382F] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#C49A45] placeholder:text-[#45382F]/35"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3.5 top-3 text-[#45382F]/40 hover:text-[#45382F] p-1 cursor-pointer"
                    aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-[#45382F]/60 mt-1 pl-1">
                  Enter exactly 4 or 6 digits to protect your volunteer account.
                </p>
              </div>

              {/* Confirm Security PIN (Re-enter) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#45382F]/80 mb-1.5">
                  Confirm Security PIN (Re-enter) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#45382F]/40 absolute left-4 top-3.5" />
                  <input
                    type={showConfirmPin ? 'text' : 'password'}
                    inputMode="numeric"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    autoComplete="new-password"
                    placeholder="Re-enter PIN exactly to confirm"
                    className={`w-full pl-11 pr-11 py-3 rounded-2xl bg-[#FFFDF7] border text-[#45382F] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#C49A45] placeholder:text-[#45382F]/35 ${
                      confirmPin && pin && confirmPin !== pin
                        ? 'border-rose-400 bg-rose-50/20'
                        : confirmPin && pin && confirmPin === pin
                        ? 'border-emerald-500 bg-emerald-50/20'
                        : 'border-[#45382F]/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    className="absolute right-3.5 top-3 text-[#45382F]/40 hover:text-[#45382F] p-1 cursor-pointer"
                    aria-label={showConfirmPin ? 'Hide PIN' : 'Show PIN'}
                  >
                    {showConfirmPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {confirmPin && pin && (
                  <div className="mt-1.5 pl-1 flex items-center gap-1.5 text-[11px]">
                    {confirmPin === pin ? (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Both PINs match!
                      </span>
                    ) : (
                      <span className="text-rose-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> PINs do not match
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#C49A45] hover:bg-[#A57F32] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60"
                >
                  <span>
                    {isSubmitting ? 'Verifying Account...' : 'Verify PIN & Enter Volunteer Portal'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
