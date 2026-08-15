import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base

class CareerProfile(Base):
    __tablename__ = "career_profiles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    overall_readiness_score = Column(Float, default=78.0)
    resume_score = Column(Float, default=82.0)
    job_match_score = Column(Float, default=78.0)
    interview_score = Column(Float, default=80.0)
    skill_depth_score = Column(Float, default=72.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="career_profile")
    user_skills = relationship("UserSkill", back_populates="career_profile", cascade="all, delete-orphan")


class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    profile_id = Column(String, ForeignKey("career_profiles.id", ondelete="CASCADE"), nullable=False)
    skill_name = Column(String, nullable=False, index=True)
    proficiency = Column(String, default="Intermediate")
    is_verified = Column(Boolean, default=True)

    career_profile = relationship("CareerProfile", back_populates="user_skills")
