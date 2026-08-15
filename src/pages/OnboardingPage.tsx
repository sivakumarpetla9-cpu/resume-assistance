import React, { useState } from 'react';
import { useCareer } from '../store/CareerContext';
import { Upload, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { updateProfile, createJobTarget, setActiveScreen } = useCareer();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: 'Jane Candidate',
    targetRole: 'Frontend Developer',
    experienceLevel: 'Mid' as 'Entry' | 'Mid' | 'Senior' | 'Lead',
    skills: 'React, JavaScript, HTML5/CSS3, Tailwind CSS, REST APIs',
    location: 'San Francisco, CA (Hybrid)',
    careerGoal: 'Land a Senior Frontend / UI Engineering role at a top tech company',
    resumeFileName: 'Candidate_Resume_2026.pdf'
  });

  const handleFinish = () => {
    const skillList = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
    updateProfile({
      name: formData.name,
      targetRole: formData.targetRole,
      experienceLevel: formData.experienceLevel,
      skills: skillList,
      location: formData.location,
      careerGoal: formData.careerGoal,
      resumeUploaded: true,
      resumeFileName: formData.resumeFileName
    });
    createJobTarget({
      title: formData.targetRole,
      company: "Target Employer",
      location: formData.location,
      description: `Target engineering position for ${formData.targetRole}.`
    });
    setStep(3); // Completed step
  };

  return (
    <div className="min-h-screen bg-[#070A0F] text-[#F3F5F7] flex items-center justify-center p-6 bg-grid-pattern">
      <div className="w-full max-w-2xl bg-[#0C1118] border border-[#1C2633] rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] space-y-8">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-[#1C2633] pb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#35C6FF]/10 text-[#35C6FF] flex items-center justify-center font-mono font-bold text-xs">
              {step}/3
            </div>
            <span className="font-mono text-xs font-semibold text-[#A7B0BC]">PROFILE ONBOARDING</span>
          </div>

          <div className="flex items-center gap-2">
            <div className={`w-12 h-1 rounded-full ${step >= 1 ? 'bg-[#35C6FF]' : 'bg-[#1C2633]'}`} />
            <div className={`w-12 h-1 rounded-full ${step >= 2 ? 'bg-[#35C6FF]' : 'bg-[#1C2633]'}`} />
            <div className={`w-12 h-1 rounded-full ${step >= 3 ? 'bg-[#35C6FF]' : 'bg-[#1C2633]'}`} />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-[#F3F5F7]">Tell Us About Your Career Intent</h2>
              <p className="text-xs text-[#A7B0BC]">This data powers your persistent Job Target workspace and ATS analysis.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#A7B0BC] mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#111822] border border-[#1C2633] rounded-xl px-4 py-2.5 text-xs text-[#F3F5F7] focus:border-[#35C6FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A7B0BC] mb-1">Target Role Title</label>
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  className="w-full bg-[#111822] border border-[#1C2633] rounded-xl px-4 py-2.5 text-xs text-[#F3F5F7] focus:border-[#35C6FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A7B0BC] mb-1">Experience Level</label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as any })}
                  className="w-full bg-[#111822] border border-[#1C2633] rounded-xl px-4 py-2.5 text-xs text-[#F3F5F7] focus:border-[#35C6FF] focus:outline-none font-mono"
                >
                  <option value="Entry">Entry Level (0-2 yrs)</option>
                  <option value="Mid">Mid Level (2-5 yrs)</option>
                  <option value="Senior">Senior Level (5-8 yrs)</option>
                  <option value="Lead">Staff / Lead (8+ yrs)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A7B0BC] mb-1">Preferred Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-[#111822] border border-[#1C2633] rounded-xl px-4 py-2.5 text-xs text-[#F3F5F7] focus:border-[#35C6FF] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#A7B0BC] mb-1">Primary Core Skills (Comma-separated)</label>
              <textarea
                rows={2}
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full bg-[#111822] border border-[#1C2633] rounded-xl p-3 text-xs text-[#F3F5F7] focus:border-[#35C6FF] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#A7B0BC] mb-1">Career Goal Statement</label>
              <input
                type="text"
                value={formData.careerGoal}
                onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                className="w-full bg-[#111822] border border-[#1C2633] rounded-xl px-4 py-2.5 text-xs text-[#F3F5F7] focus:border-[#35C6FF] focus:outline-none"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all flex items-center justify-center gap-2"
            >
              <span>NEXT: UPLOAD RESUME</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in text-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-[#F3F5F7]">Upload Existing Resume</h2>
              <p className="text-xs text-[#A7B0BC]">Upload PDF or DOCX for instant semantic parsing and keyword extraction.</p>
            </div>

            <div className="border-2 border-dashed border-[#1C2633] hover:border-[#35C6FF] rounded-2xl p-8 bg-[#111822]/50 transition-colors flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#35C6FF]/10 text-[#35C6FF] flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-mono font-bold text-[#F3F5F7]">
                  {formData.resumeFileName}
                </div>
                <div className="text-xs text-[#66717F]">PDF / DOCX formats supported (Max 10MB)</div>
              </div>
              <span className="px-3 py-1 bg-[#35D399]/10 border border-[#35D399]/40 text-[#35D399] rounded-full text-[11px] font-mono">
                ✓ Ready for Parsing
              </span>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(53,198,255,0.3)]"
            >
              <Sparkles className="w-4 h-4" />
              <span>GENERATE CAREER PROFILE</span>
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-[#35D399]/10 border border-[#35D399]/40 text-[#35D399] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(53,211,153,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-[#F3F5F7]">Your Career Profile Is Ready</h2>
              <p className="text-sm text-[#A7B0BC] max-w-md mx-auto">
                We have parsed your resume, indexed 7 verified skills, and established your baseline Career Readiness Score.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#111822] border border-[#1C2633] max-w-md mx-auto text-left font-mono text-xs space-y-2">
              <div className="flex justify-between text-[#A7B0BC]">
                <span>CANDIDATE:</span>
                <span className="text-[#F3F5F7] font-bold">{formData.name}</span>
              </div>
              <div className="flex justify-between text-[#A7B0BC]">
                <span>TARGET ROLE:</span>
                <span className="text-[#35C6FF] font-bold">{formData.targetRole}</span>
              </div>
              <div className="flex justify-between text-[#A7B0BC]">
                <span>INITIAL READINESS:</span>
                <span className="text-[#35D399] font-bold">78%</span>
              </div>
            </div>

            <button
              onClick={() => setActiveScreen('command-center')}
              className="px-8 py-3.5 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all flex items-center justify-center gap-2 mx-auto shadow-[0_0_20px_rgba(53,198,255,0.4)]"
            >
              <span>Continue to Career Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
