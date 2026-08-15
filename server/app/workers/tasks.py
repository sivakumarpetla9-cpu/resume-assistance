import time
from typing import Dict, Any

# In-memory / Redis Job Status Registry
jobs_registry: Dict[str, Dict[str, Any]] = {}

def create_background_job(job_id: str, job_type: str) -> Dict[str, Any]:
    job_info = {
        "job_id": job_id,
        "type": job_type,
        "status": "QUEUED",
        "progress": 0,
        "created_at": time.time()
    }
    jobs_registry[job_id] = job_info
    return job_info

def update_job_status(job_id: str, status: str, progress: int = 100, result: Any = None):
    if job_id in jobs_registry:
        jobs_registry[job_id]["status"] = status
        jobs_registry[job_id]["progress"] = progress
        if result:
            jobs_registry[job_id]["result"] = result

def get_job_status(job_id: str) -> Dict[str, Any]:
    return jobs_registry.get(job_id, {"job_id": job_id, "status": "COMPLETED", "progress": 100})
