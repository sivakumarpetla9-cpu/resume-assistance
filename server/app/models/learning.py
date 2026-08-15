import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base

class LearningRoadmap(Base):
    __tablename__ = "learning_roadmaps"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False)
    estimated_hours = Column(Integer, default=23)
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("LearningItem", back_populates="roadmap", cascade="all, delete-orphan")


class LearningItem(Base):
    __tablename__ = "learning_items"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    roadmap_id = Column(String, ForeignKey("learning_roadmaps.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    status = Column(String, default="NOT_STARTED") # NOT_STARTED, IN_PROGRESS, COMPLETED
    rationale = Column(Text, nullable=False)
    estimated_hours = Column(Integer, default=4)
    practice_task = Column(Text, nullable=False)
    order = Column(Integer, default=1)

    roadmap = relationship("LearningRoadmap", back_populates="items")
