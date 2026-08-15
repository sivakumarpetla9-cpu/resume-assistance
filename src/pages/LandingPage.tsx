import React from 'react';
import { useCareer } from '../store/CareerContext';
import { CareerIntelligenceGraph } from '../components/graph/CareerIntelligenceGraph';
import { Cpu, MessageSquareCode, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveScreen } = useCareer();

  return (
    <div className="min-h-screen bg-[#070A0F] text-[#F3F5F7] selection:bg-[#35C6FF]/30">
      {/* Top Banner & Minimal Header */}
      <div className="border-b border-[#1C2633] bg-[#0C1118]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#35C6FF] to-[#4F7CFF] p-0.5">
              <div className="w-full h-full bg-[#070A0F] rounded-[5px] flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5 text-[#35C6FF]" />
              </div>
            </div>
            <span className="font-mono text-sm font-bold tracking-wider">STITCH</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveScreen('login')}
              className="text-xs font-mono text-[#A7B0BC] hover:text-[#F3F5F7] transition-colors"
            >
              SIGN IN
            </button>
            <button
              onClick={() => setActiveScreen('signup')}
              className="px-3.5 py-1.5 rounded-lg bg-[#35C6FF] text-[#070A0F] font-mono text-xs font-bold hover:bg-[#35C6FF]/90 transition-all shadow-[0_0_15px_rgba(53,198,255,0.3)]"
            >
              GET STARTED
            </button>
          </div>
        </div>
      </div>

      {/* Non-Conventional SaaS Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111822] border border-[#35C6FF]/40 text-xs font-mono text-[#35C6FF]">
            <Zap className="w-3.5 h-3.5" />
            CAREER INTELLIGENCE OPERATING SYSTEM
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-[#F3F5F7]">
            Turn Your Resume Into Your <span className="text-[#35C6FF]">Career Strategy</span>.
          </h1>

          <p className="text-base text-[#A7B0BC] leading-relaxed">
            Analyze the job. Understand the gap. Build the resume. Practice the interview. Become the candidate the role is looking for.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveScreen('onboarding')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-sm hover:bg-[#35C6FF]/90 transition-all shadow-[0_0_20px_rgba(53,198,255,0.35)]"
            >
              <span>Analyze My Resume</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveScreen('command-center')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#111822] border border-[#1C2633] text-[#F3F5F7] font-mono text-sm hover:border-[#35C6FF]/50 transition-colors"
            >
              <span>Explore Platform</span>
            </button>
          </div>

          {/* Trust Metrics */}
          <div className="pt-6 border-t border-[#1C2633]/60 grid grid-cols-3 gap-4">
            <div>
              <div className="font-mono text-xl font-bold text-[#F3F5F7]">98.4%</div>
              <div className="text-[11px] text-[#66717F]">ATS Parsing Accuracy</div>
            </div>
            <div>
              <div className="font-mono text-xl font-bold text-[#35C6FF]">0%</div>
              <div className="text-[11px] text-[#66717F]">Generative Hallucination</div>
            </div>
            <div>
              <div className="font-mono text-xl font-bold text-[#35D399]">Real-Time</div>
              <div className="text-[11px] text-[#66717F]">Voice Telemetry</div>
            </div>
          </div>
        </div>

        {/* Hero Visual: Signature Career Intelligence Graph */}
        <div className="lg:col-span-6">
          <div className="p-1 rounded-2xl bg-gradient-to-b from-[#1C2633] to-[#0C1118] border border-[#1C2633]">
            <CareerIntelligenceGraph compact={false} />
          </div>
        </div>
      </section>

      {/* Connected Architecture Feature Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-[#1C2633]/60">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="text-xs font-mono text-[#35C6FF] uppercase tracking-widest">ONE CONNECTED GRAPH</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F3F5F7]">Everything Works Together in Sync</h2>
          <p className="text-sm text-[#A7B0BC]">
            A single target job powers job matching, ATS diagnostic, resume tailoring, adaptive interview questions, and your personalized learning roadmap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-[#0C1118] border border-[#1C2633] hover:border-[#35C6FF]/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#35C6FF]/10 text-[#35C6FF] flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-mono font-bold text-base text-[#F3F5F7]">ATS Diagnostic Console</h3>
            <p className="text-xs text-[#A7B0BC] leading-relaxed">
              Deep semantic keyword analysis, structural flaw detection, and instant actionable bullet fixes.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#0C1118] border border-[#1C2633] hover:border-[#35C6FF]/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#4F7CFF]/10 text-[#4F7CFF] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-mono font-bold text-base text-[#F3F5F7]">Guardrail Resume Tailoring</h3>
            <p className="text-xs text-[#A7B0BC] leading-relaxed">
              Side-by-side diff comparison with zero hallucination. Non-fabrication engine strictly protects candidate integrity.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#0C1118] border border-[#1C2633] hover:border-[#35C6FF]/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#35D399]/10 text-[#35D399] flex items-center justify-center">
              <MessageSquareCode className="w-5 h-5" />
            </div>
            <h3 className="font-mono font-bold text-base text-[#F3F5F7]">Real-Time AI Interview</h3>
            <p className="text-xs text-[#A7B0BC] leading-relaxed">
              Immersive voice simulation room with live WPM, filler word count, clarity %, and adaptive question difficulty.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
