import React, { useState } from 'react';
import { useCareer } from '../store/CareerContext';
import { Upload, CheckCircle2, Cpu, ArrowRight, Sparkles } from 'lucide-react';

export const ResumeUploadPage: React.FC = () => {
  const { setActiveScreen, showToast } = useCareer();
  const [status, setStatus] = useState<'idle' | 'processing' | 'ready'>('idle');
  const [currentStep, setCurrentStep] = useState(0);

  const processingSteps = [
    'Uploading document file...',
    'Reading binary PDF/DOCX stream...',
    'Parsing document layout & hierarchy...',
    'Extracting candidate work experience & dates...',
    'Analyzing skill keywords & project evidence...',
    'Indexing semantic profile against ATS rules...'
  ];

  const handleSimulatedUpload = () => {
    setStatus('processing');
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(interval);
          setStatus('ready');
          showToast("Resume parsed and indexed successfully");
          return prev;
        }
        return prev + 1;
      });
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111822] border border-[#35C6FF]/40 text-xs font-mono text-[#35C6FF]">
          <Cpu className="w-3.5 h-3.5" />
          SEMANTIC RESUME PARSER v2.4
        </div>
        <h1 className="text-3xl font-bold text-[#F3F5F7]">Upload Resume Document</h1>
        <p className="text-xs text-[#A7B0BC]">
          Upload your existing resume file for structural extraction, keyword density indexing, and AI tailoring.
        </p>
      </div>

      <div className="bg-[#0C1118] border border-[#1C2633] rounded-2xl p-8 shadow-xl">
        {status === 'idle' && (
          <div
            onClick={handleSimulatedUpload}
            className="border-2 border-dashed border-[#1C2633] hover:border-[#35C6FF] rounded-2xl p-12 bg-[#111822]/40 transition-all cursor-pointer flex flex-col items-center justify-center space-y-4 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#35C6FF]/10 border border-[#35C6FF]/30 text-[#35C6FF] flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(53,198,255,0.2)]">
              <Upload className="w-8 h-8" />
            </div>
            <div className="text-center space-y-1">
              <div className="font-mono font-bold text-base text-[#F3F5F7]">
                Drag and drop your resume file here
              </div>
              <div className="text-xs text-[#A7B0BC]">Supports PDF, DOCX (Up to 10MB)</div>
            </div>
            <button className="px-5 py-2.5 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all">
              Browse Local Files
            </button>
          </div>
        )}

        {status === 'processing' && (
          <div className="py-12 space-y-8 text-center max-w-md mx-auto">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#1C2633]" />
              <div className="absolute inset-0 rounded-full border-4 border-[#35C6FF] border-t-transparent animate-spin" />
              <Sparkles className="w-8 h-8 text-[#35C6FF] animate-pulse" />
            </div>

            <div className="space-y-3">
              <div className="font-mono text-sm font-bold text-[#F3F5F7]">
                {processingSteps[currentStep]}
              </div>
              <div className="w-full h-2 rounded-full bg-[#111822] overflow-hidden">
                <div
                  className="h-full bg-[#35C6FF] transition-all duration-500 rounded-full"
                  style={{ width: `${((currentStep + 1) / processingSteps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {status === 'ready' && (
          <div className="py-8 text-center space-y-6 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#35D399]/10 border border-[#35D399]/40 text-[#35D399] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(53,211,153,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#F3F5F7]">Resume Indexed Successfully</h2>
              <p className="text-xs text-[#A7B0BC]">
                Extracted 2 Experience entries, 7 Skills, and 1 Project.
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setActiveScreen('resume-studio')}
                className="px-6 py-3 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all flex items-center gap-2"
              >
                <span>OPEN RESUME STUDIO</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
