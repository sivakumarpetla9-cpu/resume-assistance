import sys
import os

# Add server directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token
from app.db.session import get_db
from app.models import User, CareerProfile, JobTarget, SkillGap, ATSAnalysis
import uuid

client = TestClient(app)

def get_auth_headers():
    db = next(get_db())
    test_user_id = "test-user-api-1"
    user = db.query(User).filter(User.id == test_user_id).first()
    if not user:
        user = User(
            id=test_user_id,
            name="Test Candidate",
            email="testcandidate@example.com",
            hashed_password="hashed_pass_test",
            target_role="Frontend Developer"
        )
        db.add(user)
        profile = CareerProfile(id=f"prof-{test_user_id}", user_id=test_user_id, overall_readiness_score=78.0)
        db.add(profile)
        job = JobTarget(id="job-1", user_id=test_user_id, title="Frontend Developer", company="XYZ Tech", description="React, TypeScript")
        db.add(job)
        ats = ATSAnalysis(id="ats-job-1", job_target_id="job-1", overall_score=82.0, keyword_score=74.0, skills_score=80.0, matched_keywords=[], missing_keywords=[], weak_keywords=[], structural_issues=[])
        db.add(ats)
        gap = SkillGap(id="sg-1", job_target_id="job-1", skill_name="TypeScript", status="missing", job_requirement="Core", candidate_evidence="None", why_it_matters="Critical", how_to_improve="Practice", practice_project="Project")
        db.add(gap)
        db.commit()
    
    token = create_access_token(test_user_id)
    return {"Authorization": f"Bearer {token}"}

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_get_job_targets():
    headers = get_auth_headers()
    response = client.get("/api/v1/jobs", headers=headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_ats_analysis():
    headers = get_auth_headers()
    response = client.get("/api/v1/jobs/job-1/ats/latest", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "overall_score" in data
    assert data["overall_score"] == 82.0

def test_resume_tailoring_guardrails():
    headers = get_auth_headers()
    payload = {
        "job_target_id": "job-1",
        "user_skills": ["React", "JavaScript"]
    }
    response = client.post("/api/v1/jobs/job-1/tailor", json=payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "omitted_unbacked" in data
    assert "Docker" in data["omitted_unbacked"]

def test_skill_gaps():
    headers = get_auth_headers()
    response = client.get("/api/v1/skills/gaps", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) > 0
