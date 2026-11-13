import React from 'react';
import { Logo } from '../common/Logo';

export const WhatsAppCommunityStrip: React.FC = () => {
  return (
    <section className="py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-[#F5EEDC] rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-12 border border-[#C49A45]/30 shadow-md">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFDF7] border border-[#C49A45]/40 text-xs font-semibold uppercase tracking-wider text-[#C49A45]">
            Daily Community Network
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#45382F] tracking-tight text-balance">
            Nitya Narayana Seva, Serving Bengaluru with Dignity
          </h3>
          <p className="text-sm sm:text-base text-[#45382F]/75 font-sans leading-relaxed max-w-xl">
            Coordinators and volunteers coordinate daily to ensure no cancer patient attendee goes
            hungry. Connect with our dedicated volunteer community.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6">
            <Logo variant="dark" size="sm" showTagline={false} />
            <div className="text-xs text-[#45382F]/70 font-medium">
              Kidwai Hospital Seva Camp · Gate 2 Bengaluru
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
