import os
import uuid
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user, verify_owner
from app.models import User, Resume, ResumeVersion, CareerProfile
from app.services.resume_parser import ResumeParserService

router = APIRouter(prefix="/resumes", tags=["Resumes"])

UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename missing from upload request.")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".pdf", ".docx"]:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Only PDF (.pdf) and DOCX (.docx) files are accepted."
        )

    # Read content & validate file size
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File size ({len(content) / (1024 * 1024):.1f}MB) exceeds the 10MB maximum limit."
        )

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    unique_filename = f"resume_{current_user.id}_{uuid.uuid4().hex[:8]}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as f:
        f.write(content)

    # Send file to real resume parser service
    try:
        parsed_data = ResumeParserService.parse_document(file_path, file.filename)
    except ValueError as val_err:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as parse_err:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Error parsing resume file: {str(parse_err)}")

    # Create Resume database record for current user
    resume_id = f"res-{uuid.uuid4().hex[:8]}"
    new_resume = Resume(
        id=resume_id,
        user_id=current_user.id,
        file_name=file.filename,
        file_path=file_path,
        file_type=ext.lstrip(".").lower(),
        parsed_summary=parsed_data.get("summary", "")
    )
    db.add(new_resume)

    # Create initial ResumeVersion database record
    version_id = f"ver-{uuid.uuid4().hex[:8]}"
    new_version = ResumeVersion(
        id=version_id,
        resume_id=resume_id,
        version_label="V1 (Original Upload)",
        summary=parsed_data.get("summary", "")
    )
    db.add(new_version)

    # Update candidate profile's target role or experience if present
    profile = db.query(CareerProfile).filter(CareerProfile.user_id == current_user.id).first()
    if profile:
        profile.resume_score = 85.0

    db.commit()
    db.refresh(new_resume)

    return {
        "resume_id": new_resume.id,
        "version_id": version_id,
        "file_name": file.filename,
        "file_size": len(content),
        "status": "SUCCESS",
        "extracted_text_available": bool(parsed_data.get("raw_text")),
        "extracted_text": parsed_data.get("raw_text", ""),
        "extracted_skills": parsed_data.get("skills", []),
        "word_count": parsed_data.get("word_count", 0)
    }

@router.get("/{resume_id}")
def get_resume(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume record not found.")

    verify_owner(resume.user_id, current_user.id)

    return {
        "id": resume.id,
        "user_id": resume.user_id,
        "file_name": resume.file_name,
        "summary": resume.parsed_summary,
        "file_type": resume.file_type,
        "created_at": resume.created_at
    }
