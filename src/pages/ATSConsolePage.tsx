import React, { useState } from 'react';
import { useCareer } from '../store/CareerContext';
import { Cpu, CheckCircle2, XCircle, AlertTriangle, ArrowRight, ShieldAlert, Play } from 'lucide-react';

export const ATSConsolePage: React.FC = () => {
  const { atsDiagnostic, activeJobTarget, verifySkill, setActiveScreen, runATSAnalysis } = useCareer();
  const [analyzing, setAnalyzing] = useState(false);

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    await runATSAnalysis(activeJobTarget.id);
    setAnalyzing(false);
  };

  const isAnalyzed = atsDiagnostic.overallScore !== null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0C1118] border border-[#1C2633]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#35D399]">
            <Cpu className="w-4 h-4" />
            ATS DIAGNOSTIC CONSOLE v4.2
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F3F5F7]">
            ATS COMPLIANCE DIAGNOSTICS
          </h1>
          <p className="text-xs text-[#A7B0BC]">
            Analyzed against: <span className="font-mono text-[#35C6FF]">{activeJobTarget.title} — {activeJobTarget.company}</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-6 py-3 rounded-2xl bg-[#111822] border border-[#35C6FF]/50 text-center shadow-[0_0_20px_rgba(53,198,255,0.2)]">
            <div className="font-mono text-4xl font-extrabold text-[#F3F5F7]">
              {isAnalyzed ? `${atsDiagnostic.overallScore}%` : '--'}
            </div>
            <div className="text-[10px] font-mono text-[#35C6FF] uppercase tracking-wider">
              {isAnalyzed ? 'ATS MATCH SCORE' : 'NOT ANALYZED YET'}
            </div>
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all shadow-[0_0_15px_rgba(53,198,255,0.3)] disabled:opacity-40"
          >
            {analyzing ? (
              <>
                <Cpu className="w-4 h-4 animate-spin" />
                <span>ANALYZING...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>{isAnalyzed ? 'RE-RUN ATS ANALYSIS' : 'RUN ATS ANALYSIS'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {!isAnalyzed ? (
        /* Empty Un-Analyzed State Card */
        <div className="p-12 rounded-2xl bg-[#0C1118] border border-[#1C2633] text-center space-y-4">
          <div className="p-4 rounded-full bg-[#111822] border border-[#35C6FF]/30 w-16 h-16 mx-auto flex items-center justify-center">
            <Cpu className="w-8 h-8 text-[#35C6FF]" />
          </div>
          <h2 className="text-xl font-mono font-bold text-[#F3F5F7]">
            No ATS Diagnostic Available for {activeJobTarget.title}
          </h2>
          <p className="text-xs text-[#A7B0BC] max-w-md mx-auto">
            Click <strong className="text-[#35C6FF]">Run ATS Analysis</strong> to evaluate your uploaded resume against the job description and generate real match scores, keyword coverage, and skill gap metrics.
          </p>
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all"
          >
            <Play className="w-4 h-4" />
            <span>RUN ATS ANALYSIS NOW</span>
          </button>
        </div>
      ) : (
        <>
          {/* Breakdown Gauges */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl bg-[#0C1118] border border-[#1C2633] space-y-1">
              <div className="text-[10px] font-mono text-[#66717F] uppercase">KEYWORD DENSITY</div>
              <div className="font-mono text-2xl font-bold text-[#F3F5F7]">{atsDiagnostic.keywordScore}%</div>
              <div className="w-full h-1.5 rounded-full bg-[#111822] overflow-hidden">
                <div className="h-full bg-[#35C6FF]" style={{ width: `${atsDiagnostic.keywordScore}%` }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0C1118] border border-[#1C2633] space-y-1">
              <div className="text-[10px] font-mono text-[#66717F] uppercase">SKILLS ALIGNMENT</div>
              <div className="font-mono text-2xl font-bold text-[#F3F5F7]">{atsDiagnostic.skillsScore}%</div>
              <div className="w-full h-1.5 rounded-full bg-[#111822] overflow-hidden">
                <div className="h-full bg-[#4F7CFF]" style={{ width: `${atsDiagnostic.skillsScore}%` }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0C1118] border border-[#1C2633] space-y-1">
              <div className="text-[10px] font-mono text-[#66717F] uppercase">EXPERIENCE IMPACT</div>
              <div className="font-mono text-2xl font-bold text-[#F3F5F7]">{atsDiagnostic.experienceScore}%</div>
              <div className="w-full h-1.5 rounded-full bg-[#111822] overflow-hidden">
                <div className="h-full bg-[#35D399]" style={{ width: `${atsDiagnostic.experienceScore}%` }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0C1118] border border-[#1C2633] space-y-1">
              <div className="text-[10px] font-mono text-[#66717F] uppercase">STRUCTURE & FORMAT</div>
              <div className="font-mono text-2xl font-bold text-[#F3F5F7]">{atsDiagnostic.structureScore}%</div>
              <div className="w-full h-1.5 rounded-full bg-[#111822] overflow-hidden">
                <div className="h-full bg-[#F2B84B]" style={{ width: `${atsDiagnostic.structureScore}%` }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0C1118] border border-[#1C2633] space-y-1 col-span-2 md:col-span-1">
              <div className="text-[10px] font-mono text-[#66717F] uppercase">GRAMMAR & TONE</div>
              <div className="font-mono text-2xl font-bold text-[#F3F5F7]">{atsDiagnostic.languageScore}%</div>
              <div className="w-full h-1.5 rounded-full bg-[#111822] overflow-hidden">
                <div className="h-full bg-[#35C6FF]" style={{ width: `${atsDiagnostic.languageScore}%` }} />
              </div>
            </div>
          </div>

          {/* Strict Guardrail Alert Banner */}
          {atsDiagnostic.guardrailAlerts.map((alert, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#111822] border border-[#4F7CFF] text-xs font-mono text-[#F3F5F7] flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-[#35C6FF] shrink-0" />
              <span>{alert}</span>
            </div>
          ))}

          {/* Diagnostic Issues Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Actionable Issues */}
            <div className="lg:col-span-7 bg-[#0C1118] border border-[#1C2633] rounded-xl p-6 space-y-4">
              <h3 className="font-mono text-xs font-bold text-[#F3F5F7] uppercase tracking-wider">
                ACTIONABLE STRUCTURAL & KEYWORD ISSUES
              </h3>

              <div className="space-y-3">
                {atsDiagnostic.structuralIssues.map((issue, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#111822] border border-[#1C2633] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        issue.severity === 'high' ? 'bg-[#F06A6A]/10 text-[#F06A6A]' : 'bg-[#F2B84B]/10 text-[#F2B84B]'
                      }`}>
                        {issue.severity.toUpperCase()} SEVERITY
                      </span>
                      <button
                        onClick={() => setActiveScreen('resume-studio')}
                        className="text-[11px] font-mono text-[#35C6FF] hover:underline flex items-center gap-1"
                      >
                        Open Resume Editor <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="text-xs text-[#F3F5F7] font-medium leading-relaxed">
                      {issue.issue}
                    </p>

                    <div className="text-[11px] text-[#A7B0BC] bg-[#070A0F] p-2.5 rounded-lg border border-[#1C2633] font-mono">
                      <span className="text-[#35D399]">ACTION:</span> {issue.fixAction}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Matched vs Missing vs Weak Keywords */}
            <div className="lg:col-span-5 bg-[#0C1118] border border-[#1C2633] rounded-xl p-6 space-y-6">
              <h3 className="font-mono text-xs font-bold text-[#F3F5F7] uppercase tracking-wider">
                KEYWORD BREAKDOWN
              </h3>

              {/* Missing */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-[#F06A6A] flex items-center gap-1.5 font-bold">
                  <XCircle className="w-4 h-4" /> MISSING KEYWORDS ({atsDiagnostic.missingSkills.length})
                </div>
                <div className="space-y-1.5">
                  {atsDiagnostic.missingSkills.map((sk, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[#111822] border border-[#1C2633] flex justify-between items-center text-xs font-mono">
                      <span className="text-[#F3F5F7]">{sk}</span>
                      <button
                        onClick={() => verifySkill(sk)}
                        className="px-2 py-1 rounded bg-[#35C6FF]/10 border border-[#35C6FF]/40 text-[#35C6FF] text-[10px] hover:bg-[#35C6FF] hover:text-[#070A0F] transition-colors"
                      >
                        + VERIFY & FIX
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matched */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-[#35D399] flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4" /> MATCHED KEYWORDS ({atsDiagnostic.matchedSkills.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {atsDiagnostic.matchedSkills.map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded bg-[#35D399]/10 border border-[#35D399]/30 text-xs font-mono text-[#35D399]">
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Weak */}
              {atsDiagnostic.weakKeywords.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-mono text-[#F2B84B] flex items-center gap-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4" /> WEAK KEYWORD EVIDENCE
                  </div>
                  <ul className="space-y-1 text-xs text-[#A7B0BC]">
                    {atsDiagnostic.weakKeywords.map((wk, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F2B84B]" />
                        <span>{wk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>
        </>
      )}
    </div>
  );
};
