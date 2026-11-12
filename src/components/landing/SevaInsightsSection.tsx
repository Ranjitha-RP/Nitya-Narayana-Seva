import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Heart, Sparkles, X } from 'lucide-react';
import servingImg from '../../assets/images/nns_serving_kidwai_hospital_1794315493128.jpg';
import kitchenImg from '../../assets/images/nns_food_prep_cooking_1794315490474.jpg';
import smilesImg from '../../assets/images/nns_community_smiles_1794315492872.jpg';

export const SevaInsightsSection: React.FC = () => {
  const [selectedGuide, setSelectedGuide] = useState<number | null>(null);

  const guides = [
    {
      title: 'First-Time Volunteer Guide: What to Expect at Kidwai',
      tag: 'Preparation Guide',
      img: smilesImg,
      summary: 'Timings, parking at Gate 2, locker provisions, and where to report on your first morning.',
      content:
        'Please report by 10:45 AM at Gate 2 Seva Counter. Our senior volunteer coordinator will orient you, assign your seva station (either food distribution, plate sanitization, or queue assistance), and provide your official NNS seva apron and hairnet.',
    },
    {
      title: 'Hygiene & Cleanliness: Hospital-Grade Seva Protocols',
      tag: 'Hygiene Protocol',
      img: kitchenImg,
      summary: 'Sanitization practices, double-handing plates, and maintaining absolute cleanliness.',
      content:
        'Serving in a hospital environment requires highest cleanliness standards. Hands must be washed with antibacterial soap prior to service. Clean gloves and hairnets must be worn throughout the food service. Food is served piping hot with dedicated long-handled ladles.',
    },
    {
      title: 'Dignity & Compassion: The True Spirit of Annadana',
      tag: 'Seva Philosophy',
      img: servingImg,
      summary: 'Why offering a warm smile and respectful word is as vital as the food itself.',
      content:
        'Annadana is sacred service. We greet each recipient with "Namaskara" and serve with both hands. Many family members carry emotional burdens of severe cancer diagnoses; your kindness, patience, and encouraging presence brings profound solace.',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#45382F] tracking-tight mb-2 text-balance">
            Volunteer Guidelines & <span className="text-[#C49A45]">Resources</span>
          </h2>
          <p className="text-base text-[#45382F]/75 font-sans max-w-xl">
            Everything you need to know before joining us for morning seva at Kidwai Hospital.
          </p>
        </div>
      </div>

      {/* 3 Photo Cards matching reference theme */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {guides.map((guide, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedGuide(idx)}
            className="group relative rounded-3xl overflow-hidden aspect-4/5 sm:aspect-3/4 bg-[#2D241E] cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 border border-[#45382F]/10"
          >
            {/* Background photo */}
            <img
              src={guide.img}
              alt={guide.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end p-6 sm:p-7 text-white">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C49A45] mb-2">
                {guide.tag}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold leading-snug mb-2 group-hover:text-[#F5EEDC] transition-colors">
                {guide.title}
              </h3>
              <p className="text-xs text-white/80 line-clamp-2">{guide.summary}</p>
              <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-medium text-[#C49A45]">
                <span>Read Full Guideline</span>
                <span>↗</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Guide Details Modal */}
      {selectedGuide !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FFFDF7] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#45382F]/10 relative">
            <button
              onClick={() => setSelectedGuide(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#F5EEDC] text-[#45382F] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#C49A45] mb-2">
              {guides[selectedGuide].tag}
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#45382F] mb-4">
              {guides[selectedGuide].title}
            </h3>
            <p className="text-sm text-[#45382F]/80 leading-relaxed mb-6">
              {guides[selectedGuide].content}
            </p>
            <div className="p-4 bg-[#F5EEDC] rounded-2xl text-xs text-[#45382F]/80 space-y-1">
              <strong className="block text-[#45382F] font-semibold">Service Station Details:</strong>
              <div>• Kidwai Memorial Institute of Oncology, Gate 2</div>
              <div>• Timing: 10:45 AM Arrival, Service 11:00 AM – 2:00 PM</div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedGuide(null)}
                className="px-6 py-2.5 bg-[#45382F] text-white text-xs font-semibold rounded-xl hover:bg-[#2D241E] transition-colors"
              >
                Close Guideline
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
