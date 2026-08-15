import sys
import os

# Add server directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.db import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.models import User, CareerProfile, JobTarget, Application

def seed_database():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if demo user exists
        demo_user = db.query(User).filter(User.id == "demo-user-1").first()
        if not demo_user:
            print("Seeding demo user & STITCH workspace data...")
            user = User(
                id="demo-user-1",
                name="Alex Vance",
                email="alex.vance@example.com",
                hashed_password=get_password_hash("password123"),
                target_role="Frontend Developer",
                experience_level="Mid",
                location="San Francisco, CA",
                career_goal="Land a Senior Frontend / Staff UI Engineering role"
            )
            db.add(user)

            profile = CareerProfile(
                id="prof-1",
                user_id="demo-user-1",
                overall_readiness_score=81.0,
                resume_score=82.0,
                job_match_score=78.0,
                interview_score=80.0,
                skill_depth_score=72.0
            )
            db.add(profile)

            job = JobTarget(
                id="job-1",
                user_id="demo-user-1",
                title="Frontend Developer",
                company="XYZ Technology",
                location="San Francisco, CA",
                description="Build real-time React web applications with WebSockets and TypeScript.",
                match_score=78.0,
                ats_score=82.0
            )
            db.add(job)

            app = Application(
                id="app-1",
                user_id="demo-user-1",
                company="XYZ Technology",
                role="Frontend Developer",
                stage="INTERVIEW",
                applied_date="2026-08-11",
                match_score=78.0,
                notes="Recruiter screen completed; AI technical interview scheduled."
            )
            db.add(app)

            db.commit()
            print("STITCH database seeded successfully!")
        else:
            print("Demo data already seeded.")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
