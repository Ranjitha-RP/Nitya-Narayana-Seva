import React from 'react';
import { Logo } from './Logo';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Heart,
  ShieldCheck,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { ActivePage } from './Navbar';

interface FooterProps {
  onNavigate: (page: ActivePage) => void;
  onOpenCoordinatorModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenCoordinatorModal }) => {
  return (
    <footer className="bg-[#45382F] text-[#FFFDF7] pt-16 pb-12 border-t border-[#C49A45]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Organization & Identity */}
          <div className="space-y-4">
            <Logo variant="light" size="md" showTagline={true} />
            <p className="text-sm text-[#FFFDF7]/75 leading-relaxed pt-2">
              Nitya Narayana Seva (NNS) is a community seva initiative serving hot, nutritious meals
              daily to cancer patients, caregivers, and families visiting Kidwai Memorial Institute
              of Oncology, Bengaluru.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#C49A45]/20 border border-[#C49A45]/40 text-xs text-[#FFFDF7]">
              <Heart className="w-3.5 h-3.5 text-[#C49A45] fill-current" />
              <span>800+ Meals Served With Dignity Every Day</span>
            </div>
          </div>

          {/* Column 2: Seva Location & Schedule */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg text-white font-medium tracking-wide">
              Seva Location & Timings
            </h4>
            <ul className="space-y-3 text-sm text-[#FFFDF7]/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C49A45] shrink-0 mt-0.5" />
                <span>
                  Gate 2 Seva Counter, Kidwai Memorial Institute of Oncology, Dr. M H Marigowda Road,
                  Bengaluru, Karnataka 560029
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C49A45] shrink-0" />
                <span>Daily Service: 11:00 AM – 02:00 PM</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#C49A45] shrink-0" />
                <span>365 Days a Year (Uninterrupted Service)</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg text-white font-medium tracking-wide">
              Quick Portals
            </h4>
            <ul className="space-y-2.5 text-sm text-[#FFFDF7]/75">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#C49A45] transition-colors cursor-pointer text-left"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('volunteer-dashboard')}
                  className="hover:text-[#C49A45] transition-colors cursor-pointer text-left"
                >
                  Explore Volunteer Opportunities
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('my-registrations')}
                  className="hover:text-[#C49A45] transition-colors cursor-pointer text-left"
                >
                  My Registrations & History
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('volunteer-account')}
                  className="hover:text-[#C49A45] transition-colors cursor-pointer text-left"
                >
                  Volunteer Login / My Account
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCoordinatorModal}
                  className="hover:text-[#C49A45] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C49A45]" />
                  <span>Coordinator Login</span>
                </button>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('home');
                    setTimeout(() => {
                      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="hover:text-[#C49A45] transition-colors cursor-pointer text-left"
                >
                  How Seva Registration Works
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Coordinator Helpline & Community */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg text-white font-medium tracking-wide">
              Connect With Us
            </h4>
            <p className="text-sm text-[#FFFDF7]/75">
              Have questions regarding today's volunteer slots or bulk group participation?
            </p>
            <div className="space-y-2 text-sm text-[#FFFDF7]/75">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C49A45]" />
                <span>+91 98450 12345 / +91 94480 56789</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C49A45]" />
                <span>seva@nityanarayanaseva.org</span>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('volunteer-dashboard')}
                className="w-full text-center px-4 py-2.5 rounded-xl bg-[#C49A45] hover:bg-[#A57F32] text-white text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                Volunteer With Us Today
              </button>
            </div>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="pt-8 mt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FFFDF7]/60 gap-4">
          <p>© {new Date().getFullYear()} Nitya Narayana Seva (NNS). All rights reserved.</p>
          <div className="flex items-center gap-4 text-[#FFFDF7]/70">
            <span>Non-Profit Community Service</span>
            <span>·</span>
            <span>Kidwai Hospital, Bengaluru</span>
            <span>·</span>
            <span>Dedicated to Universal Compassion</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
