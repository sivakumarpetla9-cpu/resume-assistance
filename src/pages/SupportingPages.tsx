import React, { useState } from 'react';
import { useCareer } from '../store/CareerContext';
import { Layers, Target, FileText, Globe, Share2, Settings, Copy, Moon, Sun, ArrowRight, Plus, Trash2, RotateCcw } from 'lucide-react';

/* 1. APPLICATIONS TIMELINE TRACKER */
export const ApplicationsPage: React.FC = () => {
  const { applications, addApplication } = useCareer();
  const [showModal, setShowModal] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role) return;
    addApplication({
      company,
      role,
      stage: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      matchScore: 82,
      notes: 'Submitted tailored V1 resume.'
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
        {applications.map(app => (
          <div key={app.id} className="p-5 rounded-2xl bg-[#0C1118] border border-[#1C2633] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="font-mono font-bold text-base text-[#F3F5F7]">{app.company}</h3>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-[#35C6FF]/10 text-[#35C6FF] font-bold border border-[#35C6FF]/30">
                  {app.matchScore}% MATCH FIT
                </span>
              </div>
              <p className="text-xs text-[#A7B0BC]">{app.role} • Applied on {app.appliedDate}</p>
              <p className="text-[11px] text-[#66717F] font-mono">{app.notes}</p>
            </div>

            {/* Stage Progress Pills */}
            <div className="flex items-center gap-1 font-mono text-xs">
              {['Applied', 'Assessment', 'Interview', 'Offer'].map((stg, sIdx) => {
                const stages = ['Applied', 'Assessment', 'Interview', 'Offer'];
                const currentIdx = stages.indexOf(app.stage);
                const isPassed = sIdx <= currentIdx;

                return (
                  <span
                    key={stg}
                    className={`px-3 py-1 rounded-lg border text-[10px] font-bold ${
                      isPassed
                        ? 'bg-[#35D399]/10 border-[#35D399] text-[#35D399]'
                        : 'bg-[#111822] border-[#1C2633] text-[#66717F]'
                    }`}
                  >
                    {stg}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* 2. JOB MATCHES MATRIX */
export const JobMatchesPage: React.FC = () => {
  const { jobTargets, setActiveJobTargetId, setActiveScreen } = useCareer();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="p-6 rounded-2xl bg-[#0C1118] border border-[#1C2633] space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono text-[#35C6FF]">
          <Target className="w-4 h-4" />
          MULTI-ROLE FIT COMPARISON MATRIX
        </div>
        <h1 className="text-2xl font-bold font-mono text-[#F3F5F7]">JOB MATCH ANALYSIS</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobTargets.map(job => (
          <div key={job.id} className="p-6 rounded-2xl bg-[#0C1118] border border-[#1C2633] space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-mono font-bold text-lg text-[#F3F5F7]">{job.title}</h3>
                <p className="text-xs text-[#A7B0BC]">{job.company} • {job.location}</p>
              </div>
              <div className="font-mono text-2xl font-extrabold text-[#35C6FF]">{job.matchScore}%</div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono text-[#66717F]">MATCHED KEYWORDS:</div>
              <div className="flex flex-wrap gap-1.5">
                {job.requiredSkills.map((sk, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-[#111822] border border-[#1C2633] text-xs font-mono text-[#35D399]">
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setActiveJobTargetId(job.id);
                setActiveScreen('job-intelligence');
              }}
              className="w-full py-2.5 rounded-xl bg-[#151D28] border border-[#35C6FF]/40 text-[#35C6FF] font-mono text-xs font-bold hover:bg-[#35C6FF]/10 transition-colors flex items-center justify-center gap-2"
            >
              <span>OPEN WORKSPACE FOR THIS ROLE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* 3. COVER LETTER STUDIO */
export const CoverLetterPage: React.FC = () => {
  const { coverLetter, updateCoverLetter, showToast } = useCareer();
  const [content, setContent] = useState(coverLetter.content);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    showToast("Cover Letter copied to clipboard");
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

/* 4. PORTFOLIO BUILDER */
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
          <p className="text-xs text-[#A7B0BC] max-w-2xl">{profile.bio}</p>
        </div>

        <div className="space-y-4">
          <h3 className="font-mono text-xs font-bold text-[#35C6FF] uppercase">FEATURED PROJECTS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#111822] border border-[#1C2633] space-y-2">
              <h4 className="font-mono font-bold text-sm text-[#F3F5F7]">Real-Time Telemetry Dashboard</h4>
              <p className="text-xs text-[#A7B0BC]">Interactive analytics application rendering live streaming metric graphs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 5. LINKEDIN OPTIMIZER */
export const LinkedInPage: React.FC = () => {
  const { linkedInOpt } = useCareer();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="p-6 rounded-2xl bg-[#0C1118] border border-[#1C2633] space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono text-[#35C6FF]">
          <Share2 className="w-4 h-4" />
          AI LINKEDIN PROFILE OPTIMIZER
        </div>
        <h1 className="text-2xl font-bold font-mono text-[#F3F5F7]">HEADLINE & ABOUT ENHANCER</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#0C1118] border border-[#1C2633] space-y-4">
          <div className="text-xs font-mono text-[#66717F] uppercase">CURRENT HEADLINE</div>
          <p className="text-xs text-[#A7B0BC] p-3 rounded-xl bg-[#111822]">{linkedInOpt.currentHeadline}</p>
          <div className="text-xs font-mono text-[#66717F] uppercase">CURRENT ABOUT</div>
          <p className="text-xs text-[#A7B0BC] p-3 rounded-xl bg-[#111822]">{linkedInOpt.currentAbout}</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0C1118] border border-[#35C6FF]/50 space-y-4 shadow-[0_0_20px_rgba(53,198,255,0.15)]">
          <div className="text-xs font-mono text-[#35C6FF] font-bold uppercase">OPTIMIZED HEADLINE (+29% RECRUITER REACH)</div>
          <p className="text-xs text-[#F3F5F7] font-semibold p-3 rounded-xl bg-[#151D28] border border-[#35C6FF]/40">{linkedInOpt.optimizedHeadline}</p>
          <div className="text-xs font-mono text-[#35C6FF] font-bold uppercase">OPTIMIZED ABOUT SECTION</div>
          <p className="text-xs text-[#F3F5F7] p-3 rounded-xl bg-[#151D28] border border-[#35C6FF]/40">{linkedInOpt.optimizedAbout}</p>
        </div>
      </div>
    </div>
  );
};

/* 6. SETTINGS & PROFILE */
/* 6. SETTINGS & PROFILE */
export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme, clearMockData, resetMockData, showToast } = useCareer();
  const [apiKey, setApiKey] = useState('sk-proj-••••••••••••••••••••');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="p-6 rounded-2xl bg-[#0C1118] border border-[#1C2633] space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono text-[#35C6FF]">
          <Settings className="w-4 h-4" />
          SYSTEM SETTINGS & PREFERENCES
        </div>
        <h1 className="text-2xl font-bold font-mono text-[#F3F5F7]">SAAS CONFIGURATION</h1>
      </div>

      <div className="bg-[#0C1118] border border-[#1C2633] rounded-2xl p-6 space-y-6">
        
        {/* Appearance Toggle */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1C2633]">
          <div>
            <h3 className="font-mono text-sm font-bold text-[#F3F5F7]">Visual Theme Mode</h3>
            <p className="text-xs text-[#A7B0BC]">Toggle between Dark Mode (Primary) and Light Mode</p>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#151D28] border border-[#1C2633] text-xs font-mono text-[#F3F5F7] hover:border-[#35C6FF]/40 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#F2B84B]" /> : <Moon className="w-4 h-4 text-[#4268D8]" />}
            <span>{theme.toUpperCase()} MODE</span>
          </button>
        </div>

        {/* API Key Config */}
        <div className="space-y-2 pb-4 border-b border-[#1C2633]">
          <h3 className="font-mono text-sm font-bold text-[#F3F5F7]">OpenAI LLM API Key (Optional)</h3>
          <p className="text-xs text-[#A7B0BC]">Leave blank to use built-in intelligent fallback engine.</p>
          <div className="flex gap-3">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 bg-[#111822] border border-[#1C2633] rounded-xl px-4 py-2 text-xs font-mono text-[#F3F5F7]"
            />
            <button
              onClick={() => showToast("API Key Configured Successfully")}
              className="px-4 py-2 bg-[#35C6FF] text-[#070A0F] font-mono font-bold text-xs rounded-xl"
            >
              SAVE KEY
            </button>
          </div>
        </div>

        {/* Mock Data / Workspace Management */}
        <div className="space-y-3 pt-2">
          <div>
            <h3 className="font-mono text-sm font-bold text-[#F3F5F7]">Workspace & Mock Data Management</h3>
            <p className="text-xs text-[#A7B0BC]">Clear sample mock data to start with a fresh candidate profile, or reload sample demo data anytime.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={clearMockData}
              className="px-4 py-2 bg-[#F06A6A]/10 border border-[#F06A6A]/40 text-[#F06A6A] font-mono text-xs font-bold rounded-xl hover:bg-[#F06A6A]/20 transition-all flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Mock Data / Start Fresh</span>
            </button>
            <button
              onClick={resetMockData}
              className="px-4 py-2 bg-[#151D28] border border-[#35C6FF]/40 text-[#35C6FF] font-mono text-xs font-bold rounded-xl hover:bg-[#35C6FF]/10 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Load Sample Mock Data</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
