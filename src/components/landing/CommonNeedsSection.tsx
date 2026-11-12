import React from 'react';
import { Utensils, HeartHandshake, Sparkles, CheckCircle2 } from 'lucide-react';

export const CommonNeedsSection: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Centered Heading matching reference theme style */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#45382F] tracking-tight mb-4 text-balance">
          Our Core Daily <span className="text-[#C49A45]">Seva</span> Commitments
        </h2>
        <p className="text-base text-[#45382F]/75 font-sans leading-relaxed">
          At Kidwai Memorial Institute of Oncology, volunteer hands ensure every patient attendant
          and family member receives warm, wholesome food with deep empathy.
        </p>
      </div>

      {/* 3 Elevated Feature Cards matching reference layout with center highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center">
        {/* Card 1: Food Distribution */}
        <div className="bg-white rounded-3xl p-8 border border-[#45382F]/10 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-[#F5EEDC] flex items-center justify-center text-[#C49A45] mb-6">
            <Utensils className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#45382F] mb-3">
            Wholesome Food Distribution
          </h3>
          <p className="text-sm text-[#45382F]/75 mb-6 leading-relaxed">
            Distributing freshly prepared hot meals directly into stainless steel plates outside
            OPD and waiting areas.
          </p>
          <ul className="space-y-3 text-sm text-[#45382F]/85">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#819B82] shrink-0 mt-0.5" />
              <span>Nutritious rice, dal, and fresh vegetable curry</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#819B82] shrink-0 mt-0.5" />
              <span>Dignified serving with respect and care</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#819B82] shrink-0 mt-0.5" />
              <span>Queue guidance for elderly & frail attendees</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#819B82] shrink-0 mt-0.5" />
              <span>Uninterrupted 11:00 AM – 2:00 PM timing</span>
            </li>
          </ul>
        </div>

        {/* Card 2: Center Highlighted Card (elevated & distinctive) */}
        <div className="relative bg-[#45382F] text-white rounded-3xl p-8 lg:p-9 shadow-xl border border-[#C49A45]/40 md:-translate-y-3 z-10 overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 bg-[#C49A45]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="w-12 h-12 rounded-2xl bg-[#C49A45] flex items-center justify-center text-white mb-6 shadow-md">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#C49A45] mb-1">
            Compassionate Care
          </div>
          <h3 className="font-serif text-2xl font-bold text-white mb-3">
            Attendant & Patient Support
          </h3>
          <p className="text-sm text-white/80 mb-6 leading-relaxed">
            Families often travel hundreds of kilometers for cancer care on tight budgets. A warm meal
            restores their strength and hope.
          </p>
          <ul className="space-y-3 text-sm text-white/90">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#C49A45] shrink-0 mt-0.5" />
              <span>Easy-to-digest porridge & buttermilk for patient diets</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#C49A45] shrink-0 mt-0.5" />
              <span>Warm listening and reassuring human connection</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#C49A45] shrink-0 mt-0.5" />
              <span>Clean hydration and water refill support</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#C49A45] shrink-0 mt-0.5" />
              <span>Support for pediatric & oncology ward families</span>
            </li>
          </ul>
        </div>

        {/* Card 3: Hygiene & Quality Assurance */}
        <div className="bg-white rounded-3xl p-8 border border-[#45382F]/10 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-[#F5EEDC] flex items-center justify-center text-[#C49A45] mb-6">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#45382F] mb-3">
            Hygiene & Food Safety
          </h3>
          <p className="text-sm text-[#45382F]/75 mb-6 leading-relaxed">
            Maintaining hospital-grade cleanliness standards at every step of preparation,
            service, and cleanup.
          </p>
          <ul className="space-y-3 text-sm text-[#45382F]/85">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#819B82] shrink-0 mt-0.5" />
              <span>Sanitized stainless steel serving utensils</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#819B82] shrink-0 mt-0.5" />
              <span>Clean aprons, gloves, and hairnets for all volunteers</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#819B82] shrink-0 mt-0.5" />
              <span>Spotless post-seva area cleaning and sanitization</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#819B82] shrink-0 mt-0.5" />
              <span>Zero food wastage through careful portioning</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
