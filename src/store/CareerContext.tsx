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
  createJobTarget: (target: { title: string; company: string; location: string; description: string }) => JobTarget;
  atsDiagnostic: ATSDiagnostic;
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
  verifySkill: (skillName: string) => void;
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
}

// Initial Mock Seed Data
const initialProfile: CandidateProfile = {
  name: "Alex Vance",
  targetRole: "Frontend Developer",
  experienceLevel: "Mid",
  skills: ["React", "JavaScript", "HTML5/CSS3", "Tailwind CSS", "REST APIs", "Git", "Redux"],
  location: "San Francisco, CA (Hybrid)",
  careerGoal: "Land a Senior Frontend / Staff UI Engineering role at a high-growth tech company",
  email: "alex.vance@example.com",
  bio: "Frontend Engineer with 4 years of experience delivering responsive web apps and interactive UI systems.",
  verifiedExperience: [
    {
      title: "Frontend Engineer",
      company: "Apex Tech Labs",
      period: "2022 - Present",
      achievements: [
        "Architected core dashboard components handling 120k daily active users.",
        "Improved web performance score from 64 to 94 using code-splitting and asset optimization.",
        "Collaborated with UX designers to establish unified token-based design system."
      ],
      skillsUsed: ["React", "JavaScript", "Tailwind CSS", "REST APIs", "Vite"]
    },
    {
      title: "UI Developer",
      company: "ByteForge Studios",
      period: "2020 - 2022",
      achievements: [
        "Built responsive client portals and landing pages.",
        "Integrated state management and backend APIs using React and Redux."
      ],
      skillsUsed: ["React", "JavaScript", "HTML5/CSS3", "Redux"]
    }
  ],
  resumeUploaded: true,
  resumeFileName: "Alex_Vance_Resume_2026.pdf",
  resumeParsedAt: "Just now"
};

const initialJobTargets: JobTarget[] = [
  {
    id: "job-1",
    title: "Frontend Developer",
    company: "XYZ Technology",
    location: "San Francisco, CA",
    description: "We are seeking a Frontend Developer to build real-time web applications with React, TypeScript, and high-performance WebSockets. You will collaborate closely with UI/UX designers and backend developers.",
    matchScore: 78,
    atsScore: 82,
    requiredSkills: ["React", "TypeScript", "JavaScript", "Tailwind CSS", "WebSockets", "State Management", "Performance Optimization"],
    preferredSkills: ["Testing (Jest/Cypress)", "Docker", "CI/CD", "Next.js"],
    keywords: [
      { word: "React", count: 8, status: "matched" },
      { word: "TypeScript", count: 6, status: "missing" },
      { word: "WebSockets", count: 4, status: "weak" },
      { word: "Performance", count: 5, status: "matched" },
      { word: "State Management", count: 3, status: "matched" },
      { word: "Testing", count: 2, status: "missing" }
    ],
    responsibilities: [
      "Develop modular React UI components using modern TypeScript patterns.",
      "Optimize client-side performance and bundle size.",
      "Integrate real-time WebSocket feeds and REST endpoints."
    ],
    createdAt: "2026-08-10",
    isPrimary: true
  },
  {
    id: "job-2",
    title: "React Engineer",
    company: "ABC Digital Labs",
    location: "Remote",
    description: "Join ABC Digital Labs to engineer scalable UI dashboards. Focus on custom data visualization, component library design, and browser performance.",
    matchScore: 84,
    atsScore: 88,
    requiredSkills: ["React", "JavaScript", "CSS Modules / Tailwind", "Redux", "REST APIs"],
    preferredSkills: ["GraphQL", "Design Systems"],
    keywords: [
      { word: "React", count: 10, status: "matched" },
      { word: "JavaScript", count: 7, status: "matched" },
      { word: "Design Systems", count: 3, status: "matched" }
    ],
    responsibilities: [
      "Build reusable component design systems.",
      "Integrate backend APIs with state store."
    ],
    createdAt: "2026-08-12"
  }
];

const initialAtsDiagnostic: ATSDiagnostic = {
  overallScore: 82,
  keywordScore: 74,
  skillsScore: 80,
  experienceScore: 86,
  structureScore: 92,
  languageScore: 88,
  matchedSkills: ["React", "JavaScript", "Tailwind CSS", "REST APIs", "Redux"],
  missingSkills: ["TypeScript", "WebSockets", "Jest / Unit Testing", "Docker"],
  weakKeywords: ["WebSockets (mentioned only once)", "Performance Optimization (lacks metrics)"],
  structuralIssues: [
    { severity: 'medium', issue: "TypeScript is listed in target job core requirements but missing from skills section header.", fixAction: "Add verified TypeScript knowledge or complete guided practice." },
    { severity: 'low', issue: "Quantifiable impact metrics could be increased in ByteForge experience.", fixAction: "Enhance achievement bullets with concrete numbers." }
  ],
  guardrailAlerts: [
    "Guardrail Active: Docker & AWS were detected in target job description, but omitted from auto-tailoring because no verified experience exists in candidate profile."
  ]
};

const initialTailoredResume: TailoredResumeVersion = {
  id: "res-v1",
  versionLabel: "V1 — XYZ Company Tailored",
  jobTargetId: "job-1",
  summary: "Results-driven Frontend Developer with 4+ years of experience crafting high-performance web applications using React, modern JavaScript, and Tailwind CSS. Proven track record of improving web performance scores by 30% and building responsive UI systems.",
  experience: [
    {
      id: "exp-1",
      company: "Apex Tech Labs",
      title: "Frontend Engineer",
      period: "2022 - Present",
      bullets: [
        "Architected core dashboard components handling 120k daily active users with React and REST APIs.",
        "Optimized web performance score from 64 to 94 using code-splitting, lazy loading, and asset bundle tuning.",
        "Collaborated with UX designers to build a token-based Tailwind design system."
      ],
      tailoredBullets: [
        "Architected real-time dashboard UI components handling 120,000+ daily active users utilizing React, modern state management, and optimized REST/WebSocket feeds.",
        "Pioneered client-side performance optimization strategy, elevating Lighthouse performance score from 64 to 94 through code-splitting and asset minimization.",
        "Engineered scalable component design system in Tailwind CSS, accelerating UI feature delivery by 25%."
      ]
    },
    {
      id: "exp-2",
      company: "ByteForge Studios",
      title: "UI Developer",
      period: "2020 - 2022",
      bullets: [
        "Built responsive client portals and landing pages.",
        "Integrated state management and backend APIs using React and Redux."
      ],
      tailoredBullets: [
        "Developed responsive client portals and high-conversion landing pages utilizing React and Redux state architecture.",
        "Integrated backend REST endpoints with strict error boundaries, decreasing app crash rate by 18%."
      ]
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "Real-Time Telemetry Dashboard",
      description: "Interactive analytics application rendering live streaming metric graphs.",
      techStack: ["React", "JavaScript", "Tailwind CSS", "WebSockets"],
      highlights: ["Implemented custom canvas charts rendering 60 FPS live streaming feeds."]
    }
  ],
  skills: [
    { category: "Frontend Frameworks", items: ["React", "JavaScript (ES6+)", "Redux / Context API"] },
    { category: "Styling & UI", items: ["Tailwind CSS", "HTML5 / CSS3", "Responsive Design"] },
    { category: "Tools & Workflow", items: ["REST APIs", "Git / GitHub", "Vite", "Webpack"] }
  ],
  education: [
    { institution: "University of California, Berkeley", degree: "B.S. in Computer Science", year: "2020" }
  ],
  changesLog: [
    {
      id: "c-1",
      section: "Summary",
      beforeText: "Frontend Engineer with 4 years of experience...",
      afterText: "Results-driven Frontend Developer with 4+ years of experience crafting high-performance web applications using React...",
      rationale: "Positioned React and performance keywords prominently to match XYZ Company job title and criteria.",
      guardrailCompliant: true
    },
    {
      id: "c-2",
      section: "Experience",
      beforeText: "Architected core dashboard components...",
      afterText: "Architected real-time dashboard UI components handling 120,000+ daily active users utilizing React and REST/WebSocket feeds...",
      rationale: "Added real-time context aligned with telemetry project evidence.",
      guardrailCompliant: true
    },
    {
      id: "c-3",
      section: "Skills",
      beforeText: "Docker / AWS (Attempted AI Insertion)",
      afterText: "[OMITTED]",
      rationale: "Did NOT insert Docker or AWS because candidate evidence does not verify proficiency. Non-fabrication guardrail enforced.",
      guardrailCompliant: true,
      guardrailNote: "Enforced non-fabrication rule against false experience."
    }
  ],
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
      expectedConcepts: ["React.memo", "useCallback", "Virtualization (windowing)", "Code Splitting"]
    },
    {
      id: "q2",
      text: "Explain how you would handle real-time WebSocket connection drops and state resynchronization in a React application.",
      category: "Architecture",
      difficulty: "Medium",
      expectedConcepts: ["Exponential Backoff", "Optimistic Updates", "Reconnection Queue", "Heartbeat"]
    },
    {
      id: "q3",
      text: "Can you contrast TypeScript interfaces vs types, and describe when generics are essential for robust component props?",
      category: "Technical",
      difficulty: "Hard",
      expectedConcepts: ["Type Aliases", "Union Types", "Generic Constraints", "Extending Interfaces"]
    },
    {
      id: "q4",
      text: "Describe a complex technical challenge you faced when building a UI system and how you resolved it.",
      category: "Behavioral",
      difficulty: "Medium",
      expectedConcepts: ["STAR Method", "Problem Definition", "Impact Metrics"]
    }
  ],
  telemetry: {
    wpm: 142,
    fillersCount: 2,
    clarityPercentage: 88,
    confidenceScore: 83,
    paceStatus: "Optimal"
  },
  transcript: [
    { speaker: "AI", text: "Welcome to your AI Mock Technical Interview for Frontend Developer at XYZ Company. Let's begin with question 1.", timestamp: "12:00:00" },
    { speaker: "AI", text: "How would you optimize a React application that is experiencing frame drops and slow rendering on large lists?", timestamp: "12:00:05" }
  ],
  scoreBreakdown: {
    technical: 78,
    communication: 84,
    confidence: 81,
    structure: 76,
    relevance: 82
  },
  overallReadinessScore: 80,
  whatWentWell: [
    "Clear explanation of React component memoization.",
    "Strong technical vocabulary and natural speech pacing (142 WPM).",
    "Effective usage of real-world metrics from Apex Tech Labs experience."
  ],
  whatNeedsWork: [
    "Mention list virtualization libraries like react-window explicitly.",
    "Practice deeper answers on TypeScript generics under pressure."
  ],
  recommendedActions: [
    "Complete the TypeScript Generics micro-learning task on your roadmap.",
    "Do a 10-minute targeted mock interview focusing on System Architecture."
  ]
};

const initialSkillGaps: SkillGapItem[] = [
  {
    id: "sg-1",
    skillName: "TypeScript",
    status: "intermediate",
    jobRequirement: "Core requirement for Frontend Developer at XYZ Company.",
    candidateEvidence: "Basic exposure in personal project; missing from verified company work.",
    whyItMatters: "XYZ Company codebase is 100% strict TypeScript. Lacking verified depth creates ATS penalty.",
    howToImprove: "Build a typed component library and add typed props to React projects.",
    practiceProject: "Refactor Real-Time Telemetry Dashboard to Strict TypeScript",
    resources: [
      { name: "TypeScript Official Handbook", type: "Docs", url: "https://www.typescriptlang.org/docs/" },
      { name: "Execute Program: Advanced TypeScript", type: "Course", url: "#" }
    ]
  },
  {
    id: "sg-2",
    skillName: "WebSockets & Real-Time Sync",
    status: "intermediate",
    jobRequirement: "Required for XYZ live telemetry UI features.",
    candidateEvidence: "Used REST APIs extensively; single socket demo project.",
    whyItMatters: "Real-time communication is central to XYZ's flagship SaaS product.",
    howToImprove: "Implement WebSocket auto-reconnect, message framing, and state queueing.",
    practiceProject: "Build a WebSocket Live Telemetry Feed with Exponential Backoff",
    resources: [
      { name: "MDN WebSocket API Guide", type: "Docs", url: "https://developer.mozilla.org" }
    ]
  },
  {
    id: "sg-3",
    skillName: "Jest & Cypress Testing",
    status: "missing",
    jobRequirement: "Preferred skill in job description.",
    candidateEvidence: "No testing evidence found in resume.",
    whyItMatters: "Senior engineering roles heavily favor candidates with unit and E2E testing experience.",
    howToImprove: "Write unit tests for custom React hooks and E2E tests for main user flows.",
    practiceProject: "Add 90% Test Coverage to React Dashboard Component",
    resources: [
      { name: "Testing Library & Jest Crash Course", type: "Tutorial", url: "#" }
    ]
  },
  {
    id: "sg-4",
    skillName: "React & State Management",
    status: "strong",
    jobRequirement: "Core essential skill.",
    candidateEvidence: "Verified 4 years experience at Apex Tech Labs & ByteForge.",
    whyItMatters: "Demonstrates core domain mastery.",
    howToImprove: "Maintain state-of-the-art knowledge on React 19 server components.",
    practiceProject: "Master React Compiler & Server Actions",
    resources: [
      { name: "React Official Docs", type: "Docs", url: "https://react.dev" }
    ]
  }
];

const initialRoadmapSteps: LearningRoadmapStep[] = [
  {
    id: "step-1",
    title: "TypeScript Foundations & Strict Props",
    category: "Language",
    status: "completed",
    rationale: "Mandatory foundation before applying to TypeScript-first engineering teams.",
    estimatedHours: 4,
    resources: ["TypeScript Handbook", "React TypeScript Cheatsheet"],
    practiceTask: "Type all state hooks and API responses in sample workspace.",
    order: 1
  },
  {
    id: "step-2",
    title: "TypeScript Generics & Utility Types",
    category: "Language",
    status: "in_progress",
    rationale: "Required to answer technical interview question 03 confidently.",
    estimatedHours: 6,
    resources: ["Advanced TypeScript Patterns", "Generic Component Props Guide"],
    practiceTask: "Create a reusable generic table component `<DataTable<T>>` with sorted columns.",
    order: 2
  },
  {
    id: "step-3",
    title: "Real-Time WebSockets Architecture",
    category: "Architecture",
    status: "upcoming",
    rationale: "Key differentiator for XYZ Company Frontend Developer role.",
    estimatedHours: 8,
    resources: ["WebSocket Protocol RFC", "React Socket Hooks Pattern"],
    practiceTask: "Implement socket reconnect buffer with optimistic UI state.",
    order: 3
  },
  {
    id: "step-4",
    title: "React Unit & Integration Testing (Jest/RTL)",
    category: "Quality",
    status: "upcoming",
    rationale: "Closes the missing testing skill gap in ATS diagnostic console.",
    estimatedHours: 5,
    resources: ["React Testing Library Best Practices"],
    practiceTask: "Write 10 unit test cases for the interview room telemetry panel.",
    order: 4
  }
];

const initialApplications: ApplicationTrackerItem[] = [
  {
    id: "app-1",
    company: "XYZ Technology",
    role: "Frontend Developer",
    stage: "Interview",
    appliedDate: "2026-08-11",
    matchScore: 78,
    notes: "Completed initial recruiter phone screen; AI technical interview scheduled."
  },
  {
    id: "app-2",
    company: "ABC Digital Labs",
    role: "React Engineer",
    stage: "Assessment",
    appliedDate: "2026-08-08",
    matchScore: 84,
    notes: "Submitted take-home coding assignment."
  },
  {
    id: "app-3",
    company: "Starlight Software",
    role: "Senior UI Engineer",
    stage: "Applied",
    appliedDate: "2026-08-01",
    matchScore: 72,
    notes: "Submitted tailored V1 resume."
  }
];

const initialCoverLetter: CoverLetterData = {
  jobTargetId: "job-1",
  company: "XYZ Technology",
  role: "Frontend Developer",
  content: `Dear Hiring Team at XYZ Technology,

I am writing to express my strong enthusiasm for the Frontend Developer position. With over 4 years of hands-on experience building high-traffic React applications, optimizing performance, and designing intuitive user interfaces, I am eager to contribute to XYZ Technology's innovative frontend ecosystem.

At Apex Tech Labs, I architected core dashboard components serving 120,000+ daily active users and improved our Lighthouse web performance rating from 64 to 94. My background in modern JavaScript, React state management, and responsive CSS aligns directly with your job requirements.

I am particularly excited about XYZ's focus on real-time data features. I look forward to discussing how my frontend technical skills and problem-solving mindset will add value to your engineering organization.

Sincerely,
Alex Vance`,
  tone: "Technical"
};

const initialLinkedInOpt: LinkedInOptimization = {
  currentHeadline: "Frontend Developer at Apex Tech Labs | React & JavaScript",
  optimizedHeadline: "Frontend Engineer | React, TypeScript, High-Performance UI Systems | Building Scalable Web Apps (120k+ DAU)",
  currentAbout: "Software developer with 4 years experience in web development using React and CSS.",
  optimizedAbout: "Frontend Engineer specializing in React, TypeScript, and high-performance client applications. Track record of improving app load speeds by 30%+ and delivering token-based design systems for 100k+ user SaaS platforms.",
  keywordScoreBefore: 62,
  keywordScoreAfter: 91,
  keyEnhancements: [
    "Added high-intent keywords: TypeScript, High-Performance UI Systems, Design Systems.",
    "Integrated verifiable impact metric (120k+ DAU & 30% speed boost).",
    "Aligned structure with executive recruiter search algorithms."
  ]
};

const CareerContext = createContext<CareerContextType | undefined>(undefined);

export const CareerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>(() => {
    return (localStorage.getItem('stitch_theme') as 'dark' | 'light' | 'system') || 'dark';
  });
  const [profile, setProfile] = useState<CandidateProfile>(initialProfile);
  const [jobTargets, setJobTargets] = useState<JobTarget[]>(initialJobTargets);
  const [activeJobTargetId, setActiveJobTargetId] = useState<string>("job-1");
  const [atsDiagnostic, setAtsDiagnostic] = useState<ATSDiagnostic>(initialAtsDiagnostic);
  const [resumeVersion, setResumeVersion] = useState<TailoredResumeVersion>(initialTailoredResume);
  const [interviewSession, setInterviewSession] = useState<InterviewSession>(initialInterviewSession);
  const [skillGaps, setSkillGaps] = useState<SkillGapItem[]>(initialSkillGaps);
  const [roadmapSteps, setRoadmapSteps] = useState<LearningRoadmapStep[]>(initialRoadmapSteps);
  const [applications, setApplications] = useState<ApplicationTrackerItem[]>(initialApplications);
  const [coverLetter, setCoverLetter] = useState<CoverLetterData>(initialCoverLetter);
  const [linkedInOpt] = useState<LinkedInOptimization>(initialLinkedInOpt);
  const [activeScreen, setActiveScreen] = useState<string>('landing');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync theme with document html class and localStorage
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

  const activeJobTarget = jobTargets.find(j => j.id === activeJobTargetId) || jobTargets[0];

  const updateProfile = (updated: Partial<CandidateProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
    showToast("Profile & skills updated successfully");
  };

  const createJobTarget = (targetData: { title: string; company: string; location: string; description: string }): JobTarget => {
    const newId = `job-${Date.now()}`;
    const newTarget: JobTarget = {
      id: newId,
      title: targetData.title,
      company: targetData.company,
      location: targetData.location || "Remote / Onsite",
      description: targetData.description,
      matchScore: 76,
      atsScore: 80,
      requiredSkills: ["React", "JavaScript", "TypeScript", "UI Engineering"],
      preferredSkills: ["Performance Optimization", "Testing"],
      keywords: [
        { word: "React", count: 5, status: "matched" },
        { word: "TypeScript", count: 4, status: "missing" },
        { word: "UI Engineering", count: 3, status: "matched" }
      ],
      responsibilities: ["Develop customer-facing web applications", "Collaborate on modern UI design systems"],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setJobTargets(prev => [newTarget, ...prev]);
    setActiveJobTargetId(newId);
    showToast(`Created new Job Target: ${newTarget.title} — ${newTarget.company}`);
    return newTarget;
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

  // Requirement 31: REAL-TIME DATA BEHAVIOR
  // When user verifies/adds a skill (e.g. TypeScript), update all connected metrics reactively!
  const verifySkill = (skillName: string) => {
    if (!profile.skills.includes(skillName)) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, skillName] }));
    }
    // Update active job target match score & keywords
    setJobTargets(prev => prev.map(job => {
      const updatedKeywords = job.keywords.map(k => k.word.toLowerCase() === skillName.toLowerCase() ? { ...k, status: 'matched' as const } : k);
      return {
        ...job,
        matchScore: Math.min(98, job.matchScore + 8),
        atsScore: Math.min(99, job.atsScore + 6),
        keywords: updatedKeywords
      };
    }));

    // Update ATS diagnostic
    setAtsDiagnostic(prev => ({
      ...prev,
      overallScore: Math.min(98, prev.overallScore + 6),
      keywordScore: Math.min(96, prev.keywordScore + 8),
      matchedSkills: [...prev.matchedSkills, skillName],
      missingSkills: prev.missingSkills.filter(s => !s.toLowerCase().includes(skillName.toLowerCase()))
    }));

    // Update Skill Gap status
    setSkillGaps(prev => prev.map(sg => sg.skillName.toLowerCase() === skillName.toLowerCase() ? { ...sg, status: 'strong' as const } : sg));

    // Update Roadmap step
    setRoadmapSteps(prev => prev.map(step => step.title.toLowerCase().includes(skillName.toLowerCase()) ? { ...step, status: 'completed' as const } : step));

    showToast(`Verified Skill: ${skillName}! Job Match & ATS Scores Updated in Real Time.`);
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
      bio: "Candidate profile will be updated automatically upon onboarding or resume upload.",
      verifiedExperience: [],
      resumeUploaded: false
    });
    setJobTargets([]);
    setApplications([]);
    showToast("Mock data cleared — starting fresh workspace!");
  };

  const resetMockData = () => {
    setProfile(initialProfile);
    setJobTargets(initialJobTargets);
    setActiveJobTargetId("job-1");
    setAtsDiagnostic(initialAtsDiagnostic);
    setResumeVersion(initialTailoredResume);
    setInterviewSession(initialInterviewSession);
    setSkillGaps(initialSkillGaps);
    setRoadmapSteps(initialRoadmapSteps);
    setApplications(initialApplications);
    setCoverLetter(initialCoverLetter);
    showToast("Sample mock dataset re-seeded successfully!");
  };

  // Calculate global Career Readiness Score based on connected pillars
  const careerReadinessScore = Math.round(
    ((activeJobTarget?.matchScore || 70) * 0.35) +
    (atsDiagnostic.overallScore * 0.25) +
    ((interviewSession.overallReadinessScore || 80) * 0.20) +
    ((profile.skills.length > 5 ? 88 : 70) * 0.20)
  );

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
      resetMockData
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
