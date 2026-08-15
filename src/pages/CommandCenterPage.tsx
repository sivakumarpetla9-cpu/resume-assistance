import React from 'react';
import { useCareer } from '../store/CareerContext';
import { CareerIntelligenceGraph } from '../components/graph/CareerIntelligenceGraph';
import { Target, CheckCircle2, ChevronRight, Zap, Award, FileText, MessageSquare } from 'lucide-react';

export const CommandCenterPage: React.FC = () => {
  const {
    profile,
    activeJobTarget,
    jobTargets,
    setActiveJobTargetId,
    careerReadinessScore,
    atsDiagnostic,
    interviewSession,
    verifySkill,
    setActiveScreen
  } = useCareer();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#0C1118] via-[#111822] to-[#0C1118] border border-[#1C2633] shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#35C6FF]">
            <span className="w-2 h-2 rounded-full bg-[#35C6FF] animate-pulse" />
            OPERATING SYSTEM ACTIVE
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F3F5F7]">
            Good morning, {profile.name}
          </h1>
          <p className="text-xs text-[#A7B0BC]">
            Active Target Context: <span className="font-mono text-[#F3F5F7] font-semibold">{activeJobTarget.title}</span> — <span className="text-[#35C6FF]">{activeJobTarget.company}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen('create-job-target')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#151D28] border border-[#1C2633] hover:border-[#35C6FF]/50 text-xs font-mono text-[#F3F5F7] transition-all"
          >
            <Target className="w-4 h-4 text-[#35C6FF]" />
            <span>+ NEW JOB TARGET</span>
          </button>
          <button
            onClick={() => setActiveScreen('interview-room')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono text-xs font-bold hover:bg-[#35C6FF]/90 transition-all shadow-[0_0_15px_rgba(53,198,255,0.3)]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>LAUNCH INTERVIEW</span>
          </button>
        </div>
      </div>

      {/* Main Readiness & Connected Pillars Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Overall Readiness Gauge Card */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0C1118] border border-[#1C2633] flex flex-col justify-between space-y-6">
          <div className="space-y-1">
            <div className="text-xs font-mono text-[#66717F] uppercase tracking-wider">GLOBAL READINESS</div>
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-6xl font-extrabold text-[#F3F5F7] tracking-tight">
                {careerReadinessScore}%
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#35D399]/10 border border-[#35D399]/40 text-[#35D399]">
                CAREER READY
              </span>
            </div>
          </div>

          {/* 4 Pillars Breakdown Bars */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#A7B0BC] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#4F7CFF]" /> Resume Quality
                </span>
                <span className="text-[#F3F5F7] font-bold">82%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#111822] overflow-hidden">
                <div className="h-full bg-[#4F7CFF] rounded-full" style={{ width: '82%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#A7B0BC] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#35C6FF]" /> Target Job Fit
                </span>
                <span className="text-[#F3F5F7] font-bold">{activeJobTarget.matchScore}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#111822] overflow-hidden">
                <div className="h-full bg-[#35C6FF] rounded-full" style={{ width: `${activeJobTarget.matchScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#A7B0BC] flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#35D399]" /> Interview Readiness
                </span>
                <span className="text-[#F3F5F7] font-bold">{interviewSession.overallReadinessScore || 80}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#111822] overflow-hidden">
                <div className="h-full bg-[#35D399] rounded-full" style={{ width: `${interviewSession.overallReadinessScore || 80}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#A7B0BC] flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#F2B84B]" /> Verified Skill Depth
                </span>
                <span className="text-[#F3F5F7] font-bold">72%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#111822] overflow-hidden">
                <div className="h-full bg-[#F2B84B] rounded-full" style={{ width: '72%' }} />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#111822] border border-[#1C2633] text-[11px] text-[#A7B0BC] font-mono flex items-center justify-between">
            <span>ATS DIAGNOSTIC INDEX:</span>
            <span className="text-[#35C6FF] font-bold">{atsDiagnostic.overallScore}/100 SCORE</span>
          </div>
        </div>

        {/* Right: Signature Career Intelligence Graph */}
        <div className="lg:col-span-7">
          <CareerIntelligenceGraph compact={true} />
        </div>
      </div>

      {/* YOUR NEXT BEST ACTION Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#111822] via-[#0C1118] to-[#111822] border border-[#35C6FF]/40 shadow-[0_0_20px_rgba(53,198,255,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#35C6FF]/10 text-[#35C6FF] flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-[#35C6FF] uppercase tracking-wider">
              YOUR NEXT BEST ACTION
            </div>
            <p className="text-sm text-[#F3F5F7] font-medium leading-relaxed max-w-2xl">
              "TypeScript appears in several of your target jobs, but your current profile has limited verified evidence. Verifying TypeScript will boost your ATS Match from 82% to 92%."
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => verifySkill('TypeScript')}
            className="px-5 py-2.5 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(53,198,255,0.3)]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Verify TypeScript Skill</span>
          </button>
          <button
            onClick={() => setActiveScreen('learning-roadmap')}
            className="px-4 py-2.5 rounded-xl bg-[#151D28] border border-[#1C2633] hover:border-[#35C6FF]/40 text-xs font-mono text-[#A7B0BC] hover:text-[#F3F5F7] transition-colors"
          >
            <span>View Roadmap</span>
          </button>
        </div>
      </div>

      {/* Active Job Targets Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-mono text-[#F3F5F7]">ACTIVE JOB TARGETS</h2>
          <button
            onClick={() => setActiveScreen('create-job-target')}
            className="text-xs font-mono text-[#35C6FF] hover:underline flex items-center gap-1"
          >
            + Create New Target
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobTargets.map(job => {
            const isSelected = job.id === activeJobTarget.id;
            return (
              <div
                key={job.id}
                onClick={() => setActiveJobTargetId(job.id)}
                className={`p-5 rounded-xl border transition-all cursor-pointer space-y-4 ${
                  isSelected
                    ? 'bg-[#111822] border-[#35C6FF] shadow-[0_0_15px_rgba(53,198,255,0.2)]'
                    : 'bg-[#0C1118] border-[#1C2633] hover:border-[#1C2633]/80'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-mono font-bold text-base text-[#F3F5F7]">{job.title}</h3>
                    <div className="text-xs text-[#A7B0BC]">{job.company} • {job.location}</div>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-[#35C6FF]/10 border border-[#35C6FF]/40 font-mono text-xs font-bold text-[#35C6FF]">
                    {job.matchScore}% MATCH
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {job.requiredSkills.slice(0, 5).map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-[#151D28] border border-[#1C2633] text-[10px] font-mono text-[#A7B0BC]">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#1C2633]/60 text-xs font-mono">
                  <span className="text-[#66717F]">ATS SCORE: {job.atsScore}/100</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveJobTargetId(job.id);
                      setActiveScreen('job-intelligence');
                    }}
                    className="text-[#35C6FF] hover:underline flex items-center gap-1"
                  >
                    Open Workspace <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
