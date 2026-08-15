import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token
from app.db.session import get_db
from app.models import User, JobTarget, SkillGap

client = TestClient(app)

def test_assistant_chat_unauthenticated():
    """
    Assistant endpoint MUST return 401 Unauthorized if no Bearer token is provided.
    """
    res = client.post("/api/v1/assistant/chat", json={"page": "command-center", "message": "Hello"})
    assert res.status_code == 401

def test_assistant_chat_authenticated():
    """
    Authenticated user sends query to assistant -> 200 OK with clean context response.
    """
    db = next(get_db())
    user_id = "user-assistant-test-1"
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = User(id=user_id, name="Assistant Test Candidate", email="assistant@test.com", hashed_password="pwd", target_role="Frontend Developer")
        db.add(user)
        job = JobTarget(id="job-asst-1", user_id=user_id, title="Frontend Engineer", company="Apex Tech", description="React, TypeScript")
        db.add(job)
        db.commit()

    token = create_access_token(user_id)
    headers = {"Authorization": f"Bearer {token}"}

    res = client.post(
        "/api/v1/assistant/chat",
        json={"page": "command-center", "message": "What skills should I learn?"},
        headers=headers
    )
    assert res.status_code == 200
    data = res.json()
    assert "reply" in data
    assert "context_used" in data
    assert data["context_used"]["user_name"] == "Assistant Test Candidate"
    assert data["context_used"]["target_role"] == "Frontend Engineer"
