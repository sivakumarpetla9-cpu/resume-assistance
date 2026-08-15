import React, { useState } from 'react';
import { useCareer } from '../store/CareerContext';
import { Target, Sparkles, Building, MapPin, AlignLeft } from 'lucide-react';

export const CreateJobTargetPage: React.FC = () => {
  const { createJobTarget, setActiveScreen } = useCareer();
  const [title, setTitle] = useState('Senior React Developer');
  const [company, setCompany] = useState('Nexus Cloud Solutions');
  const [location, setLocation] = useState('San Francisco, CA (Hybrid)');
  const [description, setDescription] = useState(
    `We are seeking a Senior React Developer to join Nexus Cloud Solutions. You will engineer client-side web applications using React, TypeScript, Tailwind CSS, and WebSockets. Requirements: 4+ years of React experience, state management proficiency, performance optimization experience, and strong familiarity with modern component testing.`
  );
  const [analyzing, setAnalyzing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    setTimeout(() => {
      createJobTarget({ title, company, location, description });
      setAnalyzing(false);
      setActiveScreen('job-intelligence');
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 animate-fade-in">
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111822] border border-[#35C6FF]/40 text-xs font-mono text-[#35C6FF]">
          <Target className="w-3.5 h-3.5" />
          CENTRAL WORKSPACE ENGINE
        </div>
        <h1 className="text-3xl font-bold text-[#F3F5F7]">Create Target Job Workspace</h1>
        <p className="text-xs text-[#A7B0BC]">
          Paste the target job description to create a persistent SaaS workspace powering ATS analysis, resume tailoring, and interview questions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#0C1118] border border-[#1C2633] rounded-2xl p-8 shadow-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[#A7B0BC] mb-1">Target Job Title</label>
            <div className="relative">
              <Target className="w-4 h-4 text-[#66717F] absolute left-3 top-3" />
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#111822] border border-[#1C2633] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#F3F5F7] focus:border-[#35C6FF] focus:outline-none font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#A7B0BC] mb-1">Company Name</label>
            <div className="relative">
              <Building className="w-4 h-4 text-[#66717F] absolute left-3 top-3" />
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-[#111822] border border-[#1C2633] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#F3F5F7] focus:border-[#35C6FF] focus:outline-none font-sans"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-[#A7B0BC] mb-1">Location / Working Mode</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-[#66717F] absolute left-3 top-3" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#111822] border border-[#1C2633] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#F3F5F7] focus:border-[#35C6FF] focus:outline-none font-sans"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-[#A7B0BC] mb-1">Job Description Text</label>
          <div className="relative">
            <AlignLeft className="w-4 h-4 text-[#66717F] absolute left-3 top-3" />
            <textarea
              rows={6}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#111822] border border-[#1C2633] rounded-xl pl-9 pr-4 py-3 text-xs text-[#F3F5F7] focus:border-[#35C6FF] focus:outline-none font-mono leading-relaxed"
              placeholder="Paste full job description here..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={analyzing}
          className="w-full py-3.5 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(53,198,255,0.35)] disabled:opacity-50"
        >
          {analyzing ? (
            <span>EXTRACTING KEYWORDS & BUILDING WORKSPACE...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>ANALYZE JOB & CREATE TARGET WORKSPACE</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
