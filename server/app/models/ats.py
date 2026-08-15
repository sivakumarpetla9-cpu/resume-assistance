import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class ATSAnalysis(Base):
    __tablename__ = "ats_analyses"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_target_id = Column(String, ForeignKey("job_targets.id", ondelete="CASCADE"), nullable=False, index=True)
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
