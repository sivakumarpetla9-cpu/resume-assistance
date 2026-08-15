import React, { useState } from 'react';
import { useCareer } from '../store/CareerContext';
import { Download, CheckCircle2, History } from 'lucide-react';

export const ResumeExportPage: React.FC = () => {
  const { resumeVersion, activeJobTarget, showToast, setActiveScreen } = useCareer();
  const [selectedTemplate, setSelectedTemplate] = useState<'Minimal' | 'Technical' | 'Executive'>('Technical');
  const [selectedVersion, setSelectedVersion] = useState<'Original' | 'V1' | 'V2'>('V1');

  const handleDownload = () => {
    showToast(`Downloading Alex_Vance_Resume_${selectedVersion}_${selectedTemplate}.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0C1118] border border-[#1C2633]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#35C6FF]">
            <Download className="w-4 h-4" />
            RESUME EXPORT & PREVIEW STUDIO
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F3F5F7]">
            EXPORT ATS-COMPLIANT RESUME
          </h1>
          <p className="text-xs text-[#A7B0BC]">
            Optimized for: <span className="font-mono text-[#35C6FF]">{activeJobTarget.title} — {activeJobTarget.company}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen('resume-tailoring')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#151D28] border border-[#1C2633] hover:border-[#35C6FF]/40 text-xs font-mono text-[#F3F5F7] transition-all"
          >
            <History className="w-3.5 h-3.5 text-[#35C6FF]" />
            <span>Compare Versions</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all shadow-[0_0_20px_rgba(53,198,255,0.35)]"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Template & Version Controls */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Version Selector */}
          <div className="p-5 rounded-2xl bg-[#0C1118] border border-[#1C2633] space-y-4">
            <h3 className="font-mono text-xs font-bold text-[#F3F5F7] uppercase tracking-wider">
              DOCUMENT VERSION
            </h3>

            <div className="space-y-2">
              {[
                { id: 'Original', label: 'V0 — Base Resume', sub: 'Unmodified original upload' },
                { id: 'V1', label: 'V1 — XYZ Tailored', sub: '82% ATS Match • Guardrails Verified' },
                { id: 'V2', label: 'V2 — Technical Emphasis', sub: 'Emphasizes System Architecture' }
              ].map(ver => (
                <div
                  key={ver.id}
                  onClick={() => setSelectedVersion(ver.id as any)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedVersion === ver.id
                      ? 'bg-[#151D28] border-[#35C6FF] text-[#F3F5F7]'
                      : 'bg-[#111822] border-[#1C2633] text-[#A7B0BC] hover:border-[#1C2633]/80'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-xs text-[#F3F5F7]">{ver.label}</span>
                    {selectedVersion === ver.id && <CheckCircle2 className="w-4 h-4 text-[#35C6FF]" />}
                  </div>
                  <div className="text-[11px] text-[#66717F] mt-0.5">{ver.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Template Selector */}
          <div className="p-5 rounded-2xl bg-[#0C1118] border border-[#1C2633] space-y-4">
            <h3 className="font-mono text-xs font-bold text-[#F3F5F7] uppercase tracking-wider">
              ATS TEMPLATE DESIGN
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {(['Minimal', 'Technical', 'Executive'] as const).map(tpl => (
                <button
                  key={tpl}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`p-3 rounded-xl border text-center font-mono text-xs font-bold transition-all ${
                    selectedTemplate === tpl
                      ? 'bg-[#35C6FF]/10 border-[#35C6FF] text-[#35C6FF]'
                      : 'bg-[#111822] border-[#1C2633] text-[#A7B0BC] hover:text-[#F3F5F7]'
                  }`}
                >
                  {tpl}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#A7B0BC]">
              All templates follow standard single-column, ATS-parseable layout guidelines.
            </p>
          </div>

          {/* ATS Status */}
          <div className="p-4 rounded-xl bg-[#111822] border border-[#35D399]/40 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#35D399] shrink-0" />
            <div className="text-xs font-mono text-[#F3F5F7]">
              <span>100% ATS PARSABILITY PASSED</span>
              <div className="text-[10px] text-[#A7B0BC]">No tables, graphics, or text box issues detected.</div>
            </div>
          </div>

        </div>

        {/* Right Column: High Fidelity Document Preview */}
        <div className="lg:col-span-8 bg-[#0C1118] border border-[#1C2633] rounded-2xl p-8 shadow-2xl space-y-6 font-sans">
          
          {/* Simulated PDF Sheet */}
          <div className="bg-[#FFFFFF] text-[#10151C] p-8 rounded-lg shadow-xl max-w-2xl mx-auto space-y-6 min-h-[680px]">
            {/* Header */}
            <div className="border-b border-[#E2E6EB] pb-4 text-center space-y-1">
              <h1 className="text-2xl font-bold font-mono tracking-tight text-[#10151C]">ALEX VANCE</h1>
              <p className="text-xs text-[#4B5563]">
                San Francisco, CA • (555) 234-5678 • alex.vance@example.com • github.com/alexvance
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-1">
              <h2 className="text-xs font-mono font-bold text-[#0099D8] tracking-wider uppercase border-b border-[#E2E6EB] pb-0.5">
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-xs text-[#10151C] leading-relaxed">
                {resumeVersion.summary}
              </p>
            </div>

            {/* Experience */}
            <div className="space-y-3">
              <h2 className="text-xs font-mono font-bold text-[#0099D8] tracking-wider uppercase border-b border-[#E2E6EB] pb-0.5">
                WORK EXPERIENCE
              </h2>
              {resumeVersion.experience.map(exp => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between font-mono text-xs font-bold text-[#10151C]">
                    <span>{exp.title} — {exp.company}</span>
                    <span className="text-[#4B5563]">{exp.period}</span>
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-[#4B5563] space-y-1 leading-relaxed">
                    {(exp.tailoredBullets || exp.bullets).map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="space-y-1">
              <h2 className="text-xs font-mono font-bold text-[#0099D8] tracking-wider uppercase border-b border-[#E2E6EB] pb-0.5">
                TECHNICAL SKILLS
              </h2>
              <p className="text-xs text-[#10151C] font-mono">
                <span className="font-bold">Languages & Frameworks:</span> React, JavaScript, HTML5, CSS3, Tailwind CSS, REST APIs, Redux
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
