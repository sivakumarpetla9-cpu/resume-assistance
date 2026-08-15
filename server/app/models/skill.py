import uuid
from sqlalchemy import Column, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class SkillGap(Base):
    __tablename__ = "skill_gaps"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_target_id = Column(String, ForeignKey("job_targets.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_name = Column(String, nullable=False, index=True)
    status = Column(String, nullable=False) # 'strong', 'intermediate', 'missing'
    job_requirement = Column(Text, nullable=False)
    candidate_evidence = Column(Text, nullable=True)
    why_it_matters = Column(Text, nullable=False)
    how_to_improve = Column(Text, nullable=False)
    practice_project = Column(Text, nullable=False)

    job_target = relationship("JobTarget", back_populates="skill_gaps")
