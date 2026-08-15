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
  addApplication: (app: Omit<ApplicationTrackerItem, 'id'>) => Promise<void>;
  coverLetter: CoverLetterData;
  updateCoverLetter: (content: string) => void;
  linkedInOpt: LinkedInOptimization;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  careerReadinessScore: number | null;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  clearMockData: () => void;
  resetMockData: () => void;
  refreshDataFromBackend: () => Promise<void>;
}

const initialProfile: CandidateProfile = {
  name: "Candidate Profile",
  targetRole: "Software Engineer",
  experienceLevel: "Mid",
  skills: [],
  location: "Remote / Onsite",
  careerGoal: "Advance software engineering career",
  email: "",
  bio: "",
  verifiedExperience: [],
  resumeUploaded: false
};

const defaultFallbackJobTarget: JobTarget = {
  id: "",
  title: "Target Role",
  company: "Target Company",
  location: "Remote",
  description: "Create a job target to begin personalized ATS analysis and skill gap tracking.",
  matchScore: 0,
  atsScore: 0,
  requiredSkills: [],
  preferredSkills: [],
  keywords: [],
  responsibilities: [],
  createdAt: ""
};

const initialAtsDiagnostic: ATSDiagnostic = {
  overallScore: null,
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
  jobTargetId: "",
  summary: "Results-driven Software Engineer with experience building scalable web applications.",
  experience: [],
  projects: [],
  skills: [],
  education: [],
  changesLog: [],
  updatedAt: "2026-08-15"
};

const initialInterviewSession: InterviewSession = {
  id: "int-session-1",
  jobTargetId: "",
  jobTitle: "Software Engineer",
  type: "Technical",
  difficulty: "Medium",
  status: "idle",
  currentQuestionIndex: 0,
  questions: [
    {
      id: "q1",
      text: "How would you optimize performance and component architecture in a production web application?",
      category: "Technical",
      difficulty: "Medium",
      expectedConcepts: ["Memoization", "Code Splitting", "Virtualization"]
    }
  ],
  telemetry: {
    wpm: 140,
    fillersCount: 2,
    clarityPercentage: 85,
    confidenceScore: 82,
    paceStatus: "Optimal"
  },
  transcript: [],
  scoreBreakdown: {
    technical: 80,
    communication: 85,
    confidence: 82,
    structure: 80,
    relevance: 83
  },
  overallReadinessScore: 82
};

const initialCoverLetter: CoverLetterData = {
  jobTargetId: "",
  company: "Target Company",
  role: "Software Engineer",
  content: `Dear Hiring Team,\n\nI am writing to express my interest in the Software Engineer role.\n\nSincerely,\nCandidate`,
  tone: "Technical"
};

const initialLinkedInOpt: LinkedInOptimization = {
  currentHeadline: "Software Engineer",
  optimizedHeadline: "Software Engineer | High-Performance UI & Distributed Systems",
  currentAbout: "Software developer building responsive applications.",
  optimizedAbout: "Engineered robust full-stack applications with modern web architecture.",
  keywordScoreBefore: 65,
  keywordScoreAfter: 92,
  keyEnhancements: ["Added performance optimization and system architecture keywords"]
};

const CareerContext = createContext<CareerContextType | undefined>(undefined);

export const CareerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>(() => {
    return (localStorage.getItem('stitch_theme') as 'dark' | 'light' | 'system') || 'dark';
  });
  const [profile, setProfile] = useState<CandidateProfile>(initialProfile);
  const [jobTargets, setJobTargets] = useState<JobTarget[]>([]);
  const [activeJobTargetId, setActiveJobTargetId] = useState<string>("");
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

  const activeJobTarget = jobTargets.find(j => j.id === activeJobTargetId) || jobTargets[0] || defaultFallbackJobTarget;

  const refreshDataFromBackend = async () => {
    const token = localStorage.getItem('stitch_access_token');
    if (!token) return;

    try {
      // 1. Load User Me
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

      // 2. Load Profile & Verified Skills
      const userProfile = await StitchAPI.getProfile().catch(() => null);
      if (userProfile && userProfile.skills) {
        setProfile(prev => ({
          ...prev,
          skills: userProfile.skills || []
        }));
      }

      // 3. Load Job Targets
      const jobs = await StitchAPI.getJobs().catch(() => []);
      if (Array.isArray(jobs)) {
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

        if (mappedJobs.length > 0 && (!activeJobTargetId || !mappedJobs.some(j => j.id === activeJobTargetId))) {
          setActiveJobTargetId(mappedJobs[0].id);
        }
      }

      // 4. Load Skill Gaps
      const gaps = await StitchAPI.getSkillGaps().catch(() => []);
      if (Array.isArray(gaps)) {
        setSkillGaps(gaps.map((g: any) => ({
          id: g.id,
          skillName: g.skillName,
          status: g.status,
          priority: g.priority || 'HIGH',
          jobRequirement: g.jobRequirement,
          candidateEvidence: g.candidateEvidence,
          whyItMatters: g.whyItMatters,
          howToImprove: g.howToImprove,
          practiceProject: g.practiceProject,
          resources: []
        })));
      }

      // 5. Load Roadmap
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

      // 6. Load Applications
      const apps = await StitchAPI.getApplications().catch(() => []);
      if (Array.isArray(apps)) {
        setApplications(apps.map((a: any) => ({
          id: a.id,
          company: a.company,
          role: a.role,
          stage: a.stage,
          appliedDate: a.appliedDate || a.applied_date,
          matchScore: a.matchScore || a.match_score || 80,
          notes: a.notes
        })));
      }

      // 7. Load latest ATS Diagnostic for active job target
      const currentTargetId = activeJobTargetId || (jobs.length > 0 ? jobs[0].id : null);
      if (currentTargetId) {
        const atsData = await StitchAPI.getLatestATS(currentTargetId).catch(() => null);
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
        } else {
          setAtsDiagnostic(initialAtsDiagnostic);
        }
      }
    } catch (err) {
      console.error("Error refreshing backend context:", err);
    }
  };

  useEffect(() => {
    refreshDataFromBackend();
  }, [activeJobTargetId]);

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
    setAtsDiagnostic(initialAtsDiagnostic);
    showToast(`Created Job Target: ${newTarget.title} at ${newTarget.company}`);
    return newTarget;
  };

  const runATSAnalysis = async (targetJobId?: string) => {
    const targetId = targetJobId || activeJobTargetId;
    if (!targetId) return;

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

    await refreshDataFromBackend();
    showToast(`ATS Diagnostic Complete! Calculated Overall Score: ${res.overall_score}%`);
  };

  const verifySkill = async (skillName: string) => {
    await StitchAPI.verifySkill(skillName);
    if (!profile.skills.includes(skillName)) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, skillName] }));
    }
    showToast(`Verified Skill: ${skillName}!`);
    await refreshDataFromBackend();
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
        { speaker: 'AI', text: `Starting ${type} interview (${difficulty} difficulty) for ${activeJobTarget.title}. First question coming up...`, timestamp: new Date().toLocaleTimeString() },
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

  const addApplication = async (appData: Omit<ApplicationTrackerItem, 'id'>) => {
    const created = await StitchAPI.createApplication(appData.company, appData.role, appData.stage, appData.appliedDate);
    const newApp: ApplicationTrackerItem = {
      id: created.id,
      company: created.company,
      role: created.role,
      stage: created.stage,
      appliedDate: created.appliedDate || created.applied_date,
      matchScore: created.matchScore || 80,
      notes: created.notes
    };
    setApplications(prev => [newApp, ...prev]);
    showToast(`Added Application: ${appData.company}`);
  };

  const updateCoverLetter = (content: string) => {
    setCoverLetter(prev => ({ ...prev, content }));
    showToast("Cover Letter updated");
  };

  const clearMockData = () => {
    setProfile(initialProfile);
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
        ((profile.skills.length > 3 ? 90 : profile.skills.length * 20) * 0.20)
      )
    : null;

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
