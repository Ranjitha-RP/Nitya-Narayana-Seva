import React, { useState } from 'react';
import { Logo } from './Logo';
import {
  Heart,
  Menu,
  X,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export type ActivePage =
  | 'home'
  | 'volunteer-dashboard'
  | 'my-registrations'
  | 'volunteer-account'
  | 'coordinator-portal';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onOpenRegisterModal: () => void;
  onOpenCoordinatorModal: () => void;
  isCoordinatorLoggedIn: boolean;
  onLogoutCoordinator: () => void;
  isVolunteerLoggedIn: boolean;
  volunteerName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  onOpenRegisterModal,
  onOpenCoordinatorModal,
  isCoordinatorLoggedIn,
  isVolunteerLoggedIn,
  volunteerName,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: ActivePage, hash?: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    if (hash && page === 'home') {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF7]/95 backdrop-blur-md border-b border-[#45382F]/10 transition-colors">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-5 min-h-[4.5rem] py-2 sm:py-2.5 sm:min-h-20">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="shrink-0 cursor-pointer text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C49A45] rounded-xl py-0.5"
            aria-label="Nitya Narayana Seva Homepage"
          >
            <Logo variant="dark" size="md" />
          </button>

          {/* Zone 2: Clean single-line navigation links */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6 text-xs xl:text-sm font-medium text-[#45382F]/85 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-[#45382F] transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                activePage === 'home'
                  ? 'text-[#45382F] font-semibold border-b-2 border-[#C49A45]'
                  : 'hover:border-b-2 hover:border-[#C49A45]/40'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('home', 'about-nns')}
              className="hover:text-[#45382F] hover:border-b-2 hover:border-[#C49A45]/40 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer"
            >
              About NNS
            </button>
            <button
              onClick={() => handleNavClick('home', 'how-it-works')}
              className="hover:text-[#45382F] hover:border-b-2 hover:border-[#C49A45]/40 transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('volunteer-dashboard')}
              className={`hover:text-[#45382F] transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer flex items-center gap-1.5 ${
                activePage === 'volunteer-dashboard'
                  ? 'text-[#45382F] font-semibold border-b-2 border-[#C49A45]'
                  : 'hover:border-b-2 hover:border-[#C49A45]/40'
              }`}
            >
              <span>Volunteer</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#819B82]"></span>
            </button>
            <button
              onClick={() => handleNavClick('my-registrations')}
              className={`hover:text-[#45382F] transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                activePage === 'my-registrations'
                  ? 'text-[#45382F] font-semibold border-b-2 border-[#C49A45]'
                  : 'hover:border-b-2 hover:border-[#C49A45]/40'
              }`}
            >
              My Registrations
            </button>
            {isVolunteerLoggedIn && (
              <button
                onClick={() => handleNavClick('volunteer-account')}
                className={`hover:text-[#45382F] transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer flex items-center gap-1 ${
                  activePage === 'volunteer-account'
                    ? 'text-[#45382F] font-semibold border-b-2 border-[#C49A45]'
                    : 'hover:border-b-2 hover:border-[#C49A45]/40'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-[#C49A45]" />
                <span>My Account</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {/* Coordinator portal shortcut */}
            {isCoordinatorLoggedIn ? (
              <button
                onClick={() => handleNavClick('coordinator-portal')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  activePage === 'coordinator-portal'
                    ? 'bg-[#45382F] text-white border-[#45382F]'
                    : 'bg-[#F5EEDC] text-[#45382F] border-[#C49A45]/30 hover:border-[#C49A45]'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#C49A45]" />
                <span className="whitespace-nowrap">Coordinator Portal</span>
              </button>
            ) : (
              <button
                onClick={onOpenCoordinatorModal}
                className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-[#45382F]/80 hover:text-[#45382F] transition-colors whitespace-nowrap rounded-lg hover:bg-[#F5EEDC]/60 cursor-pointer"
                title="Admin access for NNS organizers"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C49A45]" />
                <span>Coordinator Login</span>
              </button>
            )}

            {/* Volunteer Account Pill or Primary CTA */}
            {isVolunteerLoggedIn && activePage !== 'volunteer-account' && (
              <button
                onClick={() => handleNavClick('volunteer-account')}
                className="hidden md:flex lg:hidden xl:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#45382F] bg-[#F5EEDC] hover:bg-[#EBE2CC] rounded-xl border border-[#C49A45]/30 transition-colors whitespace-nowrap cursor-pointer"
                title="Manage Volunteer Account"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#C49A45]" />
                <span className="max-w-[90px] truncate">{volunteerName || 'My Account'}</span>
              </button>
            )}

            {/* Primary Action Button */}
            <button
              onClick={() => {
                if (activePage === 'volunteer-dashboard' && isVolunteerLoggedIn) {
                  onOpenRegisterModal();
                } else {
                  onNavigate('volunteer-dashboard');
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#C49A45] hover:bg-[#A57F32] rounded-xl shadow-xs transition-all duration-200 cursor-pointer hover:shadow-md whitespace-nowrap active:scale-[0.98]"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>{isVolunteerLoggedIn ? 'Become a Volunteer' : 'Volunteer Login'}</span>
            </button>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex sm:hidden items-center gap-1.5 shrink-0 pl-1">
            <button
              onClick={() => onNavigate('volunteer-dashboard')}
              className="px-2.5 py-1.5 text-xs font-semibold text-white bg-[#C49A45] hover:bg-[#A57F32] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Volunteer
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#45382F] rounded-xl hover:bg-[#F5EEDC] focus:outline-hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#45382F]/10 bg-[#FFFDF7] px-4 pt-3 pb-6 shadow-xl space-y-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              activePage === 'home' ? 'bg-[#F5EEDC] text-[#45382F] font-semibold' : 'text-[#45382F]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('home', 'about-nns')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#45382F]"
          >
            About NNS
          </button>
          <button
            onClick={() => handleNavClick('home', 'how-it-works')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#45382F]"
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick('volunteer-dashboard')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
              activePage === 'volunteer-dashboard'
                ? 'bg-[#F5EEDC] text-[#45382F] font-semibold'
                : 'text-[#45382F]'
            }`}
          >
            <span>{isVolunteerLoggedIn ? 'Volunteer Opportunities' : 'Volunteer Login & Slots'}</span>
            <span className="text-xs bg-[#819B82]/20 text-[#45382F] font-medium px-2 py-0.5 rounded-full">
              Live Slots
            </span>
          </button>
          <button
            onClick={() => handleNavClick('my-registrations')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              activePage === 'my-registrations'
                ? 'bg-[#F5EEDC] text-[#45382F] font-semibold'
                : 'text-[#45382F]'
            }`}
          >
            My Registrations
          </button>
          <button
            onClick={() => handleNavClick('volunteer-account')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
              activePage === 'volunteer-account'
                ? 'bg-[#F5EEDC] text-[#45382F] font-semibold'
                : 'text-[#45382F]'
            }`}
          >
            <UserCheck className="w-4 h-4 text-[#C49A45]" />
            <span>{isVolunteerLoggedIn ? `My Account (${volunteerName || 'Profile'})` : 'Volunteer Account / Login'}</span>
          </button>
          <button
            onClick={() => {
              if (isCoordinatorLoggedIn) {
                handleNavClick('coordinator-portal');
              } else {
                setMobileMenuOpen(false);
                onOpenCoordinatorModal();
              }
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#45382F] flex items-center gap-2 border-t border-[#45382F]/10 pt-3"
          >
            <ShieldCheck className="w-4 h-4 text-[#C49A45]" />
            <span>
              {isCoordinatorLoggedIn ? 'Coordinator Portal (Authorized)' : 'Coordinator Login'}
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
