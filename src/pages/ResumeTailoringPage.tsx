import React from 'react';
import { useCareer } from '../store/CareerContext';
import { Sparkles, ShieldCheck, ArrowRight, Download, RefreshCw } from 'lucide-react';

export const ResumeTailoringPage: React.FC = () => {
  const { resumeVersion, activeJobTarget, setActiveScreen, showToast } = useCareer();

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8 space-y-6 animate-fade-in">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0C1118] via-[#111822] to-[#0C1118] border border-[#1C2633] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#35C6FF]">
            <Sparkles className="w-4 h-4" />
            DETERMINISTIC AI RESUME TAILORING ENGINE
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F3F5F7]">
            RESUME TAILORING & GUARDRAIL COMPARISON
          </h1>
          <p className="text-xs text-[#A7B0BC]">
            Tailored specifically for: <span className="font-mono text-[#35C6FF]">{activeJobTarget.title} — {activeJobTarget.company}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast("Re-running AI Tailoring verification...")}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#151D28] border border-[#1C2633] hover:border-[#35C6FF]/40 text-xs font-mono text-[#F3F5F7] transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#35C6FF]" />
            <span>RE-RUN TAILORING</span>
          </button>
          <button
            onClick={() => setActiveScreen('resume-export')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all shadow-[0_0_15px_rgba(53,198,255,0.3)]"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT TAILORED V1 PDF</span>
          </button>
        </div>
      </div>

      {/* Mandatory Non-Fabrication Guardrail Callout Banner */}
      <div className="p-4 rounded-xl bg-[#111822] border border-[#35C6FF]/50 flex items-start gap-4">
        <div className="w-9 h-9 rounded-lg bg-[#35C6FF]/10 text-[#35C6FF] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs">
          <div className="font-mono font-bold text-[#35C6FF]">
            NON-FABRICATION GUARDRAIL ACTIVE
          </div>
          <p className="text-[#A7B0BC] leading-relaxed">
            The AI engine enforces strict candidate verification. Content is re-ordered and highlighted for ATS keywords, but unverified experience (e.g. Docker, AWS, unbacked certifications) is explicitly prohibited from being fabricated.
          </p>
        </div>
      </div>

      {/* Side-by-Side Diff Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: ORIGINAL DOCUMENT */}
        <div className="lg:col-span-4 bg-[#0C1118] border border-[#1C2633] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1C2633]">
            <span className="font-mono text-xs font-bold text-[#66717F] uppercase">ORIGINAL RESUME</span>
            <span className="text-[10px] font-mono text-[#66717F]">V0 BASELINE</span>
          </div>

          <div className="space-y-4 text-xs font-sans text-[#A7B0BC] leading-relaxed opacity-80">
            <div className="space-y-1">
              <div className="font-mono text-xs font-bold text-[#F3F5F7]">SUMMARY</div>
              <p className="p-3 rounded bg-[#111822] border border-[#1C2633]">
                Frontend Engineer with 4 years of experience delivering responsive web apps and interactive UI systems.
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-xs font-bold text-[#F3F5F7]">EXPERIENCE</div>
              <div className="p-3 rounded bg-[#111822] border border-[#1C2633] space-y-1">
                <div className="font-mono font-bold text-[#F3F5F7]">Apex Tech Labs — Frontend Engineer</div>
                <p>• Architected core dashboard components handling 120k daily active users.</p>
                <p>• Improved web performance score from 64 to 94.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: AI TAILORED DOCUMENT */}
        <div className="lg:col-span-4 bg-[#0C1118] border border-[#35C6FF]/40 rounded-xl p-5 space-y-4 shadow-[0_0_20px_rgba(53,198,255,0.15)]">
          <div className="flex items-center justify-between pb-3 border-b border-[#35C6FF]/30">
            <span className="font-mono text-xs font-bold text-[#35C6FF] uppercase">AI TAILORED RESUME</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#35C6FF]/10 text-[#35C6FF] font-bold">V1 OPTIMIZED</span>
          </div>

          <div className="space-y-4 text-xs font-sans text-[#F3F5F7] leading-relaxed">
            <div className="space-y-1">
              <div className="font-mono text-xs font-bold text-[#35C6FF]">SUMMARY</div>
              <p className="p-3 rounded bg-[#151D28] border border-[#35C6FF]/40 text-[#F3F5F7]">
                Results-driven Frontend Developer with 4+ years of experience crafting high-performance web applications using React, modern JavaScript, and Tailwind CSS.
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-xs font-bold text-[#35C6FF]">EXPERIENCE</div>
              <div className="p-3 rounded bg-[#151D28] border border-[#35C6FF]/40 space-y-1">
                <div className="font-mono font-bold text-[#F3F5F7]">Apex Tech Labs — Frontend Engineer</div>
                <p className="text-[#35D399]">
                  • Architected real-time dashboard UI components handling 120,000+ daily active users utilizing React and REST/WebSocket feeds.
                </p>
                <p className="text-[#35D399]">
                  • Pioneered client-side performance optimization strategy, elevating Lighthouse performance score from 64 to 94.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* WHY AI CHANGED THIS PANEL */}
        <div className="lg:col-span-4 bg-[#0C1118] border border-[#1C2633] rounded-xl p-5 space-y-5">
          <div className="pb-3 border-b border-[#1C2633]">
            <h3 className="font-mono text-xs font-bold text-[#F3F5F7] uppercase tracking-wider">
              WHY AI CHANGED THIS
            </h3>
            <p className="text-[11px] text-[#A7B0BC]">Transparent rationale for every document modification.</p>
          </div>

          <div className="space-y-3">
            {resumeVersion.changesLog.map((change) => (
              <div key={change.id} className="p-3.5 rounded-xl bg-[#111822] border border-[#1C2633] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#35C6FF]">SECTION: {change.section}</span>
                  {change.guardrailNote ? (
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#4F7CFF]/10 text-[#4F7CFF] border border-[#4F7CFF]/30 font-bold">
                      GUARDRAIL ENFORCED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#35D399]/10 text-[#35D399]">
                      KEYWORD ENHANCED
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#F3F5F7] font-medium leading-relaxed">
                  "{change.rationale}"
                </p>

                {change.guardrailNote && (
                  <div className="text-[11px] font-mono text-[#A7B0BC] bg-[#070A0F] p-2 rounded border border-[#1C2633] flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#35C6FF] shrink-0" />
                    <span>{change.guardrailNote}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveScreen('resume-export')}
            className="w-full py-3 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all flex items-center justify-center gap-2"
          >
            <span>CONTINUE TO RESUME EXPORT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
