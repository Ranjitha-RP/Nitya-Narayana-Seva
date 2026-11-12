import React, { useState } from 'react';
import { MessageSquare, ArrowRight, Share2, Check } from 'lucide-react';
import { Logo } from '../common/Logo';

export const WhatsAppCommunityStrip: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const text = 'Join Nitya Narayana Seva (NNS) daily food distribution at Kidwai Hospital, Bengaluru: https://nityanarayanaseva.org';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section className="py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Container matching reference theme's Neighborly card */}
      <div className="bg-[#F5EEDC] rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-12 border border-[#C49A45]/30 shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Side */}
          <div className="lg:col-span-7 space-y-4">
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
            <div className="pt-2 flex items-center gap-6">
              <Logo variant="dark" size="sm" showTagline={false} />
              <div className="text-xs text-[#45382F]/70 font-medium">
                Kidwai Hospital Seva Camp · Gate 2 Bengaluru
              </div>
            </div>
          </div>

          {/* Right Side: Community card matching App download box in reference */}
          <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#45382F]/10 shadow-lg text-center space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#45382F]/70 block">
              Official Volunteer Network
            </span>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://chat.whatsapp.com/sample-nns-volunteers"
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#819B82] hover:bg-[#688269] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Join WhatsApp</span>
              </a>

              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#45382F] hover:bg-[#2D241E] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-[#819B82]" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Link Copied!' : 'Share Platform'}</span>
              </button>
            </div>

            <p className="text-[11px] text-[#45382F]/65 pt-2 border-t border-[#45382F]/10">
              Receive broadcast updates on open volunteer positions, rain alerts, and special seva
              announcements.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
