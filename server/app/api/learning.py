from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models import User, LearningRoadmap, LearningItem

router = APIRouter(prefix="/learning", tags=["Learning Roadmap"])

@router.get("/roadmap")
def get_learning_roadmap(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    roadmap = db.query(LearningRoadmap).filter(LearningRoadmap.user_id == current_user.id).first()
    if not roadmap:
        return []

    items = db.query(LearningItem).filter(LearningItem.roadmap_id == roadmap.id).order_by(LearningItem.order).all()
    return [
        {
            "id": item.id,
            "title": item.title,
            "category": item.category,
            "status": item.status,
            "rationale": item.rationale,
            "estimatedHours": item.estimated_hours,
            "practiceTask": item.practice_task,
            "order": item.order
        }
        for item in items
    ]

@router.put("/items/{item_id}")
def update_learning_item(
    item_id: str,
    status_val: str = "completed",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(LearningItem).filter(LearningItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Learning item not found.")

    item.status = status_val
    db.commit()
    return {"id": item.id, "status": item.status, "message": "Updated learning item status"}
