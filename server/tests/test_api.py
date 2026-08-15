import sys
import os

# Add server directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_get_job_targets():
    response = client.get("/api/v1/jobs")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_ats_analysis():
    response = client.get("/api/v1/jobs/job-1/ats/latest")
    assert response.status_code == 200
    data = response.json()
    assert "overall_score" in data
    assert data["overall_score"] == 82.0

def test_resume_tailoring_guardrails():
    payload = {
        "job_target_id": "job-1",
        "user_skills": ["React", "JavaScript"]
    }
    response = client.post("/api/v1/jobs/job-1/tailor", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "omitted_unbacked" in data
    # Verify non-fabrication guardrail caught unverified Docker & AWS skills
    assert "Docker" in data["omitted_unbacked"]

def test_skill_gaps():
    response = client.get("/api/v1/skills/gaps")
    assert response.status_code == 200
    assert len(response.json()) > 0
