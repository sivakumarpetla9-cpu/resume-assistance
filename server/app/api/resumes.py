from fastapi import APIRouter, UploadFile, File, HTTPException
import uuid

router = APIRouter(prefix="/resumes", tags=["Resumes"])

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    if not (file.filename.endswith(".pdf") or file.filename.endswith(".docx")):
        raise HTTPException(status_code=400, detail="Invalid file format. PDF and DOCX supported.")
    
    resume_id = f"res-{uuid.uuid4().hex[:8]}"
    content = await file.read()
    
    return {
        "id": resume_id,
        "file_name": file.filename,
        "file_size": len(content),
        "status": "COMPLETED",
        "parsed_sections": ["Summary", "Experience", "Projects", "Skills", "Education"],
        "extracted_skills": ["React", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "REST APIs"]
    }

@router.get("/{resume_id}")
def get_resume(resume_id: str):
    return {
        "id": resume_id,
        "file_name": "Alex_Vance_Resume_2026.pdf",
        "summary": "Frontend Engineer with 4 years experience...",
        "status": "ACTIVE"
    }
