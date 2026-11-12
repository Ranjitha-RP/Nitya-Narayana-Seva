import React, { useState } from 'react';
import { Calendar, Users, Search, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import heroBg from '../../assets/images/nns_hero_volunteer_service_1794315488917.jpg';
import { useSeva } from '../../context/SevaContext';

interface QuickSlotFinderBannerProps {
  onSelectDate: (date: string) => void;
}

export const QuickSlotFinderBanner: React.FC<QuickSlotFinderBannerProps> = ({ onSelectDate }) => {
  const { requirements } = useSeva();
  const [selectedDate, setSelectedDate] = useState<string>(
    requirements[0]?.date || '2026-11-10'
  );

  // Calculate stats for selected date safely
  const targetReq =
    requirements.find((r) => r.date === selectedDate) || requirements[0];
  const maleRem = targetReq
    ? Math.max(0, (targetReq.maleRequired ?? 0) - (targetReq.maleRegistered ?? 0))
    : 0;
  const femaleRem = targetReq
    ? Math.max(0, (targetReq.femaleRequired ?? 0) - (targetReq.femaleRegistered ?? 0))
    : 0;
  const totalRem = maleRem + femaleRem;

  const handleCheck = () => {
    if (requirements.length > 0) {
      onSelectDate(selectedDate);
    }
  };

  const formatDateDisplay = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const clean = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`;
      const d = new Date(clean);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Dark curved banner matching the reference theme */}
      <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden bg-[#2D241E] p-8 sm:p-14 lg:p-16 shadow-xl flex items-center justify-center">
        {/* Background photography with darkened overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Kidwai Hospital Food Distribution Service"
            className="w-full h-full object-cover opacity-25 filter blur-xs"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#2D241E]/85" />
        </div>

        {/* Centered Card matching reference screenshot style */}
        <div className="relative z-10 w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 text-center text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C49A45]/30 border border-[#C49A45]/50 text-xs font-medium text-[#FFFDF7] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#819B82]"></span>
            <span>Real-Time Position Tracker</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3 tracking-tight">
            Find an Open Seva Slot Today
          </h3>
          <p className="text-sm text-white/80 max-w-md mx-auto mb-6">
            {requirements.length > 0
              ? 'Select an upcoming service date to check open volunteer positions at Kidwai Memorial Institute, Bengaluru.'
              : 'Coordinators launch daily seva events according to patient needs. Check open positions or launch today’s event.'}
          </p>

          {/* Interactive Picker & Action Button */}
          {requirements.length > 0 ? (
            <>
              <div className="flex flex-col sm:flex-row items-center gap-3 bg-black/40 p-2 sm:p-2.5 rounded-2xl border border-white/15">
                <div className="flex items-center gap-3 px-4 py-2.5 w-full bg-white/5 rounded-xl border border-white/10 text-left">
                  <Calendar className="w-4 h-4 text-[#C49A45] shrink-0" />
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent text-white text-sm w-full focus:outline-hidden cursor-pointer"
                    aria-label="Select service date"
                  >
                    {requirements.map((req) => (
                      <option key={req.id} value={req.date} className="bg-[#2D241E] text-white">
                        {formatDateDisplay(req.date)} — {req.title}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleCheck}
                  className="w-full sm:w-auto px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#45382F] bg-white hover:bg-[#F5EEDC] rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Check Open Slots</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Real-time quick preview */}
              {targetReq && (
                <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs text-white/85">
                  <span>
                    Available Slots:{' '}
                    <strong className="text-[#C49A45] tabular-nums font-semibold">
                      {totalRem}
                    </strong>{' '}
                    open
                  </span>
                  <span>·</span>
                  <span>
                    Male: <strong className="tabular-nums">{maleRem}</strong>
                  </span>
                  <span>·</span>
                  <span>
                    Female: <strong className="tabular-nums">{femaleRem}</strong>
                  </span>
                  <span>·</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      totalRem === 0
                        ? 'bg-neutral-600 text-white'
                        : totalRem < 3
                        ? 'bg-amber-600/80 text-white'
                        : 'bg-[#819B82] text-white'
                    }`}
                  >
                    {totalRem === 0
                      ? 'All Positions Filled'
                      : totalRem < 3
                      ? 'Limited Slots Remaining'
                      : 'Open for Registration'}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="bg-black/30 p-5 rounded-2xl border border-white/15 text-center space-y-3">
              <p className="text-xs text-white/80">
                No active seva events published yet. Coordinators can launch today's requirement from
                the Coordinator Portal.
              </p>
              <button
                onClick={() => onSelectDate('')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#45382F] text-xs font-semibold uppercase tracking-wider hover:bg-[#F5EEDC] transition-colors"
              >
                <span>Go to Opportunities Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
