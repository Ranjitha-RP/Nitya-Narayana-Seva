import React, { useState } from 'react';
import { useSeva } from '../../context/SevaContext';
import { VolunteerRequirement } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Heart,
  ChevronRight,
  AlertCircle,
  UserCheck,
  LogOut,
} from 'lucide-react';

interface VolunteerDashboardProps {
  onOpenRegisterModal: (req?: VolunteerRequirement) => void;
  onNavigateToMyRegistrations: () => void;
  onNavigateToMyAccount?: () => void;
  onLogoutVolunteer?: () => void;
}

export const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({
  onOpenRegisterModal,
  onNavigateToMyRegistrations,
  onNavigateToMyAccount,
  onLogoutVolunteer,
}) => {
  const { requirements, currentVolunteer } = useSeva();
  const [filterType, setFilterType] = useState<'all' | 'open' | 'almost-full'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter requirements
  const filteredRequirements = requirements.filter((req) => {
    const totalRequired = (req.maleRequired ?? 0) + (req.femaleRequired ?? 0);
    const totalRegistered = (req.maleRegistered ?? 0) + (req.femaleRegistered ?? 0);
    const remaining = totalRequired - totalRegistered;
    const isFull = remaining <= 0 || req.status === 'CLOSED';

    if (filterType === 'open' && isFull) return false;
    if (filterType === 'almost-full' && (isFull || remaining > 2)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (req.title || '').toLowerCase().includes(q);
      const matchDate = (req.date || '').includes(q);
      const matchLocation = (req.location || '').toLowerCase().includes(q);
      return matchTitle || matchDate || matchLocation;
    }
    return true;
  });

  const formatDateDisplay = (dateStr?: string) => {
    if (!dateStr) return { dayName: 'Seva', formattedDate: '' };
    try {
      const clean = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`;
      const d = new Date(clean);
      if (isNaN(d.getTime())) {
        return { dayName: 'Seva', formattedDate: dateStr };
      }
      return {
        dayName: d.toLocaleDateString('en-IN', { weekday: 'long' }),
        formattedDate: d.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      };
    } catch {
      return { dayName: 'Seva', formattedDate: dateStr };
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-[#F5EEDC] rounded-3xl p-8 sm:p-10 border border-[#C49A45]/30 shadow-xs mb-10 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#C49A45]/40 text-xs font-semibold uppercase tracking-wider text-[#C49A45]">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>
              {currentVolunteer
                ? `Welcome, ${currentVolunteer.name} · Kidwai Memorial Hospital`
                : 'Volunteer Portal · Kidwai Memorial Hospital'}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#45382F] tracking-tight">
            Every Helping Hand <span className="text-[#C49A45]">Matters!</span>
          </h1>

          <p className="text-base text-[#45382F]/80 font-sans leading-relaxed">
            Explore upcoming opportunities and be part of something meaningful. Join us to serve hot,
            nutritious meals to cancer patients and families visiting Kidwai Hospital every day.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-[#45382F]/75">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#819B82]"></span>
              Green: Open for Registration
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Amber: Partially Filled
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-400"></span>
              Grey: Filled / Registration Closed
            </span>
          </div>
        </div>

        {/* Action shortcuts to My Registrations, My Account, and Logout */}
        <div className="mt-6 pt-6 border-t border-[#45382F]/10 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-[#45382F]/80">
            {currentVolunteer
              ? `Signed in as ${currentVolunteer.email}`
              : 'Already registered? Check your upcoming schedule or view your Seva Pass.'}
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            {onNavigateToMyAccount && currentVolunteer && (
              <button
                onClick={onNavigateToMyAccount}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#FFFDF7] text-[#45382F] text-xs font-semibold border border-[#C49A45]/40 shadow-xs transition-colors cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#C49A45]" />
                <span>My Account</span>
              </button>
            )}
            <button
              onClick={onNavigateToMyRegistrations}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#FFFDF7] text-[#45382F] text-xs font-semibold border border-[#C49A45]/40 shadow-xs transition-colors cursor-pointer"
            >
              <span>Go to My Registrations</span>
              <ChevronRight className="w-4 h-4 text-[#C49A45]" />
            </button>
            {onLogoutVolunteer && currentVolunteer && (
              <button
                onClick={onLogoutVolunteer}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* When NO requirements have been launched by the coordinator yet */}
      {requirements.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#45382F]/10 p-8 sm:p-12 space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#F5EEDC] text-[#C49A45] flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#45382F]">
            No Seva Events Published Yet
          </h2>
          <p className="text-sm text-[#45382F]/75 max-w-md mx-auto leading-relaxed">
            Coordinators have not launched any volunteer requirements yet. As soon as a coordinator
            publishes an event from the coordinator portal, it will immediately appear here for public
            registration.
          </p>
          <div className="pt-2 text-xs text-[#45382F]/60">
            Are you a coordinator? Click "Coordinator Login" in the top bar to launch today's seva event.
          </div>
        </div>
      ) : (
        <>
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
            {/* Interactive Segmented Filter Controls */}
            <div className="flex items-center gap-1 p-1 bg-[#F5EEDC] rounded-2xl border border-[#45382F]/10">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-white text-[#45382F] shadow-xs'
                    : 'text-[#45382F]/70 hover:text-[#45382F]'
                }`}
              >
                All Dates ({requirements.length})
              </button>
              <button
                onClick={() => setFilterType('open')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  filterType === 'open'
                    ? 'bg-white text-[#45382F] shadow-xs'
                    : 'text-[#45382F]/70 hover:text-[#45382F]'
                }`}
              >
                Open Slots Only
              </button>
              <button
                onClick={() => setFilterType('almost-full')}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  filterType === 'almost-full'
                    ? 'bg-white text-[#45382F] shadow-xs'
                    : 'text-[#45382F]/70 hover:text-[#45382F]'
                }`}
              >
                Fast Filling
              </button>
            </div>

            {/* Search */}
            <div className="relative sm:w-72">
              <Search className="w-4 h-4 text-[#45382F]/40 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search date or requirement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#45382F]/15 text-[#45382F] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#C49A45]"
              />
            </div>
          </div>

          {/* Available Opportunities Grid */}
          {filteredRequirements.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#45382F]/10 p-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F5EEDC] text-[#C49A45] flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#45382F]">
                No service opportunities match your filter
              </h3>
              <p className="text-xs text-[#45382F]/70 max-w-sm mx-auto">
                Try clearing your search query or selecting "All Dates" to see the upcoming schedule.
              </p>
              <button
                onClick={() => {
                  setFilterType('all');
                  setSearchQuery('');
                }}
                className="mt-2 px-4 py-2 text-xs font-semibold text-[#45382F] bg-[#F5EEDC] rounded-xl hover:bg-[#EBE2CC] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredRequirements.map((req) => {
                const totalRequired = (req.maleRequired ?? 0) + (req.femaleRequired ?? 0);
                const totalRegistered = (req.maleRegistered ?? 0) + (req.femaleRegistered ?? 0);
                const remaining = Math.max(0, totalRequired - totalRegistered);
                const isFull = remaining === 0 || req.status === 'CLOSED';
                const isPartiallyFilled = totalRegistered > 0 && !isFull;
                const fillPercentage =
                  totalRequired > 0 ? Math.min(100, Math.round((totalRegistered / totalRequired) * 100)) : 0;

                const dateInfo = formatDateDisplay(req.date);

                return (
                  <div
                    key={req.id}
                    className={`rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between ${
                      isFull
                        ? 'bg-neutral-50/80 border-neutral-200'
                        : isPartiallyFilled
                        ? 'bg-white border-[#C49A45]/30 shadow-xs hover:shadow-xl hover:border-[#C49A45]'
                        : 'bg-white border-[#819B82]/30 shadow-xs hover:shadow-xl hover:border-[#819B82]'
                    }`}
                  >
                    <div>
                      {/* Status Indicator Bar */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[11px] font-semibold text-[#45382F]/70 uppercase tracking-wider">
                          Service: Food Distribution
                        </span>

                        {/* Visual Status Indicator as requested */}
                        {isFull ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-600 border border-neutral-300">
                            <span className="w-2 h-2 rounded-full bg-neutral-400"></span>
                            Closed / Full
                          </span>
                        ) : isPartiallyFilled ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                            Partially Filled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#819B82]/15 text-[#45382F] border border-[#819B82]/40">
                            <span className="w-2 h-2 rounded-full bg-[#819B82]"></span>
                            Open for Registration
                          </span>
                        )}
                      </div>

                      {/* Title & Date */}
                      <h3 className="font-serif text-xl font-bold text-[#45382F] mb-1">{req.title}</h3>

                      <div className="space-y-1.5 mb-4 text-xs text-[#45382F]/80">
                        <div className="flex items-center gap-2 font-medium">
                          <Calendar className="w-4 h-4 text-[#C49A45] shrink-0" />
                          <span>
                            <strong>Date:</strong> {dateInfo.formattedDate} ({dateInfo.dayName})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#C49A45] shrink-0" />
                          <span>
                            <strong>Time:</strong> {req.startTime} – {req.endTime}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#C49A45] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{req.location}</span>
                        </div>
                      </div>

                      {/* Slot Details Box matching user's exact example */}
                      <div className="bg-[#FFFDF7] rounded-2xl p-4 border border-[#45382F]/10 space-y-2.5 mb-6 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[#45382F]/75">Male volunteers:</span>
                          <span className="font-semibold text-[#45382F] tabular-nums">
                            {req.maleRegistered ?? 0}/{req.maleRequired ?? 0} filled{' '}
                            {(req.maleRequired ?? 0) > 0 &&
                              (req.maleRegistered ?? 0) >= (req.maleRequired ?? 0) && (
                                <span className="text-neutral-400 font-normal">(Full)</span>
                              )}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[#45382F]/75">Female volunteers:</span>
                          <span className="font-semibold text-[#45382F] tabular-nums">
                            {req.femaleRegistered ?? 0}/{req.femaleRequired ?? 0} filled{' '}
                            {(req.femaleRequired ?? 0) > 0 &&
                              (req.femaleRegistered ?? 0) >= (req.femaleRequired ?? 0) && (
                                <span className="text-neutral-400 font-normal">(Full)</span>
                              )}
                          </span>
                        </div>

                        <div className="flex items-center justify-between font-medium pt-1 border-t border-[#45382F]/10">
                          <span className="text-[#45382F]">Total volunteers:</span>
                          <span className="font-bold text-[#45382F] tabular-nums">
                            {totalRegistered}/{totalRequired}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="pt-1">
                          <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isFull
                                  ? 'bg-neutral-500'
                                  : isPartiallyFilled
                                  ? 'bg-amber-500'
                                  : 'bg-[#819B82]'
                              }`}
                              style={{ width: `${fillPercentage}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 text-xs">
                          <span className="text-[#45382F]/80">Remaining positions:</span>
                          <span
                            className={`font-bold tabular-nums text-sm ${
                              remaining > 0 ? 'text-[#819B82]' : 'text-neutral-400'
                            }`}
                          >
                            {remaining}
                          </span>
                        </div>
                      </div>

                      {/* Instructions */}
                      {req.instructions && (
                        <p className="text-xs text-[#45382F]/70 line-clamp-2 mb-4 italic">
                          "{req.instructions}"
                        </p>
                      )}
                    </div>

                    {/* Footer Action Button */}
                    <div>
                      {isFull ? (
                        <div className="p-3 bg-neutral-100 rounded-2xl text-center space-y-2 border border-neutral-200">
                          <p className="text-xs font-medium text-neutral-600 leading-tight">
                            All volunteer positions are filled. Thank you to everyone who registered!
                          </p>
                          <button
                            disabled
                            className="w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-neutral-400 bg-neutral-200 rounded-xl cursor-not-allowed"
                          >
                            Registration Closed
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onOpenRegisterModal(req)}
                          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-[#C49A45] hover:bg-[#A57F32] rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-98"
                        >
                          <span>Register Now</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
