import React, { useState } from 'react';
import { useCareer } from '../store/CareerContext';
import { Award, BookOpen } from 'lucide-react';

export const SkillGapPage: React.FC = () => {
  const { skillGaps, activeJobTarget, verifySkill, setActiveScreen } = useCareer();
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(skillGaps[0]?.id || null);

  const selectedSkill = skillGaps.find(sg => sg.id === selectedSkillId) || skillGaps[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0C1118] border border-[#1C2633]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#F2B84B]">
            <Award className="w-4 h-4" />
            SKILL GAP MATRIX CONSTELLATION
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F3F5F7]">
            CANDIDATE ↔ TARGET ROLE SKILL GAPS
          </h1>
          <p className="text-xs text-[#A7B0BC]">
            Compared against requirements for: <span className="font-mono text-[#35C6FF]">{activeJobTarget.title} — {activeJobTarget.company}</span>
          </p>
        </div>

        <button
          onClick={() => setActiveScreen('learning-roadmap')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all shadow-[0_0_15px_rgba(53,198,255,0.3)]"
        >
          <BookOpen className="w-4 h-4" />
          <span>VIEW LEARNING ROADMAP</span>
        </button>
      </div>

      {skillGaps.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#0C1118] border border-[#1C2633] text-center space-y-4">
          <div className="p-4 rounded-full bg-[#111822] border border-[#35C6FF]/30 w-16 h-16 mx-auto flex items-center justify-center">
            <Award className="w-8 h-8 text-[#35C6FF]" />
          </div>
          <h2 className="text-xl font-mono font-bold text-[#F3F5F7]">
            No Skill Gaps Identified Yet
          </h2>
          <p className="text-xs text-[#A7B0BC] max-w-md mx-auto">
            Your candidate profile matches all current requirements, or you have not run an ATS analysis for <strong className="text-[#35C6FF]">{activeJobTarget.title}</strong> yet.
          </p>
          <button
            onClick={() => setActiveScreen('ats-console')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all"
          >
            <span>OPEN ATS DIAGNOSTIC CONSOLE</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Skills Constellation List */}
          <div className="lg:col-span-6 bg-[#0C1118] border border-[#1C2633] rounded-2xl p-6 space-y-4">
            <h3 className="font-mono text-xs font-bold text-[#F3F5F7] uppercase tracking-wider">
              SKILL STATUS SPECTRUM ({skillGaps.length})
            </h3>

            <div className="space-y-3">
              {skillGaps.map(sg => {
                const isSelected = selectedSkill?.id === sg.id;
                const priority = sg.priority || (sg.status === 'missing' ? 'HIGH' : 'MEDIUM');

                return (
                  <div
                    key={sg.id}
                    onClick={() => setSelectedSkillId(sg.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? 'bg-[#151D28] border-[#35C6FF] shadow-[0_0_15px_rgba(53,198,255,0.2)]'
                        : 'bg-[#111822] border-[#1C2633] hover:border-[#1C2633]/80'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#F3F5F7]">{sg.skillName}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                          priority === 'HIGH' ? 'bg-[#F06A6A]/20 text-[#F06A6A]' :
                          priority === 'MEDIUM' ? 'bg-[#F2B84B]/20 text-[#F2B84B]' :
                          'bg-[#66717F]/20 text-[#A7B0BC]'
                        }`}>
                          {priority} PRIORITY
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        sg.status === 'strong' ? 'bg-[#35D399]/10 text-[#35D399] border border-[#35D399]/30' :
                        sg.status === 'intermediate' ? 'bg-[#F2B84B]/10 text-[#F2B84B] border border-[#F2B84B]/30' :
                        'bg-[#F06A6A]/10 text-[#F06A6A] border border-[#F06A6A]/30'
                      }`}>
                        {sg.status}
                      </span>
                    </div>

                    <p className="text-xs text-[#A7B0BC] line-clamp-1">{sg.jobRequirement}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Skill Deep-Dive Drawer */}
          {selectedSkill && (
            <div className="lg:col-span-6 bg-[#0C1118] border border-[#1C2633] rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-[#1C2633]">
                <div className="space-y-0.5">
                  <h3 className="font-mono text-lg font-bold text-[#F3F5F7]">{selectedSkill.skillName}</h3>
                  <div className="text-xs font-mono text-[#35C6FF]">SKILL ANALYSIS & ACTION PLAN</div>
                </div>

                {selectedSkill.status !== 'strong' && (
                  <button
                    onClick={() => verifySkill(selectedSkill.skillName)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#35D399]/10 border border-[#35D399]/40 text-[#35D399] font-mono text-xs font-bold hover:bg-[#35D399] hover:text-[#070A0F] transition-all"
                  >
                    + VERIFY SKILL EVIDENCE
                  </button>
                )}
              </div>

              {/* Why it Matters */}
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#66717F] uppercase">WHY IT MATTERS FOR THIS ROLE</div>
                <p className="text-xs text-[#F3F5F7] font-medium leading-relaxed p-3 rounded-xl bg-[#111822] border border-[#1C2633]">
                  {selectedSkill.whyItMatters}
                </p>
              </div>

              {/* Candidate Evidence */}
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#66717F] uppercase">VERIFIED CANDIDATE EVIDENCE</div>
                <p className="text-xs text-[#A7B0BC] p-3 rounded-xl bg-[#111822] border border-[#1C2633]">
                  {selectedSkill.candidateEvidence}
                </p>
              </div>

              {/* How to Improve */}
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#66717F] uppercase">RECOMMENDED LEARNING ACTION</div>
                <p className="text-xs text-[#35C6FF] font-mono p-3 rounded-xl bg-[#111822] border border-[#35C6FF]/30">
                  {selectedSkill.howToImprove}
                </p>
              </div>

              {/* Practice Project */}
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#66717F] uppercase">PRACTICE PROJECT TASK</div>
                <div className="p-3.5 rounded-xl bg-[#151D28] border border-[#1C2633] space-y-1">
                  <div className="font-mono text-xs font-bold text-[#F3F5F7]">{selectedSkill.practiceProject}</div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
