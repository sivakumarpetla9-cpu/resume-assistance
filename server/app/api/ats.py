from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.services.ai_providers import DevelopmentAIProvider

router = APIRouter(prefix="/jobs", tags=["ATS Analysis"])

@router.post("/{job_id}/ats")
def run_ats_analysis(job_id: str):
    ai = DevelopmentAIProvider()
    return ai.run_ats_diagnostic({}, "React, TypeScript, WebSockets")

@router.get("/{job_id}/ats/latest")
def get_latest_ats(job_id: str):
    return {
        "job_id": job_id,
        "overall_score": 82.0,
        "keyword_score": 74.0,
        "skills_score": 80.0,
        "experience_score": 86.0,
        "structure_score": 92.0,
        "language_score": 88.0,
        "matched_keywords": ["React", "JavaScript", "Tailwind CSS", "REST APIs", "Redux"],
        "missing_keywords": ["TypeScript", "WebSockets", "Jest / Unit Testing", "Docker"],
        "weak_keywords": ["WebSockets (mentioned only once)", "Performance Optimization (lacks metrics)"],
        "structural_issues": [
            {
                "severity": "high",
                "issue": "TypeScript is listed in target job requirements but missing from skills section header.",
                "fix_action": "Add verified TypeScript knowledge or complete guided practice."
            }
        ],
        "guardrail_alerts": [
            "Guardrail Active: Docker & AWS were detected in target job description, but omitted from auto-tailoring because no verified experience exists in candidate profile."
        ]
    }
