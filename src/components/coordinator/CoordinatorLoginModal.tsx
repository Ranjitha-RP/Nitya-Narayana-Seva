import React, { useState, useEffect } from 'react';
import { useSeva } from '../../context/SevaContext';
import {
  ShieldCheck,
  X,
  KeyRound,
  User,
  Phone,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

interface CoordinatorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const CoordinatorLoginModal: React.FC<CoordinatorLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const { loginCoordinator } = useSeva();

  // All inputs always start completely empty
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Every time the modal opens, reset all fields to completely blank
  useEffect(() => {
    if (isOpen) {
      setName('');
      setPhone('');
      setPin('');
      setConfirmPin('');
      setShowPin(false);
      setShowConfirmPin(false);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Validate full name
    const cleanName = name.trim();
    if (!cleanName) {
      setError('Please enter your coordinator full name.');
      return;
    }

    // 2. Validate mobile number
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    // 3. Validate PIN
    const cleanPin = pin.trim();
    if (!cleanPin) {
      setError('Please set a security PIN.');
      return;
    }

    // 4. Exact PIN matching verification
    if (cleanPin !== confirmPin.trim()) {
      setError('PIN not correct: The re-entered confirmation PIN does not match the Security PIN you set.');
      return;
    }

    const res = loginCoordinator({
      name: cleanName,
      phone: cleanPhone,
      pin: cleanPin,
      confirmPin: confirmPin.trim(),
    });

    if (res.success) {
      setName('');
      setPhone('');
      setPin('');
      setConfirmPin('');
      onLoginSuccess();
      onClose();
    } else {
      setError(res.error || 'Failed to authenticate coordinator. Please check your credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#FFFDF7] rounded-3xl shadow-2xl border border-[#45382F]/15 overflow-hidden">
        {/* Header */}
        <div className="bg-[#45382F] text-white p-6 sm:p-7 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white p-0.5 border border-[#C49A45]/40 shrink-0 shadow-xs overflow-hidden flex items-center justify-center">
              <img
                src="/assets/aistudio/image_81b81f34.png"
                alt="NNS Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C49A45]">
                <ShieldCheck className="w-4 h-4 text-[#C49A45]" />
                <span>Authorized Access Only</span>
              </div>
              <h2 className="font-serif text-2xl font-bold tracking-tight text-white">
                Coordinator Login
              </h2>
            </div>
          </div>
          <p className="text-xs text-white/80 mt-2">
            Nitya Narayana Seva • Kidwai Memorial Institute of Oncology, Bengaluru
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Coordinator Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#45382F]/80 mb-1.5">
                Coordinator Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#45382F]/40 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="off"
                  placeholder="Enter your full name"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-[#45382F]/20 text-[#45382F] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#C49A45] placeholder:text-[#45382F]/35"
                />
              </div>
            </div>

            {/* Phone / Mobile Number */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#45382F]/80 mb-1.5">
                Phone / Mobile Number <span className="text-rose-500">*</span>
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
                  placeholder="10-digit mobile number"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-[#45382F]/20 text-[#45382F] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#C49A45] placeholder:text-[#45382F]/35"
                />
              </div>
            </div>

            {/* Set Security PIN */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#45382F]/80 mb-1.5">
                Set Security PIN <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#45382F]/40 absolute left-4 top-3.5" />
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Create 4 to 6-digit security PIN"
                  required
                  autoComplete="new-password"
                  className="w-full pl-11 pr-11 py-3 rounded-2xl bg-white border border-[#45382F]/20 text-[#45382F] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#C49A45] placeholder:text-[#45382F]/35"
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
                Choose a private PIN you will use to verify access.
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
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="Re-enter PIN exactly to confirm"
                  required
                  autoComplete="new-password"
                  className={`w-full pl-11 pr-11 py-3 rounded-2xl bg-white border text-[#45382F] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#C49A45] placeholder:text-[#45382F]/35 ${
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

            <div className="p-3.5 bg-[#F5EEDC]/80 rounded-2xl border border-[#C49A45]/20 text-[11px] text-[#45382F]/80">
              <span className="font-semibold text-[#45382F]">Cloud Profile Saving:</span> Entering your name, phone, and matching PIN authenticates you and syncs your coordinator profile to Supabase.
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-2xl bg-[#C49A45] hover:bg-[#A57F32] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Verify PIN & Enter Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
