from fastapi import APIRouter

router = APIRouter(prefix="/portfolio", tags=["Portfolio"])

@router.get("")
def get_portfolio():
    return {
        "username": "alexvance",
        "title": "Alex Vance — Frontend Engineer",
        "bio": "Specializing in React, TypeScript, and high-performance UI systems.",
        "projects": [
            {
                "name": "Real-Time Telemetry Dashboard",
                "description": "Interactive analytics application rendering live streaming metric graphs.",
                "tech_stack": ["React", "JavaScript", "Tailwind CSS", "WebSockets"]
            }
        ]
    }

@router.get("/{username}")
def get_public_portfolio(username: str):
    return {
        "username": username,
        "title": f"{username} — Portfolio",
        "bio": "Full-stack career intelligence profile.",
        "verified_skills": ["React", "JavaScript", "Tailwind CSS"]
    }
