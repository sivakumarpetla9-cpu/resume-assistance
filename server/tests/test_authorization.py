import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token
from app.core.db import SessionLocal
from app.models import User, Resume

client = TestClient(app)

def test_user_authorization_isolation():
    """
    Mandatory Phase 32 Authorization Test:
    User A creates Resume A. User B attempts to access Resume A.
    The backend MUST reject with 403 Forbidden or 404 Not Found.
    """
    # 1. Create tokens for User A and User B
    user_a_token = create_access_token("user-a-123")
    user_b_token = create_access_token("user-b-456")

    # 2. Seed Resume A owned by User A
    db = SessionLocal()
    try:
        user_a = User(id="user-a-123", name="User A", email="usera@example.com", hashed_password="pwd")
        user_b = User(id="user-b-456", name="User B", email="userb@example.com", hashed_password="pwd")
        resume_a = Resume(id="res-user-a", user_id="user-a-123", file_name="UserA_Resume.pdf", file_type="pdf")

        db.merge(user_a)
        db.merge(user_b)
        db.merge(resume_a)
        db.commit()
    finally:
        db.close()

    # 3. User A requests their own resume file -> Expected 200 OK
    headers_a = {"Authorization": f"Bearer {user_a_token}"}
    response_a = client.get("/api/v1/resumes/res-user-a/file", headers=headers_a)
    assert response_a.status_code == 200

    # 4. User B attempts to request User A's resume file -> MUST RETURN 403 Forbidden!
    headers_b = {"Authorization": f"Bearer {user_b_token}"}
    response_b = client.get("/api/v1/resumes/res-user-a/file", headers=headers_b)
    assert response_b.status_code == 403
    assert "Forbidden" in response_b.json()["detail"]
