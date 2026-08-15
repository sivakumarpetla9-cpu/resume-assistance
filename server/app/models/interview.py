import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_target_id = Column(String, ForeignKey("job_targets.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(String, default="Technical")
    difficulty = Column(String, default="Medium")
    status = Column(String, default="idle")
    overall_readiness_score = Column(Float, default=80.0)
    telemetry = Column(JSON, nullable=True)
    transcript = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    job_target = relationship("JobTarget", back_populates="interview_sessions")
    feedbacks = relationship("InterviewFeedback", back_populates="session", cascade="all, delete-orphan")


class InterviewFeedback(Base):
    __tablename__ = "interview_feedbacks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    technical_score = Column(Float, default=78.0)
    communication_score = Column(Float, default=84.0)
    confidence_score = Column(Float, default=81.0)
    structure_score = Column(Float, default=76.0)
    relevance_score = Column(Float, default=82.0)
    what_went_well = Column(JSON, nullable=False)
    what_needs_work = Column(JSON, nullable=False)

    session = relationship("InterviewSession", back_populates="feedbacks")
