from typing import Dict, Any, List
from app.services.ai_providers import DevelopmentAIProvider, OpenAIProvider
from app.core.config import settings

class CareerOrchestrator:
    """
    Central orchestration engine for STITCH.
    Coordinates Job Analysis, Candidate Matching, ATS Diagnostics, Skill Gap mapping, and Readiness updates.
    """
    def __init__(self):
        if settings.AI_API_KEY and settings.AI_PROVIDER == "openai":
            self.ai_provider = OpenAIProvider(settings.AI_API_KEY)
        else:
            self.ai_provider = DevelopmentAIProvider()

    def process_new_job_target(self, title: str, company: str, description: str, candidate_skills: List[str]) -> Dict[str, Any]:
        # 1. Job Analysis
        job_analysis = self.ai_provider.analyze_job(title, description)
        
        # 2. Match Engine (Deterministic)
        req_skills = job_analysis.get("required_skills", [])
        matched = [s for s in candidate_skills if any(s.lower() in r.lower() for r in req_skills)]
        match_score = min(98.0, max(50.0, round((len(matched) / max(1, len(req_skills))) * 100, 1)))

        # 3. ATS Diagnostic
        ats_result = self.ai_provider.run_ats_diagnostic({"skills": candidate_skills}, description)

        # 4. Skill Gap Mapping
        missing_skills = [s for s in req_skills if not any(s.lower() in cs.lower() for cs in candidate_skills)]
        
        # 5. Career Readiness Score Synthesis
        readiness_score = round((match_score * 0.35) + (ats_result["overall_score"] * 0.35) + (80.0 * 0.30), 1)

        return {
            "job_analysis": job_analysis,
            "match_score": match_score,
            "ats_result": ats_result,
            "missing_skills": missing_skills,
            "readiness_score": readiness_score
        }

orchestrator = CareerOrchestrator()
