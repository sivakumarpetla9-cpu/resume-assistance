import React from 'react';
import { CareerProvider, useCareer } from './store/CareerContext';
import { HeaderNav } from './components/common/HeaderNav';
import { Toast } from './components/common/Toast';
import { AICareerAssistant } from './components/common/AICareerAssistant';
import { LandingPage } from './pages/LandingPage';
import { AuthPages } from './pages/AuthPages';
import { OnboardingPage } from './pages/OnboardingPage';
import { CommandCenterPage } from './pages/CommandCenterPage';
import { ResumeUploadPage } from './pages/ResumeUploadPage';
import { ResumeStudioPage } from './pages/ResumeStudioPage';
import { CreateJobTargetPage } from './pages/CreateJobTargetPage';
import { JobIntelligencePage } from './pages/JobIntelligencePage';
import { ATSConsolePage } from './pages/ATSConsolePage';
import { ResumeTailoringPage } from './pages/ResumeTailoringPage';
import { ResumeExportPage } from './pages/ResumeExportPage';
import { InterviewSetupPage } from './pages/InterviewSetupPage';
import { InterviewRoomPage } from './pages/InterviewRoomPage';
import { InterviewResultsPage } from './pages/InterviewResultsPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { LearningRoadmapPage } from './pages/LearningRoadmapPage';
import {
  ApplicationsPage,
  JobMatchesPage,
  CoverLetterPage,
  PortfolioPage,
  LinkedInPage,
  SettingsPage
} from './pages/SupportingPages';

const MainContent: React.FC = () => {
  const { activeScreen } = useCareer();

  // Fullscreen Interview Room has no outer header
  if (activeScreen === 'interview-room') {
    return <InterviewRoomPage />;
  }

  // Public Landing / Auth / Onboarding
  if (activeScreen === 'landing') return <LandingPage />;
  if (activeScreen === 'login') return <AuthPages mode="login" />;
  if (activeScreen === 'signup') return <AuthPages mode="signup" />;
  if (activeScreen === 'forgot') return <AuthPages mode="forgot" />;
  if (activeScreen === 'onboarding') return <OnboardingPage />;

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#070A0F] text-[#10151C] dark:text-[#F3F5F7] transition-colors pb-16">
      <HeaderNav />

      <main className="w-full">
        {activeScreen === 'command-center' && <CommandCenterPage />}
        {activeScreen === 'resume-upload' && <ResumeUploadPage />}
        {activeScreen === 'resume-studio' && <ResumeStudioPage />}
        {activeScreen === 'create-job-target' && <CreateJobTargetPage />}
        {activeScreen === 'job-intelligence' && <JobIntelligencePage />}
        {activeScreen === 'ats-console' && <ATSConsolePage />}
        {activeScreen === 'resume-tailoring' && <ResumeTailoringPage />}
        {activeScreen === 'resume-export' && <ResumeExportPage />}
        {activeScreen === 'interview-setup' && <InterviewSetupPage />}
        {activeScreen === 'interview-results' && <InterviewResultsPage />}
        {activeScreen === 'skill-gap' && <SkillGapPage />}
        {activeScreen === 'learning-roadmap' && <LearningRoadmapPage />}
        {activeScreen === 'applications' && <ApplicationsPage />}
        {activeScreen === 'job-matches' && <JobMatchesPage />}
        {activeScreen === 'cover-letter' && <CoverLetterPage />}
        {activeScreen === 'portfolio' && <PortfolioPage />}
        {activeScreen === 'linkedin' && <LinkedInPage />}
        {activeScreen === 'settings' && <SettingsPage />}
      </main>

      <Toast />
      <AICareerAssistant activeScreen={activeScreen} />
    </div>
  );
};

export function App() {
  return (
    <CareerProvider>
      <MainContent />
    </CareerProvider>
  );
}

export default App;
