import React, { useState, useEffect } from 'react';
import { useSeva } from '../../context/SevaContext';
import { VolunteerRequirement, Gender, VolunteerRegistration } from '../../types';
import {
  X,
  Heart,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  User,
  Phone,
} from 'lucide-react';

interface VolunteerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRequirement?: VolunteerRequirement | null;
  onViewMyRegistrations: () => void;
}

export const VolunteerRegistrationModal: React.FC<VolunteerRegistrationModalProps> = ({
  isOpen,
  onClose,
  selectedRequirement,
  onViewMyRegistrations,
}) => {
  const { requirements, registerVolunteer } = useSeva();

  // Determine initial selected requirement safely
  const initialReqId =
    selectedRequirement?.id ||
    (requirements && requirements.length > 0 ? requirements[0].id : '');

  const [activeReqId, setActiveReqId] = useState<string>(initialReqId);
  const [fullName, setFullName] = useState('');
  // Always start with empty phone number input as requested
  const [mobile, setMobile] = useState('');
  const [gender, setGender] = useState<Gender>('Male');
  const [confirmedCommitment, setConfirmedCommitment] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successRegistration, setSuccessRegistration] = useState<VolunteerRegistration | null>(null);

  // Sync active requirement if prop changes
  useEffect(() => {
    if (selectedRequirement?.id) {
      setActiveReqId(selectedRequirement.id);
    } else if (requirements && requirements.length > 0 && !activeReqId) {
      setActiveReqId(requirements[0].id);
    }
  }, [selectedRequirement, requirements, activeReqId]);

  // Find the currently selected requirement safely
  const currentReq =
    requirements.find((r) => r.id === activeReqId) ||
    requirements[0] ||
    null;

  // Check category (gender) slot availability safely with fallback defaults
  const maleRegistered = currentReq?.maleRegistered ?? 0;
  const maleRequired = currentReq?.maleRequired ?? 0;
  const femaleRegistered = currentReq?.femaleRegistered ?? 0;
  const femaleRequired = currentReq?.femaleRequired ?? 0;

  const maleSlotsFull = maleRequired > 0 && maleRegistered >= maleRequired;
  const femaleSlotsFull = femaleRequired > 0 && femaleRegistered >= femaleRequired;
  const allSlotsFull = maleSlotsFull && femaleSlotsFull;

  // Auto-switch gender if chosen one is full
  useEffect(() => {
    if (maleSlotsFull && !femaleSlotsFull && gender === 'Male') {
      setGender('Female');
    } else if (femaleSlotsFull && !maleSlotsFull && gender === 'Female') {
      setGender('Male');
    }
  }, [maleSlotsFull, femaleSlotsFull, gender]);

  // Helper for resilient date formatting
  const formatDateDisplay = (dateStr?: string, withWeekday = true) => {
    if (!dateStr) return '';
    try {
      const clean = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`;
      const d = new Date(clean);
      if (isNaN(d.getTime())) {
        return dateStr;
      }
      return d.toLocaleDateString('en-IN', {
        weekday: withWeekday ? 'short' : undefined,
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // If not open, return null after all hooks have executed
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!confirmedCommitment) {
      setErrorMessage('Please confirm your commitment to attend and serve.');
      return;
    }

    if (!currentReq) {
      setErrorMessage('Please select a service date.');
      return;
    }

    const result = registerVolunteer({
      requirementId: currentReq.id,
      fullName: fullName.trim(),
      mobile: cleanMobile,
      gender,
    });

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to register. Please check slot availability.');
    } else if (result.registration) {
      setSuccessRegistration(result.registration);
    }
  };

  const handleResetAndClose = () => {
    setSuccessRegistration(null);
    setErrorMessage(null);
    setConfirmedCommitment(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#FFFDF7] rounded-3xl shadow-2xl border border-[#45382F]/10 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#45382F] text-white p-6 sm:p-7 relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C49A45] mb-1">
            <Heart className="w-4 h-4 fill-current" />
            <span>Volunteer Registration</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            {successRegistration ? 'Registration Confirmed!' : 'Join Food Seva'}
          </h2>
          <p className="text-xs sm:text-sm text-white/80 mt-1">
            Kidwai Memorial Institute of Oncology, Bengaluru
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {successRegistration ? (
            /* Registration Success Pass Screen */
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-[#819B82]/20 text-[#819B82] rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#45382F]">
                  Thank You, {successRegistration.fullName}!
                </h3>
                <p className="text-sm text-[#45382F]/75">
                  Your volunteer position has been successfully confirmed. A Little Help. A Lot of Humanity.
                </p>
              </div>

              {/* Seva Pass Card */}
              <div className="bg-[#F5EEDC] rounded-2xl p-6 border border-[#C49A45]/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#C49A45]/10 rounded-full blur-xl pointer-events-none" />

                <div className="flex items-start justify-between border-b border-[#45382F]/15 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[#C49A45] block">
                      OFFICIAL SEVA PASS
                    </span>
                    <span className="font-serif text-lg font-bold text-[#45382F]">
                      {successRegistration.requirementTitle}
                    </span>
                  </div>
                  <div className="px-2.5 py-1 bg-[#819B82] text-white text-xs font-semibold rounded-md">
                    Confirmed
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                  <div>
                    <span className="text-[#45382F]/60 block">Service Date:</span>
                    <span className="font-bold text-[#45382F] text-sm">
                      {formatDateDisplay(successRegistration.requirementDate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#45382F]/60 block">Reporting Time:</span>
                    <span className="font-bold text-[#45382F] text-sm">10:45 AM (Prompt)</span>
                  </div>
                  <div>
                    <span className="text-[#45382F]/60 block">Volunteer Name:</span>
                    <span className="font-semibold text-[#45382F]">
                      {successRegistration.fullName} ({successRegistration.gender})
                    </span>
                  </div>
                  <div>
                    <span className="text-[#45382F]/60 block">Pass / Reg ID:</span>
                    <span className="font-mono font-bold text-[#45382F]">
                      {successRegistration.id.slice(0, 12)}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#45382F]/15 text-xs text-[#45382F]/80 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#C49A45] shrink-0 mt-0.5" />
                  <span>{successRegistration.location}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    handleResetAndClose();
                    onViewMyRegistrations();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#45382F] hover:bg-[#2D241E] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>View in My Registrations</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetAndClose}
                  className="py-3 px-5 rounded-xl bg-[#F5EEDC] hover:bg-[#EBE2CC] text-[#45382F] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : requirements.length === 0 ? (
            /* When NO requirements published yet */
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#F5EEDC] text-[#C49A45] flex items-center justify-center mx-auto">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#45382F]">
                No Seva Requirements Published Yet
              </h3>
              <p className="text-xs text-[#45382F]/75 max-w-sm mx-auto leading-relaxed">
                Coordinators have not launched any volunteer requirements yet. As soon as a
                coordinator publishes an event, registration will open here immediately.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 rounded-xl bg-[#45382F] text-white text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Registration Input Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Banner */}
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <div className="leading-relaxed">{errorMessage}</div>
                </div>
              )}

              {/* Service Date Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#45382F]/80 mb-2">
                  1. Selected Service Date
                </label>
                <div className="space-y-2">
                  <select
                    value={activeReqId}
                    onChange={(e) => {
                      setActiveReqId(e.target.value);
                      setErrorMessage(null);
                    }}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-[#45382F]/20 text-[#45382F] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C49A45] cursor-pointer"
                  >
                    {requirements.map((req) => {
                      const totalRem = Math.max(
                        0,
                        (req.maleRequired ?? 0) +
                          (req.femaleRequired ?? 0) -
                          ((req.maleRegistered ?? 0) + (req.femaleRegistered ?? 0))
                      );
                      const isClosed = totalRem === 0 || req.status === 'CLOSED';
                      return (
                        <option key={req.id} value={req.id}>
                          {formatDateDisplay(req.date)}{' '}
                          — {req.title} ({isClosed ? 'Positions Filled' : `${totalRem} slots available`})
                        </option>
                      );
                    })}
                  </select>

                  {/* Date details pill */}
                  {currentReq && (
                    <div className="p-3 bg-[#F5EEDC] rounded-2xl text-xs text-[#45382F] space-y-1">
                      <div className="flex items-center justify-between font-medium">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#C49A45]" />
                          {currentReq.startTime} – {currentReq.endTime}
                        </span>
                        <span>
                          {maleRegistered + femaleRegistered}/
                          {maleRequired + femaleRequired} Filled
                        </span>
                      </div>
                      <div className="text-[11px] text-[#45382F]/70">
                        Male Slots:{' '}
                        <strong>
                          {maleRegistered}/{maleRequired}
                        </strong>{' '}
                        · Female Slots:{' '}
                        <strong>
                          {femaleRegistered}/{femaleRequired}
                        </strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#45382F]/80 mb-1.5">
                  2. Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#45382F]/40 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-[#45382F]/20 text-[#45382F] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C49A45]"
                  />
                </div>
              </div>

              {/* Mobile Number - Starts completely empty */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#45382F]/80 mb-1.5">
                  3. Mobile Number (WhatsApp)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#45382F]/40 absolute left-4 top-3.5" />
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter your 10-digit mobile number"
                    maxLength={10}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-[#45382F]/20 text-[#45382F] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C49A45]"
                  />
                </div>
                <p className="text-[11px] text-[#45382F]/60 mt-1 pl-1">
                  Used to confirm your Seva registration and send arrival guidelines.
                </p>
              </div>

              {/* Gender Selector with live capacity checks */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#45382F]/80 mb-1.5">
                  4. Volunteer Category / Gender
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={maleSlotsFull}
                    onClick={() => setGender('Male')}
                    className={`py-3 px-4 rounded-2xl text-xs font-semibold border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      maleSlotsFull
                        ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed opacity-60'
                        : gender === 'Male'
                        ? 'bg-[#C49A45] text-white border-[#C49A45] shadow-xs'
                        : 'bg-white text-[#45382F] border-[#45382F]/20 hover:border-[#C49A45]'
                    }`}
                  >
                    <span>Male Volunteer</span>
                    <span className="text-[10px] font-normal opacity-90">
                      {maleSlotsFull
                        ? 'Slots Full'
                        : `${Math.max(0, maleRequired - maleRegistered)} open`}
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={femaleSlotsFull}
                    onClick={() => setGender('Female')}
                    className={`py-3 px-4 rounded-2xl text-xs font-semibold border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      femaleSlotsFull
                        ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed opacity-60'
                        : gender === 'Female'
                        ? 'bg-[#C49A45] text-white border-[#C49A45] shadow-xs'
                        : 'bg-white text-[#45382F] border-[#45382F]/20 hover:border-[#C49A45]'
                    }`}
                  >
                    <span>Female Volunteer</span>
                    <span className="text-[10px] font-normal opacity-90">
                      {femaleSlotsFull
                        ? 'Slots Full'
                        : `${Math.max(0, femaleRequired - femaleRegistered)} open`}
                    </span>
                  </button>
                </div>
              </div>

              {/* Commitment Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={confirmedCommitment}
                    onChange={(e) => setConfirmedCommitment(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-[#C49A45] focus:ring-[#C49A45] border-[#45382F]/30 cursor-pointer"
                  />
                  <span className="text-xs text-[#45382F]/80 leading-relaxed">
                    I confirm that I will report on time at <strong>Kidwai Gate 2</strong> (10:45 AM)
                    and serve with respect, empathy, and care for cancer patient families.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={allSlotsFull}
                  className={`w-full py-3.5 px-6 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-md ${
                    allSlotsFull
                      ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                      : 'bg-[#C49A45] hover:bg-[#A57F32] text-white hover:shadow-lg active:scale-98 cursor-pointer'
                  }`}
                >
                  {allSlotsFull ? 'All Slots Filled for This Date' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
