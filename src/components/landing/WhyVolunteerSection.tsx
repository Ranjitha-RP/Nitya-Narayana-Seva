import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';
import volunteerTeamImg from '../../assets/images/nns_volunteers_team_1794315492268.jpg';

export const WhyVolunteerSection: React.FC = () => {
  const [activeItem, setActiveItem] = useState<number>(0);

  const reasons = [
    {
      title: 'Flexible Scheduling & Morning Service',
      short: '11:00 AM – 2:00 PM fits around work, college, and family life.',
      details:
        'Our 3-hour morning service window allows working professionals, students, and elders to dedicate meaningful time to humanity without having to commit whole days. Free parking and volunteer lockers are arranged at Kidwai Hospital.',
      icon: Clock,
    },
    {
      title: 'Transparent Real-Time Coordination',
      short: 'No confusing WhatsApp group spam or lost registrations.',
      details:
        'Know exactly which dates need volunteers before leaving home. Our live platform guarantees your slot is confirmed, shows male/female balance, and alerts you instantly if a requirement is fulfilled.',
      icon: ShieldCheck,
    },
    {
      title: 'Direct, Meaningful Human Impact',
      short: 'Touch over 800 lives in need of warmth, food, and hope daily.',
      details:
        'You hand wholesome hot meals directly to cancer patients and their tired family attendants. Experience the genuine gratitude and camaraderie that makes seva a life-changing experience.',
      icon: HeartHandshake,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Heading & Interactive Reason Cards */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#45382F] tracking-tight mb-4 text-balance">
              Why Volunteer with <span className="text-[#C49A45]">NNS</span>?
            </h2>
            <p className="text-base text-[#45382F]/75 font-sans leading-relaxed max-w-xl">
              Currently, WhatsApp groups make tracking positions hard. NNS provides a dignified,
              transparent platform so you can focus on serving with love.
            </p>
          </div>

          {/* Cards with arrows matching reference screenshot */}
          <div className="space-y-4">
            {reasons.map((reason, idx) => {
              const isActive = activeItem === idx;
              const Icon = reason.icon;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveItem(idx)}
                  className={`rounded-2xl sm:rounded-3xl p-6 transition-all duration-300 cursor-pointer border ${
                    isActive
                      ? 'bg-white border-[#C49A45]/50 shadow-md ring-1 ring-[#C49A45]/30'
                      : 'bg-[#FFFDF7] border-[#45382F]/10 hover:border-[#C49A45]/40 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-[#C49A45] text-white'
                            : 'bg-[#F5EEDC] text-[#45382F]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#45382F]">
                        {reason.title}
                      </h3>
                    </div>

                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-200 ${
                        isActive
                          ? 'bg-[#45382F] text-white border-[#45382F]'
                          : 'bg-[#F5EEDC] text-[#45382F] border-[#45382F]/10'
                      }`}
                    >
                      {isActive ? (
                        <ArrowDownRight className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isActive && (
                    <div className="mt-4 pt-4 border-t border-[#45382F]/10 pl-14 text-sm text-[#45382F]/80 leading-relaxed space-y-2 animate-fadeIn">
                      <p className="font-medium text-[#45382F]">{reason.short}</p>
                      <p className="text-[#45382F]/75">{reason.details}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Warm Photography */}
        <div className="lg:col-span-5">
          <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-2xl aspect-4/5 max-h-[580px] w-full border border-[#45382F]/10">
            <img
              src={volunteerTeamImg}
              alt="NNS Volunteer Team smiling at Kidwai Memorial Institute of Oncology, Bengaluru"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {/* Soft gradient bottom overlay with quote */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D241E]/90 via-[#2D241E]/30 to-transparent flex flex-col justify-end p-8 text-white">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C49A45] mb-2">
                "A Little Help. A Lot of Humanity."
              </span>
              <p className="font-serif text-xl sm:text-2xl font-bold leading-snug text-white">
                "When you look into their eyes and hand them a warm plate of rice, you see the
                sacred divinity in every human being."
              </p>
              <span className="text-xs text-white/70 mt-3 font-medium">
                — NNS Volunteer Reflection, Kidwai Seva Camp
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
