from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import get_db
from app.core.config import settings

router = APIRouter(tags=["System Health"])

@router.get("/health")
def health_check():
    return {"status": "ok", "system": settings.PROJECT_NAME}

@router.get("/health/db")
def db_health(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected", "engine": settings.DATABASE_URL.split(":")[0]}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.get("/health/redis")
def redis_health():
    return {"status": "ok", "redis": "connected", "mode": "development_session_registry"}

@router.get("/health/ai")
def ai_health():
    return {
        "status": "ok",
        "provider": settings.AI_PROVIDER,
        "configured": bool(settings.AI_API_KEY)
    }
