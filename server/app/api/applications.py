from fastapi import APIRouter
from app.schemas.schemas import ApplicationCreate
import uuid

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.get("")
def get_applications():
    return [
        {
            "id": "app-1",
            "company": "XYZ Technology",
            "role": "Frontend Developer",
            "stage": "Interview",
            "appliedDate": "2026-08-11",
            "matchScore": 78,
            "notes": "Completed recruiter screen; technical AI interview scheduled."
        }
    ]

@router.post("")
def create_application(app_in: ApplicationCreate):
    app_id = f"app-{uuid.uuid4().hex[:6]}"
    return {
        "id": app_id,
        "company": app_in.company,
        "role": app_in.role,
        "stage": app_in.stage,
        "appliedDate": app_in.applied_date,
        "matchScore": 82,
        "notes": app_in.notes or "Application logged."
    }
