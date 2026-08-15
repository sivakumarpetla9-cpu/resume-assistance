from fastapi import APIRouter

router = APIRouter(prefix="/learning", tags=["Learning Roadmap"])

@router.get("/roadmap")
def get_learning_roadmap():
    return [
        {
            "id": "step-1",
            "title": "TypeScript Foundations & Strict Props",
            "category": "Language",
            "status": "completed",
            "rationale": "Mandatory foundation before applying to TypeScript-first engineering teams.",
            "estimatedHours": 4,
            "practiceTask": "Type all state hooks and API responses in sample workspace.",
            "order": 1
        },
        {
            "id": "step-2",
            "title": "TypeScript Generics & Utility Types",
            "category": "Language",
            "status": "in_progress",
            "rationale": "Required to answer technical interview question 03 confidently.",
            "estimatedHours": 6,
            "practiceTask": "Create a reusable generic table component <DataTable<T>> with sorted columns.",
            "order": 2
        }
    ]

@router.put("/items/{item_id}")
def update_learning_item(item_id: str):
    return {"id": item_id, "status": "completed", "message": "Updated learning item status"}
