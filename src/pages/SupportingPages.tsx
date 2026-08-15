import React, { useState } from 'react';
import { useCareer } from '../store/CareerContext';
import { Layers, FileText, Globe, Settings, Copy, Plus } from 'lucide-react';

/* 1. APPLICATIONS TIMELINE TRACKER */
export const ApplicationsPage: React.FC = () => {
  const { applications, addApplication, atsDiagnostic } = useCareer();
  const [showModal, setShowModal] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role) return;
    await addApplication({
      company,
      role,
      stage: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      matchScore: atsDiagnostic.overallScore || 80,
      notes: 'Logged application.'
    });
    setCompany('');
    setRole('');
    setShowModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0C1118] border border-[#1C2633]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#35C6FF]">
            <Layers className="w-4 h-4" />
            CAREER TIMELINE TRACKER
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F3F5F7]">ACTIVE JOB APPLICATIONS</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all shadow-[0_0_15px_rgba(53,198,255,0.3)]"
        >
          <Plus className="w-4 h-4" />
          <span>+ LOG APPLICATION</span>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#070A0F]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAdd} className="bg-[#0C1118] border border-[#1C2633] rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="font-mono text-sm font-bold text-[#F3F5F7]">Log New Application</h3>
            <div>
              <label className="block text-xs font-mono text-[#A7B0BC] mb-1">Company Name</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-[#111822] border border-[#1C2633] rounded-xl px-3 py-2 text-xs text-[#F3F5F7] focus:border-[#35C6FF] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#A7B0BC] mb-1">Role Title</label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#111822] border border-[#1C2633] rounded-xl px-3 py-2 text-xs text-[#F3F5F7] focus:border-[#35C6FF] focus:outline-none"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-[#151D28] text-xs font-mono text-[#A7B0BC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#35C6FF] text-[#070A0F] text-xs font-mono font-bold"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Timeline List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0C1118] border border-[#1C2633] text-center space-y-3">
            <Layers className="w-10 h-10 mx-auto text-[#66717F]" />
            <h3 className="text-sm font-mono font-bold text-[#F3F5F7]">No Applications Tracked Yet</h3>
            <p className="text-xs text-[#A7B0BC] max-w-md mx-auto">
              Log your active job application submissions to track status stages and interview timelines.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono text-xs font-bold"
            >
              + Log First Application
            </button>
          </div>
        ) : (
          applications.map(app => (
            <div key={app.id} className="p-5 rounded-2xl bg-[#0C1118] border border-[#1C2633] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-mono font-bold text-base text-[#F3F5F7]">{app.company}</h3>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-[#35C6FF]/10 text-[#35C6FF] font-bold border border-[#35C6FF]/30">
                    {app.matchScore}% MATCH FIT
                  </span>
                </div>
                <div className="text-xs text-[#A7B0BC]">{app.role} • Applied {app.appliedDate}</div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#151D28] border border-[#1C2633] text-[#F3F5F7]">
                  {app.stage}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* 2. COVER LETTER GENERATOR */
export const CoverLetterPage: React.FC = () => {
  const { coverLetter, updateCoverLetter, showToast } = useCareer();
  const [content, setContent] = useState(coverLetter.content);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    showToast('Cover Letter copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0C1118] border border-[#1C2633]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#35C6FF]">
            <FileText className="w-4 h-4" />
            AI COVER LETTER GENERATOR
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F3F5F7]">ROLE-SPECIFIC COVER LETTER</h1>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs hover:bg-[#35C6FF]/90 transition-all shadow-[0_0_15px_rgba(53,198,255,0.3)]"
        >
          <Copy className="w-4 h-4" />
          <span>COPY TO CLIPBOARD</span>
        </button>
      </div>

      <div className="bg-[#0C1118] border border-[#1C2633] rounded-2xl p-6 space-y-4">
        <textarea
          rows={14}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            updateCoverLetter(e.target.value);
          }}
          className="w-full bg-[#111822] border border-[#1C2633] rounded-xl p-4 text-xs font-mono text-[#F3F5F7] leading-relaxed focus:border-[#35C6FF] focus:outline-none"
        />
      </div>
    </div>
  );
};

/* 3. PORTFOLIO BUILDER */
export const PortfolioPage: React.FC = () => {
  const { profile } = useCareer();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="p-6 rounded-2xl bg-[#0C1118] border border-[#1C2633] space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono text-[#35C6FF]">
          <Globe className="w-4 h-4" />
          LIVE PORTFOLIO BUILDER
        </div>
        <h1 className="text-2xl font-bold font-mono text-[#F3F5F7]">ENGINEERING PORTFOLIO PREVIEW</h1>
      </div>

      <div className="bg-[#0C1118] border border-[#1C2633] rounded-2xl p-8 space-y-8">
        <div className="space-y-2 border-b border-[#1C2633] pb-6">
          <h2 className="text-3xl font-bold text-[#F3F5F7]">{profile.name}</h2>
          <p className="text-sm text-[#35C6FF] font-mono">{profile.targetRole} • {profile.location}</p>
          <p className="text-xs text-[#A7B0BC] max-w-2xl">{profile.careerGoal}</p>
        </div>

        <div className="space-y-4">
          <h3 className="font-mono text-xs font-bold text-[#35C6FF] uppercase">VERIFIED TECHNICAL SKILLS</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.length > 0 ? profile.skills.map((s, idx) => (
              <span key={idx} className="px-3 py-1 rounded bg-[#111822] border border-[#35C6FF]/30 text-xs font-mono text-[#35C6FF]">
                ✓ {s}
              </span>
            )) : (
              <span className="text-xs font-mono text-[#A7B0BC] italic">No verified skills recorded yet.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* 4. SETTINGS */
export const SettingsPage: React.FC = () => {
  const { profile, updateProfile, theme, setThemeMode } = useCareer();
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.targetRole);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, targetRole: role });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="p-6 rounded-2xl bg-[#0C1118] border border-[#1C2633] space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono text-[#35C6FF]">
          <Settings className="w-4 h-4" />
          SYSTEM PREFERENCES
        </div>
        <h1 className="text-2xl font-bold font-mono text-[#F3F5F7]">ACCOUNT & SYSTEM CONFIGURATION</h1>
      </div>

      <div className="bg-[#0C1118] border border-[#1C2633] rounded-2xl p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="font-mono text-xs font-bold text-[#35C6FF] uppercase">USER PROFILE</h3>
          <div>
            <label className="block text-xs font-mono text-[#A7B0BC] mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#111822] border border-[#1C2633] rounded-xl px-4 py-2 text-xs text-[#F3F5F7] focus:border-[#35C6FF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#A7B0BC] mb-1">Target Engineering Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#111822] border border-[#1C2633] rounded-xl px-4 py-2 text-xs text-[#F3F5F7] focus:border-[#35C6FF] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs"
          >
            Save Profile Settings
          </button>
        </form>

        <div className="pt-6 border-t border-[#1C2633] space-y-4">
          <h3 className="font-mono text-xs font-bold text-[#35C6FF] uppercase">THEME MODE</h3>
          <div className="flex gap-3">
            {(['dark', 'light', 'system'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setThemeMode(mode)}
                className={`px-4 py-2 rounded-xl border text-xs font-mono font-bold uppercase transition-all ${
                  theme === mode
                    ? 'bg-[#35C6FF]/10 border-[#35C6FF] text-[#35C6FF]'
                    : 'bg-[#111822] border-[#1C2633] text-[#A7B0BC]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* 5. JOB MATCHES PAGE */
export const JobMatchesPage: React.FC = () => {
  const { jobTargets, setActiveScreen } = useCareer();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="p-6 rounded-2xl bg-[#0C1118] border border-[#1C2633] space-y-1">
        <h1 className="text-2xl font-bold font-mono text-[#F3F5F7]">JOB MATCH CONSTELLATION</h1>
        <p className="text-xs text-[#A7B0BC]">Overview of active candidate target role matches.</p>
      </div>

      <div className="space-y-4">
        {jobTargets.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#0C1118] border border-[#1C2633] text-center text-xs text-[#A7B0BC]">
            No job targets created yet. Create a job target to calculate match ratings.
          </div>
        ) : (
          jobTargets.map(j => (
            <div key={j.id} className="p-5 rounded-xl bg-[#0C1118] border border-[#1C2633] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-[#F3F5F7]">{j.title}</h3>
                <p className="text-xs text-[#A7B0BC]">{j.company} • {j.location}</p>
              </div>
              <button
                onClick={() => setActiveScreen('ats-console')}
                className="px-3 py-1.5 rounded-lg bg-[#35C6FF] text-[#070A0F] font-mono text-xs font-bold"
              >
                ATS Analysis
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* 6. LINKEDIN OPTIMIZATION PAGE */
export const LinkedInPage: React.FC = () => {
  const { linkedInOpt } = useCareer();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="p-6 rounded-2xl bg-[#0C1118] border border-[#1C2633] space-y-1">
        <h1 className="text-2xl font-bold font-mono text-[#F3F5F7]">LINKEDIN PROFILE OPTIMIZATION</h1>
        <p className="text-xs text-[#A7B0BC]">Keyword optimization for recruiter search visibility.</p>
      </div>

      <div className="p-6 rounded-2xl bg-[#0C1118] border border-[#1C2633] space-y-4">
        <h3 className="text-xs font-mono font-bold text-[#35C6FF]">OPTIMIZED HEADLINE</h3>
        <p className="p-3 rounded-xl bg-[#111822] text-xs text-[#F3F5F7] font-mono">{linkedInOpt.optimizedHeadline}</p>

        <h3 className="text-xs font-mono font-bold text-[#35C6FF]">OPTIMIZED ABOUT SECTION</h3>
        <p className="p-3 rounded-xl bg-[#111822] text-xs text-[#F3F5F7] font-mono">{linkedInOpt.optimizedAbout}</p>
      </div>
    </div>
  );
};
