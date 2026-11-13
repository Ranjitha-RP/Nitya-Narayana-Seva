import React, { useState, useEffect } from 'react';
import { useSeva } from '../../context/SevaContext';
import { Gender } from '../../types';
import {
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  Save,
  LogOut,
  Calendar,
  ArrowRight,
  Clock,
} from 'lucide-react';

interface VolunteerAccountViewProps {
  onNavigateToOpportunities: () => void;
  onNavigateToRegistrations: () => void;
  onLogout: () => void;
}

export const VolunteerAccountView: React.FC<VolunteerAccountViewProps> = ({
  onNavigateToOpportunities,
  onNavigateToRegistrations,
  onLogout,
}) => {
  const {
    currentVolunteer,
    updateVolunteerProfile,
    registrations,
  } = useSeva();

  // Editable Profile States
  const [name, setName] = useState(currentVolunteer?.name || '');
  const [phone, setPhone] = useState(currentVolunteer?.phone || '');
  const [gender, setGender] = useState<Gender | ''>(currentVolunteer?.gender || '');
  const [city, setCity] = useState(currentVolunteer?.city || 'Bengaluru');
  const [profileStatus, setProfileStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password Change States
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (currentVolunteer) {
      setName(currentVolunteer.name || '');
      setPhone(currentVolunteer.phone || '');
      setGender(currentVolunteer.gender || '');
      setCity(currentVolunteer.city || 'Bengaluru');
    }
  }, [currentVolunteer]);

  if (!currentVolunteer) return null;

  const cleanPhone = (currentVolunteer.phone || '').replace(/\D/g, '');
  const myRegs = cleanPhone
    ? registrations.filter((r) => (r.mobile || '').replace(/\D/g, '') === cleanPhone)
    : [];
  const upcomingCount = myRegs.filter((r) => r.attendanceStatus !== 'CANCELLED').length;
  const completedCount = myRegs.filter((r) => r.attendanceStatus === 'PRESENT').length;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatus(null);

    if (!name.trim()) {
      setProfileStatus({ type: 'error', text: 'Full name cannot be empty.' });
      return;
    }

    const cleanedPhone = phone.trim().replace(/\D/g, '');
    if (cleanedPhone && cleanedPhone.length < 10) {
      setProfileStatus({ type: 'error', text: 'Please enter a valid 10-digit mobile number.' });
      return;
    }

    setIsSavingProfile(true);
    try {
      const res = await updateVolunteerProfile({
        name: name.trim(),
        phone: cleanedPhone,
        gender: gender ? (gender as Gender) : undefined,
        city: city.trim() || 'Bengaluru',
      });
      if (res.success) {
        setProfileStatus({
          type: 'success',
          text: 'Your account details have been updated and saved.',
        });
        setTimeout(() => setProfileStatus(null), 4000);
      } else {
        setProfileStatus({ type: 'error', text: res.error || 'Failed to update account.' });
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    const cleanPin = newPassword.trim().replace(/\D/g, '');
    const cleanConfirm = confirmPassword.trim().replace(/\D/g, '');

    if (!/^(\d{4}|\d{6})$/.test(cleanPin)) {
      setPasswordStatus({ type: 'error', text: 'Security PIN must be exactly 4 or 6 digits.' });
      return;
    }
    if (cleanPin !== cleanConfirm) {
      setPasswordStatus({
        type: 'error',
        text: 'PIN not correct: The re-entered PIN does not match.',
      });
      return;
    }

    const res = await updateVolunteerProfile({ password: cleanPin });
    if (res.success) {
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
      setPasswordStatus({
        type: 'success',
        text: 'Security PIN updated successfully.',
      });
      setTimeout(() => setPasswordStatus(null), 4000);
    } else {
      setPasswordStatus({ type: 'error', text: res.error || 'Could not update Security PIN.' });
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Top Account Banner */}
      <div className="bg-[#45382F] text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#C49A45] text-white flex items-center justify-center font-serif text-2xl sm:text-3xl font-bold shrink-0 border-2 border-white/80 shadow-md">
              {currentVolunteer.name ? currentVolunteer.name.charAt(0).toUpperCase() : 'V'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#C49A45] bg-white/10 px-2.5 py-0.5 rounded-full">
                  My Volunteer Account
                </span>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#819B82]/30 text-emerald-100 border border-[#819B82]/40">
                  Verified Volunteer
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {currentVolunteer.name}
              </h1>
              <p className="text-xs text-white/75 flex items-center gap-2 flex-wrap">
                <span>{currentVolunteer.email}</span>
                {currentVolunteer.phone && (
                  <>
                    <span>•</span>
                    <span>+91 {currentVolunteer.phone}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={onNavigateToOpportunities}
              className="px-4 py-2.5 rounded-xl bg-[#C49A45] hover:bg-[#A57F32] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Browse Opportunities</span>
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Seva Impact Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#45382F]/10 shadow-xs">
          <span className="text-xs text-[#45382F]/60 block">Upcoming Shifts</span>
          <span className="font-serif text-2xl font-bold text-[#C49A45] tabular-nums mt-1 block">
            {upcomingCount}
          </span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#45382F]/10 shadow-xs">
          <span className="text-xs text-[#45382F]/60 block">Completed Sevas</span>
          <span className="font-serif text-2xl font-bold text-[#819B82] tabular-nums mt-1 block">
            {completedCount}
          </span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#45382F]/10 shadow-xs">
          <span className="text-xs text-[#45382F]/60 block">Seva Location</span>
          <span className="font-semibold text-xs text-[#45382F] mt-2 block truncate">
            Kidwai Hospital
          </span>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#45382F]/10 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-[#45382F]/60 block">My Seva Passes</span>
          <button
            onClick={onNavigateToRegistrations}
            className="text-xs font-semibold text-[#C49A45] hover:underline flex items-center gap-1 mt-1 cursor-pointer text-left"
          >
            <span>View Registrations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Account Management Form & Security */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Personal Profile Editor */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#45382F]/15 shadow-sm space-y-5">
          <div className="border-b border-[#45382F]/10 pb-4">
            <h2 className="font-serif text-xl font-bold text-[#45382F] flex items-center gap-2">
              <User className="w-5 h-5 text-[#C49A45]" />
              <span>Manage Personal Details</span>
            </h2>
            <p className="text-xs text-[#45382F]/70 mt-1">
              Keep your volunteer name, phone number, and preferences up to date.
            </p>
          </div>

          {profileStatus && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-medium flex items-center gap-2 ${
                profileStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {profileStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{profileStatus.text}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#45382F]/80 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#45382F]/40 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FFFDF7] border border-[#45382F]/20 text-[#45382F] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#C49A45]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#45382F]/80 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#45382F]/40 absolute left-4 top-3.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FFFDF7] border border-[#45382F]/20 text-[#45382F] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#C49A45]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#45382F]/80 mb-1.5">
                  Volunteer Category
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender | '')}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FFFDF7] border border-[#45382F]/20 text-[#45382F] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#C49A45]"
                >
                  <option value="">Select gender (optional)</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#45382F]/80 mb-1.5">
                  Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#45382F]/40 absolute left-4 top-3.5" />
                  <input
                    type="email"
                    value={currentVolunteer.email}
                    disabled
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-neutral-100 border border-[#45382F]/10 text-[#45382F]/70 text-xs cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#45382F]/80 mb-1.5">
                  City / Area
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#45382F]/40 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FFFDF7] border border-[#45382F]/20 text-[#45382F] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#C49A45]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-6 py-3 bg-[#C49A45] hover:bg-[#A57F32] text-white text-xs font-semibold uppercase tracking-wider rounded-2xl shadow-sm transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingProfile ? 'Saving Changes...' : 'Save Account Details'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Security & Database Record */}
        <div className="lg:col-span-5 space-y-6">
          {/* Password Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#45382F]/15 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#45382F] flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#C49A45]" />
                <span>Account Security</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(!isChangingPassword);
                  setPasswordStatus(null);
                }}
                className="text-xs font-semibold text-[#C49A45] hover:underline cursor-pointer"
              >
                {isChangingPassword
                  ? 'Cancel'
                  : currentVolunteer.password
                  ? 'Change Security PIN'
                  : 'Set Security PIN'}
              </button>
            </div>

            <div className="p-3.5 bg-[#FFFDF7] rounded-2xl border border-[#45382F]/10 text-xs space-y-1">
              <div className="flex items-center justify-between text-[#45382F]/70">
                <span>Sign-In Method:</span>
                <span className="font-semibold text-[#45382F]">
                  Email & Security PIN
                </span>
              </div>
              <div className="flex items-center justify-between text-[#45382F]/70">
                <span>Last Active:</span>
                <span className="font-medium text-[#45382F]">
                  {new Date(currentVolunteer.lastLoginAt).toLocaleDateString('en-IN')}
                </span>
              </div>
            </div>

            {passwordStatus && (
              <div
                className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                  passwordStatus.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordStatus.text}</span>
              </div>
            )}

            {isChangingPassword && (
              <form onSubmit={handleSavePassword} className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#45382F]/70 mb-1">
                    New Security PIN (4 or 6 Digits)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      inputMode="numeric"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      maxLength={6}
                      placeholder="4 or 6-digit PIN"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-[#FFFDF7] border border-[#45382F]/20 text-xs text-[#45382F] focus:outline-hidden focus:ring-2 focus:ring-[#C49A45]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-[#45382F]/40 hover:text-[#45382F] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#45382F]/70 mb-1">
                    Confirm New Security PIN
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    inputMode="numeric"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    placeholder="Re-enter PIN to confirm"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF7] border border-[#45382F]/20 text-xs text-[#45382F] focus:outline-hidden focus:ring-2 focus:ring-[#C49A45]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#45382F] hover:bg-[#2D241E] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Update Security PIN
                </button>
              </form>
            )}
          </div>

          {/* Seva Reporting Guidelines Card */}
          <div className="bg-[#F5EEDC] rounded-3xl p-6 border border-[#C49A45]/30 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#45382F]">
              <Clock className="w-4 h-4 text-[#C49A45]" />
              <span>Seva Reporting Guidelines</span>
            </div>
            <ul className="space-y-1.5 text-[#45382F]/80 text-[11px] leading-relaxed">
              <li>• Arrive 15 minutes early at Kidwai Hospital Gate 2 Seva Counter.</li>
              <li>• Aprons, gloves, and hairnets are provided at the counter.</li>
              <li>• Carry your Seva Pass or registered mobile number for check-in.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
