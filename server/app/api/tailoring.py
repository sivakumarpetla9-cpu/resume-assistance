from fastapi import APIRouter
from app.schemas.schemas import ResumeTailorRequest, ResumeTailorResponse
from app.services.guardrails import NonFabricationGuardrail
import uuid

router = APIRouter(prefix="/jobs", tags=["Resume Tailoring"])

@router.post("/{job_id}/tailor")
def tailor_resume(job_id: str, req: ResumeTailorRequest):
    candidate_skills = req.user_skills or ["React", "JavaScript", "Tailwind CSS", "REST APIs", "Redux"]
    
    validation = NonFabricationGuardrail.validate_tailoring(
        candidate_skills=candidate_skills,
        candidate_experience=[],
        suggested_skills=["React", "TypeScript", "Docker", "AWS"]
    )

    version_id = f"res-v{uuid.uuid4().hex[:4]}"

    return {
        "version_id": version_id,
        "job_target_id": job_id,
        "tailored_summary": "Results-driven Frontend Developer with 4+ years of experience crafting high-performance web applications using React, modern JavaScript, and Tailwind CSS.",
        "changes_log": [
            {
                "id": "c-1",
                "section": "Summary",
                "beforeText": "Frontend Engineer with 4 years experience...",
                "afterText": "Results-driven Frontend Developer with 4+ years experience...",
                "rationale": "Positioned React and performance keywords prominently to match job title.",
                "guardrailCompliant": True
            },
            {
                "id": "c-2",
                "section": "Skills",
                "beforeText": "Docker / AWS (Attempted Insertion)",
                "afterText": "[OMITTED]",
                "rationale": f"Omitted {', '.join(validation['omitted_unbacked_skills'])} because candidate profile lacks verified evidence.",
                "guardrailCompliant": True,
                "guardrailNote": "Non-fabrication rule strictly enforced."
            }
        ],
        "approved_skills": validation["approved_skills"],
        "omitted_unbacked": validation["omitted_unbacked_skills"],
        "guardrail_audit": validation["audit_log"]
    }
