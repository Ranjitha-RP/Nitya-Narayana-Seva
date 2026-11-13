import React, { useState, useEffect } from 'react';
import { useSeva } from '../../context/SevaContext';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Phone,
  User,
  Heart,
  QrCode,
  ShieldCheck,
  Search,
} from 'lucide-react';

interface MyRegistrationsViewProps {
  onExploreMore: () => void;
}

export const MyRegistrationsView: React.FC<MyRegistrationsViewProps> = ({ onExploreMore }) => {
  const {
    registrations,
    currentVolunteerMobile,
    setCurrentVolunteerMobile,
    currentVolunteer,
    cancelRegistration,
  } = useSeva();

  // Mobile starts empty unless user has logged in with phone or actually registered
  const [lookupPhone, setLookupPhone] = useState(
    currentVolunteer?.phone || currentVolunteerMobile || ''
  );
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (currentVolunteer?.phone && !lookupPhone) {
      setLookupPhone(currentVolunteer.phone);
    }
  }, [currentVolunteer]);

  const cleanPhone = lookupPhone.replace(/\D/g, '');

  // Filter registrations matching current volunteer's mobile number
  const userRegistrations = cleanPhone
    ? registrations.filter((r) => (r.mobile || '').replace(/\D/g, '') === cleanPhone)
    : [];

  const activeUpcoming = userRegistrations.filter((r) => r.attendanceStatus !== 'CANCELLED');
  const pastOrCancelled = userRegistrations.filter((r) => r.attendanceStatus === 'CANCELLED');

  const handleCancel = (registrationId: string) => {
    const res = cancelRegistration(registrationId);
    if (res.success) {
      setCancelSuccessMsg(
        'Your registration has been cancelled. The position is now available for other volunteers.'
      );
      setTimeout(() => setCancelSuccessMsg(null), 5000);
    }
  };

  const formatDateDisplay = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const clean = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`;
      const d = new Date(clean);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const totalCompletedSeva = userRegistrations.filter((r) => r.attendanceStatus === 'PRESENT').length;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header and Lookup Bar */}
      <div className="bg-[#F5EEDC] rounded-3xl p-6 sm:p-8 border border-[#C49A45]/30 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#C49A45]/40 text-xs font-semibold uppercase tracking-wider text-[#C49A45]">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Volunteer History & Passes</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#45382F]">
            My Seva Registrations
          </h1>
          <p className="text-xs sm:text-sm text-[#45382F]/75">
            Manage your food distribution commitments and track your community service.
          </p>
        </div>

        {/* Mobile Number Lookup Switcher - Starts empty */}
        <div className="bg-white p-3 rounded-2xl border border-[#45382F]/15 sm:w-80 shadow-xs">
          <label className="block text-[11px] font-semibold text-[#45382F]/70 uppercase tracking-wider mb-1">
            Enter Registered Mobile Number
          </label>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#C49A45] shrink-0" />
            <input
              type="tel"
              value={lookupPhone}
              onChange={(e) => {
                setLookupPhone(e.target.value);
                setCurrentVolunteerMobile(e.target.value);
              }}
              placeholder="e.g. 9845012345"
              className="w-full text-xs font-semibold text-[#45382F] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Cancellation Notice Banner */}
      {cancelSuccessMsg && (
        <div className="p-4 rounded-2xl bg-[#819B82]/20 border border-[#819B82] text-[#45382F] text-xs font-medium flex items-center gap-3 mb-6 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#819B82] shrink-0" />
          <span>{cancelSuccessMsg}</span>
        </div>
      )}

      {/* When no mobile number has been entered yet */}
      {!cleanPhone ? (
        <div className="bg-white rounded-3xl p-10 sm:p-12 border border-[#45382F]/10 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#F5EEDC] text-[#C49A45] flex items-center justify-center mx-auto">
            <Phone className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#45382F]">
            Lookup Your Registered Commitments
          </h2>
          <p className="text-xs sm:text-sm text-[#45382F]/75 max-w-md mx-auto leading-relaxed">
            Enter your 10-digit mobile number in the box above to look up your confirmed Seva passes,
            reporting instructions, or to cancel a slot.
          </p>
          <div className="pt-2">
            <button
              onClick={onExploreMore}
              className="px-6 py-3 rounded-xl bg-[#C49A45] hover:bg-[#A57F32] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Browse Open Volunteer Slots
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Volunteer Seva Impact Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <div className="bg-white rounded-2xl p-4 border border-[#45382F]/10 shadow-xs">
              <div className="text-xs text-[#45382F]/60">Upcoming Services</div>
              <div className="font-serif text-2xl font-bold text-[#C49A45] tabular-nums mt-1">
                {activeUpcoming.length}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#45382F]/10 shadow-xs">
              <div className="text-xs text-[#45382F]/60">Completed Sevas</div>
              <div className="font-serif text-2xl font-bold text-[#819B82] tabular-nums mt-1">
                {totalCompletedSeva}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#45382F]/10 shadow-xs">
              <div className="text-xs text-[#45382F]/60">Total Plates Handed</div>
              <div className="font-serif text-2xl font-bold text-[#45382F] tabular-nums mt-1">
                {totalCompletedSeva * 150 > 0 ? `${totalCompletedSeva * 150}+` : '0'}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#45382F]/10 shadow-xs">
              <div className="text-xs text-[#45382F]/60">Service Center</div>
              <div className="font-semibold text-xs text-[#45382F] mt-1.5 truncate">
                Kidwai Hospital
              </div>
            </div>
          </div>

          {/* Upcoming Active Registrations */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center justify-between border-b border-[#45382F]/10 pb-3">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#45382F]">
                Upcoming Confirmed Commitments ({activeUpcoming.length})
              </h2>
              <button
                onClick={onExploreMore}
                className="text-xs font-semibold text-[#C49A45] hover:underline cursor-pointer"
              >
                + Register for Another Date
              </button>
            </div>

            {activeUpcoming.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-[#45382F]/10 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#F5EEDC] text-[#C49A45] flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#45382F]">
                  No active registrations found for {cleanPhone}
                </h3>
                <p className="text-xs text-[#45382F]/70 max-w-md mx-auto">
                  You do not have any registered service positions linked to this phone number yet.
                  Browse available volunteer slots and join us!
                </p>
                <button
                  onClick={onExploreMore}
                  className="px-6 py-3 rounded-xl bg-[#C49A45] hover:bg-[#A57F32] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Explore Available Dates
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeUpcoming.map((reg) => (
                  <div
                    key={reg.id}
                    className="bg-white rounded-3xl p-6 sm:p-7 border border-[#45382F]/15 shadow-md flex flex-col justify-between relative overflow-hidden"
                  >
                    <div>
                      {/* Top Status & Pass ID */}
                      <div className="flex items-center justify-between gap-2 mb-4 border-b border-[#45382F]/10 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#819B82]"></span>
                          <span className="text-xs font-bold text-[#819B82] uppercase tracking-wider">
                            {reg.attendanceStatus === 'PRESENT'
                              ? 'Attendance Verified (Present)'
                              : 'Confirmed Slot'}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-[#45382F]/60">
                          PASS: #{reg.id.slice(0, 8)}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-[#45382F] mb-1">
                        {reg.requirementTitle}
                      </h3>

                      <div className="space-y-2 text-xs text-[#45382F]/85 my-4 bg-[#FFFDF7] p-3.5 rounded-2xl border border-[#45382F]/10">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#C49A45]" />
                          <span className="font-semibold">
                            {formatDateDisplay(reg.requirementDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#C49A45]" />
                          <span>
                            {reg.serviceTimings} · <strong>Report: 10:45 AM</strong>
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#C49A45] shrink-0 mt-0.5" />
                          <span>{reg.location}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1 border-t border-[#45382F]/10 text-[11px]">
                          <User className="w-3.5 h-3.5 text-[#C49A45]" />
                          <span>
                            Volunteer: <strong>{reg.fullName}</strong> ({reg.gender}) · Tel:{' '}
                            {reg.mobile}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: Cancel Registration */}
                    <div className="pt-3 border-t border-[#45382F]/10 flex items-center justify-between gap-4">
                      <span className="text-[11px] text-[#45382F]/60">
                        Please cancel if unable to attend.
                      </span>

                      {reg.attendanceStatus !== 'PRESENT' && (
                        <button
                          onClick={() => handleCancel(reg.id)}
                          className="px-3.5 py-2 text-xs font-semibold text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                        >
                          Cancel Registration
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cancelled or Historical History */}
          {pastOrCancelled.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#45382F]/70 border-b border-[#45382F]/10 pb-2">
                Cancelled / Released Registrations
              </h3>
              <div className="space-y-2">
                {pastOrCancelled.map((reg) => (
                  <div
                    key={reg.id}
                    className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 flex items-center justify-between text-xs text-neutral-600"
                  >
                    <div>
                      <div className="font-medium text-neutral-800">
                        {reg.requirementTitle} — {formatDateDisplay(reg.requirementDate)}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        Registered by {reg.fullName} ({reg.gender})
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-neutral-200 text-neutral-600 rounded-md font-semibold text-[10px]">
                      Cancelled / Released
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
