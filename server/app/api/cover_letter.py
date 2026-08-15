from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/cover-letters", tags=["Cover Letters"])

class CoverLetterReq(BaseModel):
    company: str
    role: str

@router.post("/generate")
def generate_cover_letter(req: CoverLetterReq):
    return {
        "company": req.company,
        "role": req.role,
        "content": f"Dear Hiring Team at {req.company},\n\nI am writing to express my enthusiasm for the {req.role} position. With 4+ years of hands-on experience building React applications and optimizing UI performance, I am excited to contribute to {req.company}.\n\nSincerely,\nAlex Vance"
    }
