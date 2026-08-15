import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class JobTarget(Base):
    __tablename__ = "job_targets"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    location = Column(String, nullable=True)
    employment_type = Column(String, default="Full-time")
    description = Column(Text, nullable=False)
    match_score = Column(Float, default=78.0)
    ats_score = Column(Float, default=82.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="job_targets")
    requirements = relationship("JobRequirement", back_populates="job_target", cascade="all, delete-orphan")
    ats_analyses = relationship("ATSAnalysis", back_populates="job_target", cascade="all, delete-orphan")
    job_matches = relationship("JobMatch", back_populates="job_target", cascade="all, delete-orphan")
    interview_sessions = relationship("InterviewSession", back_populates="job_target", cascade="all, delete-orphan")
    skill_gaps = relationship("SkillGap", back_populates="job_target", cascade="all, delete-orphan")


class JobRequirement(Base):
    __tablename__ = "job_requirements"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_target_id = Column(String, ForeignKey("job_targets.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_name = Column(String, nullable=False)
    is_required = Column(Boolean, default=True)
    importance_level = Column(String, default="High")

    job_target = relationship("JobTarget", back_populates="requirements")


class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_target_id = Column(String, ForeignKey("job_targets.id", ondelete="CASCADE"), nullable=False, index=True)
    overall_match = Column(Float, default=78.0)
    skills_match = Column(Float, default=80.0)
    experience_match = Column(Float, default=84.0)
    keyword_match = Column(Float, default=74.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    job_target = relationship("JobTarget", back_populates="job_matches")
