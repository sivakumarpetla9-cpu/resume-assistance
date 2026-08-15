import re
import uuid
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user, verify_owner
from app.models import (
    User,
    JobTarget,
    JobRequirement,
    ATSAnalysis,
    Resume,
    ResumeVersion,
    CareerProfile,
    UserSkill,
    SkillGap,
    LearningRoadmap,
    LearningItem
)

router = APIRouter(prefix="/jobs", tags=["ATS Analysis"])

COMMON_TECH_KEYWORDS = [
    "React", "TypeScript", "JavaScript", "Python", "Java", "C++", "C#", "Go", "Rust",
    "HTML", "CSS", "Tailwind CSS", "Tailwind", "Bootstrap", "WebSockets", "Redux",
    "Node.js", "Express", "FastAPI", "Django", "Flask", "GraphQL", "REST APIs",
    "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Docker", "Kubernetes", "AWS", "Azure", "GCP",
    "Jest", "Cypress", "PyTest", "Vite", "Webpack", "Next.js", "Vue.js", "Angular", "CI/CD"
]

def extract_keywords(text: str) -> List[str]:
    found = []
    for kw in COMMON_TECH_KEYWORDS:
        pattern = r'\b' + re.escape(kw) + r'\b'
        if re.search(pattern, text, re.IGNORECASE):
            found.append(kw)
    return list(dict.fromkeys(found))

@router.post("/{job_id}/ats")
def run_ats_analysis(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(JobTarget).filter(JobTarget.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job target not found.")

    verify_owner(job.user_id, current_user.id)

    # 1. Fetch User's latest Resume and Version
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()).first()
    version = (
        db.query(ResumeVersion)
        .filter(ResumeVersion.resume_id == resume.id)
        .order_by(ResumeVersion.created_at.desc())
        .first()
        if resume else None
    )

    resume_text = ""
    if version and version.summary:
        resume_text += " " + version.summary
    if resume and resume.parsed_summary:
        resume_text += " " + resume.parsed_summary

    # Attempt reading actual file text if exists
    if resume and resume.file_path and os.path.exists(resume.file_path):
        try:
            from app.services.resume_parser import ResumeParserService
            parsed = ResumeParserService.parse_document(resume.file_path, resume.file_name)
            resume_text += " " + parsed.get("raw_text", "")
        except Exception:
            pass

    # 2. Fetch User Verified Skills
    profile = db.query(CareerProfile).filter(CareerProfile.user_id == current_user.id).first()
    user_skills = (
        db.query(UserSkill)
        .filter(UserSkill.profile_id == profile.id)
        .all()
        if profile else []
    )
    verified_skill_names = [s.skill_name.lower() for s in user_skills if s.is_verified]

    # 3. Extract Job Target Requirements
    job_reqs = db.query(JobRequirement).filter(JobRequirement.job_target_id == job.id).all()
    job_req_skills = [r.skill_name for r in job_reqs]

    job_text_skills = extract_keywords(job.description)
    all_required_skills = list(dict.fromkeys(job_req_skills + job_text_skills))
    if not all_required_skills:
        all_required_skills = ["React", "JavaScript", "Tailwind CSS", "REST APIs"]

    # 4. Compare Candidate Data against Job Requirements
    matched_skills = []
    missing_skills = []

    for req_sk in all_required_skills:
        pattern = r'\b' + re.escape(req_sk) + r'\b'
        in_resume = bool(re.search(pattern, resume_text, re.IGNORECASE))
        in_verified = req_sk.lower() in verified_skill_names

        if in_resume or in_verified:
            matched_skills.append(req_sk)
        else:
            missing_skills.append(req_sk)

    # 5. Compute ATS Pillars
    skills_count = max(len(all_required_skills), 1)
    skills_score = min(100.0, round((len(matched_skills) / skills_count) * 100.0, 1))
    keyword_score = max(50.0, min(95.0, skills_score + 5.0))
    experience_score = 85.0 if resume else 50.0
    structure_score = 90.0 if (resume_text and len(resume_text) > 50) else 60.0
    language_score = 88.0

    overall_score = round(
        0.35 * skills_score +
        0.25 * keyword_score +
        0.20 * experience_score +
        0.10 * structure_score +
        0.10 * language_score,
        1
    )

    structural_issues = []
    for m_sk in missing_skills[:4]:
        structural_issues.append({
            "severity": "high",
            "issue": f"Core skill '{m_sk}' is required for {job.title} at {job.company} but missing from uploaded resume.",
            "fix_action": f"Add verified experience or complete guided learning task for {m_sk}."
        })

    guardrail_alerts = []
    if missing_skills:
        guardrail_alerts.append(
            f"Guardrail Active: {', '.join(missing_skills[:3])} detected in job requirements but omitted from auto-tailoring because no verified experience exists in your candidate profile."
        )

    # 6. Save or Update ATSAnalysis Database Record
    ats = db.query(ATSAnalysis).filter(ATSAnalysis.job_target_id == job.id).first()
    if not ats:
        ats = ATSAnalysis(
            id=f"ats-{uuid.uuid4().hex[:8]}",
            job_target_id=job.id,
            overall_score=overall_score,
            keyword_score=keyword_score,
            skills_score=skills_score,
            experience_score=experience_score,
            structure_score=structure_score,
            language_score=language_score,
            matched_keywords=matched_skills,
            missing_keywords=missing_skills,
            weak_keywords=[],
            structural_issues=structural_issues
        )
        db.add(ats)
    else:
        ats.overall_score = overall_score
        ats.keyword_score = keyword_score
        ats.skills_score = skills_score
        ats.experience_score = experience_score
        ats.structure_score = structure_score
        ats.language_score = language_score
        ats.matched_keywords = matched_skills
        ats.missing_keywords = missing_skills
        ats.structural_issues = structural_issues

    job.ats_score = overall_score
    job.match_score = overall_score

    # 7. Generate Real SkillGap Records in DB
    db.query(SkillGap).filter(SkillGap.job_target_id == job.id).delete()
    for m_sk in missing_skills:
        gap = SkillGap(
            id=f"sg-{uuid.uuid4().hex[:8]}",
            job_target_id=job.id,
            skill_name=m_sk,
            status="missing",
            priority="HIGH",
            job_requirement=f"Required skill for {job.title} position at {job.company}.",
            candidate_evidence="No verified experience or mention found in uploaded resume.",
            why_it_matters=f"{m_sk} is central to the core technical stack at {job.company}.",
            how_to_improve=f"Complete practice task and build a project feature using {m_sk}.",
            practice_project=f"Build & verify a {m_sk} practice module."
        )
        db.add(gap)

    for match_sk in matched_skills[:3]:
        gap = SkillGap(
            id=f"sg-{uuid.uuid4().hex[:8]}",
            job_target_id=job.id,
            skill_name=match_sk,
            status="strong",
            priority="LOW",
            job_requirement=f"Verified skill matching {job.title} criteria.",
            candidate_evidence="Verified in uploaded candidate resume.",
            why_it_matters=f"Demonstrates core capability in {match_sk}.",
            how_to_improve=f"Maintain state-of-the-art proficiency in {match_sk}.",
            practice_project=f"Advanced {match_sk} architecture practice."
        )
        db.add(gap)

    # 8. Generate Real LearningRoadmap Records in DB
    roadmap = db.query(LearningRoadmap).filter(LearningRoadmap.user_id == current_user.id).first()
    if not roadmap:
        roadmap = LearningRoadmap(
            id=f"rm-{uuid.uuid4().hex[:8]}",
            user_id=current_user.id,
            title=f"Path to {job.title} Readiness",
            estimated_hours=len(missing_skills) * 6
        )
        db.add(roadmap)
    else:
        roadmap.title = f"Path to {job.title} Readiness"
        roadmap.estimated_hours = len(missing_skills) * 6

    db.query(LearningItem).filter(LearningItem.roadmap_id == roadmap.id).delete()

    order_idx = 1
    if missing_skills:
        for m_sk in missing_skills:
            item = LearningItem(
                id=f"li-{uuid.uuid4().hex[:8]}",
                roadmap_id=roadmap.id,
                title=f"{m_sk} Foundations & Implementation",
                category="Language / Tool",
                status="NOT_STARTED",
                rationale=f"Fills critical missing skill gap identified for {job.title} at {job.company}.",
                estimated_hours=5,
                practice_task=f"Implement a hands-on {m_sk} module and verify skill evidence.",
                order=order_idx
            )
            db.add(item)
            order_idx += 1
    else:
        item = LearningItem(
            id=f"li-{uuid.uuid4().hex[:8]}",
            roadmap_id=roadmap.id,
            title="Maintain Profile & Skill Depth",
            category="Domain Mastery",
            status="COMPLETED",
            rationale="Your current profile covers all selected job requirements.",
            estimated_hours=0,
            practice_task="All required core skills are verified in your candidate profile.",
            order=1
        )
        db.add(item)

    db.commit()
    db.refresh(ats)

    return {
        "job_id": job.id,
        "overall_score": ats.overall_score,
        "keyword_score": ats.keyword_score,
        "skills_score": ats.skills_score,
        "experience_score": ats.experience_score,
        "structure_score": ats.structure_score,
        "language_score": ats.language_score,
        "matched_keywords": ats.matched_keywords,
        "missing_keywords": ats.missing_keywords,
        "weak_keywords": ats.weak_keywords,
        "structural_issues": ats.structural_issues,
        "guardrail_alerts": guardrail_alerts
    }

@router.get("/{job_id}/ats/latest")
def get_latest_ats(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(JobTarget).filter(JobTarget.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job target not found.")

    verify_owner(job.user_id, current_user.id)

    ats = db.query(ATSAnalysis).filter(ATSAnalysis.job_target_id == job.id).first()
    if not ats:
        return {
            "job_id": job.id,
            "status": "not_analyzed",
            "overall_score": None,
            "ats_analysis": None,
            "message": "No ATS diagnostic generated yet. Click 'Run ATS Analysis' to generate."
        }

    return {
        "job_id": job.id,
        "status": "completed",
        "overall_score": ats.overall_score,
        "keyword_score": ats.keyword_score,
        "skills_score": ats.skills_score,
        "experience_score": ats.experience_score,
        "structure_score": ats.structure_score,
        "language_score": ats.language_score,
        "matched_keywords": ats.matched_keywords,
        "missing_keywords": ats.missing_keywords,
        "weak_keywords": ats.weak_keywords,
        "structural_issues": ats.structural_issues,
        "created_at": str(ats.created_at)
    }
