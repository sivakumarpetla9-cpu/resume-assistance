from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models import User, Application
from app.schemas.schemas import ApplicationCreate

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.get("")
def get_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    apps = db.query(Application).filter(Application.user_id == current_user.id).all()
    return [
        {
            "id": a.id,
            "company": a.company,
            "role": a.role,
            "stage": a.stage,
            "appliedDate": a.applied_date,
            "matchScore": a.match_score,
            "notes": a.notes
        }
        for a in apps
    ]

@router.post("")
def create_application(
    app_in: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_app = Application(
        user_id=current_user.id,
        company=app_in.company,
        role=app_in.role,
        stage=app_in.stage,
        applied_date=app_in.applied_date,
        match_score=82.0,
        notes=app_in.notes or "Application logged."
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)

    return {
        "id": new_app.id,
        "company": new_app.company,
        "role": new_app.role,
        "stage": new_app.stage,
        "appliedDate": new_app.applied_date,
        "matchScore": new_app.match_score,
        "notes": new_app.notes
    }
