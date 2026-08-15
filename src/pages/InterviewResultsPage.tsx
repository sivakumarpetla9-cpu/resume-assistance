import React from 'react';
import { useCareer } from '../store/CareerContext';
import { Award, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, RefreshCw } from 'lucide-react';

export const InterviewResultsPage: React.FC = () => {
  const { interviewSession, activeJobTarget, setActiveScreen } = useCareer();
  const breakdown = interviewSession.scoreBreakdown || {
    technical: 78,
    communication: 84,
    confidence: 81,
    structure: 76,
    relevance: 82
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0C1118] border border-[#1C2633]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#35D399]">
            <Award className="w-4 h-4" />
            INTERVIEW DIAGNOSTIC REPORT
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F3F5F7]">
            INTERVIEW READINESS RESULTS
          </h1>
          <p className="text-xs text-[#A7B0BC]">
            Role Target: <span className="font-mono text-[#35C6FF]">{activeJobTarget.title} — {activeJobTarget.company}</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-6 py-3 rounded-2xl bg-[#111822] border border-[#35D399]/50 text-center shadow-[0_0_20px_rgba(53,211,153,0.2)]">
            <div className="font-mono text-4xl font-extrabold text-[#35D399]">
              {interviewSession.overallReadinessScore || 80}%
            </div>
            <div className="text-[10px] font-mono text-[#A7B0BC] uppercase tracking-wider">INTERVIEW SCORE</div>
          </div>

          <button
            onClick={() => setActiveScreen('interview-setup')}
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[#151D28] border border-[#1C2633] hover:border-[#35C6FF]/40 text-xs font-mono text-[#F3F5F7] transition-all"
          >
            <RefreshCw className="w-4 h-4 text-[#35C6FF]" />
            <span>PRACTICE AGAIN</span>
          </button>
        </div>
      </div>

      {/* Visual Breakdown Gauges */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-[#0C1118] border border-[#1C2633] space-y-1">
          <div className="text-[10px] font-mono text-[#66717F] uppercase">TECHNICAL DEPTH</div>
          <div className="font-mono text-2xl font-bold text-[#F3F5F7]">{breakdown.technical}%</div>
          <div className="w-full h-1.5 rounded-full bg-[#111822] overflow-hidden">
            <div className="h-full bg-[#35C6FF]" style={{ width: `${breakdown.technical}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C1118] border border-[#1C2633] space-y-1">
          <div className="text-[10px] font-mono text-[#66717F] uppercase">COMMUNICATION</div>
          <div className="font-mono text-2xl font-bold text-[#F3F5F7]">{breakdown.communication}%</div>
          <div className="w-full h-1.5 rounded-full bg-[#111822] overflow-hidden">
            <div className="h-full bg-[#35D399]" style={{ width: `${breakdown.communication}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C1118] border border-[#1C2633] space-y-1">
          <div className="text-[10px] font-mono text-[#66717F] uppercase">CONFIDENCE</div>
          <div className="font-mono text-2xl font-bold text-[#F3F5F7]">{breakdown.confidence}%</div>
          <div className="w-full h-1.5 rounded-full bg-[#111822] overflow-hidden">
            <div className="h-full bg-[#4F7CFF]" style={{ width: `${breakdown.confidence}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C1118] border border-[#1C2633] space-y-1">
          <div className="text-[10px] font-mono text-[#66717F] uppercase">ANSWER STRUCTURE</div>
          <div className="font-mono text-2xl font-bold text-[#F3F5F7]">{breakdown.structure}%</div>
          <div className="w-full h-1.5 rounded-full bg-[#111822] overflow-hidden">
            <div className="h-full bg-[#F2B84B]" style={{ width: `${breakdown.structure}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0C1118] border border-[#1C2633] space-y-1 col-span-2 md:col-span-1">
          <div className="text-[10px] font-mono text-[#66717F] uppercase">ROLE RELEVANCE</div>
          <div className="font-mono text-2xl font-bold text-[#F3F5F7]">{breakdown.relevance}%</div>
          <div className="w-full h-1.5 rounded-full bg-[#111822] overflow-hidden">
            <div className="h-full bg-[#35C6FF]" style={{ width: `${breakdown.relevance}%` }} />
          </div>
        </div>
      </div>

      {/* Synthesis Cards: What Went Well & What Needs Work */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* WHAT WENT WELL */}
        <div className="p-6 rounded-2xl bg-[#0C1118] border border-[#1C2633] space-y-4">
          <div className="text-xs font-mono text-[#35D399] flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4" /> WHAT WENT WELL
          </div>
          <ul className="space-y-2.5 text-xs text-[#A7B0BC] font-sans">
            {interviewSession.whatWentWell?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#35D399] mt-1.5 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* WHAT NEEDS WORK */}
        <div className="p-6 rounded-2xl bg-[#0C1118] border border-[#1C2633] space-y-4">
          <div className="text-xs font-mono text-[#F2B84B] flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4" /> WHAT NEEDS WORK
          </div>
          <ul className="space-y-2.5 text-xs text-[#A7B0BC] font-sans">
            {interviewSession.whatNeedsWork?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F2B84B] mt-1.5 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* RECOMMENDED NEXT ACTION */}
      <div className="p-6 rounded-2xl bg-[#111822] border border-[#35C6FF]/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs font-mono text-[#35C6FF] font-bold">RECOMMENDED NEXT ACTION</div>
          <p className="text-sm text-[#F3F5F7] font-medium">
            "{interviewSession.recommendedActions?.[0] || 'Complete guided learning roadmap steps to close TypeScript knowledge gaps.'}"
          </p>
        </div>

        <button
          onClick={() => setActiveScreen('learning-roadmap')}
          className="px-6 py-3 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all flex items-center gap-2 shrink-0"
        >
          <BookOpen className="w-4 h-4" />
          <span>OPEN LEARNING ROADMAP</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
