from fastapi import APIRouter

router = APIRouter(prefix="/skills", tags=["Skills & Skill Gaps"])

@router.get("/gaps")
def get_skill_gaps():
    return [
        {
            "id": "sg-1",
            "skillName": "TypeScript",
            "status": "intermediate",
            "jobRequirement": "Core requirement for Frontend Developer at XYZ Company.",
            "candidateEvidence": "Basic exposure in personal project; missing from verified company work.",
            "whyItMatters": "XYZ Company codebase is 100% strict TypeScript. Lacking verified depth creates ATS penalty.",
            "howToImprove": "Build a typed component library and add typed props to React projects.",
            "practiceProject": "Refactor Real-Time Telemetry Dashboard to Strict TypeScript"
        },
        {
            "id": "sg-2",
            "skillName": "WebSockets & Real-Time Sync",
            "status": "intermediate",
            "jobRequirement": "Required for XYZ live telemetry UI features.",
            "candidateEvidence": "Used REST APIs extensively; single socket demo project.",
            "whyItMatters": "Real-time communication is central to XYZ's flagship SaaS product.",
            "howToImprove": "Implement WebSocket auto-reconnect, message framing, and state queueing.",
            "practiceProject": "Build a WebSocket Live Telemetry Feed with Exponential Backoff"
        }
    ]
