import React from 'react';
import { Heart, Calendar, Users, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import heroImg from '../../assets/images/nns_hero_volunteer_service_1794315488917.jpg';

interface HeroSectionProps {
  onVolunteerClick: () => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onVolunteerClick,
  onExploreClick,
}) => {
  return (
    <section className="relative px-3 sm:px-6 lg:px-8 pt-2 pb-8">
      {/* Immersive Curved Container matching reference design */}
      <div className="relative mx-auto max-w-7xl rounded-3xl sm:rounded-[2.5rem] overflow-hidden bg-[#2D241E] shadow-2xl min-h-[580px] lg:min-h-[640px] flex flex-col justify-between">
        {/* Background photography with measured contrast scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="NNS volunteers serving hot nutritious meals to patient families at Kidwai Hospital, Bengaluru"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
            referrerPolicy="no-referrer"
          />
          {/* Measured gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E1712]/95 via-[#2D241E]/80 to-[#2D241E]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E1712] via-transparent to-black/30" />
        </div>

        {/* Content Area */}
        <div className="relative z-10 px-6 sm:px-12 lg:px-16 pt-12 sm:pt-16 lg:pt-20 pb-12 max-w-3xl">
          {/* Unboxed editorial kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF7]/15 backdrop-blur-md border border-[#C49A45]/40 text-xs font-medium text-[#FFFDF7] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#819B82]"></span>
            <span>Kidwai Memorial Institute of Oncology, Bengaluru</span>
            <span className="text-[#C49A45]">·</span>
            <span>Daily Food Seva</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.15] mb-6 text-balance">
            Serve with <span className="text-[#C49A45] italic">Love</span>.<br />
            Make a <span className="text-[#D9A6A5]">Difference</span>.
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-white/85 leading-relaxed mb-8 max-w-2xl font-sans font-light">
            Join <strong className="text-white font-medium">Nitya Narayana Seva</strong> and become
            part of a compassionate community serving hot, wholesome meals to over 800 cancer
            patients and families every single day.
          </p>

          {/* CTA Buttons matching reference pill / rounded buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={onVolunteerClick}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-[#45382F] bg-white hover:bg-[#F5EEDC] rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer active:scale-95"
            >
              <Heart className="w-4 h-4 text-[#C49A45] fill-current" />
              <span>Volunteer With Us</span>
              <ArrowRight className="w-4 h-4 text-[#45382F]" />
            </button>

            <button
              onClick={onExploreClick}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium text-white hover:text-white bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-sm rounded-full transition-all duration-200 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#C49A45]" />
              <span>Explore Opportunities</span>
            </button>
          </div>
        </div>

        {/* Impact Statistics Strip (Supplied organizational statistics) */}
        <div className="relative z-10 border-t border-white/15 bg-black/40 backdrop-blur-md px-6 sm:px-12 lg:px-16 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
            <div className="space-y-0.5">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#C49A45] tabular-nums">
                800+
              </div>
              <div className="text-xs sm:text-sm text-white/75 font-medium">
                People Served Daily
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-white tabular-nums">
                365 Days
              </div>
              <div className="text-xs sm:text-sm text-white/75 font-medium">
                Daily Food Distribution
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#D9A6A5] tabular-nums">
                100%
              </div>
              <div className="text-xs sm:text-sm text-white/75 font-medium">
                Community-Driven Service
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#819B82] tabular-nums">
                80+
              </div>
              <div className="text-xs sm:text-sm text-white/75 font-medium">
                Volunteers in Network
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
