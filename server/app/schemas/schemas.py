from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any, Dict

# User & Auth Schemas
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    name: str
    email: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    avatar: Optional[str] = None
    target_role: Optional[str] = None
    experience_level: Optional[str] = None
    location: Optional[str] = None
    career_goal: Optional[str] = None

# Profile & Onboarding
class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    target_role: Optional[str] = None
    experience_level: Optional[str] = None
    skills: Optional[List[str]] = None
    location: Optional[str] = None
    career_goal: Optional[str] = None

# Job Target
class JobTargetCreate(BaseModel):
    title: str
    company: str
    location: Optional[str] = "Remote"
    description: str

class JobTargetResponse(BaseModel):
    id: str
    title: str
    company: str
    location: Optional[str]
    description: str
    match_score: float
    ats_score: float
    created_at: str

# Resume Tailoring
class ResumeTailorRequest(BaseModel):
    job_target_id: str
    user_skills: Optional[List[str]] = None

class ResumeTailorResponse(BaseModel):
    version_id: str
    job_target_id: str
    tailored_summary: str
    changes_log: List[Dict[str, Any]]
    approved_skills: List[str]
    omitted_unbacked: List[str]
    guardrail_audit: str

# Interview Session
class InterviewStartRequest(BaseModel):
    job_target_id: str
    type: str = "Technical"
    difficulty: str = "Medium"

class InterviewFinishRequest(BaseModel):
    session_id: str
    transcript: Optional[List[Dict[str, Any]]] = None

# Application
class ApplicationCreate(BaseModel):
    company: str
    role: str
    stage: str = "APPLIED"
    applied_date: str
    notes: Optional[str] = None
