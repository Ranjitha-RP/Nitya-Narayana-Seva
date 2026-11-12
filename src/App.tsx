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
import { CoordinatorLoginModal } from './components/coordinator/CoordinatorLoginModal';
import { CoordinatorDashboard } from './components/coordinator/CoordinatorDashboard';
import { VolunteerRequirement } from './types';

const MainApp: React.FC = () => {
  const { isCoordinatorLoggedIn, logoutCoordinator } = useSeva();
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCoordinatorModalOpen, setIsCoordinatorModalOpen] = useState(false);
  const [selectedReqForModal, setSelectedReqForModal] = useState<VolunteerRequirement | null>(null);

  const handleOpenRegister = (req?: VolunteerRequirement) => {
    setSelectedReqForModal(req || null);
    setIsRegisterModalOpen(true);
  };

  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

            {/* 2. Common Needs / Core Seva Commitments (3 elevated cards with center highlight) */}
            <CommonNeedsSection />

            {/* 3. Bento Service Grid (4 cards with photo & impact badge) */}
            <BentoServiceGrid
              onViewAllOpportunities={() => handleNavigate('volunteer-dashboard')}
            />

            {/* 4. Quick Slot Finder Banner (dark curved container matching theme) */}
            <QuickSlotFinderBanner
              onSelectDate={(date) => {
                handleNavigate('volunteer-dashboard');
              }}
            />

            {/* 5. Volunteer Opportunities Preview */}
            <OpportunitiesPreview
              onOpenRegisterModal={handleOpenRegister}
              onViewAllOpportunities={() => handleNavigate('volunteer-dashboard')}
            />

            {/* 6. Why Volunteer Section (Interactive list with arrows + right photo) */}
            <WhyVolunteerSection />

            {/* 7. How It Works (3 Steps: Discover, Register, Serve) */}
            <HowItWorksSection onRegisterClick={() => handleOpenRegister()} />

            {/* 8. Volunteer Guidelines & Resources (3 photo cards matching theme) */}
            <SevaInsightsSection />

            {/* 9. FAQ Section (Accordion on left + coordinator card on right) */}
            <FaqSection onContactCoordinators={() => setIsCoordinatorModalOpen(true)} />

            {/* 10. WhatsApp Community Network Strip */}
            <WhatsAppCommunityStrip />
          </div>
        )}

        {activePage === 'volunteer-dashboard' && (
          <VolunteerDashboard
            onOpenRegisterModal={handleOpenRegister}
            onNavigateToMyRegistrations={() => handleNavigate('my-registrations')}
          />
        )}

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

      {/* Volunteer Registration Modal (Clean mount when opened) */}
      {isRegisterModalOpen && (
        <VolunteerRegistrationModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          selectedRequirement={selectedReqForModal}
          onViewMyRegistrations={() => handleNavigate('my-registrations')}
        />
      )}

      {/* Coordinator Login Modal (Clean mount when opened) */}
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
