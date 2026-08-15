import React from 'react';
import { useCareer } from '../store/CareerContext';
import { BookOpen, CheckCircle2, Clock } from 'lucide-react';

export const LearningRoadmapPage: React.FC = () => {
  const { roadmapSteps, activeJobTarget, verifySkill } = useCareer();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0C1118] border border-[#1C2633]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#35C6FF]">
            <BookOpen className="w-4 h-4" />
            CAREER PROGRESSION ROADMAP
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F3F5F7]">
            PATH TO TARGET ROLE READINESS
          </h1>
          <p className="text-xs text-[#A7B0BC]">
            Tailored progression toward: <span className="font-mono text-[#35C6FF]">{activeJobTarget.title} — {activeJobTarget.company}</span>
          </p>
        </div>

        <div className="px-5 py-2.5 rounded-xl bg-[#111822] border border-[#35C6FF]/40 text-center font-mono text-xs text-[#35C6FF] font-bold">
          ESTIMATED TIME: 23 HOURS
        </div>
      </div>

      {/* Vertical Career Progression Timeline */}
      <div className="relative border-l-2 border-[#1C2633] ml-6 space-y-8 pl-8 font-sans">
        
        {roadmapSteps.map((step) => {
          const isDone = step.status === 'completed';
          const isInProgress = step.status === 'in_progress';

          return (
            <div key={step.id} className="relative group">
              {/* Timeline Node Icon */}
              <div className={`absolute -left-[45px] top-0 w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all ${
                isDone ? 'bg-[#35D399] text-[#070A0F] shadow-[0_0_15px_rgba(53,211,153,0.4)]' :
                isInProgress ? 'bg-[#35C6FF] text-[#070A0F] animate-pulse shadow-[0_0_15px_rgba(53,198,255,0.4)]' :
                'bg-[#111822] border border-[#1C2633] text-[#66717F]'
              }`}>
                {isDone ? '✓' : step.order}
              </div>

              {/* Step Card Content */}
              <div className={`p-6 rounded-2xl border transition-all space-y-4 ${
                isInProgress ? 'bg-[#111822] border-[#35C6FF] shadow-[0_0_20px_rgba(53,198,255,0.15)]' :
                isDone ? 'bg-[#0C1118] border-[#35D399]/40 opacity-90' :
                'bg-[#0C1118] border-[#1C2633]'
              }`}>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1C2633] pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-[#35C6FF] uppercase font-bold tracking-wider">
                      STEP {step.order} • {step.category.toUpperCase()}
                    </span>
                    <h3 className="text-lg font-bold font-mono text-[#F3F5F7]">{step.title}</h3>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="flex items-center gap-1 text-[#A7B0BC]">
                      <Clock className="w-3.5 h-3.5" /> {step.estimatedHours}h
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      isDone ? 'bg-[#35D399]/10 text-[#35D399]' :
                      isInProgress ? 'bg-[#35C6FF]/10 text-[#35C6FF]' :
                      'bg-[#1C2633] text-[#66717F]'
                    }`}>
                      {step.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#A7B0BC] leading-relaxed">
                  <span className="font-mono text-[#F3F5F7] font-bold">RATIONALE:</span> {step.rationale}
                </p>

                {/* Practice Task */}
                <div className="p-3.5 rounded-xl bg-[#070A0F] border border-[#1C2633] text-xs font-mono space-y-1">
                  <div className="text-[#35C6FF] font-bold">PRACTICE TASK:</div>
                  <div className="text-[#F3F5F7]">{step.practiceTask}</div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    {step.resources.map((res, rIdx) => (
                      <span key={rIdx} className="px-2.5 py-1 rounded bg-[#151D28] text-[10px] font-mono text-[#A7B0BC]">
                        {res}
                      </span>
                    ))}
                  </div>

                  {!isDone && (
                    <button
                      onClick={() => verifySkill(step.title.split(' ')[0])}
                      className="px-4 py-2 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>MARK COMPLETED</span>
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}

        {/* Final Target Goal Node */}
        <div className="relative">
          <div className="absolute -left-[45px] top-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#35C6FF] to-[#4F7CFF] text-[#070A0F] flex items-center justify-center font-mono font-bold text-xs shadow-[0_0_20px_rgba(53,198,255,0.4)]">
            ★
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#111822] via-[#0C1118] to-[#111822] border border-[#35C6FF]/50 space-y-2">
            <h3 className="font-mono text-base font-bold text-[#F3F5F7]">TARGET ROLE READINESS ACHIEVED</h3>
            <p className="text-xs text-[#A7B0BC]">
              Upon completing these steps, your ATS Match score reaches 98% and interview readiness reaches 92%.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
