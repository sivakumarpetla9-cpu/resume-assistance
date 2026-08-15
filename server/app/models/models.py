from sqlalchemy import Column, Integer, String, Text, Boolean, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    avatar = Column(String, nullable=True)
    target_role = Column(String, nullable=True)
    experience_level = Column(String, nullable=True)
    location = Column(String, nullable=True)
    career_goal = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    career_profile = relationship("CareerProfile", back_populates="user", uselist=False)
    resumes = relationship("Resume", back_populates="user")
    job_targets = relationship("JobTarget", back_populates="user")
    applications = relationship("Application", back_populates="user")
    cover_letters = relationship("CoverLetter", back_populates="user")
    portfolio = relationship("Portfolio", back_populates="user", uselist=False)


class CareerProfile(Base):
    __tablename__ = "career_profiles"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    overall_readiness_score = Column(Float, default=78.0)
    resume_score = Column(Float, default=82.0)
    job_match_score = Column(Float, default=78.0)
    interview_score = Column(Float, default=80.0)
    skill_depth_score = Column(Float, default=72.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="career_profile")
    user_skills = relationship("UserSkill", back_populates="career_profile")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=True)
    file_type = Column(String, nullable=False)
    parsed_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="resumes")
    versions = relationship("ResumeVersion", back_populates="resume")


class ResumeVersion(Base):
    __tablename__ = "resume_versions"

    id = Column(String, primary_key=True, index=True)
    resume_id = Column(String, ForeignKey("resumes.id"), nullable=False)
    version_label = Column(String, nullable=False) # e.g. "V1 - XYZ Tailored"
    summary = Column(Text, nullable=True)
    changes_log = Column(JSON, nullable=True) # Array of rationale & guardrail notes
    created_at = Column(DateTime, default=datetime.utcnow)

    resume = relationship("Resume", back_populates="versions")
    experiences = relationship("Experience", back_populates="version")
    projects = relationship("Project", back_populates="version")


class Experience(Base):
    __tablename__ = "experiences"

    id = Column(String, primary_key=True, index=True)
    version_id = Column(String, ForeignKey("resume_versions.id"), nullable=False)
    company = Column(String, nullable=False)
    title = Column(String, nullable=False)
    period = Column(String, nullable=False)
    bullets = Column(JSON, nullable=False)
    tailored_bullets = Column(JSON, nullable=True)

    version = relationship("ResumeVersion", back_populates="experiences")


class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    version_id = Column(String, ForeignKey("resume_versions.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    tech_stack = Column(JSON, nullable=False)
    highlights = Column(JSON, nullable=True)

    version = relationship("ResumeVersion", back_populates="projects")


class JobTarget(Base):
    __tablename__ = "job_targets"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
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
    requirements = relationship("JobRequirement", back_populates="job_target")
    ats_analyses = relationship("ATSAnalysis", back_populates="job_target")
    job_matches = relationship("JobMatch", back_populates="job_target")
    interview_sessions = relationship("InterviewSession", back_populates="job_target")
    skill_gaps = relationship("SkillGap", back_populates="job_target")


class JobRequirement(Base):
    __tablename__ = "job_requirements"

    id = Column(String, primary_key=True, index=True)
    job_target_id = Column(String, ForeignKey("job_targets.id"), nullable=False)
    skill_name = Column(String, nullable=False)
    is_required = Column(Boolean, default=True)
    importance_level = Column(String, default="High")

    job_target = relationship("JobTarget", back_populates="requirements")


class ATSAnalysis(Base):
    __tablename__ = "ats_analyses"

    id = Column(String, primary_key=True, index=True)
    job_target_id = Column(String, ForeignKey("job_targets.id"), nullable=False)
    overall_score = Column(Float, default=82.0)
    keyword_score = Column(Float, default=74.0)
    skills_score = Column(Float, default=80.0)
    experience_score = Column(Float, default=86.0)
    structure_score = Column(Float, default=92.0)
    language_score = Column(Float, default=88.0)
    matched_keywords = Column(JSON, nullable=False)
    missing_keywords = Column(JSON, nullable=False)
    weak_keywords = Column(JSON, nullable=False)
    structural_issues = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    job_target = relationship("JobTarget", back_populates="ats_analyses")


class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(String, primary_key=True, index=True)
    job_target_id = Column(String, ForeignKey("job_targets.id"), nullable=False)
    overall_match = Column(Float, default=78.0)
    skills_match = Column(Float, default=80.0)
    experience_match = Column(Float, default=84.0)
    keyword_match = Column(Float, default=74.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    job_target = relationship("JobTarget", back_populates="job_matches")


class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(String, primary_key=True, index=True)
    profile_id = Column(String, ForeignKey("career_profiles.id"), nullable=False)
    skill_name = Column(String, nullable=False)
    proficiency = Column(String, default="Intermediate")
    is_verified = Column(Boolean, default=True)

    career_profile = relationship("CareerProfile", back_populates="user_skills")


class SkillGap(Base):
    __tablename__ = "skill_gaps"

    id = Column(String, primary_key=True, index=True)
    job_target_id = Column(String, ForeignKey("job_targets.id"), nullable=False)
    skill_name = Column(String, nullable=False)
    status = Column(String, nullable=False) # 'strong', 'intermediate', 'missing'
    job_requirement = Column(Text, nullable=False)
    candidate_evidence = Column(Text, nullable=True)
    why_it_matters = Column(Text, nullable=False)
    how_to_improve = Column(Text, nullable=False)
    practice_project = Column(Text, nullable=False)

    job_target = relationship("JobTarget", back_populates="skill_gaps")


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(String, primary_key=True, index=True)
    job_target_id = Column(String, ForeignKey("job_targets.id"), nullable=False)
    type = Column(String, default="Technical")
    difficulty = Column(String, default="Medium")
    status = Column(String, default="idle")
    overall_readiness_score = Column(Float, default=80.0)
    telemetry = Column(JSON, nullable=True)
    transcript = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    job_target = relationship("JobTarget", back_populates="interview_sessions")
    feedbacks = relationship("InterviewFeedback", back_populates="session")


class InterviewFeedback(Base):
    __tablename__ = "interview_feedbacks"

    id = Column(String, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("interview_sessions.id"), nullable=False)
    technical_score = Column(Float, default=78.0)
    communication_score = Column(Float, default=84.0)
    confidence_score = Column(Float, default=81.0)
    structure_score = Column(Float, default=76.0)
    relevance_score = Column(Float, default=82.0)
    what_went_well = Column(JSON, nullable=False)
    what_needs_work = Column(JSON, nullable=False)

    session = relationship("InterviewSession", back_populates="feedbacks")


class LearningRoadmap(Base):
    __tablename__ = "learning_roadmaps"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    estimated_hours = Column(Integer, default=23)
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("LearningItem", back_populates="roadmap")


class LearningItem(Base):
    __tablename__ = "learning_items"

    id = Column(String, primary_key=True, index=True)
    roadmap_id = Column(String, ForeignKey("learning_roadmaps.id"), nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    status = Column(String, default="NOT_STARTED") # NOT_STARTED, IN_PROGRESS, COMPLETED
    rationale = Column(Text, nullable=False)
    estimated_hours = Column(Integer, default=4)
    practice_task = Column(Text, nullable=False)
    order = Column(Integer, default=1)

    roadmap = relationship("LearningRoadmap", back_populates="items")


class Application(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    company = Column(String, nullable=False)
    role = Column(String, nullable=False)
    stage = Column(String, default="APPLIED")
    applied_date = Column(String, nullable=False)
    match_score = Column(Float, default=82.0)
    notes = Column(Text, nullable=True)

    user = relationship("User", back_populates="applications")


class CoverLetter(Base):
    __tablename__ = "cover_letters"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    company = Column(String, nullable=False)
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="cover_letters")


class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    public_username = Column(String, unique=True, nullable=False)
    bio = Column(Text, nullable=True)
    projects = Column(JSON, nullable=True)
    skills = Column(JSON, nullable=True)

    user = relationship("User", back_populates="portfolio")
