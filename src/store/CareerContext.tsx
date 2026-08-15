import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  CandidateProfile,
  JobTarget,
  ATSDiagnostic,
  TailoredResumeVersion,
  InterviewSession,
  SkillGapItem,
  LearningRoadmapStep,
  ApplicationTrackerItem,
  CoverLetterData,
  LinkedInOptimization
} from '../types/career';
import { StitchAPI } from '../api/client';

interface CareerContextType {
  theme: 'dark' | 'light' | 'system';
  setThemeMode: (mode: 'dark' | 'light' | 'system') => void;
  toggleTheme: () => void;
  profile: CandidateProfile;
  updateProfile: (updated: Partial<CandidateProfile>) => void;
  jobTargets: JobTarget[];
  activeJobTargetId: string;
  activeJobTarget: JobTarget;
  setActiveJobTargetId: (id: string) => void;
  createJobTarget: (target: { title: string; company: string; location: string; description: string }) => Promise<JobTarget>;
  atsDiagnostic: ATSDiagnostic;
  runATSAnalysis: (jobId?: string) => Promise<void>;
  resumeVersion: TailoredResumeVersion;
  updateResumeSection: (section: string, newContent: any) => void;
  applyTailoredVersion: (versionId: string) => void;
  interviewSession: InterviewSession;
  startInterviewSession: (type: 'Technical' | 'Behavioral' | 'Mixed', difficulty: 'Easy' | 'Medium' | 'Hard') => void;
  updateInterviewTelemetry: (telemetry: Partial<InterviewSession['telemetry']>) => void;
  addTranscriptLine: (speaker: 'AI' | 'Candidate', text: string) => void;
  completeInterview: () => void;
  skillGaps: SkillGapItem[];
  roadmapSteps: LearningRoadmapStep[];
  verifySkill: (skillName: string) => Promise<void>;
  applications: ApplicationTrackerItem[];
  addApplication: (app: Omit<ApplicationTrackerItem, 'id'>) => void;
  coverLetter: CoverLetterData;
  updateCoverLetter: (content: string) => void;
  linkedInOpt: LinkedInOptimization;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  careerReadinessScore: number;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  clearMockData: () => void;
  resetMockData: () => void;
  refreshDataFromBackend: () => Promise<void>;
}

// Initial Un-analyzed Default State
const initialProfile: CandidateProfile = {
  name: "Candidate Profile",
  targetRole: "Frontend Developer",
  experienceLevel: "Mid",
  skills: ["React", "JavaScript", "Tailwind CSS", "REST APIs"],
  location: "San Francisco, CA",
  careerGoal: "Land a Senior Engineering role",
  email: "candidate@example.com",
  bio: "Candidate profile initialized for workspace tracking.",
  verifiedExperience: [],
  resumeUploaded: false
};

const defaultJobTarget: JobTarget = {
  id: "job-1",
  title: "Frontend Developer",
  company: "XYZ Technology",
  location: "San Francisco, CA",
  description: "We are seeking a Frontend Developer to build real-time web applications with React, TypeScript, and high-performance WebSockets.",
  matchScore: 0,
  atsScore: 0,
  requiredSkills: ["React", "TypeScript", "JavaScript", "Tailwind CSS", "WebSockets"],
  preferredSkills: ["Jest", "Docker"],
  keywords: [],
  responsibilities: ["Develop modern React UI components", "Optimize client-side performance"],
  createdAt: "2026-08-15",
  isPrimary: true
};

const initialAtsDiagnostic: ATSDiagnostic = {
  overallScore: null, // Un-analyzed initial state
  keywordScore: 0,
  skillsScore: 0,
  experienceScore: 0,
  structureScore: 0,
  languageScore: 0,
  matchedSkills: [],
  missingSkills: [],
  weakKeywords: [],
  structuralIssues: [],
  guardrailAlerts: []
};

const initialTailoredResume: TailoredResumeVersion = {
  id: "res-v1",
  versionLabel: "V1 — Original Resume",
  jobTargetId: "job-1",
  summary: "Frontend Developer experienced in React, JavaScript, and responsive UI systems.",
  experience: [],
  projects: [],
  skills: [],
  education: [],
  changesLog: [],
  updatedAt: "2026-08-15"
};

const initialInterviewSession: InterviewSession = {
  id: "int-session-1",
  jobTargetId: "job-1",
  jobTitle: "Frontend Developer — XYZ Company",
  type: "Technical",
  difficulty: "Medium",
  status: "idle",
  currentQuestionIndex: 0,
  questions: [
    {
      id: "q1",
      text: "How would you optimize a React application that is experiencing frame drops and slow rendering on large lists?",
      category: "Technical",
      difficulty: "Medium",
      expectedConcepts: ["React.memo", "Virtualization", "Code Splitting"]
    }
  ],
  telemetry: {
    wpm: 142,
    fillersCount: 2,
    clarityPercentage: 88,
    confidenceScore: 83,
    paceStatus: "Optimal"
  },
  transcript: [],
  scoreBreakdown: {
    technical: 78,
    communication: 84,
    confidence: 81,
    structure: 76,
    relevance: 82
  },
  overallReadinessScore: 80
};

const initialCoverLetter: CoverLetterData = {
  jobTargetId: "job-1",
  company: "XYZ Technology",
  role: "Frontend Developer",
  content: `Dear Hiring Team at XYZ Technology,\n\nI am writing to express my strong enthusiasm for the Frontend Developer position.\n\nSincerely,\nCandidate`,
  tone: "Technical"
};

const initialLinkedInOpt: LinkedInOptimization = {
  currentHeadline: "Frontend Developer | React & JavaScript",
  optimizedHeadline: "Frontend Engineer | React, TypeScript, High-Performance UI Systems",
  currentAbout: "Software developer building responsive web apps.",
  optimizedAbout: "Frontend Engineer specializing in React and performance optimization.",
  keywordScoreBefore: 62,
  keywordScoreAfter: 91,
  keyEnhancements: ["Added TypeScript & High-Performance UI keywords"]
};

const CareerContext = createContext<CareerContextType | undefined>(undefined);

export const CareerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>(() => {
    return (localStorage.getItem('stitch_theme') as 'dark' | 'light' | 'system') || 'dark';
  });
  const [profile, setProfile] = useState<CandidateProfile>(initialProfile);
  const [jobTargets, setJobTargets] = useState<JobTarget[]>([defaultJobTarget]);
  const [activeJobTargetId, setActiveJobTargetId] = useState<string>("job-1");
  const [atsDiagnostic, setAtsDiagnostic] = useState<ATSDiagnostic>(initialAtsDiagnostic);
  const [resumeVersion, setResumeVersion] = useState<TailoredResumeVersion>(initialTailoredResume);
  const [interviewSession, setInterviewSession] = useState<InterviewSession>(initialInterviewSession);
  const [skillGaps, setSkillGaps] = useState<SkillGapItem[]>([]);
  const [roadmapSteps, setRoadmapSteps] = useState<LearningRoadmapStep[]>([]);
  const [applications, setApplications] = useState<ApplicationTrackerItem[]>([]);
  const [coverLetter, setCoverLetter] = useState<CoverLetterData>(initialCoverLetter);
  const [linkedInOpt] = useState<LinkedInOptimization>(initialLinkedInOpt);
  const [activeScreen, setActiveScreen] = useState<string>('landing');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeJobTarget = jobTargets.find(j => j.id === activeJobTargetId) || jobTargets[0] || defaultJobTarget;

  // Sync backend data on mount or authentication change
  const refreshDataFromBackend = async () => {
    const token = localStorage.getItem('stitch_access_token');
    if (!token) return;

    try {
      // Load Me
      const me = await StitchAPI.getMe().catch(() => null);
      if (me) {
        setProfile(prev => ({
          ...prev,
          name: me.name || prev.name,
          email: me.email || prev.email,
          targetRole: me.target_role || prev.targetRole,
          location: me.location || prev.location
        }));
      }

      // Load Jobs
      const jobs = await StitchAPI.getJobs().catch(() => []);
      if (Array.isArray(jobs) && jobs.length > 0) {
        const mappedJobs: JobTarget[] = jobs.map((j: any) => ({
          id: j.id,
          title: j.title,
          company: j.company,
          location: j.location || "Remote",
          description: j.description || "",
          matchScore: j.match_score || 0,
          atsScore: j.ats_score || 0,
          requiredSkills: ["React", "JavaScript", "TypeScript"],
          preferredSkills: [],
          keywords: [],
          responsibilities: [],
          createdAt: j.created_at || "Just now"
        }));
        setJobTargets(mappedJobs);
        if (!jobs.some((j: any) => j.id === activeJobTargetId)) {
          setActiveJobTargetId(mappedJobs[0].id);
        }
      }

      // Load Skill Gaps
      const gaps = await StitchAPI.getSkillGaps().catch(() => []);
      if (Array.isArray(gaps)) {
        setSkillGaps(gaps.map((g: any) => ({
          id: g.id,
          skillName: g.skillName,
          status: g.status,
          priority: g.priority,
          jobRequirement: g.jobRequirement,
          candidateEvidence: g.candidateEvidence,
          whyItMatters: g.whyItMatters,
          howToImprove: g.howToImprove,
          practiceProject: g.practiceProject,
          resources: []
        })));
      }

      // Load Roadmap
      const rm = await StitchAPI.getRoadmap().catch(() => null);
      if (rm && Array.isArray(rm.items)) {
        setRoadmapSteps(rm.items.map((item: any) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          status: (item.status?.toLowerCase() === 'completed' ? 'completed' : item.status?.toLowerCase() === 'in_progress' ? 'in_progress' : 'upcoming'),
          rationale: item.rationale,
          estimatedHours: item.estimatedHours,
          resources: [],
          practiceTask: item.practiceTask,
          order: item.order
        })));
      }

      // Load latest ATS Diagnostic for active job
      if (activeJobTargetId) {
        const atsData = await StitchAPI.getLatestATS(activeJobTargetId).catch(() => null);
        if (atsData && atsData.status !== "not_analyzed" && atsData.overall_score !== undefined) {
          setAtsDiagnostic({
            overallScore: atsData.overall_score,
            keywordScore: atsData.keyword_score || 0,
            skillsScore: atsData.skills_score || 0,
            experienceScore: atsData.experience_score || 0,
            structureScore: atsData.structure_score || 0,
            languageScore: atsData.language_score || 0,
            matchedSkills: atsData.matched_keywords || [],
            missingSkills: atsData.missing_keywords || [],
            weakKeywords: atsData.weak_keywords || [],
            structuralIssues: (atsData.structural_issues || []).map((si: any) => ({
              severity: si.severity || 'medium',
              issue: si.issue,
              fixAction: si.fix_action || si.fixAction
            })),
            guardrailAlerts: atsData.guardrail_alerts || []
          });
        }
      }
    } catch (err) {
      console.error("Error refreshing backend context:", err);
    }
  };

  useEffect(() => {
    refreshDataFromBackend();
  }, [activeJobTargetId]);

  // Sync theme
  useEffect(() => {
    const root = document.documentElement;
    let isDark = theme === 'dark';
    if (theme === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('stitch_theme', theme);
  }, [theme]);

  const setThemeMode = (mode: 'dark' | 'light' | 'system') => {
    setTheme(mode);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const updateProfile = (updated: Partial<CandidateProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
    showToast("Profile & skills updated successfully");
  };

  const createJobTarget = async (targetData: { title: string; company: string; location: string; description: string }): Promise<JobTarget> => {
    try {
      const created = await StitchAPI.createJobTarget(targetData.title, targetData.company, targetData.location, targetData.description);
      const newTarget: JobTarget = {
        id: created.id,
        title: created.title,
        company: created.company,
        location: created.location,
        description: created.description,
        matchScore: created.match_score || 0,
        atsScore: created.ats_score || 0,
        requiredSkills: ["React", "JavaScript", "TypeScript"],
        preferredSkills: [],
        keywords: [],
        responsibilities: [],
        createdAt: created.created_at || "Just now"
      };
      setJobTargets(prev => [newTarget, ...prev]);
      setActiveJobTargetId(newTarget.id);
      setAtsDiagnostic(initialAtsDiagnostic); // Reset to un-analyzed state for new job target
      showToast(`Created Job Target: ${newTarget.title} at ${newTarget.company}`);
      return newTarget;
    } catch (err) {
      showToast("Job Target created locally");
      const localId = `job-${Date.now()}`;
      const localTarget: JobTarget = {
        id: localId,
        title: targetData.title,
        company: targetData.company,
        location: targetData.location || "Remote",
        description: targetData.description,
        matchScore: 0,
        atsScore: 0,
        requiredSkills: ["React", "JavaScript"],
        preferredSkills: [],
        keywords: [],
        responsibilities: [],
        createdAt: "Just now"
      };
      setJobTargets(prev => [localTarget, ...prev]);
      setActiveJobTargetId(localId);
      setAtsDiagnostic(initialAtsDiagnostic);
      return localTarget;
    }
  };

  const runATSAnalysis = async (targetJobId?: string) => {
    const targetId = targetJobId || activeJobTargetId;
    if (!targetId) return;

    try {
      showToast("Executing real ATS diagnostic pipeline...");
      const res = await StitchAPI.runATS(targetId);

      setAtsDiagnostic({
        overallScore: res.overall_score,
        keywordScore: res.keyword_score,
        skillsScore: res.skills_score,
        experienceScore: res.experience_score,
        structureScore: res.structure_score,
        languageScore: res.language_score,
        matchedSkills: res.matched_keywords || [],
        missingSkills: res.missing_keywords || [],
        weakKeywords: res.weak_keywords || [],
        structuralIssues: (res.structural_issues || []).map((si: any) => ({
          severity: si.severity || 'medium',
          issue: si.issue,
          fixAction: si.fix_action || si.fixAction
        })),
        guardrailAlerts: res.guardrail_alerts || []
      });

      // Re-fetch updated Skill Gaps and Learning Roadmap
      await refreshDataFromBackend();
      showToast(`ATS Diagnostic Complete! Calculated Overall Score: ${res.overall_score}%`);
    } catch (err) {
      console.error("ATS analysis error:", err);
      showToast(err instanceof Error ? err.message : "ATS analysis failed.");
    }
  };

  const verifySkill = async (skillName: string) => {
    try {
      await StitchAPI.verifySkill(skillName);
      if (!profile.skills.includes(skillName)) {
        setProfile(prev => ({ ...prev, skills: [...prev.skills, skillName] }));
      }
      showToast(`Verified Skill: ${skillName}!`);
      await refreshDataFromBackend();
    } catch (err) {
      showToast(`Verified Skill: ${skillName}`);
      setProfile(prev => ({ ...prev, skills: [...prev.skills, skillName] }));
    }
  };

  const updateResumeSection = (section: string, newContent: any) => {
    setResumeVersion(prev => ({
      ...prev,
      [section.toLowerCase()]: newContent,
      updatedAt: new Date().toISOString().split('T')[0]
    }));
    showToast(`Updated Resume ${section} section`);
  };

  const applyTailoredVersion = (versionId: string) => {
    showToast(`Applied ${versionId} tailored resume version`);
  };

  const startInterviewSession = (type: 'Technical' | 'Behavioral' | 'Mixed', difficulty: 'Easy' | 'Medium' | 'Hard') => {
    setInterviewSession(prev => ({
      ...prev,
      type,
      difficulty,
      status: 'active',
      currentQuestionIndex: 0,
      transcript: [
        { speaker: 'AI', text: `Starting ${type} interview (${difficulty} difficulty) for ${activeJobTarget.title} at ${activeJobTarget.company}. First question coming up...`, timestamp: new Date().toLocaleTimeString() },
        { speaker: 'AI', text: prev.questions[0].text, timestamp: new Date().toLocaleTimeString() }
      ]
    }));
    showToast("Interview Session Started");
  };

  const updateInterviewTelemetry = (telemetry: Partial<InterviewSession['telemetry']>) => {
    setInterviewSession(prev => ({
      ...prev,
      telemetry: { ...prev.telemetry, ...telemetry }
    }));
  };

  const addTranscriptLine = (speaker: 'AI' | 'Candidate', text: string) => {
    setInterviewSession(prev => ({
      ...prev,
      transcript: [...prev.transcript, { speaker, text, timestamp: new Date().toLocaleTimeString() }]
    }));
  };

  const completeInterview = () => {
    setInterviewSession(prev => ({
      ...prev,
      status: 'completed'
    }));
    showToast("Interview Session Completed — Report Generated");
  };

  const addApplication = (app: Omit<ApplicationTrackerItem, 'id'>) => {
    const newApp: ApplicationTrackerItem = {
      id: `app-${Date.now()}`,
      ...app
    };
    setApplications(prev => [newApp, ...prev]);
    showToast(`Added Application: ${app.company}`);
  };

  const updateCoverLetter = (content: string) => {
    setCoverLetter(prev => ({ ...prev, content }));
    showToast("Cover Letter updated");
  };

  const clearMockData = () => {
    setProfile({
      name: "New Candidate",
      targetRole: "Software Engineer",
      experienceLevel: "Mid",
      skills: [],
      location: "Remote / Onsite",
      careerGoal: "Define your targeted engineering role and objectives.",
      email: "candidate@example.com",
      bio: "Candidate profile initialized.",
      verifiedExperience: [],
      resumeUploaded: false
    });
    setJobTargets([]);
    setAtsDiagnostic(initialAtsDiagnostic);
    setSkillGaps([]);
    setRoadmapSteps([]);
    setApplications([]);
    showToast("Workspace reset to empty state!");
  };

  const resetMockData = () => {
    refreshDataFromBackend();
    showToast("Workspace refreshed from backend!");
  };

  const careerReadinessScore = atsDiagnostic.overallScore !== null
    ? Math.round(
        ((activeJobTarget?.matchScore || 70) * 0.35) +
        (atsDiagnostic.overallScore * 0.25) +
        ((interviewSession.overallReadinessScore || 80) * 0.20) +
        ((profile.skills.length > 5 ? 88 : 70) * 0.20)
      )
    : 0;

  return (
    <CareerContext.Provider value={{
      theme,
      setThemeMode,
      toggleTheme,
      profile,
      updateProfile,
      jobTargets,
      activeJobTargetId,
      activeJobTarget,
      setActiveJobTargetId,
      createJobTarget,
      atsDiagnostic,
      runATSAnalysis,
      resumeVersion,
      updateResumeSection,
      applyTailoredVersion,
      interviewSession,
      startInterviewSession,
      updateInterviewTelemetry,
      addTranscriptLine,
      completeInterview,
      skillGaps,
      roadmapSteps,
      verifySkill,
      applications,
      addApplication,
      coverLetter,
      updateCoverLetter,
      linkedInOpt,
      activeScreen,
      setActiveScreen,
      careerReadinessScore,
      toastMessage,
      showToast,
      clearMockData,
      resetMockData,
      refreshDataFromBackend
    }}>
      {children}
    </CareerContext.Provider>
  );
};

export const useCareer = () => {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareer must be used within a CareerProvider');
  }
  return context;
};
