export interface CandidateProfile {
  name: string;
  targetRole: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  skills: string[];
  location: string;
  careerGoal: string;
  email: string;
  bio: string;
  verifiedExperience: {
    title: string;
    company: string;
    period: string;
    achievements: string[];
    skillsUsed: string[];
  }[];
  resumeUploaded: boolean;
  resumeFileName?: string;
  resumeParsedAt?: string;
}

export interface JobTarget {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  matchScore: number;
  atsScore: number;
  requiredSkills: string[];
  preferredSkills: string[];
  keywords: { word: string; count: number; status: 'matched' | 'missing' | 'weak' }[];
  responsibilities: string[];
  createdAt: string;
  isPrimary?: boolean;
}

export interface ATSDiagnostic {
  overallScore: number;
  keywordScore: number;
  skillsScore: number;
  experienceScore: number;
  structureScore: number;
  languageScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  weakKeywords: string[];
  structuralIssues: { severity: 'high' | 'medium' | 'low'; issue: string; fixAction: string }[];
  guardrailAlerts: string[];
}

export interface ChangeLogItem {
  id: string;
  section: 'Summary' | 'Experience' | 'Projects' | 'Skills' | 'Education';
  beforeText: string;
  afterText: string;
  rationale: string;
  guardrailCompliant: boolean;
  guardrailNote?: string;
}

export interface TailoredResumeVersion {
  id: string;
  versionLabel: string;
  jobTargetId: string;
  summary: string;
  experience: {
    id: string;
    company: string;
    title: string;
    period: string;
    bullets: string[];
    tailoredBullets?: string[];
  }[];
  projects: {
    id: string;
    name: string;
    description: string;
    techStack: string[];
    highlights: string[];
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
  changesLog: ChangeLogItem[];
  updatedAt: string;
}

export interface TelemetryMetrics {
  wpm: number;
  fillersCount: number;
  clarityPercentage: number;
  confidenceScore: number;
  paceStatus: 'Optimal' | 'Too Fast' | 'Slightly Slow';
}

export interface InterviewQuestion {
  id: string;
  text: string;
  category: 'Technical' | 'Behavioral' | 'Architecture' | 'System Design';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  expectedConcepts: string[];
}

export interface InterviewSession {
  id: string;
  jobTargetId: string;
  jobTitle: string;
  type: 'Technical' | 'Behavioral' | 'Mixed';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'idle' | 'connecting' | 'active' | 'processing' | 'completed';
  currentQuestionIndex: number;
  questions: InterviewQuestion[];
  telemetry: TelemetryMetrics;
  transcript: { speaker: 'AI' | 'Candidate'; text: string; timestamp: string }[];
  scoreBreakdown?: {
    technical: number;
    communication: number;
    confidence: number;
    structure: number;
    relevance: number;
  };
  overallReadinessScore?: number;
  whatWentWell?: string[];
  whatNeedsWork?: string[];
  recommendedActions?: string[];
}

export interface SkillGapItem {
  id: string;
  skillName: string;
  status: 'strong' | 'intermediate' | 'missing';
  jobRequirement: string;
  candidateEvidence: string;
  whyItMatters: string;
  howToImprove: string;
  practiceProject: string;
  resources: { name: string; type: 'Course' | 'Docs' | 'Tutorial'; url: string }[];
}

export interface LearningRoadmapStep {
  id: string;
  title: string;
  category: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  rationale: string;
  estimatedHours: number;
  resources: string[];
  practiceTask: string;
  order: number;
}

export interface ApplicationTrackerItem {
  id: string;
  company: string;
  role: string;
  stage: 'Applied' | 'Assessment' | 'Interview' | 'Offer' | 'Rejected';
  appliedDate: string;
  matchScore: number;
  notes: string;
}

export interface CoverLetterData {
  jobTargetId: string;
  company: string;
  role: string;
  content: string;
  tone: 'Professional' | 'Confident' | 'Technical';
}

export interface LinkedInOptimization {
  currentHeadline: string;
  optimizedHeadline: string;
  currentAbout: string;
  optimizedAbout: string;
  keywordScoreBefore: number;
  keywordScoreAfter: number;
  keyEnhancements: string[];
}
