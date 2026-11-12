import React from 'react';
import { Compass, UserCheck, HeartHandshake, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  onRegisterClick: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onRegisterClick }) => {
  const steps = [
    {
      num: '01',
      title: 'Discover',
      tagline: 'Explore Upcoming Requirements',
      desc: 'Browse our live calendar of daily food distribution dates at Kidwai Hospital. Check real-time male and female position availability.',
      icon: Compass,
    },
    {
      num: '02',
      title: 'Register',
      tagline: 'Select Slot & Confirm',
      desc: 'Pick your preferred date, enter your name and phone number. Instantly reserve your spot without waiting for WhatsApp confirmations.',
      icon: UserCheck,
    },
    {
      num: '03',
      title: 'Serve',
      tagline: 'Distribute Food with Love',
      desc: 'Arrive at Kidwai Gate 2 by 10:45 AM. Put on your seva apron and experience the profound joy of feeding 800+ souls with dignity.',
      icon: HeartHandshake,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5EEDC] text-xs font-semibold uppercase tracking-wider text-[#C49A45] mb-3">
          Simple 3-Step Process
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#45382F] tracking-tight mb-4 text-balance">
          How <span className="text-[#C49A45]">It Works</span>
        </h2>
        <p className="text-base text-[#45382F]/75 font-sans leading-relaxed">
          From registration to service, our platform ensures a smooth, organized experience for
          every volunteer and coordinator.
        </p>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="relative bg-white rounded-3xl p-8 border border-[#45382F]/10 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-serif text-3xl font-bold text-[#C49A45]/40 tabular-nums">
                    {step.num}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#F5EEDC] text-[#C49A45] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="text-xs font-semibold uppercase tracking-wider text-[#C49A45] mb-1">
                  Step {idx + 1}
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#45382F] mb-2">{step.title}</h3>
                <p className="text-xs font-medium text-[#45382F]/60 mb-3">{step.tagline}</p>
                <p className="text-sm text-[#45382F]/75 leading-relaxed">{step.desc}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#45382F]/10 flex items-center text-xs font-semibold text-[#C49A45] gap-1.5">
                <span>Direct coordination at Kidwai</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={onRegisterClick}
          className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#C49A45] hover:bg-[#A57F32] rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
        >
          <span>Register for Upcoming Seva</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
