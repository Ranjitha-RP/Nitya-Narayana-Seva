import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Phone, MessageSquare, ShieldCheck } from 'lucide-react';

interface FaqSectionProps {
  onContactCoordinators: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onContactCoordinators }) => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const faqs = [
    {
      q: 'What makes NNS different from other volunteer initiatives?',
      a: 'NNS serves directly on the ground at Kidwai Memorial Institute of Oncology every day of the year. We focus on personal, human-to-human connection: serving hot meals into stainless steel plates with two hands, listening with empathy, and maintaining absolute hygiene.',
    },
    {
      q: 'Do I need prior volunteering experience to participate?',
      a: 'No prior experience is necessary! Our experienced coordinators are present every single day to orient you, assign your seva station, and support you throughout the service. We welcome first-time volunteers with open hearts.',
    },
    {
      q: 'Why are male and female volunteer slots separated?',
      a: 'Kidwai Hospital food distribution requires different stations: heavy cauldron handling, food serving, queue management for female and male patient attendees, and distribution in specialized wards. Having balanced teams ensures smooth and comfortable operations for everyone.',
    },
    {
      q: 'What if I need to cancel my registered seva slot?',
      a: 'You can easily cancel your registration through the "My Registrations" portal with one click. Doing so immediately frees up the position so another willing volunteer in Bengaluru can step forward.',
    },
    {
      q: 'Are meals provided for volunteers as well?',
      a: 'Yes, after serving the patients and attendants, all volunteers and coordinators sit together for Prasadam seva. Sharing meals together fosters a deeply bonded community.',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Accordion Questions */}
        <div className="lg:col-span-7 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className={`rounded-2xl sm:rounded-3xl p-6 transition-all duration-300 cursor-pointer border ${
                  isOpen
                    ? 'bg-white border-[#C49A45]/50 shadow-md ring-1 ring-[#C49A45]/20'
                    : 'bg-[#FFFDF7] border-[#45382F]/10 hover:border-[#C49A45]/30 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#45382F] leading-snug">
                    {faq.q}
                  </h3>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                      isOpen
                        ? 'bg-[#45382F] text-white border-[#45382F]'
                        : 'bg-[#F5EEDC] text-[#45382F] border-[#45382F]/10'
                    }`}
                  >
                    {isOpen ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-4 pt-4 border-t border-[#45382F]/10 text-sm text-[#45382F]/80 leading-relaxed animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Title & Coordinator Card matching reference theme */}
        <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C49A45] block mb-2">
              Common Questions
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#45382F] tracking-tight mb-4 text-balance">
              Questions <span className="text-[#C49A45]">Answered FAQ</span>
            </h2>
            <p className="text-base text-[#45382F]/75 font-sans leading-relaxed">
              Everything you need to know about serving with Nitya Narayana Seva at Kidwai Memorial
              Institute of Oncology.
            </p>
          </div>

          {/* Coordinator Help Card matching reference screenshot */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#45382F]/10 shadow-lg space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#C49A45] text-white flex items-center justify-center font-bold text-base shadow-xs">
                NNS
              </div>
              <div>
                <h4 className="font-bold text-[#45382F] text-sm">Have more questions?</h4>
                <p className="text-xs text-[#45382F]/70">Connect directly with our Seva coordinators</p>
              </div>
            </div>

            <p className="text-xs text-[#45382F]/80 leading-relaxed">
              We are available to answer inquiries regarding group volunteering, corporate CSR
              support, or special date bookings.
            </p>

            <div className="pt-1 flex flex-col sm:flex-row gap-2">
              <a
                href="tel:+919845012345"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#45382F] hover:bg-[#2D241E] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#C49A45]" />
                <span>Call Coordinator</span>
              </a>
              <button
                onClick={onContactCoordinators}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5EEDC] hover:bg-[#EBE2CC] text-[#45382F] text-xs font-semibold uppercase tracking-wider border border-[#C49A45]/30 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#C49A45]" />
                <span>WhatsApp Query</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
