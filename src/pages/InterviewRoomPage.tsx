import React, { useState, useEffect } from 'react';
import { useCareer } from '../store/CareerContext';
import { Mic, Activity, Square, Radio, Sparkles, ChevronRight } from 'lucide-react';

export const InterviewRoomPage: React.FC = () => {
  const { interviewSession, updateInterviewTelemetry, addTranscriptLine, completeInterview, setActiveScreen } = useCareer();
  const [isRecording, setIsRecording] = useState(false);
  const [roomState, setRoomState] = useState<'Listening' | 'AI Thinking' | 'Speaking' | 'Answer Complete'>('Listening');
  const [candidateSpeech, setCandidateSpeech] = useState('');
  const [qIndex, setQIndex] = useState(0);

  const currentQ = interviewSession.questions[qIndex] || interviewSession.questions[0];

  // Dynamic Telemetry Waveform simulation
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        updateInterviewTelemetry({
          wpm: Math.floor(135 + Math.random() * 20),
          clarityPercentage: Math.floor(84 + Math.random() * 8),
          confidenceScore: Math.floor(80 + Math.random() * 10)
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRoomState('Listening');
      setCandidateSpeech('To optimize a React application experiencing frame drops, I would first profile the component render tree using React DevTools to identify unnecessary re-renders...');
    } else {
      setIsRecording(false);
      setRoomState('AI Thinking');
      if (candidateSpeech) {
        addTranscriptLine('Candidate', candidateSpeech);
      }

      setTimeout(() => {
        setRoomState('Speaking');
        addTranscriptLine('AI', 'Excellent point on component memoization and profiling. Now let\'s transition to real-time WebSocket state management.');
      }, 2000);
    }
  };

  const handleNextQuestion = () => {
    if (qIndex < interviewSession.questions.length - 1) {
      setQIndex(prev => prev + 1);
      setCandidateSpeech('');
      setRoomState('Listening');
    } else {
      completeInterview();
      setActiveScreen('interview-results');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070A0F] text-[#F3F5F7] flex flex-col justify-between p-6 select-none">
      
      {/* Room Header */}
      <div className="flex items-center justify-between border-b border-[#1C2633] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#F06A6A]/10 border border-[#F06A6A]/40 text-[#F06A6A] font-mono text-xs font-bold animate-pulse">
            <Radio className="w-3.5 h-3.5" />
            LIVE INTERVIEW ROOM
          </div>
          <span className="font-mono text-xs text-[#A7B0BC]">
            {interviewSession.jobTitle}
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="text-[#35C6FF] font-bold">
            QUESTION {qIndex + 1} / {interviewSession.questions.length}
          </span>
          <button
            onClick={() => {
              completeInterview();
              setActiveScreen('interview-results');
            }}
            className="px-3 py-1.5 rounded-lg bg-[#151D28] border border-[#1C2633] text-[#F06A6A] hover:bg-[#F06A6A]/10 transition-colors"
          >
            END SESSION
          </button>
        </div>
      </div>

      {/* Main Room Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto w-full my-auto">
        
        {/* Center AI Interviewer Visualizer & Active Question */}
        <div className="lg:col-span-8 space-y-8 text-center">
          
          {/* AI Persona Visualizer Node */}
          <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${
              roomState === 'AI Thinking' ? 'border-[#35C6FF] animate-ping opacity-30' :
              roomState === 'Speaking' ? 'border-[#35D399] shadow-[0_0_40px_rgba(53,211,153,0.4)]' :
              'border-[#1C2633]'
            }`} />
            
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#111822] to-[#151D28] border border-[#35C6FF]/50 flex items-center justify-center shadow-xl">
              <Sparkles className={`w-10 h-10 transition-transform ${roomState === 'AI Thinking' ? 'animate-spin text-[#35C6FF]' : 'text-[#35C6FF]'}`} />
            </div>
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-[#111822] border border-[#1C2633] text-xs font-mono text-[#35C6FF]">
            STATUS: {roomState.toUpperCase()}
          </div>

          {/* Large Active Question */}
          <div className="space-y-3 max-w-3xl mx-auto">
            <div className="text-xs font-mono text-[#66717F] uppercase tracking-widest">
              {currentQ.category} • {currentQ.difficulty.toUpperCase()} DIFFICULTY
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold leading-relaxed text-[#F3F5F7]">
              "{currentQ.text}"
            </h2>
          </div>

          {/* Transcript Preview */}
          {candidateSpeech && (
            <div className="p-4 rounded-xl bg-[#0C1118] border border-[#1C2633] max-w-2xl mx-auto text-left text-xs font-mono text-[#A7B0BC] space-y-1">
              <span className="text-[#35C6FF] font-bold">LIVE TRANSCRIPT:</span>
              <p className="italic">"{candidateSpeech}"</p>
            </div>
          )}
        </div>

        {/* Right-Side Real-Time Telemetry Dashboard */}
        <div className="lg:col-span-4 bg-[#0C1118] border border-[#1C2633] rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1C2633]">
            <Activity className="w-4 h-4 text-[#35C6FF]" />
            <h3 className="font-mono text-xs font-bold text-[#F3F5F7] uppercase tracking-wider">
              REAL-TIME VOICE TELEMETRY
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 font-mono">
            <div className="p-3.5 rounded-xl bg-[#111822] border border-[#1C2633] space-y-1">
              <div className="text-[10px] text-[#66717F]">SPEECH PACE</div>
              <div className="text-2xl font-bold text-[#35C6FF]">{interviewSession.telemetry.wpm} WPM</div>
              <div className="text-[9px] text-[#35D399]">OPTIMAL</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#111822] border border-[#1C2633] space-y-1">
              <div className="text-[10px] text-[#66717F]">FILLER WORDS</div>
              <div className="text-2xl font-bold text-[#F2B84B]">{interviewSession.telemetry.fillersCount}</div>
              <div className="text-[9px] text-[#A7B0BC]">LOW FREQUENCY</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#111822] border border-[#1C2633] space-y-1">
              <div className="text-[10px] text-[#66717F]">AUDIO CLARITY</div>
              <div className="text-2xl font-bold text-[#35D399]">{interviewSession.telemetry.clarityPercentage}%</div>
              <div className="text-[9px] text-[#35D399]">HIGH DEFINITION</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#111822] border border-[#1C2633] space-y-1">
              <div className="text-[10px] text-[#66717F]">CONFIDENCE SCORE</div>
              <div className="text-2xl font-bold text-[#35C6FF]">{interviewSession.telemetry.confidenceScore}%</div>
              <div className="text-[9px] text-[#35C6FF]">STRONG</div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#1C2633]">
            <div className="text-[10px] font-mono text-[#66717F] uppercase">EXPECTED CONCEPTS</div>
            <div className="flex flex-wrap gap-1.5">
              {currentQ.expectedConcepts.map((concept, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-[#111822] border border-[#1C2633] text-[10px] font-mono text-[#A7B0BC]">
                  {concept}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={handleNextQuestion}
            className="w-full py-3 rounded-xl bg-[#151D28] border border-[#35C6FF]/40 text-[#35C6FF] font-mono text-xs font-bold hover:bg-[#35C6FF]/10 transition-colors flex items-center justify-center gap-2"
          >
            <span>NEXT QUESTION ({qIndex + 1}/{interviewSession.questions.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Room Footer Controls: Mic + Waveform Canvas */}
      <div className="border-t border-[#1C2633] pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        
        {/* Simulated Waveform Bar Visualizer */}
        <div className="flex items-center gap-1 h-8">
          {[40, 70, 30, 90, 60, 100, 50, 80, 45, 95, 35, 75, 65, 85].map((h, idx) => (
            <div
              key={idx}
              className={`w-1 rounded-full transition-all duration-300 ${
                isRecording ? 'bg-[#35C6FF]' : 'bg-[#1C2633]'
              }`}
              style={{ height: isRecording ? `${(h * Math.random()).toFixed(0)}%` : '20%' }}
            />
          ))}
        </div>

        {/* Microphone Toggle Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleRecording}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-full font-mono font-bold text-xs transition-all shadow-lg ${
              isRecording
                ? 'bg-[#F06A6A] text-[#F3F5F7] animate-pulse shadow-[0_0_20px_rgba(240,106,106,0.4)]'
                : 'bg-[#35C6FF] text-[#070A0F] hover:bg-[#35C6FF]/90 shadow-[0_0_20px_rgba(53,198,255,0.4)]'
            }`}
          >
            {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
            <span>{isRecording ? 'PAUSE / SUBMIT ANSWER' : 'START SPEAKING ANSWER'}</span>
          </button>
        </div>

        <div className="text-xs font-mono text-[#66717F]">
          WEBSOCKET STREAM ACTIVE
        </div>
      </div>

    </div>
  );
};
