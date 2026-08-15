import React, { useState } from 'react';
import { useCareer } from '../store/CareerContext';
import { FileText, Sparkles, ChevronRight, AlertCircle, History, Download, ArrowRight } from 'lucide-react';

export const ResumeStudioPage: React.FC = () => {
  const { resumeVersion, activeJobTarget, updateResumeSection, setActiveScreen } = useCareer();
  const [selectedSection, setSelectedSection] = useState<'Summary' | 'Experience' | 'Projects' | 'Skills' | 'Education'>('Experience');
  const [editingSummary, setEditingSummary] = useState(resumeVersion.summary);

  const sections = ['Summary', 'Experience', 'Projects', 'Skills', 'Education'] as const;

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-6 space-y-4 animate-fade-in">
      
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0C1118] border border-[#1C2633]">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#35C6FF]" />
          <div>
            <h1 className="text-base font-bold font-mono text-[#F3F5F7]">RESUME STUDIO — WORKSPACE</h1>
            <p className="text-xs text-[#A7B0BC]">
              Target Job: <span className="text-[#35C6FF] font-mono">{activeJobTarget.title} — {activeJobTarget.company}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveScreen('resume-tailoring')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#151D28] border border-[#1C2633] hover:border-[#35C6FF]/40 text-xs font-mono text-[#F3F5F7] transition-all"
          >
            <History className="w-3.5 h-3.5 text-[#35C6FF]" />
            <span>AI Tailoring Diff</span>
          </button>

          <button
            onClick={() => setActiveScreen('resume-export')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all shadow-[0_0_15px_rgba(53,198,255,0.3)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* 3-Zone Document Editing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-210px)] min-h-[600px]">
        
        {/* ZONE 1 (LEFT): Resume Sections Sidebar */}
        <div className="lg:col-span-2 bg-[#0C1118] border border-[#1C2633] rounded-xl p-3 space-y-2">
          <div className="text-[11px] font-mono text-[#66717F] uppercase tracking-wider px-2 py-1">
            SECTIONS
          </div>
          {sections.map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono transition-all text-left ${
                selectedSection === sec
                  ? 'bg-[#151D28] text-[#35C6FF] border border-[#35C6FF]/40 font-bold'
                  : 'text-[#A7B0BC] hover:text-[#F3F5F7] hover:bg-[#111822]'
              }`}
            >
              <span>{sec}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          ))}
        </div>

        {/* ZONE 2 (CENTER): Interactive Document Editor */}
        <div className="lg:col-span-6 bg-[#0C1118] border border-[#1C2633] rounded-xl p-6 overflow-y-auto space-y-6 shadow-inner font-sans">
          
          {/* Document Header */}
          <div className="border-b border-[#1C2633] pb-4 space-y-1">
            <h2 className="text-xl font-bold text-[#F3F5F7] font-mono">Alex Vance</h2>
            <p className="text-xs text-[#A7B0BC] font-mono">
              San Francisco, CA • alex.vance@example.com • linkedin.com/in/alexvance
            </p>
          </div>

          {/* Section 1: Summary */}
          <div className={`p-4 rounded-xl transition-colors border ${selectedSection === 'Summary' ? 'bg-[#111822] border-[#35C6FF]/50' : 'border-transparent hover:border-[#1C2633]'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-mono font-bold text-[#35C6FF] uppercase">Professional Summary</h3>
              {selectedSection === 'Summary' && <span className="text-[10px] font-mono text-[#35D399]">ACTIVE SECTION</span>}
            </div>
            <textarea
              rows={3}
              value={editingSummary}
              onChange={(e) => {
                setEditingSummary(e.target.value);
                updateResumeSection('summary', e.target.value);
              }}
              className="w-full bg-transparent text-xs text-[#F3F5F7] leading-relaxed border border-[#1C2633] focus:border-[#35C6FF] rounded-lg p-2.5 focus:outline-none font-sans"
            />
          </div>

          {/* Section 2: Experience */}
          <div className={`p-4 rounded-xl transition-colors border space-y-4 ${selectedSection === 'Experience' ? 'bg-[#111822] border-[#35C6FF]/50' : 'border-transparent hover:border-[#1C2633]'}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-[#35C6FF] uppercase">Work Experience</h3>
              {selectedSection === 'Experience' && <span className="text-[10px] font-mono text-[#35D399]">ACTIVE SECTION</span>}
            </div>

            {resumeVersion.experience.map(exp => (
              <div key={exp.id} className="space-y-2 border-b border-[#1C2633]/60 pb-3 last:border-0">
                <div className="flex justify-between items-baseline font-mono text-xs">
                  <span className="font-bold text-[#F3F5F7]">{exp.title} — <span className="text-[#35C6FF]">{exp.company}</span></span>
                  <span className="text-[#66717F]">{exp.period}</span>
                </div>
                <ul className="space-y-1.5 list-disc list-inside text-xs text-[#A7B0BC]">
                  {(exp.tailoredBullets || exp.bullets).map((bullet, bIdx) => (
                    <li key={bIdx} className="leading-relaxed">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Section 3: Projects */}
          <div className={`p-4 rounded-xl transition-colors border space-y-3 ${selectedSection === 'Projects' ? 'bg-[#111822] border-[#35C6FF]/50' : 'border-transparent hover:border-[#1C2633]'}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-[#35C6FF] uppercase">Projects & Technical Evidence</h3>
              {selectedSection === 'Projects' && <span className="text-[10px] font-mono text-[#35D399]">ACTIVE SECTION</span>}
            </div>

            {resumeVersion.projects.map(proj => (
              <div key={proj.id} className="space-y-1 text-xs">
                <div className="font-mono font-bold text-[#F3F5F7]">{proj.name}</div>
                <p className="text-[#A7B0BC]">{proj.description}</p>
                <div className="flex gap-1.5 pt-1">
                  {proj.techStack.map((tech, tIdx) => (
                    <span key={tIdx} className="px-2 py-0.5 rounded bg-[#151D28] text-[10px] font-mono text-[#35C6FF]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Section 4: Skills */}
          <div className={`p-4 rounded-xl transition-colors border space-y-3 ${selectedSection === 'Skills' ? 'bg-[#111822] border-[#35C6FF]/50' : 'border-transparent hover:border-[#1C2633]'}`}>
            <h3 className="text-xs font-mono font-bold text-[#35C6FF] uppercase">Core Skills</h3>
            <div className="flex flex-wrap gap-2">
              {resumeVersion.skills.flatMap(s => s.items).map((sk, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded bg-[#151D28] border border-[#1C2633] text-xs font-mono text-[#F3F5F7]">
                  {sk}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* ZONE 3 (RIGHT): AI Intelligence Panel */}
        <div className="lg:col-span-4 bg-[#0C1118] border border-[#1C2633] rounded-xl p-5 overflow-y-auto space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1C2633]">
            <Sparkles className="w-4 h-4 text-[#35C6FF]" />
            <h3 className="font-mono text-xs font-bold text-[#F3F5F7] uppercase tracking-wider">
              AI SECTION INTELLIGENCE — {selectedSection.toUpperCase()}
            </h3>
          </div>

          {selectedSection === 'Experience' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#111822] border border-[#1C2633] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#A7B0BC]">IMPACT METRIC SCORE</span>
                  <span className="text-[#35D399] font-bold">92/100</span>
                </div>
                <p className="text-xs text-[#A7B0BC] leading-relaxed">
                  High quantifiable density. "120,000+ daily active users" and "Lighthouse score from 64 to 94" provide strong empirical proof.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111822] border border-[#1C2633] space-y-2">
                <div className="text-xs font-mono text-[#35C6FF] font-bold uppercase">
                  ATS KEYWORD RELEVANCE
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-[#35D399]/10 text-[#35D399] text-[10px] font-mono rounded">React (Matched)</span>
                  <span className="px-2 py-0.5 bg-[#35D399]/10 text-[#35D399] text-[10px] font-mono rounded">REST APIs (Matched)</span>
                  <span className="px-2 py-0.5 bg-[#F06A6A]/10 text-[#F06A6A] text-[10px] font-mono rounded">TypeScript (Missing)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111822] border border-[#35C6FF]/40 space-y-2">
                <div className="text-xs font-mono font-bold text-[#35C6FF]">RECOMMENDED PHRASING ADJUSTMENT</div>
                <p className="text-xs text-[#A7B0BC] italic">
                  "Architected real-time dashboard UI components handling 120,000+ daily active users utilizing React and optimized WebSocket feeds."
                </p>
                <div className="text-[11px] text-[#66717F]">
                  <span className="font-bold text-[#F3F5F7]">Why:</span> Emphasizes real-time WebSocket architecture directly matching XYZ Company criteria.
                </div>
              </div>
            </div>
          )}

          {selectedSection === 'Summary' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#111822] border border-[#1C2633] space-y-2">
                <div className="text-xs font-mono font-bold text-[#35C6FF]">ROLE MATCH SUMMARY</div>
                <p className="text-xs text-[#A7B0BC]">
                  Your summary directly matches the Frontend Developer job target title and highlights performance optimization.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111822] border border-[#F2B84B]/40 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#F2B84B] font-bold">
                  <AlertCircle className="w-3.5 h-3.5" /> KEYWORD OPPORTUNITY
                </div>
                <p className="text-xs text-[#A7B0BC]">
                  Consider explicitly mentioning TypeScript in your summary once verified to increase initial recruiter screening pass rates.
                </p>
              </div>
            </div>
          )}

          {(selectedSection === 'Skills' || selectedSection === 'Projects' || selectedSection === 'Education') && (
            <div className="p-4 rounded-xl bg-[#111822] border border-[#1C2633] text-xs text-[#A7B0BC] space-y-2">
              <div className="font-mono font-bold text-[#35C6FF]">SECTION HEALTH: GOOD</div>
              <p>Section is structured clearly for ATS parser engines. No parsing syntax errors detected.</p>
            </div>
          )}

          <div className="pt-4 border-t border-[#1C2633] flex justify-end">
            <button
              onClick={() => setActiveScreen('resume-tailoring')}
              className="w-full py-2.5 rounded-xl bg-[#151D28] border border-[#35C6FF]/40 text-[#35C6FF] font-mono text-xs font-bold hover:bg-[#35C6FF]/10 transition-colors flex items-center justify-center gap-2"
            >
              <span>RUN FULL AI TAILORING ANALYSIS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
