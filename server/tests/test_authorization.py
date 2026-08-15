import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token
from app.db.session import get_db
from app.models import User, Resume, JobTarget, SkillGap, LearningRoadmap, LearningItem

client = TestClient(app)

def test_user_authorization_isolation():
    """
    User A creates resources. User B attempts to access User A's resources.
    The backend MUST isolate user data and reject cross-user access.
    """
    db = next(get_db())

    user_a_id = "user-isolation-a"
    user_b_id = "user-isolation-b"

    user_a = User(id=user_a_id, name="User A", email="usera@isolation.com", hashed_password="pwd")
    user_b = User(id=user_b_id, name="User B", email="userb@isolation.com", hashed_password="pwd")
    resume_a = Resume(id="res-user-a", user_id=user_a_id, file_name="UserA_Resume.pdf", file_type="pdf")
    job_a = JobTarget(id="job-user-a", user_id=user_a_id, title="Frontend Developer", company="A Corp", description="React, TypeScript")

    db.merge(user_a)
    db.merge(user_b)
    db.merge(resume_a)
    db.merge(job_a)
    db.commit()

    token_a = create_access_token(user_a_id)
    token_b = create_access_token(user_b_id)

    headers_a = {"Authorization": f"Bearer {token_a}"}
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # 1. User A requests their resume file -> 200 OK
    res_a = client.get("/api/v1/resumes/res-user-a/file", headers=headers_a)
    assert res_a.status_code == 200

    # 2. User B requests User A's resume file -> 403 Forbidden
    res_b = client.get("/api/v1/resumes/res-user-a/file", headers=headers_b)
    assert res_b.status_code == 403

    # 3. User B requests jobs list -> User B must NOT see User A's job target!
    jobs_b = client.get("/api/v1/jobs", headers=headers_b).json()
    job_ids_b = [j["id"] for j in jobs_b]
    assert "job-user-a" not in job_ids_b

    # 4. User B attempts to access User A's specific job target -> 403 Forbidden
    job_detail_b = client.get("/api/v1/jobs/job-user-a", headers=headers_b)
    assert job_detail_b.status_code == 403
