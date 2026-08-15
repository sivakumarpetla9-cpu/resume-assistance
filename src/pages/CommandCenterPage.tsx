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
    skillGaps,
    verifySkill,
    setActiveScreen
  } = useCareer();

  const topGap = skillGaps.find(g => g.status === 'missing') || skillGaps[0];

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
            Welcome back, {profile.name}
          </h1>
          <p className="text-xs text-[#A7B0BC]">
            Active Target Context: {activeJobTarget ? (
              <><span className="font-mono text-[#F3F5F7] font-semibold">{activeJobTarget.title}</span> — <span className="text-[#35C6FF]">{activeJobTarget.company}</span></>
            ) : (
              <span className="font-mono text-[#F3F5F7] italic">No active job target set</span>
            )}
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
                {careerReadinessScore !== null ? `${careerReadinessScore}%` : '--'}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                careerReadinessScore !== null
                  ? 'bg-[#35D399]/10 border border-[#35D399]/40 text-[#35D399]'
                  : 'bg-[#1C2633] text-[#66717F]'
              }`}>
                {careerReadinessScore !== null ? 'ANALYZED' : 'UNANALYZED'}
              </span>
            </div>
          </div>

          {/* 4 Pillars Breakdown Bars */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#A7B0BC] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#4F7CFF]" /> Resume Structure Score
                </span>
                <span className="text-[#F3F5F7] font-bold">
                  {atsDiagnostic.structureScore ? `${atsDiagnostic.structureScore}%` : '--'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#111822] overflow-hidden">
                <div className="h-full bg-[#4F7CFF] rounded-full transition-all" style={{ width: `${atsDiagnostic.structureScore || 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#A7B0BC] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#35C6FF]" /> Target Job Fit
                </span>
                <span className="text-[#F3F5F7] font-bold">
                  {activeJobTarget?.matchScore ? `${activeJobTarget.matchScore}%` : '--'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#111822] overflow-hidden">
                <div className="h-full bg-[#35C6FF] rounded-full transition-all" style={{ width: `${activeJobTarget?.matchScore || 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#A7B0BC] flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#35D399]" /> Interview Readiness
                </span>
                <span className="text-[#F3F5F7] font-bold">
                  {interviewSession.status === 'completed' ? `${interviewSession.overallReadinessScore}%` : '--'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#111822] overflow-hidden">
                <div className="h-full bg-[#35D399] rounded-full transition-all" style={{ width: `${interviewSession.status === 'completed' ? interviewSession.overallReadinessScore : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#A7B0BC] flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#F2B84B]" /> Verified Skills Count
                </span>
                <span className="text-[#F3F5F7] font-bold">
                  {profile.skills.length > 0 ? `${profile.skills.length} verified` : '0 verified'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#111822] overflow-hidden">
                <div className="h-full bg-[#F2B84B] rounded-full transition-all" style={{ width: `${Math.min(profile.skills.length * 20, 100)}%` }} />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#111822] border border-[#1C2633] text-[11px] text-[#A7B0BC] font-mono flex items-center justify-between">
            <span>ATS DIAGNOSTIC INDEX:</span>
            <span className="text-[#35C6FF] font-bold">
              {atsDiagnostic.overallScore !== null ? `${atsDiagnostic.overallScore}/100 SCORE` : 'NOT ANALYZED YET'}
            </span>
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
              {topGap ? (
                `"${topGap.skillName} is listed in requirements for ${activeJobTarget?.title || 'your target role'}, but is not yet verified in your profile. Verifying this skill will improve your match score."`
              ) : activeJobTarget ? (
                `"Run an ATS diagnostic on your ${activeJobTarget.title} job target to analyze keyword match scores and extract missing skill requirements."`
              ) : (
                `"Create your first job target to begin personalized ATS keyword extraction, skill gap prioritization, and learning roadmaps."`
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {topGap ? (
            <button
              onClick={() => verifySkill(topGap.skillName)}
              className="px-5 py-2.5 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(53,198,255,0.3)]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify {topGap.skillName} Skill</span>
            </button>
          ) : activeJobTarget ? (
            <button
              onClick={() => setActiveScreen('ats-console')}
              className="px-5 py-2.5 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(53,198,255,0.3)]"
            >
              <Zap className="w-4 h-4" />
              <span>Run ATS Analysis</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveScreen('create-job-target')}
              className="px-5 py-2.5 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(53,198,255,0.3)]"
            >
              <Target className="w-4 h-4" />
              <span>Create Job Target</span>
            </button>
          )}
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

        {jobTargets.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#0C1118] border border-[#1C2633] text-center space-y-3">
            <Target className="w-10 h-10 mx-auto text-[#66717F]" />
            <h3 className="text-sm font-mono font-bold text-[#F3F5F7]">No Job Targets Yet</h3>
            <p className="text-xs text-[#A7B0BC] max-w-md mx-auto">
              Create a job target with a target title and job description to begin keyword extraction, ATS scoring, and skill gap analysis.
            </p>
            <button
              onClick={() => setActiveScreen('create-job-target')}
              className="px-4 py-2 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono text-xs font-bold hover:bg-[#35C6FF]/90 transition-all"
            >
              + Create First Job Target
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobTargets.map(job => {
              const isSelected = activeJobTarget && job.id === activeJobTarget.id;
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
                      {job.matchScore ? `${job.matchScore}% MATCH` : 'TARGET SET'}
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
                    <span className="text-[#66717F]">
                      ATS SCORE: {job.atsScore ? `${job.atsScore}/100` : 'Not analyzed'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveJobTargetId(job.id);
                        setActiveScreen('ats-console');
                      }}
                      className="text-[#35C6FF] hover:underline flex items-center gap-1"
                    >
                      Open ATS Console <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
