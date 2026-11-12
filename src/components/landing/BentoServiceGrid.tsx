import React from 'react';
import { ArrowRight, Users, Heart, Sparkles } from 'lucide-react';
import kitchenImg from '../../assets/images/nns_food_prep_cooking_1794315490474.jpg';
import servingImg from '../../assets/images/nns_serving_kidwai_hospital_1794315493128.jpg';
import smilesImg from '../../assets/images/nns_community_smiles_1794315492872.jpg';
import teamImg from '../../assets/images/nns_volunteers_team_1794315492268.jpg';

interface BentoServiceGridProps {
  onViewAllOpportunities: () => void;
}

export const BentoServiceGrid: React.FC<BentoServiceGridProps> = ({
  onViewAllOpportunities,
}) => {
  return (
    <section id="about-nns" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Centered Heading */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#45382F] tracking-tight mb-4 text-balance">
          Every Plate Served with <span className="text-[#C49A45]">Dignity & Care</span>
        </h2>
        <p className="text-base text-[#45382F]/75 font-sans leading-relaxed">
          From early morning vegetarian cooking to midday distribution, every step is powered by
          compassionate community volunteers.
        </p>
      </div>

      {/* 4-Card Bento Grid matching reference theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Card 1: Wholesome Preparation */}
        <div className="group bg-white rounded-3xl p-6 sm:p-8 border border-[#45382F]/10 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C49A45]">
                Morning Seva
              </span>
              <span className="text-xs text-[#45382F]/60">08:00 AM – 10:30 AM</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#45382F] mb-2">
              Fresh Vegetarian Preparation
            </h3>
            <p className="text-sm text-[#45382F]/75 mb-6 leading-relaxed">
              Wholesome lentils, vegetables, and rice are cooked fresh in large sanitized stainless steel
              cauldrons under the care of experienced cooks and seva assistants.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-4/3 max-h-64 sm:max-h-72 w-full relative">
            <img
              src={kitchenImg}
              alt="Volunteers and cooks preparing fresh food in large stainless steel cauldrons"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Card 2: Kidwai Hospital Distribution (with badge) */}
        <div className="group bg-white rounded-3xl p-6 sm:p-8 border border-[#45382F]/10 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C49A45]">
                Direct Service
              </span>
              <span className="text-xs text-[#45382F]/60">Gate 2 & OPD Courtyard</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#45382F] mb-2">
              Kidwai Hospital Distribution
            </h3>
            <p className="text-sm text-[#45382F]/75 mb-6 leading-relaxed">
              Serving steaming meals directly to patients undergoing chemotherapy, outpatient visitors,
              and tired attendants who have traveled from remote villages.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-4/3 max-h-64 sm:max-h-72 w-full relative">
            <img
              src={servingImg}
              alt="Volunteer gently serving warm food to hospital attendant"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            {/* Impact Badge matching reference theme's "450+ workers" pill */}
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#45382F]/10 shadow-md flex items-center gap-2">
              <div className="flex -space-x-1.5 overflow-hidden">
                <span className="inline-block h-5 w-5 rounded-full bg-[#C49A45] ring-1 ring-white text-[9px] text-white flex items-center justify-center font-bold">
                  8
                </span>
                <span className="inline-block h-5 w-5 rounded-full bg-[#819B82] ring-1 ring-white text-[9px] text-white flex items-center justify-center font-bold">
                  0
                </span>
                <span className="inline-block h-5 w-5 rounded-full bg-[#D9A6A5] ring-1 ring-white text-[9px] text-white flex items-center justify-center font-bold">
                  0
                </span>
              </div>
              <span className="text-xs font-semibold text-[#45382F] tabular-nums">
                800+ Served Daily
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Community Kindness & View All Button */}
        <div className="group bg-white rounded-3xl p-6 sm:p-8 border border-[#45382F]/10 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C49A45] block mb-2">
              Human Compassion
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#45382F] mb-2">
              A Gentle Word, A Warm Meal
            </h3>
            <p className="text-sm text-[#45382F]/75 mb-6 leading-relaxed">
              More than food, NNS offers warmth, empathy, and dignity. Volunteers listen with compassion
              and bring joy to families experiencing difficult medical battles.
            </p>
            <button
              onClick={onViewAllOpportunities}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#45382F] hover:bg-[#2D241E] rounded-xl transition-colors cursor-pointer"
            >
              <span>Explore All Seva Slots</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-4/3 max-h-60 w-full relative">
            <img
              src={smilesImg}
              alt="Volunteer exchanging warm smile with elderly recipient"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Card 4: Dedicated Volunteer Community */}
        <div className="group bg-white rounded-3xl p-6 sm:p-8 border border-[#45382F]/10 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C49A45] block mb-2">
              Unity & Inclusiveness
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#45382F] mb-2">
              The Volunteer Community
            </h3>
            <p className="text-sm text-[#45382F]/75 mb-6 leading-relaxed">
              Professionals, students, homemakers, and retirees uniting shoulder-to-shoulder with one
              mission: "A Little Help. A Lot of Humanity."
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-4/3 max-h-60 w-full relative">
            <img
              src={teamImg}
              alt="NNS volunteer team outside Kidwai Hospital campus in Bengaluru"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
