import React, { useState } from 'react';
import { useCareer } from '../store/CareerContext';
import { Target, CheckCircle2, XCircle, ArrowRight, Cpu } from 'lucide-react';

export const JobIntelligencePage: React.FC = () => {
  const { activeJobTarget, profile, setActiveScreen } = useCareer();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Resume' | 'ATS' | 'Interview' | 'Skills'>('Overview');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in">
      
      {/* Target Job Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0C1118] via-[#111822] to-[#0C1118] border border-[#1C2633] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#35C6FF]">
            <Target className="w-4 h-4" />
            JOB TARGET WORKSPACE
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-[#F3F5F7]">
            {activeJobTarget.title.toUpperCase()} — {activeJobTarget.company.toUpperCase()}
          </h1>
          <p className="text-xs text-[#A7B0BC]">
            {activeJobTarget.location} • Created on {activeJobTarget.createdAt}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-5 py-3 rounded-2xl bg-[#35C6FF]/10 border border-[#35C6FF]/40 text-center">
            <div className="font-mono text-3xl font-extrabold text-[#35C6FF]">
              {activeJobTarget.matchScore}%
            </div>
            <div className="text-[10px] font-mono text-[#A7B0BC] uppercase tracking-wider">JOB MATCH FIT</div>
          </div>

          <button
            onClick={() => setActiveScreen('ats-console')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all shadow-[0_0_15px_rgba(53,198,255,0.3)]"
          >
            <Cpu className="w-4 h-4" />
            <span>RUN ATS DIAGNOSTIC</span>
          </button>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex border-b border-[#1C2633] gap-2 overflow-x-auto pb-1">
        {(['Overview', 'Resume', 'ATS', 'Interview', 'Skills'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab === 'ATS') setActiveScreen('ats-console');
              if (tab === 'Interview') setActiveScreen('interview-setup');
              if (tab === 'Skills') setActiveScreen('skill-gap');
              if (tab === 'Resume') setActiveScreen('resume-studio');
            }}
            className={`px-4 py-2 rounded-t-lg font-mono text-xs font-semibold transition-all ${
              activeTab === tab
                ? 'bg-[#111822] text-[#35C6FF] border-t-2 border-[#35C6FF]'
                : 'text-[#A7B0BC] hover:text-[#F3F5F7]'
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tab Content: Candidate ↔ Job Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Job Description & Responsibilities */}
        <div className="lg:col-span-7 bg-[#0C1118] border border-[#1C2633] rounded-xl p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="font-mono text-xs font-bold text-[#35C6FF] uppercase">JOB DESCRIPTION SUMMARY</h3>
            <p className="text-xs text-[#A7B0BC] leading-relaxed font-sans">
              {activeJobTarget.description}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-mono text-xs font-bold text-[#35C6FF] uppercase">KEY RESPONSIBILITIES</h3>
            <ul className="space-y-2">
              {activeJobTarget.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-[#A7B0BC]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#35C6FF] mt-1.5 shrink-0" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-mono text-xs font-bold text-[#35C6FF] uppercase">KEYWORD DENSITY INDEX</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {activeJobTarget.keywords.map((kw, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-[#111822] border border-[#1C2633] flex justify-between items-center text-xs font-mono">
                  <span className="text-[#F3F5F7]">{kw.word}</span>
                  <span className={`text-[10px] font-bold ${kw.status === 'matched' ? 'text-[#35D399]' : 'text-[#F06A6A]'}`}>
                    {kw.count}x {kw.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Candidate ↔ Role Skills Alignment */}
        <div className="lg:col-span-5 bg-[#0C1118] border border-[#1C2633] rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-[#1C2633]">
            <h3 className="font-mono text-xs font-bold text-[#F3F5F7] uppercase">CANDIDATE ↔ ROLE FIT</h3>
            <span className="text-[11px] font-mono text-[#35C6FF]">7 REQUIREMENTS</span>
          </div>

          {/* Required Skills Matrix */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-[#66717F] uppercase tracking-wider">REQUIRED SKILLS</div>
            <div className="space-y-2">
              {activeJobTarget.requiredSkills.map((skill, idx) => {
                const isCandidateHas = profile.skills.some(s => s.toLowerCase() === skill.toLowerCase());
                return (
                  <div key={idx} className="p-3 rounded-lg bg-[#111822] border border-[#1C2633] flex items-center justify-between">
                    <span className="text-xs font-mono font-medium text-[#F3F5F7]">{skill}</span>
                    {isCandidateHas ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-[#35D399] bg-[#35D399]/10 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-[#F06A6A] bg-[#F06A6A]/10 px-2 py-0.5 rounded">
                        <XCircle className="w-3 h-3" /> GAP
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preferred Skills */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-[#66717F] uppercase tracking-wider">PREFERRED SKILLS</div>
            <div className="flex flex-wrap gap-2">
              {activeJobTarget.preferredSkills.map((skill, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded bg-[#111822] border border-[#1C2633] text-xs font-mono text-[#A7B0BC]">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#1C2633] space-y-2">
            <button
              onClick={() => setActiveScreen('resume-tailoring')}
              className="w-full py-2.5 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all flex items-center justify-center gap-2"
            >
              <span>TAILOR RESUME FOR THIS ROLE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
