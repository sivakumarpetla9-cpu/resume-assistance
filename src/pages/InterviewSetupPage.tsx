import React, { useState } from 'react';
import { useCareer } from '../store/CareerContext';
import { MessageSquareCode, Play } from 'lucide-react';

export const InterviewSetupPage: React.FC = () => {
  const { activeJobTarget, startInterviewSession, setActiveScreen } = useCareer();
  const [type, setType] = useState<'Technical' | 'Behavioral' | 'Mixed'>('Technical');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  const handleStart = () => {
    startInterviewSession(type, difficulty);
    setActiveScreen('interview-room');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111822] border border-[#35C6FF]/40 text-xs font-mono text-[#35C6FF]">
          <MessageSquareCode className="w-3.5 h-3.5" />
          REAL-TIME AI VOICE INTERVIEW SIMULATOR
        </div>
        <h1 className="text-3xl font-bold text-[#F3F5F7]">Configure Mock Interview</h1>
        <p className="text-xs text-[#A7B0BC]">
          Configure room parameters. Questions adapt dynamically based on your target job, resume evidence, and live performance.
        </p>
      </div>

      <div className="bg-[#0C1118] border border-[#1C2633] rounded-2xl p-8 shadow-xl space-y-6">
        
        {/* Active Context */}
        <div className="p-4 rounded-xl bg-[#111822] border border-[#1C2633] flex justify-between items-center text-xs font-mono">
          <span className="text-[#A7B0BC]">TARGET JOB:</span>
          <span className="text-[#35C6FF] font-bold">{activeJobTarget.title} — {activeJobTarget.company}</span>
        </div>

        {/* Type Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-mono text-[#A7B0BC]">INTERVIEW FOCUS TYPE</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'Technical', label: 'Technical Core', desc: 'Coding patterns, architecture & React internals' },
              { id: 'Behavioral', label: 'Behavioral STAR', desc: 'Communication, STAR method & leadership' },
              { id: 'Mixed', label: 'Adaptive Mixed', desc: '50% Technical + 50% Behavioral scenario' }
            ].map(t => (
              <div
                key={t.id}
                onClick={() => setType(t.id as any)}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-1 ${
                  type === t.id
                    ? 'bg-[#151D28] border-[#35C6FF] text-[#F3F5F7]'
                    : 'bg-[#111822] border-[#1C2633] text-[#A7B0BC] hover:border-[#1C2633]/80'
                }`}
              >
                <div className="font-mono font-bold text-xs text-[#F3F5F7]">{t.label}</div>
                <div className="text-[10px] text-[#66717F] leading-snug">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-mono text-[#A7B0BC]">STARTING DIFFICULTY</label>
          <div className="grid grid-cols-3 gap-3">
            {(['Easy', 'Medium', 'Hard'] as const).map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`py-3 rounded-xl border font-mono text-xs font-bold transition-all ${
                  difficulty === d
                    ? 'bg-[#35C6FF]/10 border-[#35C6FF] text-[#35C6FF]'
                    : 'bg-[#111822] border-[#1C2633] text-[#A7B0BC] hover:text-[#F3F5F7]'
                }`}
              >
                {d.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full py-4 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(53,198,255,0.4)]"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>ENTER FULLSCREEN INTERVIEW ROOM</span>
        </button>

      </div>
    </div>
  );
};
