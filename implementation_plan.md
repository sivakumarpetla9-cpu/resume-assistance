# AI Career Intelligence SaaS Platform - Implementation Plan

Build a production-quality **AI Career Intelligence SaaS Platform** designed as a unified **Career Intelligence Operating System**. The application seamlessly connects **Candidate → Resume → Target Job → ATS Analysis → Resume Tailoring → Real-Time Interview → Skill Gap → Learning Roadmap → Career Readiness**.

## Architecture & Technology Stack

### Frontend Stack (`/client`)
- **Framework**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS configured with the exact design tokens specified in the design guide (Custom Dark `#070A0F` & Light `#F7F8FA` palettes, technical JetBrains Mono + Inter typography, high-contrast borders).
- **State Management**: React Context / Zustand connected state store keeping Candidate Profile, Active Job Target, ATS Analysis, Interview Audio Telemetry, and Learning Roadmap in sync in real time.
- **Visuals & Motion**: SVG & Canvas dynamic **Career Intelligence Graph**, Canvas real-time **Audio Waveform**, CSS & Framer-Motion transitions.
- **Icons**: Lucide React.

### Backend Stack (`/server`)
- **Framework**: Python FastAPI + Uvicorn
- **AI & NLP**: Modular AI Agent System (ATS Agent, Job Matching Agent, Resume Tailoring Agent with Strict Non-Fabrication Guardrails, Interview Agent, Skill Gap & Roadmap Agent). Supports both direct LLM/OpenAI calls and robust fallback mock orchestrators for zero-setup demo mode.
- **Real-Time Communication**: WebSockets for live interview question streaming, real-time voice telemetry (WPM, fillers, clarity, confidence), and state synchronization.

---

## User Review Required

> [!IMPORTANT]
> **Key Architectural Choices & Scope**:
> 1. **Unified Dual Engine**: The frontend will automatically detect if the FastAPI backend server (port 8000) is live. If live, it communicates via REST/WebSockets. If the backend is loading or standalone, it seamlessly falls back to a client-side AI mock engine so all 24+ screens are 100% interactive and functional out-of-the-box.
> 2. **Non-Fabrication AI Guardrail**: Tailored resume recommendations are strictly validated against candidate experience. The system will explicitly call out why content was modified and why unverified skills (e.g., Docker, AWS) were NOT added without proof.
> 3. **Signature Career Intelligence Graph**: Built using interactive SVG/Canvas with node lighting, active edge telemetry pulses, and clickable state routing.

---

## Proposed Component & File Structure

```text
resume/
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   ├── career.ts        # Candidate, JobTarget, ATS, Interview, SkillGap types
│   │   └── theme.ts
│   ├── store/
│   │   └── CareerContext.tsx # Central connected state store & state event emitters
│   ├── components/
│   │   ├── common/           # Navigation, Header, Dark/Light Toggle, Command Menu, Toast, Modal, Buttons
│   │   ├── graph/            # CareerIntelligenceGraph.tsx (Interactive SVG/Canvas living network)
│   │   ├── resume/           # ResumeStudio, ResumeEditor, TailoringDiffViewer, NonFabricationBanner, PDFExporter
│   │   ├── ats/              # ATSDiagnosticConsole, KeywordScanner, StructuralHealth
│   │   ├── interview/        # RealTimeInterviewRoom, AudioWaveform, VoiceTelemetry, AdaptiveQuestionDrawer
│   │   ├── skills/           # SkillGapConstellation, LearningRoadmapTimeline
│   │   └── layout/           # DashboardLayout, FullscreenRoomLayout, AuthLayout
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── AuthPages.tsx     # Login, Register, ForgotPassword
│   │   ├── OnboardingPage.tsx
│   │   ├── CommandCenterPage.tsx
│   │   ├── ResumeUploadPage.tsx
│   │   ├── ResumeStudioPage.tsx
│   │   ├── CreateJobTargetPage.tsx
│   │   ├── JobIntelligencePage.tsx
│   │   ├── ATSConsolePage.tsx
│   │   ├── ResumeTailoringPage.tsx
│   │   ├── ResumeExportPage.tsx
│   │   ├── InterviewSetupPage.tsx
│   │   ├── InterviewRoomPage.tsx
│   │   ├── InterviewResultsPage.tsx
│   │   ├── SkillGapPage.tsx
│   │   ├── LearningRoadmapPage.tsx
│   │   ├── SupportingPages.tsx # Applications, Job Matches, Cover Letter, Portfolio, LinkedIn Optimizer, Settings
│   │   └── IndexPages.ts
│   └── utils/
│       ├── parseResume.ts
│       ├── atsScorer.ts
│       └── audioTelemetry.ts
└── server/
    ├── requirements.txt
    ├── app/
    │   ├── main.py
    │   ├── api/
    │   │   ├── resume.py
    │   │   ├── jobs.py
    │   │   ├── ats.py
    │   │   ├── interview.py
    │   │   └── skills.py
    │   ├── services/
    │   │   ├── ai_orchestrator.py
    │   │   └── guardrails.py
    │   └── websocket/
    │       └── interview_ws.py
```

---

## Key Feature Implementation Phases

### Phase 1: Core Foundation & Design System
- Setup Vite + React + TypeScript + Tailwind CSS with dark mode as primary (`#070A0F` background, `#35C6FF` cyan accent, JetBrains Mono font integration).
- Implement global navigation, theme toggle (Dark/Light), command palette, and unified layout wrappers.

### Phase 2: Signature Visual System (Career Intelligence Graph)
- Develop `CareerIntelligenceGraph.tsx`: An interactive canvas/SVG component displaying nodes (`RESUME`, `JOB TARGET`, `ATS MATCH`, `SKILLS`, `INTERVIEW`, `LEARNING`, `READINESS`).
- Implement dynamic node connections, glowing cyan pulse animations, and interactive node selection to navigate across SaaS workspaces.

### Phase 3: Onboarding & Resume Parsing Studio
- Drag & Drop Resume Uploader with multi-stage parser simulation (Reading -> Extracting -> Semantic Indexing).
- **Resume Studio**: 3-zone layout (Section list on left, Document renderer in center, AI section intelligence on right).

### Phase 4: Job Target Workspace & ATS Diagnostic Console
- **Job Target Manager**: Create persistent job targets (Title, Company, Description).
- **Job Intelligence**: Candidate ↔ Role breakdown, required vs missing keywords.
- **ATS Diagnostic Console**: Score ring (e.g., 82 ATS Match), keyword density chart, structural error flags, and one-click "Fix in Resume" triggers.

### Phase 5: AI Resume Tailoring with Guardrails
- **Side-by-Side Diff Viewer**: Original vs AI-Tailored resume.
- **Strict Non-Fabrication Guardrail**: Explains every change (e.g., "Reworded bullet point for impact", "Did NOT add Docker because candidate profile lacks evidence").
- **Multi-template PDF/Doc Exporter** with version history (Original, V1, V2).

### Phase 6: Real-Time AI Interview Room & Voice Telemetry
- **Immersive Room**: Fullscreen layout with interviewer persona visualizer, live microphone waveform animation, real-time transcript streaming.
- **Live Telemetry Engine**: Computes WPM (e.g., 142 WPM), filler word counts, clarity %, and confidence score.
- **Adaptive Difficulty**: Question complexity dynamically adjusts (Easy -> Medium -> Hard) based on user answer depth.
- **Interview Results**: Comprehensive feedback, strengths, weak areas, and question-by-question scoring.

### Phase 7: Skill Gap, Learning Roadmap & Applications Tracker
- **Skill Gap Radar**: Categorizes skills into Strong, Intermediate, and Missing.
- **Vertical Learning Roadmap**: Step-by-step career path with estimated time, learning links, and practice projects.
- **Supporting Modules**: Applications Tracker (Timeline format), Job Matches Multi-Role view, AI Cover Letter generator, Portfolio builder, LinkedIn Optimizer, and Settings.

### Phase 8: FastAPI Backend & API Integration
- Setup FastAPI server with endpoint routes for AI operations.
- Implement WebSocket handler for real-time interview telemetry streaming.

---

## Verification Plan

### Automated Verification
1. **Frontend Build Check**: `npm run build` to verify clean TypeScript compilation and asset bundling.
2. **Backend API Test**: Verify FastAPI startup with `python -m uvicorn app.main:app --port 8000` and test endpoint responses.

### Manual Verification
1. **Full Flow Execution**: Sign Up -> Onboarding -> Upload Resume -> Create Job Target -> ATS Diagnostic -> Resume Tailoring -> Real-Time Mock Interview -> Skill Gap -> Learning Roadmap.
2. **Theme Switching**: Test Dark Mode vs Light Mode toggle across all 20+ screens.
3. **Guardrail Verification**: Ensure resume tailoring explicitly highlights unverified skill omissions and explains all edits.
4. **Interview Telemetry**: Confirm real-time audio waveform responsiveness and live metrics updates.
