import React from 'react';
import { useSeva } from '../../context/SevaContext';
import { Calendar, Clock, MapPin, Users, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { VolunteerRequirement } from '../../types';

interface OpportunitiesPreviewProps {
  onOpenRegisterModal: (req?: VolunteerRequirement) => void;
  onViewAllOpportunities: () => void;
}

export const OpportunitiesPreview: React.FC<OpportunitiesPreviewProps> = ({
  onOpenRegisterModal,
  onViewAllOpportunities,
}) => {
  const { requirements } = useSeva();

  // Show top 3 upcoming opportunities
  const previewItems = requirements.slice(0, 3);

  const getStatusBadge = (req: VolunteerRequirement) => {
    const totalRequired = (req.maleRequired ?? 0) + (req.femaleRequired ?? 0);
    const totalRegistered = (req.maleRegistered ?? 0) + (req.femaleRegistered ?? 0);
    const isFull = totalRegistered >= totalRequired && totalRequired > 0;

    if (isFull || req.status === 'CLOSED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-600 border border-neutral-300">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span>
          Positions Filled
        </span>
      );
    }

    if (totalRegistered > 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          Partially Filled ({totalRequired - totalRegistered} left)
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#819B82]/15 text-[#45382F] border border-[#819B82]/40">
        <span className="w-1.5 h-1.5 rounded-full bg-[#819B82]"></span>
        Open for Registration
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    try {
      const clean = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`;
      const d = new Date(clean);
      if (isNaN(d.getTime())) {
        return { dayName: 'Seva', dayNum: '—', monthName: dateStr };
      }
      return {
        dayName: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        dayNum: d.getDate(),
        monthName: d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      };
    } catch {
      return { dayName: 'Seva', dayNum: '—', monthName: dateStr };
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header with Title and "View All" Link */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5EEDC] text-xs font-semibold uppercase tracking-wider text-[#C49A45] mb-3">
            Real-Time Slot Availability
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#45382F] tracking-tight text-balance">
            Upcoming <span className="text-[#C49A45]">Seva Opportunities</span>
          </h2>
          <p className="text-base text-[#45382F]/75 font-sans mt-2 max-w-xl">
            Live volunteer requirements for food distribution at Kidwai Memorial Institute of Oncology.
          </p>
        </div>

        <button
          onClick={onViewAllOpportunities}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#45382F] hover:text-[#C49A45] transition-colors cursor-pointer self-start md:self-end pb-1"
        >
          <span>View All Available Dates</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Preview Cards */}
      {previewItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-12 border border-[#45382F]/10 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#F5EEDC] text-[#C49A45] flex items-center justify-center mx-auto">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#45382F]">
            No Seva Events Published Yet
          </h3>
          <p className="text-xs sm:text-sm text-[#45382F]/75 max-w-md mx-auto leading-relaxed">
            The coordinator has not launched any volunteer requirements yet. As soon as a requirement
            is created in the coordinator hub, it will appear here for public registration.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onViewAllOpportunities}
              className="px-6 py-3 rounded-xl bg-[#C49A45] hover:bg-[#A57F32] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Open Volunteer Dashboard
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {previewItems.map((req) => {
            const totalRequired = (req.maleRequired ?? 0) + (req.femaleRequired ?? 0);
            const totalRegistered = (req.maleRegistered ?? 0) + (req.femaleRegistered ?? 0);
            const remaining = Math.max(0, totalRequired - totalRegistered);
            const isFull = remaining === 0 || req.status === 'CLOSED';
            const fillPercentage =
              totalRequired > 0 ? Math.min(100, Math.round((totalRegistered / totalRequired) * 100)) : 0;

            const dateMeta = formatDate(req.date);

            return (
              <div
                key={req.id}
                className={`rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between ${
                  isFull
                    ? 'bg-neutral-50/70 border-neutral-200 opacity-90'
                    : 'bg-white border-[#45382F]/10 shadow-xs hover:shadow-xl hover:border-[#C49A45]/40'
                }`}
              >
                <div>
                  {/* Header Date & Status */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#F5EEDC] border border-[#C49A45]/30 flex flex-col items-center justify-center text-[#45382F] shrink-0">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#C49A45]">
                          {dateMeta.dayName}
                        </span>
                        <span className="font-serif text-lg font-bold leading-none tabular-nums">
                          {dateMeta.dayNum}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#45382F]">{dateMeta.monthName}</div>
                        <div className="flex items-center gap-1.5 text-xs text-[#45382F]/70">
                          <Clock className="w-3.5 h-3.5 text-[#C49A45]" />
                          <span>
                            {req.startTime} – {req.endTime}
                          </span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(req)}
                  </div>

                  {/* Service Title & Location */}
                  <h3 className="font-serif text-xl font-bold text-[#45382F] mb-2">{req.title}</h3>
                  <div className="flex items-start gap-2 text-xs text-[#45382F]/75 mb-6">
                    <MapPin className="w-3.5 h-3.5 text-[#C49A45] shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{req.location}</span>
                  </div>

                  {/* Detailed Slot Breakdown */}
                  <div className="space-y-3 bg-[#FFFDF7] p-4 rounded-2xl border border-[#45382F]/10 mb-6">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#45382F]/70">Male Volunteers:</span>
                      <span className="font-semibold text-[#45382F] tabular-nums">
                        {req.maleRegistered ?? 0}/{req.maleRequired ?? 0} filled
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#45382F]/70">Female Volunteers:</span>
                      <span className="font-semibold text-[#45382F] tabular-nums">
                        {req.femaleRegistered ?? 0}/{req.femaleRequired ?? 0} filled
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="pt-1">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-medium text-[#45382F]/80">Capacity Progress</span>
                        <span className="font-bold text-[#45382F] tabular-nums">{fillPercentage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isFull
                              ? 'bg-neutral-500'
                              : fillPercentage > 70
                              ? 'bg-amber-500'
                              : 'bg-[#819B82]'
                          }`}
                          style={{ width: `${fillPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#45382F]/10 text-xs font-semibold">
                      <span className="text-[#45382F]">Remaining Positions:</span>
                      <span
                        className={`tabular-nums ${
                          remaining > 0 ? 'text-[#819B82] font-bold text-sm' : 'text-neutral-500'
                        }`}
                      >
                        {remaining} open
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2">
                  {isFull ? (
                    <div className="p-3 bg-neutral-100 rounded-xl text-center">
                      <p className="text-xs font-medium text-neutral-600">
                        All volunteer positions are filled. Thank you to everyone who registered!
                      </p>
                      <button
                        disabled
                        className="mt-2 w-full py-2.5 px-4 text-xs font-medium text-neutral-400 bg-neutral-200 rounded-xl cursor-not-allowed"
                      >
                        Registration Closed
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onOpenRegisterModal(req)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-[#C49A45] hover:bg-[#A57F32] rounded-xl shadow-xs transition-all duration-200 cursor-pointer active:scale-98"
                    >
                      <span>Register for This Date</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
