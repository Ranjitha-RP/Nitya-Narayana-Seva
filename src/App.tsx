/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SevaProvider, useSeva } from './context/SevaContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Navbar, ActivePage } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/landing/HeroSection';
import { CommonNeedsSection } from './components/landing/CommonNeedsSection';
import { BentoServiceGrid } from './components/landing/BentoServiceGrid';
import { QuickSlotFinderBanner } from './components/landing/QuickSlotFinderBanner';
import { OpportunitiesPreview } from './components/landing/OpportunitiesPreview';
import { WhyVolunteerSection } from './components/landing/WhyVolunteerSection';
import { HowItWorksSection } from './components/landing/HowItWorksSection';
import { SevaInsightsSection } from './components/landing/SevaInsightsSection';
import { FaqSection } from './components/landing/FaqSection';
import { WhatsAppCommunityStrip } from './components/landing/WhatsAppCommunityStrip';
import { VolunteerDashboard } from './components/volunteer/VolunteerDashboard';
import { VolunteerRegistrationModal } from './components/volunteer/VolunteerRegistrationModal';
import { MyRegistrationsView } from './components/volunteer/MyRegistrationsView';
import { VolunteerLoginView } from './components/volunteer/VolunteerLoginView';
import { VolunteerAccountView } from './components/volunteer/VolunteerAccountView';
import { CoordinatorLoginModal } from './components/coordinator/CoordinatorLoginModal';
import { CoordinatorDashboard } from './components/coordinator/CoordinatorDashboard';
import { VolunteerRequirement } from './types';

const MainApp: React.FC = () => {
  const {
    isCoordinatorLoggedIn,
    logoutCoordinator,
    isVolunteerLoggedIn,
    currentVolunteer,
    logoutVolunteer,
  } = useSeva();

  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCoordinatorModalOpen, setIsCoordinatorModalOpen] = useState(false);
  const [selectedReqForModal, setSelectedReqForModal] = useState<VolunteerRequirement | null>(null);
  const [pendingRegisterAfterLogin, setPendingRegisterAfterLogin] = useState(false);

  const handleOpenRegister = (req?: VolunteerRequirement) => {
    setSelectedReqForModal(req || null);
    if (!isVolunteerLoggedIn) {
      setPendingRegisterAfterLogin(Boolean(req));
      setActivePage('volunteer-dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setIsRegisterModalOpen(true);
  };

  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVolunteerLoginSuccess = (targetPage: ActivePage) => {
    setActivePage(targetPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (pendingRegisterAfterLogin) {
      setPendingRegisterAfterLogin(false);
      setIsRegisterModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] text-[#45382F]">
      {/* Top Navbar */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenRegisterModal={() => handleOpenRegister()}
        onOpenCoordinatorModal={() => setIsCoordinatorModalOpen(true)}
        isCoordinatorLoggedIn={isCoordinatorLoggedIn}
        onLogoutCoordinator={() => {
          logoutCoordinator();
          handleNavigate('home');
        }}
        isVolunteerLoggedIn={isVolunteerLoggedIn}
        volunteerName={currentVolunteer?.name}
      />

      {/* Main Content Area based on Active Page */}
      <main className="flex-1">
        {activePage === 'home' && (
          <div className="space-y-4">
            {/* 1. Hero Section matching reference theme layout */}
            <HeroSection
              onVolunteerClick={() => handleOpenRegister()}
              onExploreClick={() => handleNavigate('volunteer-dashboard')}
            />

            {/* 2. Common Needs / Core Seva Commitments */}
            <CommonNeedsSection />

            {/* 3. Bento Service Grid */}
            <BentoServiceGrid
              onViewAllOpportunities={() => handleNavigate('volunteer-dashboard')}
            />

            {/* 4. Quick Slot Finder Banner */}
            <QuickSlotFinderBanner
              onSelectDate={() => {
                handleNavigate('volunteer-dashboard');
              }}
            />

            {/* 5. Volunteer Opportunities Preview */}
            <OpportunitiesPreview
              onOpenRegisterModal={handleOpenRegister}
              onViewAllOpportunities={() => handleNavigate('volunteer-dashboard')}
            />

            {/* 6. Why Volunteer Section */}
            <WhyVolunteerSection />

            {/* 7. How It Works */}
            <HowItWorksSection onRegisterClick={() => handleOpenRegister()} />

            {/* 8. Volunteer Guidelines & Resources */}
            <SevaInsightsSection />

            {/* 9. FAQ Section */}
            <FaqSection />

            {/* 10. WhatsApp Community Network Strip */}
            <WhatsAppCommunityStrip />
          </div>
        )}

        {activePage === 'volunteer-dashboard' &&
          (isVolunteerLoggedIn ? (
            <VolunteerDashboard
              onOpenRegisterModal={handleOpenRegister}
              onNavigateToMyRegistrations={() => handleNavigate('my-registrations')}
              onNavigateToMyAccount={() => handleNavigate('volunteer-account')}
              onLogoutVolunteer={() => {
                logoutVolunteer();
                handleNavigate('home');
              }}
            />
          ) : (
            <VolunteerLoginView
              onLoginSuccess={() => handleVolunteerLoginSuccess('volunteer-dashboard')}
              onBackHome={() => handleNavigate('home')}
            />
          ))}

        {activePage === 'volunteer-account' &&
          (isVolunteerLoggedIn ? (
            <VolunteerAccountView
              onNavigateToOpportunities={() => handleNavigate('volunteer-dashboard')}
              onNavigateToRegistrations={() => handleNavigate('my-registrations')}
              onLogout={() => {
                logoutVolunteer();
                handleNavigate('home');
              }}
            />
          ) : (
            <VolunteerLoginView
              onLoginSuccess={() => handleVolunteerLoginSuccess('volunteer-account')}
              onBackHome={() => handleNavigate('home')}
            />
          ))}

        {activePage === 'my-registrations' && (
          <MyRegistrationsView
            onExploreMore={() => handleNavigate('volunteer-dashboard')}
          />
        )}

        {activePage === 'coordinator-portal' && (
          <CoordinatorDashboard
            onLogout={() => {
              logoutCoordinator();
              handleNavigate('home');
            }}
            onNavigateToPublic={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Footer (Rendered on public and volunteer pages) */}
      {activePage !== 'coordinator-portal' && (
        <Footer
          onNavigate={handleNavigate}
          onOpenCoordinatorModal={() => setIsCoordinatorModalOpen(true)}
        />
      )}

      {/* Volunteer Registration Modal */}
      {isRegisterModalOpen && (
        <VolunteerRegistrationModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          selectedRequirement={selectedReqForModal}
          onViewMyRegistrations={() => handleNavigate('my-registrations')}
        />
      )}

      {/* Coordinator Login Modal */}
      {isCoordinatorModalOpen && (
        <CoordinatorLoginModal
          isOpen={isCoordinatorModalOpen}
          onClose={() => setIsCoordinatorModalOpen(false)}
          onLoginSuccess={() => handleNavigate('coordinator-portal')}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <SevaProvider>
        <MainApp />
      </SevaProvider>
    </ErrorBoundary>
  );
}
