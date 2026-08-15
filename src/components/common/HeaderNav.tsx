import React from 'react';
import { useCareer } from '../../store/CareerContext';
import {
  Sun, Moon, Cpu, LayoutDashboard, FileText, Target,
  MessageSquare, Award, BookOpen, Layers, ChevronDown
} from 'lucide-react';

export const HeaderNav: React.FC = () => {
  const { theme, toggleTheme, activeScreen, setActiveScreen, activeJobTarget, jobTargets, setActiveJobTargetId } = useCareer();

  const navItems = [
    { id: 'command-center', label: 'Command Center', icon: LayoutDashboard },
    { id: 'resume-studio', label: 'Resume Studio', icon: FileText },
    { id: 'job-intelligence', label: 'Job Target', icon: Target },
    { id: 'ats-console', label: 'ATS Console', icon: Cpu },
    { id: 'interview-setup', label: 'AI Interview', icon: MessageSquare },
    { id: 'skill-gap', label: 'Skill Gap', icon: Award },
    { id: 'learning-roadmap', label: 'Roadmap', icon: BookOpen },
    { id: 'applications', label: 'Applications', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/90 dark:bg-[#070A0F]/90 backdrop-blur-md border-b border-[#E2E6EB] dark:border-[#1C2633] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        
        {/* Brand Logo & SaaS Tag */}
        <div 
          onClick={() => setActiveScreen('landing')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#35C6FF] to-[#4F7CFF] p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(53,198,255,0.4)]">
            <div className="w-full h-full bg-[#070A0F] rounded-[6px] flex items-center justify-center">
              <Cpu className="w-4 h-4 text-[#35C6FF]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-sm font-bold tracking-wider text-[#10151C] dark:text-[#F3F5F7] group-hover:text-[#35C6FF] transition-colors">
              STITCH
            </span>
            <span className="text-[9px] font-mono text-[#35C6FF] tracking-widest uppercase">
              CAREER INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Active Job Target Context Selector (Persistent Workspace Switcher) */}
        {activeJobTarget && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F1F3F6] dark:bg-[#0C1118] border border-[#E2E6EB] dark:border-[#1C2633]">
            <Target className="w-3.5 h-3.5 text-[#35C6FF]" />
            <span className="text-xs font-mono text-[#4B5563] dark:text-[#A7B0BC]">TARGET:</span>
            <select
              value={activeJobTarget.id}
              onChange={(e) => setActiveJobTargetId(e.target.value)}
              className="bg-transparent text-xs font-mono font-medium text-[#10151C] dark:text-[#F3F5F7] focus:outline-none cursor-pointer"
            >
              {jobTargets.map(job => (
                <option key={job.id} value={job.id} className="bg-[#FFFFFF] dark:bg-[#0C1118] text-[#10151C] dark:text-[#F3F5F7]">
                  {job.title} — {job.company} ({job.matchScore}%)
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-[#66717F]" />
          </div>
        )}

        {/* Main Workspace Navigation Pills */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  isActive
                    ? 'bg-[#E2E6EB] dark:bg-[#151D28] text-[#0099D8] dark:text-[#35C6FF] border border-[#35C6FF]/40 shadow-sm'
                    : 'text-[#4B5563] dark:text-[#A7B0BC] hover:text-[#10151C] dark:hover:text-[#F3F5F7] hover:bg-[#E2E6EB]/60 dark:hover:bg-[#0C1118]/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions: Command palette, Theme Toggle, Profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            title="Toggle Light/Dark Theme"
            className="p-2 rounded-lg bg-[#F1F3F6] dark:bg-[#0C1118] border border-[#E2E6EB] dark:border-[#1C2633] text-[#4B5563] dark:text-[#A7B0BC] hover:text-[#35C6FF] transition-colors flex items-center justify-center"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#F2B84B]" /> : <Moon className="w-4 h-4 text-[#4268D8]" />}
          </button>

          <button
            onClick={() => setActiveScreen('settings')}
            className="flex items-center gap-2 p-1.5 rounded-lg bg-[#F1F3F6] dark:bg-[#0C1118] border border-[#E2E6EB] dark:border-[#1C2633] hover:border-[#35C6FF]/50 transition-colors"
          >
            <div className="w-7 h-7 rounded-md bg-[#E2E6EB] dark:bg-[#151D28] flex items-center justify-center font-mono font-bold text-xs text-[#0099D8] dark:text-[#35C6FF]">
              AV
            </div>
          </button>
        </div>

      </div>
    </header>
  );
};
