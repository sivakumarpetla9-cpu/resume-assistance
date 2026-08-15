import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    company = Column(String, nullable=False)
    role = Column(String, nullable=False)
    stage = Column(String, default="APPLIED")
    applied_date = Column(String, nullable=False)
    match_score = Column(Float, default=82.0)
    notes = Column(Text, nullable=True)

    user = relationship("User", back_populates="applications")


class CoverLetter(Base):
    __tablename__ = "cover_letters"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    company = Column(String, nullable=False)
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="cover_letters")


class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    public_username = Column(String, unique=True, nullable=False, index=True)
    bio = Column(Text, nullable=True)
    projects = Column(JSON, nullable=True)
    skills = Column(JSON, nullable=True)

    user = relationship("User", back_populates="portfolio")
